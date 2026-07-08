Add-Type -AssemblyName System.IO.Compression.FileSystem
$files = @(
    'C:\abc\teoria\Keranen_uudet_ideat_ja_promptit.docx',
    'C:\abc\teoria\Veikko_Keranen_tutkimus_ja_teoria (3).docx'
)
foreach ($f in $files) {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($f)
    $entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
    $stream = $entry.Open()
    $reader = New-Object System.IO.StreamReader($stream)
    $content = $reader.ReadToEnd()
    $reader.Close()
    $zip.Dispose()
    $text = $content -replace '<[^>]+>', ' '
    $text = $text -replace '\s+', ' '
    $text = $text.Trim()
    $txtPath = $f -replace '\.docx$','.txt'
    $text | Out-File $txtPath -Encoding UTF8
    Write-Host "Saved: $txtPath"
}
