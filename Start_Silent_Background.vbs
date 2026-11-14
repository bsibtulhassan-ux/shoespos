Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
strDir = fso.GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = strDir

' Run completely hidden with no command prompt window (0 = hidden, False = non-blocking)
WshShell.Run Chr(34) & strDir & "\start_pos.bat" & Chr(34) & " --silent", 0, False
