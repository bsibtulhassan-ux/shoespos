Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
strDir = fso.GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = strDir

' Kill any old cloudflared process first
On Error Resume Next
WshShell.Run "taskkill /F /IM cloudflared.exe", 0, True
On Error GoTo 0

' Start cloudflared detached in hidden background window
logFile = strDir & "\cf_tunnel.log"
If fso.FileExists(logFile) Then
    fso.DeleteFile logFile, True
End If

cmd = Chr(34) & strDir & "\cloudflared.exe" & Chr(34) & " tunnel --url http://127.0.0.1:8000 --logfile " & Chr(34) & logFile & Chr(34)
WshShell.Run cmd, 0, False
