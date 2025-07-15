import db from '../db';
import * as fs from 'fs/promises';

async function exportAliasMap() {
    type SkillType = Awaited<ReturnType<typeof db.skill.findMany>>[number];
    const skills = await db.skill.findMany({
        select: {
            id: true,
            label: true,
            altLabels: true,
        },
    });

    // id is string (UUID), so Record<string, string>
    const alias2id: Record<string, string> = {};

    for (const skill of skills) {
        // add primary label
        alias2id[skill.label.toLowerCase()] = String(skill.id);

        // altLabels is Json? — might be null, array, or something else
        if (Array.isArray(skill.altLabels)) {
            for (const alias of skill.altLabels) {
                if (typeof alias === 'string') {
                    alias2id[alias.toLowerCase()] = String(skill.id);
                }
            }
        }
    }

    await fs.writeFile('src/extractor/skill_alias_map.json', JSON.stringify(alias2id, null, 2));
    console.log('Skill alias map exported to extractor/skill_alias_map.json');
}

exportAliasMap().catch(console.error);
