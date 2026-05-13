# ═══════════════════════════════════════════════════════════════
# cleanup.ps1 — خطة الإنعاش الشاملة لـ OdoSeal-Beta
# يمسح كل شيء ويثبت من جديد باستخدام npx فقط
# ═══════════════════════════════════════════════════════════════

$ROOT = "c:\Projects\OdoSeal-Beta"
Set-Location $ROOT

Write-Host "`n🔥 خطة الإنعاش الشاملة — OdoSeal-Beta`n" -ForegroundColor Magenta

# ─── الخطوة 1: التنظيف الجذري ────────────────────────────────
Write-Host "🧹 الخطوة 1: التنظيف الجذري..." -ForegroundColor Cyan

$toDelete = @(
    "node_modules",
    ".expo",
    "package-lock.json",
    "yarn.lock",
    ".yarn"
)

foreach ($item in $toDelete) {
    $fullPath = Join-Path $ROOT $item
    if (Test-Path $fullPath) {
        Remove-Item -Recurse -Force $fullPath -ErrorAction SilentlyContinue
        Write-Host "  ✅ حُذف: $item" -ForegroundColor Green
    } else {
        Write-Host "  ⏭️  غير موجود: $item" -ForegroundColor DarkGray
    }
}

# ─── الخطوة 2: التحقق من إصدار Node و npm ────────────────────
Write-Host "`n🔍 الخطوة 2: التحقق من البيئة..." -ForegroundColor Cyan
Write-Host "  Node: $(node --version)" -ForegroundColor White
Write-Host "  npm:  $(npm --version)" -ForegroundColor White
Write-Host "  npx:  $(npx --version)" -ForegroundColor White

# ─── الخطوة 3: تثبيت الحزم بـ npm (بدون global expo-cli) ────
Write-Host "`n� الخطوة 3: تثبيت الحزم..." -ForegroundColor Cyan
Write-Host "  الأمر: npm install --legacy-peer-deps`n" -ForegroundColor Yellow

npm install --legacy-peer-deps

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ فشل التثبيت!" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ تم التثبيت بنجاح!" -ForegroundColor Green

# ─── الخطوة 4: التعليمات النهائية ────────────────────────────
Write-Host "`n═══════════════════════════════════════" -ForegroundColor Magenta
Write-Host "🚀 الأوامر النهائية للتشغيل:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  # تشغيل التطبيق (في هذا الـ terminal):" -ForegroundColor DarkGray
Write-Host "  npx expo start --clear" -ForegroundColor White
Write-Host ""
Write-Host "  # تشغيل سيرفر OdoKey (terminal منفصل):" -ForegroundColor DarkGray
Write-Host "  cd c:\Projects\odokey-server ; npm start" -ForegroundColor White
Write-Host "═══════════════════════════════════════`n" -ForegroundColor Magenta
