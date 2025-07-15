#import_esco.py
import os
import pandas as pd
from sqlalchemy import create_engine, Column, Text, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import uuid
from sqlalchemy.orm import declarative_base 
from sqlalchemy import text

Base = declarative_base()
load_dotenv()                          # read .env
CSV_PATH="C:/Users/colle/Desktop/Project/JobSearch/career-compass/apps/backend/src/import_esco/skills_en.csv"
DB_URL   = os.getenv("DATABASE_URL")

engine = create_engine(DB_URL, echo=False)
Base = declarative_base()

class EscoSkill(Base):
    __tablename__ = "esco_skills"
    __table_args__ = {"schema": "core"} 

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    label       = Column(Text, nullable=False)
    alt_labels  = Column(ARRAY(Text), default=[])
    skill_type  = Column(Text)                     # e.g. 'skill/competence'
    status      = Column(Text)                     # e.g. 'released'
    modified_at = Column(DateTime)
    description = Column(Text)

# ── create table if it doesn't exist ───────────────────────────────────────────
Base.metadata.create_all(engine)

# ── read & transform CSV ───────────────────────────────────────────────────────
df = (
    pd.read_csv(CSV_PATH, delimiter=",", keep_default_na=False)
      .query("status == 'released'")                              # keep released only
      .rename(columns={
          "conceptUri":  "id",
          "preferredLabel": "label",
          "altLabels":   "alt_labels",
          "skillType":   "skill_type",
          "modifiedDate":"modified_at",
          "description": "description"
      })
      .loc[:, ["id","label","alt_labels","skill_type","status","modified_at","description"]]
)

# convert UUID strings → proper uuid.UUID
df["id"] = df["id"].str.extract(r"([0-9a-f\-]{36})")[0].apply(uuid.UUID)

# split altLabels by newline → Python list; handle empty strings
df["alt_labels"] = df["alt_labels"].apply(
    lambda x: [label.strip() for label in str(x).split("\n") if label.strip()]
)

# ── bulk insert using a single transaction ─────────────────────────────────────
with Session(engine) as session:
    # Upsert behaviour: delete + insert for a clean import (simplest)
    session.execute(text("TRUNCATE core.esco_skills"))
    session.bulk_insert_mappings(EscoSkill, df.to_dict(orient="records"))
    session.commit()

print(f"Imported {len(df):,} skills into Postgres ✅")
