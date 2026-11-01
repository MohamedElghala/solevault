@echo off
cd /d "D:\كاتب الاوامر\solevault_store"
echo ========================================================
echo   Pushing SOLEVAULT to GitHub (MohamedElghala/solevault)
echo ========================================================
"D:\DevEnvironment\flutter\bin\mingit\cmd\git.exe" push -u origin main
echo.
echo ========================================================
echo   Finished! Press any key to close.
echo ========================================================
pause
