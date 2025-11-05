@echo off
echo ==========================================
echo Docker MCP Server Setup
echo ==========================================
echo.

REM Create the directory if it doesn't exist
if not exist "D:\Claude-MCP-Files\" (
    echo Creating directory: D:\Claude-MCP-Files
    mkdir "D:\Claude-MCP-Files"
) else (
    echo Directory already exists: D:\Claude-MCP-Files
)
echo.

REM Copy the server file
echo Copying docker_mcp_server.py...
copy /Y "%~dp0docker_mcp_server.py" "D:\Claude-MCP-Files\docker_mcp_server.py"
if %ERRORLEVEL% EQU 0 (
    echo ✓ Successfully copied docker_mcp_server.py
) else (
    echo ✗ Failed to copy docker_mcp_server.py
    pause
    exit /b 1
)
echo.

REM Copy documentation files
echo Copying documentation...
copy /Y "%~dp0README.md" "D:\Claude-MCP-Files\README.md" >nul 2>&1
copy /Y "%~dp0QUICKSTART.md" "D:\Claude-MCP-Files\QUICKSTART.md" >nul 2>&1
echo ✓ Documentation copied
echo.

echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo Files have been copied to: D:\Claude-MCP-Files
echo.
echo Next steps:
echo 1. Open: %%APPDATA%%\Claude\claude_desktop_config.json
echo 2. Add the configuration from claude_desktop_config.json
echo 3. Restart Claude Desktop
echo.
echo Configuration path:
echo %APPDATA%\Claude\claude_desktop_config.json
echo.
echo Press any key to open the configuration file location...
pause >nul

REM Open the Claude config directory
explorer "%APPDATA%\Claude"

echo.
echo Done! Check QUICKSTART.md in D:\Claude-MCP-Files for next steps.
pause
