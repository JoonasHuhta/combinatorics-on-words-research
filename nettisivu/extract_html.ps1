$files = @(
    "Structures & Programs & Graphics & Music of A-2-F Strings.html",
    "RepetitionFreeStrings.html",
    "ToistovapaatMerkkijonot.html",
    "Number of a2f words.html",
    "a2f endomorphisms and substitutions.html",
    "HESARI 8.6.96.html",
    "Some cute factor occurrences in the 4-letter a2f g85.html",
    "TheSearchForOtherA-2-FreeEndomorphisms.nb.html",
    "Graphics of Abelian Square-Free Words over 4 Letters.html"
)

foreach ($fname in $files) {
    $path = Join-Path "C:\abc\nettisivu" $fname
    if (Test-Path $path) {
        Write-Host "=== $fname ==="
        $raw = Get-Content $path -Raw -Encoding UTF8
        $text = $raw -replace '<[^>]+>', ' '
        $text = $text -replace '&nbsp;', ' '
        $text = $text -replace '&amp;', '&'
        $text = $text -replace '&lt;', '<'
        $text = $text -replace '&gt;', '>'
        $text = $text -replace '&auml;', 'a'
        $text = $text -replace '&ouml;', 'o'
        $text = $text -replace '&copy;', '(c)'
        $text = $text -replace '&#\d+;', ''
        $text = $text -replace '\s+', ' '
        $text = $text.Trim()
        # Print first 3000 chars
        if ($text.Length -gt 3000) {
            Write-Host $text.Substring(0, 3000)
            Write-Host "... [TRUNCATED at 3000 chars, total: $($text.Length)]"
        } else {
            Write-Host $text
        }
        Write-Host ""
    } else {
        Write-Host "NOT FOUND: $path"
    }
}
