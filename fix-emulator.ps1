$emulatorPath = "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe"
$avdName = "Medium_Phone"

Write-Host "Tentando iniciar o emulador '$avdName' com DNS do Google (8.8.8.8)..."
& $emulatorPath -avd $avdName -dns-server 8.8.8.8
