Add-Type -AssemblyName System.IO.Compression.FileSystem
$files = Get-ChildItem 'C:\abc\teoria\*.docx'
foreach ($f in $files) {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($f.FullName)
    $entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
    $stream = $entry.Open()
    $reader = New-Object System.IO.StreamReader($stream)
    $content = $reader.ReadToEnd()
    $reader.Close()
    $zip.Dispose()
    
    # Remove XML tags, keep text
    $text = $content -replace '<[^>]+>', ' '
    # Clean up whitespace
    $text = $text -replace '\s+', ' '
    $text = $text.Trim()
    
    $txtPath = $f.FullName -replace '\.docx$','.txt'
    $text | Out-File $txtPath -Encoding UTF8
    Write-Host "Saved: $txtPath (length: $($text.Length))"
}
