"""
Ingest ESCO occupation–skill mapping into PostgreSQL.

Usage (example):
    python ingest_esco.py --mapping_file occupation_skill.tsv

Environment variables for DB connection:
    PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD

Assumptions:
- Mapping file is a tab‑separated file with headers:
  occupationUri  relationType  skillType  skillUri
- You have already downloaded the full ESCO skill and occupation labels if you want to
  populate the `preferred_label` columns. Those can be ingested with a similar script.
"""
from sqlalchemy.dialects.postgresql import insert
import argparse
import os
from urllib.parse import urlparse
import os
import pandas as pd
from sqlalchemy import (
    Column,
    Enum,
    ForeignKey,
    MetaData,
    String,
    Table,
    create_engine,
    
)
from dotenv import load_dotenv
load_dotenv()


# Enumerations from ESCO docs
RELATION_TYPES = ("essential", "optional")
SKILL_TYPES = ("knowledge", "skill/competence")


def extract_uuid(uri: str) -> str:
    """Return the UUID (last path segment) from an ESCO URI."""
    return uri.rstrip("/").split("/")[-1]


def create_schema(engine):
    """Create the minimal schema needed for occupation–skill mapping."""
    meta = MetaData()

    # --- core dimension tables ---
    occupations = Table(
        "occupations",
        meta,
        Column("id", String, primary_key=True),  # UUID only
        Column("uri", String, unique=True, nullable=False),
        Column("preferred_label", String, nullable=True),
    )

    skills = Table(
        "skills",
        meta,
        Column("id", String, primary_key=True),
        Column("uri", String, unique=True, nullable=False),
        Column("preferred_label", String, nullable=True),
    )

    skill_aliases = Table(
        "skill_aliases",
        meta,
        Column("skill_id", String, ForeignKey("skills.id", ondelete="CASCADE")),
        Column("alias", String, primary_key=True),
    )

    # --- link table ---
    occupation_skills = Table(
        "occupation_skills",
        meta,
        Column("occupation_id", String, ForeignKey("occupations.id", ondelete="CASCADE")),
        Column("skill_id", String, ForeignKey("skills.id", ondelete="CASCADE")),
        Column("relation_type", Enum(*RELATION_TYPES, name="relation_type")),
        Column("skill_type", Enum(*SKILL_TYPES, name="skill_type")),
    )

    meta.create_all(engine)
    return meta


def bulk_upsert(table: Table, rows: list[dict], engine, key_cols: list[str]):
    """Generic helper: insert rows, ignore duplicates."""
    if not rows:
        return
    with engine.begin() as conn:
        for row in rows:
            stmt = (
                insert(table)
                .values(**row)
                .on_conflict_do_nothing(index_elements=key_cols)
            )
            conn.execute(stmt)


def main(mapping_file: str):
    engine = create_engine(
        f"postgresql+psycopg2://{os.getenv('PGUSER')}:{os.getenv('PGPASSWORD')}@"
        f"{os.getenv('PGHOST')}:{os.getenv('PGPORT')}/{os.getenv('PGDATABASE')}"
    )

    meta = create_schema(engine)
    occ_tbl = meta.tables["occupations"]
    skill_tbl = meta.tables["skills"]
    occ_skill_tbl = meta.tables["occupation_skills"]

    # 1. Load mapping TSV
    mapping = pd.read_csv(mapping_file, sep=",")
    mapping = mapping.rename(
        columns={
            "occupationUri": "occupation_uri",
            "relationType": "relation_type",
            "skillType": "skill_type",
            "skillUri": "skill_uri",
        }
    )

    # 2. Extract UUIDs
    mapping["occupation_id"] = mapping["occupation_uri"].apply(extract_uuid)
    mapping["skill_id"] = mapping["skill_uri"].apply(extract_uuid)
    mapping['skill_type'] = mapping['skill_type'].fillna('knowledge') 
    
    # 3. Upsert occupations & skills (URI + ID only — labels can be added later)
    unique_occupations = (
    mapping[["occupation_id", "occupation_uri"]]
    .drop_duplicates()
    .rename(columns={"occupation_id": "id", "occupation_uri": "uri"})
    .to_dict("records")
    )
    unique_skills = (
    mapping[["skill_id", "skill_uri"]]
    .drop_duplicates()
    .rename(columns={"skill_id": "id", "skill_uri": "uri"})
    .to_dict("records")
    )

    bulk_upsert(occ_tbl, unique_occupations, engine, ["id"])
    bulk_upsert(skill_tbl, unique_skills, engine, ["id"])

    # 4. Upsert occupation‑skill links
    link_rows = mapping[
        [
            "occupation_id",
            "skill_id",
            "relation_type",
            "skill_type",
        ]
    ].to_dict("records")

    bulk_upsert(occ_skill_tbl, link_rows, engine, ["occupation_id", "skill_id"])
    print(f"Inserted {len(link_rows):,} occupation–skill links.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--mapping_file", required=True, help="Path to ESCO occupation–skill TSV")
    args = parser.parse_args()
    main(args.mapping_file)
