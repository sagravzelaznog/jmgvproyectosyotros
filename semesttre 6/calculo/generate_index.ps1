$basePath = "c:\Users\admin\Documents\000 A PREPA\planeaciones especialidades\Proyectos y Otros\semesttre 6\calculo"
$files = Get-ChildItem -Path $basePath -Recurse -File | Where-Object { $_.FullName -notmatch '\\node_modules\\' -and $_.Name -ne 'index.html' -and $_.Name -ne 'generate_index.ps1' }

$html = @"
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Índice de Cálculo</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0f172a;
            --text-color: #e2e8f0;
            --card-bg: rgba(30, 41, 59, 0.7);
            --accent: #38bdf8;
            --accent-hover: #0ea5e9;
        }
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: var(--bg-color);
            background-image: radial-gradient(circle at top right, #1e293b 0%, transparent 40%),
                              radial-gradient(circle at bottom left, #1e293b 0%, transparent 40%);
            background-attachment: fixed;
            color: var(--text-color);
            margin: 0;
            padding: 2rem;
            line-height: 1.6;
        }
        h1 {
            text-align: center;
            font-size: 3rem;
            font-weight: 800;
            background: linear-gradient(to right, #38bdf8, #818cf8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 3rem;
            text-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
        }
        .card {
            background-color: var(--card-bg);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
        }
        .card:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.04);
            border-color: rgba(56, 189, 248, 0.3);
        }
        .folder-name {
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #94a3b8;
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .file-link {
            color: var(--text-color);
            text-decoration: none;
            font-weight: 600;
            font-size: 1.125rem;
            margin-bottom: 1rem;
            word-break: break-all;
            transition: color 0.2s;
        }
        .file-link:hover {
            color: var(--accent);
        }
        .file-type {
            margin-top: auto;
            font-size: 0.75rem;
            font-weight: 600;
            background: rgba(56, 189, 248, 0.1);
            color: var(--accent);
            padding: 0.35rem 0.75rem;
            border-radius: 9999px;
            align-self: flex-start;
        }
        .search-container {
            max-width: 600px;
            margin: 0 auto 3rem auto;
            position: relative;
        }
        .search-input {
            width: 100%;
            padding: 1rem 1.5rem;
            border-radius: 9999px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(15, 23, 42, 0.6);
            color: white;
            font-size: 1.1rem;
            font-family: inherit;
            box-sizing: border-box;
            backdrop-filter: blur(10px);
            transition: all 0.3s;
        }
        .search-input:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
        }
    </style>
</head>
<body>
    <h1>Índice de Contenidos - Cálculo</h1>
    
    <div class="search-container">
        <input type="text" id="searchInput" class="search-input" placeholder="Buscar archivos o carpetas...">
    </div>

    <div class="container" id="cardsContainer">
"@

foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($basePath.Length + 1).Replace('\', '/')
    $folderName = if ($relativePath.Contains('/')) { $relativePath.Substring(0, $relativePath.LastIndexOf('/')) } else { "Raíz" }
    $fileName = $file.Name
    $extension = $file.Extension.TrimStart('.').ToUpper()
    if ($extension -eq "") { $extension = "ARCHIVO" }

    $html += @"
        <div class="card" data-name="$($fileName.ToLower())" data-folder="$($folderName.ToLower())">
            <div class="folder-name">📁 $($folderName)</div>
            <a href="$relativePath" class="file-link" target="_blank">$fileName</a>
            <div class="file-type">$extension</div>
        </div>
"@
}

$html += @"
    </div>

    <script>
        const searchInput = document.getElementById('searchInput');
        const cards = document.querySelectorAll('.card');

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            cards.forEach(card => {
                const name = card.getAttribute('data-name');
                const folder = card.getAttribute('data-folder');
                
                if (name.includes(searchTerm) || folder.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    </script>
</body>
</html>
"@

$html | Out-File -FilePath "$basePath\index.html" -Encoding utf8
