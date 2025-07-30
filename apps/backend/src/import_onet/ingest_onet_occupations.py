import pandas as pd
import asyncio
import uuid
from prisma import Client
async def main():
    db = Client()
    await db.connect()

    occ_df = pd.read_excel("C:/Users/colle/Desktop/Project/JobSearch/career-compass/apps/backend/src/import_onet/Occupation Data.xlsx")
    skills_df = pd.read_excel("C:/Users/colle/Desktop/Project/JobSearch/career-compass/apps/backend/src/import_onet/Skills.xlsx")
    skills_df = skills_df[skills_df["Element ID"].str.startswith("2.A.")]

    for _, occ_row in occ_df.iterrows():
        onet_code = occ_row["O*NET-SOC Code"]
        title = occ_row["Title"]
        desc = occ_row.get("Description", "")

        occ = await db.occupation.create({
            "id": str(uuid.uuid4()),
            "title": title,
            "description": desc,
            "source": "onet"
        })

        matched_skills = skills_df[skills_df["O*NET-SOC Code"] == onet_code]

        for _, skill_row in matched_skills.iterrows():
            skill_label = skill_row["Element Name"]
            skill_type = "cognitive"  # You can enhance this later

            skill = await db.skill.find_first(where={"label": skill_label})
            if skill:
                # Check if the occupation-skill relation already exists
                existing_rel = await db.occupationskill.find_first(
                    where={
                        "occupationId": occ.id,
                        "skillId": skill.id
                    }
                )
                if not existing_rel:
                    await db.occupationskill.create({
                        "occupationId": occ.id,
                        "skillId": skill.id,
                        "relationType": "essential",
                        "skillType": skill_type
                    })

    await db.disconnect()
    print(f"✅ Imported {len(occ_df)} O*NET occupations with skills")

if __name__ == "__main__":
    asyncio.run(main())
