$path = "c:\Users\admin\Documents\000 A PREPA\planeaciones especialidades\Proyectos y Otros\semestre_2\PM2\public"
$files = Get-ChildItem -Path $path -Recurse -Filter "MC S*.html"

$oldString = @"
            delimiters: [
                {left: '$$$$', right: '$$$$', display: true},
                {left: '\\(', right: '\\)', display: false}
            ]
"@

$newString = @"
            delimiters: [
                {left: '$$$$', right: '$$$$', display: true},
                {left: '\\(', right: '\\)', display: false},
                {left: '$', right: '$', display: false}
            ]
"@

$count = 0
foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    if ($content.Contains($oldString)) {
        $content = $content.Replace($oldString, $newString)
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        $count++
    }
}
Write-Host "Updated $count files."
