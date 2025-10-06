@echo off
cd E:\BBQ_SITE
git add .
git commit -m "Auto update %date% %time%"
git push origin main
echo.
echo 🚀 Промените бяха качени в GitHub и Vercel се обновява...
pause
