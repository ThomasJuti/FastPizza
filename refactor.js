const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.page.ts') || file.endsWith('.component.ts')) {
            refactorFile(fullPath);
        }
    }
}

function refactorFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const dir = path.dirname(filePath);
    const baseName = path.basename(filePath, '.ts');

    // Extract template
    const templateRegex = /template:\s*`([\s\S]*?)`\s*(,|(?=\n\s*styles:|\n\s*}))/;
    const templateMatch = content.match(templateRegex);

    // Extract styles
    const stylesRegex = /styles:\s*\[\s*`([\s\S]*?)`\s*\]/;
    const stylesMatch = content.match(stylesRegex);

    let modified = false;

    if (templateMatch) {
        const templateContent = templateMatch[1];
        const htmlPath = path.join(dir, `${baseName}.html`);
        fs.writeFileSync(htmlPath, templateContent.trim() + '\n');
        content = content.replace(templateRegex, `templateUrl: './${baseName}.html'$2`);
        modified = true;
    }

    if (stylesMatch) {
        const stylesContent = stylesMatch[1];
        const scssPath = path.join(dir, `${baseName}.scss`);
        fs.writeFileSync(scssPath, stylesContent.trim() + '\n');
        content = content.replace(stylesRegex, `styleUrls: ['./${baseName}.scss']`);
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`Refactored: ${filePath}`);
    }
}

const pagesDir = path.join(__dirname, 'src', 'app');
processDirectory(pagesDir);
console.log('Done!');
