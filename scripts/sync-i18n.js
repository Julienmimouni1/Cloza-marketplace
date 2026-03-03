const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { translate } = require('google-translate-api-x');

const frPath = path.join(__dirname, '../messages/fr.json');
const enPath = path.join(__dirname, '../messages/en.json');
const cachePath = path.join(__dirname, '../.i18n-cache.json');

// Read source (FR) and target (EN)
const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));
let en = {};
if (fs.existsSync(enPath)) {
  en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
}

// Read or Initialize Cache
let cache = {};
let isFirstRun = false;
if (fs.existsSync(cachePath)) {
  cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
} else {
  console.log('✨ First run with smart-sync: Initializing cache...');
  isFirstRun = true;
}

let newCache = {};
let changesMade = false;

// Helper to hash string
const getHash = (str) => crypto.createHash('md5').update(str).digest('hex');

// Helper to recurse through keys
async function syncObject(source, target, prefix = '') {
  const targetKeys = Object.keys(target);
  
  // 1. Remove keys from Target that are not in Source
  for (const key of targetKeys) {
    if (source[key] === undefined) {
      console.log(`🗑️  Removed deprecated key: ${prefix}${key}`);
      delete target[key];
      changesMade = true;
    }
  }

  // 2. Add/Update keys from Source
  for (const key of Object.keys(source)) {
    const currentPrefix = prefix ? `${prefix}.${key}` : key;

    if (typeof source[key] === 'object' && source[key] !== null) {
      // Nested object
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
        changesMade = true;
      }
      await syncObject(source[key], target[key], currentPrefix);
    } else {
      // String value
      const currentHash = getHash(source[key]);
      const cachedHash = cache[currentPrefix];
      
      // Add to new cache
      newCache[currentPrefix] = currentHash;

      // Determine if update is needed
      const isMissing = !target[key];
      const isChanged = !isFirstRun && cachedHash && cachedHash !== currentHash;

      if (isMissing || isChanged) {
        const reason = isMissing ? 'Missing' : 'Source Changed';
        try {
          console.log(`🌍 Translating (${reason}): ${currentPrefix} ...`);
          const res = await translate(source[key], { from: 'fr', to: 'en' });
          target[key] = res.text;
          console.log(`   ✅ "${source[key]}" -> "${target[key]}"`);
          changesMade = true;
        } catch (e) {
          console.error(`   ❌ Failed to translate ${currentPrefix}:`, e.message);
          if (isMissing) {
            target[key] = `[MISSING_EN] ${source[key]}`;
            changesMade = true;
          }
        }
      }
    }
  }
}

(async () => {
  console.log('🔄 Starting Smart i18n Synchronization...');
  
  await syncObject(fr, en);

  // Save changes to EN file
  if (changesMade) {
    fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
    console.log('✨ "messages/en.json" updated.');
  } else {
    console.log('✨ English translations are up to date.');
  }

  // Save Cache
  fs.writeFileSync(cachePath, JSON.stringify(newCache, null, 2));
  console.log('💾 Cache updated.');
})();
