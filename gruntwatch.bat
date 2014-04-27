@ECHO OFF
 
cd /d C:\Websites\tresreges
grunt watch
 
IF ERRORLEVEL 1 GOTO :showerror
 
GOTO :EOF
 
:showerror
PAUSE