const fs = require('fs');
const path = require('path');

const frPath = path.join(__dirname, '../messages/fr.json');
const enPath = path.join(__dirname, '../messages/en.json');

const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

function getKeys(obj, prefix = '') {
  return Object.keys(obj).reduce((res, el) => {
    if (Array.isArray(obj[el])) {
      return res;
    } else if (typeof obj[el] === 'object' && obj[el] !== null) {
      return [...res, ...getKeys(obj[el], prefix + el + '.')];
    }
    return [...res, prefix + el];
  }, []);
}

const frKeys = getKeys(fr);
const enKeys = getKeys(en);

const missingInEn = frKeys.filter(k => !enKeys.includes(k));
const missingInFr = enKeys.filter(k => !frKeys.includes(k));

console.log('--- i18n Validation Report ---');

if (missingInEn.length === 0 && missingInFr.length === 0) {
  console.log('✅ All translation keys are synced between FR and EN.');
} else {
  if (missingInEn.length > 0) {
    console.error('❌ Missing keys in EN (English):');
    missingInEn.forEach(k => console.log(`   - ${k}`));
  }
  
  if (missingInFr.length > 0) {
    console.error('❌ Missing keys in FR (French):');
    missingInFr.forEach(k => console.log(`   - ${k}`));
  }
  process.exit(1);
}
