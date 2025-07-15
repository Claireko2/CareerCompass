import fs from 'fs/promises';

export async function saveRawData(jsonData: any) {
    await fs.writeFile('./raw/jobs.json', JSON.stringify(jsonData, null, 2));
}
