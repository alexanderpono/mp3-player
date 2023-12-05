@echo off
vol %1 >nul 2>nul
if errorlevel 1 (
    echo IT DOES NOT EXIST
) else (
    echo IT EXISTS
)
