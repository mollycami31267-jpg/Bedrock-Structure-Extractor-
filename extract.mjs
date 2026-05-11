import fs from 'node:fs/promises';
import path from 'node:path';

import {
  extractStructureFilesFromMcworld
} from 'mcbe-leveldb-reader';

const mcworld = process.argv[2];

if (!mcworld) {
  console.log('用法:');
  console.log('node extract.mjs <xxx.mcworld>');
  process.exit(1);
}

const input = path.resolve(mcworld);

const outputDir = path.resolve('./exported_structures');

await fs.mkdir(outputDir, { recursive: true });

console.log('正在读取 mcworld...');
console.log(input);

try {

  const result = await extractStructureFilesFromMcworld(
    input,
    outputDir
  );

  console.log('\\n提取完成');
  console.log(result);

} catch (err) {

  console.log('\\n提取失败:\\n');

  console.error(err);

}
