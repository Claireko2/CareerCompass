import os
import pandas as pd
import asyncio
from prisma import Prisma
from datetime import datetime

async def main():
    db = Prisma()
    await db.connect()

    df = pd.read_excel("C:/Users/colle/Desktop/Project/JobSearch/career-compass/apps/backend/src/import_onet/Skills.xlsx")
    df = df[df["Element ID"].str.startswith("2.A.")]
    df = df.rename(columns={
        "Element ID": "id",
        "Element Name": "label",
        "Description": "description"
    })

    count = 0
    for _, row in df.iterrows():
        label = row["label"]
        description = row.get("description", "") or ""
        skill_type = "cognitive"
        status = "released"
        alt_labels = []  # 預設空列表，符合 JSONB
        modified_at = None  # 如果有修改時間，可以填這裡，沒有就 None

        existing = await db.skill.find_first(where={"label": label})

        if existing:
            await db.skill.update(
                where={"id": existing.id},
                data={
                    "description": description,
                    "skill_type": skill_type,
                    "status": status,
                    "altLabels": alt_labels,
                    "modified_at": modified_at,
                }
            )
        else:
            await db.skill.create(
                data={
                    "label": label,
                    "description": description,
                    "skill_type": skill_type,
                    "status": status,
                    "altLabels": alt_labels,
                    "modified_at": modified_at,
                }
            )
        count += 1

    await db.disconnect()
    print(f"✅ Imported or updated {count} O*NET skills")

if __name__ == "__main__":
    asyncio.run(main())
