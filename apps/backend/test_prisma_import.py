import os
import asyncio
import pandas as pd
from prisma import Prisma
import prisma

# 設定 Prisma Python client 的路徑
GENERATED_DIR = os.path.abspath("src/generated")
os.environ["PRISMA_PYTHON_GENERATED_DIR"] = GENERATED_DIR
print("PRISMA_PYTHON_GENERATED_DIR:", os.environ["PRISMA_PYTHON_GENERATED_DIR"])

# 印出 prisma 套件的位置（可用來確認是否安裝正確）
print("prisma module path:", prisma.__file__)

# 測試資料庫連線
db = Prisma()

async def main():
    await db.connect()
    print("Connected to DB 🎉")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
