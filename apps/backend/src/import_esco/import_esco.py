import os
import pandas as pd
from sqlalchemy import create_engine, Column, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import uuid
from sqlalchemy import text

load_dotenv()  # 讀取 .env

CSV_PATH = "C:/Users/colle/Desktop/Project/JobSearch/career-compass/apps/backend/src/import_esco/skills_en.csv"
DB_URL = os.getenv("DATABASE_URL")

engine = create_engine(DB_URL, echo=False)
Base = declarative_base()

class EscoSkill(Base):
    __tablename__ = "esco_skills"
    __table_args__ = {"schema": "public"}

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    label       = Column(Text, nullable=False)
    alt_labels  = Column(JSONB, default=list)   # 改成 JSONB
    skill_type  = Column(Text)                  
    status      = Column(Text)                  
    modified_at = Column(DateTime)
    description = Column(Text)

# 建表（如果尚未建立）
Base.metadata.create_all(engine)

# 讀 CSV 並處理
df = (
    pd.read_csv(CSV_PATH, delimiter=",", keep_default_na=False)
      .query("status == 'released'")   # 只要 released 狀態
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

# 轉換 UUID 字串成 uuid.UUID 物件
df["id"] = df["id"].str.extract(r"([0-9a-f\-]{36})")[0].apply(uuid.UUID)

# alt_labels 用換行拆成 list
df["alt_labels"] = df["alt_labels"].apply(
    lambda x: [label.strip() for label in str(x).split("\n") if label.strip()]
)

# 寫入資料庫，先清空再批量插入
with Session(engine) as session:
    session.execute(text('DELETE FROM core.esco_skills'))
    session.bulk_insert_mappings(EscoSkill, df.to_dict(orient="records"))
    session.commit()

print(f"Imported {len(df):,} skills into Postgres ✅")
