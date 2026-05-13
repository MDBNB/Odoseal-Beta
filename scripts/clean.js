/**
 * clean.js — سكريبت تنظيف مشروع OdoSeal-Beta
 * يحذف: node_modules, .expo, package-lock.json
 * ثم يعيد تثبيت الحزم
 *
 * الاستخدام: node scripts/clean.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const toDelete = ['node_modules', '.expo', 'package-lock.json'];

console.log('🧹 بدء التنظيف...\n');

for (const dir of toDelete) {
  const fullPath = path.join(ROOT, dir);
  try {
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✅ تم حذف: ${dir}`);
    } else {
      console.log(`⏭️  غير موجود: ${dir}`);
    }
  } catch (e) {
    console.error(`❌ فشل حذف ${dir}: ${e.message}`);
  }
}

console.log('\n📦 إعادة تثبيت الحزم...\n');
try {
  execSync('npm install --legacy-peer-deps', { cwd: ROOT, stdio: 'inherit' });
  console.log('\n✅ تم التثبيت بنجاح!');
  console.log('\n🚀 الآن شغّل: npx expo start --clear');
} catch (e) {
  console.error('\n❌ فشل التثبيت:', e.message);
  process.exit(1);
}
