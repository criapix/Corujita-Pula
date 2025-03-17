const fs = require('fs');
const path = require('path');

// Diretório de saída dos arquivos compilados
const distDir = path.join(__dirname, '..', 'dist');
// Caminho para o arquivo HTML
const htmlPath = path.join(__dirname, '..', 'index.html');

// Função para escanear recursivamente um diretório
function scanDirectory(dir, baseDir = '') {
    const imports = {};
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        const relativePath = path.join(baseDir, file.name);

        if (file.isDirectory()) {
            // Recursivamente escanear subdiretórios
            const subImports = scanDirectory(fullPath, relativePath);
            Object.assign(imports, subImports);
        } else if (file.name.endsWith('.js') && !file.name.endsWith('.map.js')) {
            // Ignorar arquivos de source map
            if (!file.name.endsWith('.js.map')) {
                // Criar caminho de importação sem extensão .js
                const importPath = './dist/' + relativePath.replace(/\\/g, '/').replace('.js', '');
                // Criar caminho real com extensão .js
                const realPath = './dist/' + relativePath.replace(/\\/g, '/');
                imports[importPath] = realPath;
            }
        }
    }

    return imports;
}

// Função principal
function generateImportMap() {
    try {
        // Escanear o diretório dist
        const imports = scanDirectory(distDir);

        // Criar o objeto de import map
        const importMap = { imports };

        // Ler o arquivo HTML
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');

        // Verificar se já existe um import map
        const importMapRegex = /const importMap = document\.createElement\('script'\);[\s\S]*?document\.head\.appendChild\(importMap\);/;

        // Criar o novo código de import map
        const newImportMapCode = `const importMap = document.createElement('script');
        importMap.type = 'importmap';
        importMap.textContent = JSON.stringify(${JSON.stringify(importMap, null, 4)});
        document.head.appendChild(importMap);`;

        // Substituir ou adicionar o import map
        if (importMapRegex.test(htmlContent)) {
            htmlContent = htmlContent.replace(importMapRegex, newImportMapCode);
        } else {
            // Se não existir, adicionar antes do </head>
            htmlContent = htmlContent.replace('</head>', `    <script>\n        ${newImportMapCode}\n    </script>\n</head>`);
        }

        // Escrever o arquivo HTML atualizado
        fs.writeFileSync(htmlPath, htmlContent);

        console.log('Import map gerado com sucesso!');
    } catch (error) {
        console.error('Erro ao gerar import map:', error);
    }
}

// Executar a função principal
generateImportMap();