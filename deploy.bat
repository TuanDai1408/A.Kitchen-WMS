@echo off
chcp 65001 >nul
echo ========================================================
echo   TRIỂN KHAI AKITCHEN KHO APP LÊN CLOUDFLARE 24/7 (0Đ)
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Kiểm tra trạng thái đăng nhập Cloudflare...
call npx wrangler whoami > "%temp%\cf_whoami.txt" 2>&1
type "%temp%\cf_whoami.txt"
findstr /i "not authenticated" "%temp%\cf_whoami.txt" >nul
if %errorlevel% equ 0 (
    echo.
    echo --------------------------------------------------------
    echo Ban chua dang nhap Cloudflare!
    echo Trinh duyet se tu dong mo de ban xac thuc (Authorize)...
    echo --------------------------------------------------------
    call npx wrangler login
)

echo.
echo [2/3] Trien khai ung dung len Cloudflare Edge (Workers + Assets + D1)...
call npx wrangler deploy

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo   DA TRIEN KHAI THANH CONG!
    echo   Truy cap ung dung tai:
    echo   https://akitchen-kho-app.trantuandai2508.workers.dev/
    echo ========================================================
) else (
    echo.
    echo [LOI] Qua trinh trien khai gap loi. Vui long kiem tra lai thong bao o tren.
)
pause
