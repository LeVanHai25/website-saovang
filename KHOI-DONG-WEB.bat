@echo off
title SAO VANG Website Server
color 0A
cls
echo.
echo  ╔══════════════════════════════════════╗
echo  ║     SAO VÀNG — Khởi động Web         ║
echo  ╚══════════════════════════════════════╝
echo.

cd /d "%~dp0cms"

:: Kiểm tra Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo  [LOI] Chua cai Node.js!
    echo  Tai tai: https://nodejs.org
    pause
    exit /b 1
)

:: Tắt server cũ nếu đang chạy
echo  Dang tat server cu (neu co)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":4000 "') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: Chờ 1 giây
timeout /t 1 /nobreak >nul

echo  Dang khoi dong server...
echo.

:: Khởi động server
start "SAO VANG Server" /B node server.js

:: Chờ server sẵn sàng
timeout /t 3 /nobreak >nul

:: Mở browser
echo  Mo trinh duyet...
start "" "http://localhost:4000"

echo.
echo  ✓ Website dang chay tai: http://localhost:4000
echo  ✓ Trang Bao Gia:         http://localhost:4000/bao-gia.html
echo  ✓ CMS Admin:             http://localhost:4000/admin
echo.
echo  Nhan phim bat ky de tat server...
echo  (Dong cua so nay se TAT server)
echo.
pause >nul

:: Tắt server khi đóng cửa sổ
taskkill /F /FI "WINDOWTITLE eq SAO VANG Server" >nul 2>&1
echo  Server da tat.
