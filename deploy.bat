@echo off
chcp 65001 >nul
echo ========================================================
echo   TRIỂN KHAI AKITCHEN KHO APP LÊN CLOUDFLARE 24/7 (0Đ)
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Kiểm tra đăng nhập Cloudflare...
call npx wrangler whoami
if %errorlevel% neq 0 (
    echo.
    echo Bạn chưa đăng nhập Cloudflare. Trình duyệt sẽ mở để bạn đăng nhập...
    call npx wrangler login
)

echo.
echo [2/3] Triển khai ứng dụng lên Cloudflare Edge (Workers + Pages + D1)...
call npx wrangler deploy

echo.
echo ========================================================
echo   ĐÃ TRIỂN KHAI THÀNH CÔNG! HỆ THỐNG ĐÃ CHẠY 24/7
echo ========================================================
pause
