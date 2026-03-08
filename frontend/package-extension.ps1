Write-Host "Removing old zip..."
if (Test-Path "public\subscriptos-extension.zip") {
    Remove-Item "public\subscriptos-extension.zip" -Force
}

Write-Host "Building project..."
npm run build

Write-Host "Creating new zip..."
Compress-Archive -Path "dist\*" -DestinationPath "public\subscriptos-extension.zip" -Force

Write-Host "Done!"
