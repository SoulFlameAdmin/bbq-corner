$Path = "E:\BBQ_SITE"
$DebounceMs = 2000
$fsw = New-Object System.IO.FileSystemWatcher $Path -Property @{ IncludeSubdirectories=$true; EnableRaisingEvents=$true; Filter="*.*" }
$timer = New-Object System.Timers.Timer; $timer.Interval=$DebounceMs; $timer.AutoReset=$false
$action = { $timer.Stop(); $timer.Start() }
Register-ObjectEvent $fsw Changed -Action $action | Out-Null
Register-ObjectEvent $fsw Created -Action $action | Out-Null
Register-ObjectEvent $fsw Deleted -Action $action | Out-Null
Register-ObjectEvent $fsw Renamed -Action $action | Out-Null

Register-ObjectEvent $timer Elapsed -Action {
  try {
    Push-Location $Path
    $stamp = (Get-Date -Format "HH:mm:ss")
    vercel deploy --prod --confirm --yes | Out-Null
    Write-Host "🚀 Vercel deployed @ $stamp"
  } catch {
    Write-Host "❌ $($_.Exception.Message)"
  } finally { Pop-Location }
} | Out-Null

Write-Host "👀 Watching $Path for direct Vercel deploy…"
while ($true) { Start-Sleep 1 }
