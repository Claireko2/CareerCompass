import argparse
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
    PrimaryKeyConstraint,
)
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

load_dotenv()

RELATION_TYPES = ("essential", "optional")
SKILL_TYPES = ("knowledge", "skill/competence")

def extract_uuid(uri: str) -> str:
    return uri.rstrip("/").split("/")[-1]

def create_schema(engine):
    # 指定 schema 為 core
    meta = MetaData(schema="public")

    # 表名和 Prisma schema 對齊，且 schema 也設為 core
    occupations = Table(
        "occupation",  # Prisma model 名稱沒 @@map，表名為 Occupation（大小寫敏感）
        meta,
        Column("id", String, primary_key=True),
        Column("uri", String, unique=True, nullable=False),
        Column("preferred_label", String, nullable=True),
        schema="public"
    )

    skills = Table(
        "esco_skills",  # Prisma Skill model @@map("esco_skills")
        meta,
        Column("id", String, primary_key=True),
        Column("uri", String, unique=True, nullable=False),
        Column("preferred_label", String, nullable=True),
        schema="public"
    )

    skill_aliases = Table(
        "skill_aliases",
        meta,
        Column("skill_id", String, ForeignKey("esco_skills.id", ondelete="CASCADE")),
        Column("alias", String, primary_key=True),
        schema="public"
    )

    occupation_skills = Table(
        "occupation_skills",
        meta,
        Column("occupation_id", String, ForeignKey("Occupation.id", ondelete="CASCADE")),
        Column("skill_id", String, ForeignKey("esco_skills.id", ondelete="CASCADE")),
        Column("relation_type", Enum(*RELATION_TYPES, name="relation_type")),
        Column("skill_type", Enum(*SKILL_TYPES, name="skill_type")),
        PrimaryKeyConstraint("occupation_id", "skill_id"),
        schema="public"
    )

    meta.create_all(engine)  # 建立表格（如果還沒建立）
    print(
        f"Connecting to postgresql+psycopg2://{os.getenv('PGUSER')}@"
        f"{os.getenv('PGHOST')}:{os.getenv('PGPORT')}/{os.getenv('PGDATABASE')}"
    )
    print("Tables in metadata:", meta.tables.keys())
    return meta

def bulk_upsert(table: Table, rows: list[dict], engine, key_cols: list[str], batch_size: int = 1000):
    if not rows:
        return
    with engine.connect() as conn:
        for i in range(0, len(rows), batch_size):
            batch = rows[i : i + batch_size]
            stmt = (
                insert(table)
                .values(batch)
                .on_conflict_do_nothing(index_elements=key_cols)
            )
            try:
                with conn.begin():
                    conn.execute(stmt)
            except SQLAlchemyError as e:
                print(f"Error inserting batch starting at row {i}: {e}")
                # 繼續執行其他批次

def main(mapping_file: str):
    required_env_vars = ["PGHOST", "PGPORT", "PGDATABASE", "PGUSER", "PGPASSWORD"]
    missing_vars = [var for var in required_env_vars if not os.getenv(var)]
    if missing_vars:
        raise EnvironmentError(f"Missing required environment variables: {missing_vars}")

    engine = create_engine(
        f"postgresql+psycopg2://{os.getenv('PGUSER')}:{os.getenv('PGPASSWORD')}@"
        f"{os.getenv('PGHOST')}:{os.getenv('PGPORT')}/{os.getenv('PGDATABASE')}"
    )

    meta = create_schema(engine)

    # 注意：key 要和 meta.tables 裡的 keys 一致（大小寫）
    occ_tbl = meta.tables["public.occupation"]
    skill_tbl = meta.tables["public.esco_skills"]
    occ_skill_tbl = meta.tables["public.occupation_skills"]

    # 讀取TSV檔，注意分隔符號是 tab
    mapping = pd.read_csv(mapping_file)  
    mapping = mapping.rename(
        columns={
            "occupationUri": "occupation_uri",
            "relationType": "relation_type",
            "skillType": "skill_type",
            "skillUri": "skill_uri",
        }
    )

    mapping["occupation_id"] = mapping["occupation_uri"].apply(extract_uuid)
    mapping["skill_id"] = mapping["skill_uri"].apply(extract_uuid)
    mapping['skill_type'] = mapping['skill_type'].fillna('knowledge')

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
