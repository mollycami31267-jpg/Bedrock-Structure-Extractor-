import { Level } from 'level';
import fs from 'node:fs/promises';

const dbPath = './world/db';

const db = new Level(dbPath, {
  valueEncoding: 'buffer'
});

await fs.mkdir('./exported_structures', {
  recursive: true
});

console.log('正在扫描数据库...');

let total = 0;
let found = 0;

for await (const [key, value] of db.iterator()) {

  total++;

  let textKey = '';

  try {
    textKey = Buffer.from(key).toString('utf8');
  } catch {}

  const lower = textKey.toLowerCase();

  const looksLikeStructure =
    lower.includes('structure') ||
    lower.includes('template') ||
    lower.includes('mcstructure');

  if (looksLikeStructure) {

    found++;

    const safeName =
      textKey
        .replace(/[^a-zA-Z0-9_\\-]/g, '_')
        .slice(0, 80) || `structure_${found}`;

    const out =
      `./exported_structures/${found}_${safeName}.bin`;

    await fs.writeFile(out, value);

    console.log(`发现结构: ${textKey}`);
    console.log(`已导出 -> ${out}\\n`);
  }

  if (total % 1000 === 0) {
    console.log(`已扫描 ${total} 条记录...`);
  }
}

console.log('\\n================');
console.log(`扫描完成`);
console.log(`数据库记录: ${total}`);
console.log(`发现结构: ${found}`);
console.log('================');
