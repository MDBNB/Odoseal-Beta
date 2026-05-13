# ============================================================
# OdoSeal-Beta — setup-native.ps1
# سكريبت إعداد البيئة للبناء Native Android
# ============================================================

$projectRoot = Split-Path -Parent $PSScriptRoot

Write-Host "=== [1/4] حذف مجلدات android و ios القديمة ===" -ForegroundColor Cyan

$androidPath = Join-Path $projectRoot "android"
$iosPath     = Join-Path $projectRoot "ios"

if (Test-Path $androidPath) {
    Remove-Item -Recurse -Force $androidPath
    Write-Host "  ✅ تم حذف مجلد android" -ForegroundColor Green
} else {
    Write-Host "  ℹ️  مجلد android غير موجود — تخطي" -ForegroundColor Yellow
}

if (Test-Path $iosPath) {
    Remove-Item -Recurse -Force $iosPath
    Write-Host "  ✅ تم حذف مجلد ios" -ForegroundColor Green
} else {
    Write-Host "  ℹ️  مجلد ios غير موجود — تخطي" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== [2/4] إنشاء مجلد assets/images ===" -ForegroundColor Cyan

$assetsDir = Join-Path $projectRoot "assets\images"
if (-not (Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Force -Path $assetsDir | Out-Null
    Write-Host "  ✅ تم إنشاء المجلد: assets/images" -ForegroundColor Green
} else {
    Write-Host "  ℹ️  المجلد موجود بالفعل" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== [3/4] إنشاء صور Placeholder (PNG حقيقية 1x1 بكسل) ===" -ForegroundColor Cyan

# PNG حقيقي 1x1 بكسل بنفسجي — Base64
# هذا PNG صالح تماماً يقبله AAPT بدون أخطاء
$pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
$pngBytes  = [Convert]::FromBase64String($pngBase64)

$images = @("icon.png", "adaptive-icon.png", "splash.png", "favicon.png")

foreach ($img in $images) {
    $imgPath = Join-Path $assetsDir $img
    [System.IO.File]::WriteAllBytes($imgPath, $pngBytes)
    Write-Host "  ✅ تم إنشاء: assets/images/$img" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== [4/4] جاهز للبناء! ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "  شغّل الأمر التالي الآن:" -ForegroundColor White
Write-Host ""
Write-Host "  cd '$projectRoot' ; npx expo prebuild --clean ; npx expo run:android" -ForegroundColor Yellow
Write-Host ""
Write-Host "  ⚠️  تأكد من توصيل التليفون بـ USB وتفعيل USB Debugging أولاً!" -ForegroundColor Magenta
Write-Host ""
