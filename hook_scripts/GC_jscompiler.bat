@echo off
:: ***************************************
:: ***************************************
:: ********** Google JS压缩 **********
:: ***************************************
:: ***************************************
:: ***************************************
cd /d %~dp0/../platforms/android/assets/www/
set jarPath="%~dp0compiler.jar"
setlocal enabledelayedexpansion
for /f "delims=" %%i in ('dir /b /a-d /s "*.js" ^| findstr /v "libs main plugins"') do (
	set minfile="%%i"
	set sfile="%%i"
	:: 这里调整压缩后的文件名
	set minfile=!minfile:.js=.js1!
	:: 这里调用Google compiler进行压缩，也可以自己根据需求修改成其他压缩工具
	java -jar %jarPath% --js !sfile! --charset utf-8 --js_output_file !minfile! 
	del %%i
	ren !minfile! %%~ni.js
)
echo.success
