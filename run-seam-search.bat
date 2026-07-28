@echo off
setlocal
title Seam Search & Verification Engine - Windows HPC Launcher

:: Check if Node.js is installed and available in PATH
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ============================================================================
    echo [ERROR] NODE.JS RUNTIME NOT DETECTED ON YOUR SYSTEM!
    echo ============================================================================
    echo The Seam Search HPC Runner requires Node.js to execute multi-core workers.
    echo.
    echo Please download and install Node.js (LTS version) from:
    echo   https://nodejs.org
    echo.
    echo After installing, restart this batch file or your terminal window.
    echo ============================================================================
    echo.
    pause
    exit /b 1
)

:: Check if seam-hpc-cli.js is in the current directory
if not exist "seam-hpc-cli.js" (
    echo ============================================================================
    echo [ERROR] seam-hpc-cli.js NOT FOUND!
    echo ============================================================================
    echo Please ensure this launcher (.bat) is in the exact same folder as
    echo seam-hpc-cli.js before running.
    echo ============================================================================
    echo.
    pause
    exit /b 1
)

:MENU
cls
echo ============================================================================
echo   SEAM SEARCH ^& VERIFICATION ENGINE -- WINDOWS INTERACTIVE LAUNCHER
echo   Combinatorics on Words Research Laboratory (Module 18)
echo ============================================================================
echo.
echo Please select an operational research mode to execute:
echo.
echo   [1] Negative Control Calibration (Exhaustive Ternary Cutoff at Len 7/8)
echo   [2] Seam Bridge Welding (Search for bridge connecting U and V)
echo   [3] Rao ^& Rosenfeld p=6 Replication Stress Test (Multi-core seed audit)
echo   [4] Display Command-Line Operational Manual (--help)
echo   [0] Exit Launcher
echo.
set /p choice="Enter selection [0-4]: "

if "%choice%"=="1" goto RUN_NEG
if "%choice%"=="2" goto RUN_WELD
if "%choice%"=="3" goto RUN_P6
if "%choice%"=="4" goto RUN_HELP
if "%choice%"=="0" goto EXIT_LAUNCHER

echo Invalid selection. Please choose a number from 0 to 4.
timeout /t 2 >nul
goto MENU

:RUN_NEG
cls
echo Starting Negative Control Calibration (Exhaustive Ternary Cutoff)...
echo.
node seam-hpc-cli.js --mode=neg
echo.
echo ============================================================================
pause
goto MENU

:RUN_WELD
cls
echo Starting Seam Bridge Welding Search...
echo Default blocks: U = bbbaabaaac, V = ccccbbbcbc, maxLen = 10
echo.
node seam-hpc-cli.js --mode=weld --u=bbbaabaaac --v=ccccbbbcbc --maxLen=10
echo.
echo ============================================================================
pause
goto MENU

:RUN_P6
cls
echo Starting Rao ^& Rosenfeld p=6 Replication Stress Test across CPU cores...
echo.
node seam-hpc-cli.js --mode=p6 --workers=8 --iterations=16
echo.
echo ============================================================================
pause
goto MENU

:RUN_HELP
cls
node seam-hpc-cli.js --help
echo.
echo ============================================================================
pause
goto MENU

:EXIT_LAUNCHER
endlocal
exit /b 0
