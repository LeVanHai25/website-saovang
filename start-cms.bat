@echo off
title SAO VÀNG CMS - Admin Studio
cd /d "%~dp0cms"
echo.
echo  ╔══════════════════════════════════════════╗
echo  ║    SAO VÀNG CMS  -  Khởi động           ║
echo  ╚══════════════════════════════════════════╝
echo.

:: Check if node_modules exists
if not exist "node_modules" (
  echo  [!] Chưa cài packages. Đang cài đặt...
  npm install
  echo.
)

:: Check if database exists, if not run seed
if not exist "database\db.sqlite" (
  echo  [!] Database chưa có. Đang tạo...
  node database/seed.js
  echo.
)

echo  [*] Khởi động server tại http://localhost:4000
echo  [*] Admin Studio: http://localhost:4000/admin
echo  [*] API Health:   http://localhost:4000/api/health
echo.
echo  Nhấn Ctrl+C để dừng server.
echo  ═══════════════════════════════════════════
echo.
set PORT=4000
node server.js
pause
