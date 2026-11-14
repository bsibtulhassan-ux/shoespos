' SoleMate POS 24/7 Auto-Recovery Watchdog
' Keeps BOTH SoleMate Local POS server AND Cloudflare Online Tunnel permanently alive!

Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
strDir = fso.GetParentFolderName(WScript.ScriptFullName)

' Ensure only one watchdog instance runs
Set objWMIService = GetObject("winmgmts:\\.\root\cimv2")
Set colProcesses = objWMIService.ExecQuery("SELECT * FROM Win32_Process WHERE Name = 'wscript.exe' AND CommandLine LIKE '%watchdog.vbs%'")
If colProcesses.Count > 1 Then
    WScript.Quit
End If

Dim loopCount
loopCount = 0

Do
    ' 1. Check Local Python POS Server (Port 8000)
    bServerUp = False
    On Error Resume Next
    Set http = CreateObject("MSXML2.ServerXMLHTTP.6.0")
    http.Open "GET", "http://127.0.0.1:8000/api/settings", False
    http.setTimeouts 1000, 1000, 2000, 2000
    http.Send
    
    If Err.Number = 0 And http.Status = 200 Then
        bServerUp = True
    End If
    On Error GoTo 0
    
    If Not bServerUp Then
        WshShell.CurrentDirectory = strDir
        WshShell.Run Chr(34) & strDir & "\start_pos.bat" & Chr(34) & " --silent", 0, False
        WScript.Sleep 5000
    End If

    ' 2. Check Cloudflare Online Tunnel every 30 seconds (on loop 0, 3, 6, ...)
    If (loopCount Mod 3) = 0 Then
        On Error Resume Next
        Set cfProcs = objWMIService.ExecQuery("SELECT * FROM Win32_Process WHERE Name = 'cloudflared.exe'")
        If Err.Number = 0 Then
            If cfProcs.Count = 0 Then
                WshShell.CurrentDirectory = strDir
                WshShell.Run Chr(34) & strDir & "\start_tunnel_silent.bat" & Chr(34), 0, False
            End If
        End If
        On Error GoTo 0
    End If
    
    loopCount = (loopCount + 1) Mod 300
    WScript.Sleep 10000
Loop
