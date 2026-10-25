const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'data', 'rebuilt_quizzes');
for (const f of fs.readdirSync(dir).filter(x => /^liv_.*\.json$/.test(x))) {
  const a = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  console.log(`${a[0].sourceSection}\t${a.length}\t${f}`);
}
