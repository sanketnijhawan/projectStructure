const defaultIgnorePatterns = [
    'node_modules', '.DS_Store', '.git', '.next', '.env', '.cache',
    '.bin', '.gradle', '.idea', '.vscode', 'build', '.expo', 'dist',
    'out', 'target', 'coverage', 'yarn.lock', 'package-lock.json',
    'pnpm-lock.yaml', '*.mp4', '*.mov', '*.avi', '*.wav', '*.psd',
    '*.ai', '*.log', 'npm-debug.log*', 'yarn-debug.log*',
    'yarn-error.log*', '.npm', '.yarn', '.settings', '*.swp',
    '*.swo', '.project', '.classpath', 'Thumbs.db', 'desktop.ini'
];

let currentStructure = null;
let ignorePatterns = [...defaultIgnorePatterns];
let totalFiles = 0;
let totalFolders = 0;
const fileTypes = new Set();
let rootName = '';

// Initialize
renderIgnorePatterns();

// Event Listeners
document.getElementById('folderInput').addEventListener('change', handleFileInput);

function handleFileInput(e) {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        rootName = files[0].webkitRelativePath.split('/')[0];
    }
    processFiles(files);
}

async function loadGitHubRepo() {
    const repoUrl = document.getElementById('githubRepo').value;
    if (!repoUrl) return;
    
    try {
        showLoading();
        const [user, repo] = repoUrl.split('/').slice(-2);
        rootName = repo;
        const apiUrl = `https://api.github.com/repos/${user}/${repo}/git/trees/main?recursive=1`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch repository');
        
        const data = await response.json();
        currentStructure = buildGitHubStructure(data.tree);
        displayStructure(currentStructure);
    } catch (error) {
        alert(`Error: ${error.message}`);
    } finally {
        hideLoading();
    }
}

function processFiles(files) {
    currentStructure = buildStructure(files);
    displayStructure(currentStructure);
}

function buildStructure(files) {
    resetCounters();
    const structure = {};
    
    files.forEach(file => {
        const path = file.webkitRelativePath.split('/');
        if (shouldIgnore(path)) return;

        let currentLevel = structure;
        path.forEach((item, index) => {
            const isFile = index === path.length - 1;
            
            if (!currentLevel[item]) {
                updateCounters(isFile, item);
                currentLevel[item] = { 
                    isFile,
                    expanded: true,
                    children: {} 
                };
            }
            currentLevel = currentLevel[item].children;
        });
    });
    
    return structure;
}

function buildGitHubStructure(tree) {
    resetCounters();
    const structure = {};

    tree.forEach(item => {
        const path = item.path.split('/');
        if (shouldIgnore(path)) return;

        let currentLevel = structure;
        path.forEach((part, index) => {
            const isFile = item.type === 'blob';
            
            if (!currentLevel[part]) {
                updateCounters(isFile, part);
                currentLevel[part] = { 
                    isFile,
                    expanded: true,
                    children: {} 
                };
            }
            currentLevel = currentLevel[part].children;
        });
    });
    
    return structure;
}

function updateCounters(isFile, name) {
    if (isFile) {
        totalFiles++;
        const type = name.split('.').pop() || 'unknown';
        fileTypes.add(type.toLowerCase());
    } else {
        totalFolders++;
    }
}

function resetCounters() {
    totalFiles = 0;
    totalFolders = 0;
    fileTypes.clear();
}

function shouldIgnore(pathParts) {
    return pathParts.some(part => ignorePatterns.includes(part));
}

function renderIgnorePatterns() {
    const container = document.getElementById('ignoreList');
    container.innerHTML = ignorePatterns.map(pattern => `
        <div class="pattern-tag">
            ${pattern}
            <span class="remove-pattern" onclick="removePattern('${pattern}')">&times;</span>
        </div>
    `).join('');
}

function removePattern(pattern) {
    ignorePatterns = ignorePatterns.filter(p => p !== pattern);
    renderIgnorePatterns();
    if (currentStructure) displayStructure(currentStructure);
}

function addPatterns() {
    const input = document.getElementById('newPattern').value;
    const newPatterns = input.split(',').map(p => p.trim()).filter(p => p);
    ignorePatterns = [...new Set([...ignorePatterns, ...newPatterns])];
    document.getElementById('newPattern').value = '';
    renderIgnorePatterns();
    if (currentStructure) displayStructure(currentStructure);
}

function displayStructure(structure) {
    const output = document.getElementById('folderStructure');
    output.innerHTML = `
        <div class="tree-root">${rootName}/</div>
        ${generateStructureHTML(structure)}
    `;
    updateStats();
}

function generateStructureHTML(structure, indent = 0, path = '') {
    let html = '';
    Object.entries(structure).forEach(([name, value]) => {
        const isFile = value.isFile;
        const currentPath = path ? `${path}/${name}` : name;
        
        if (isFile) {
            html += `
                <div class="file" style="margin-left: ${indent * 24}px">
                    📄 ${name}
                </div>
            `;
        } else {
            const hasChildren = Object.keys(value.children).length > 0;
            html += `
                <div class="folder-item ${value.expanded ? 'expanded' : 'collapsed'}" 
                    style="margin-left: ${indent * 24}px" 
                    data-path="${currentPath}" 
                    onclick="toggleFolder(event)">
                    📁 ${name}
                </div>
                <div class="folder-contents" style="display: ${value.expanded ? 'block' : 'none'}">
                    ${hasChildren ? generateStructureHTML(value.children, indent + 1, currentPath) : ''}
                </div>
            `;
        }
    });
    return html;
}

function toggleFolder(event) {
    const folderItem = event.currentTarget;
    const contents = folderItem.nextElementSibling;
    const isExpanded = folderItem.classList.contains('expanded');

    folderItem.classList.toggle('expanded');
    folderItem.classList.toggle('collapsed');
    contents.style.display = isExpanded ? 'none' : 'block';
    event.stopPropagation();
}

function toggleAll(expand) {
    const folders = document.getElementsByClassName('folder-item');
    Array.from(folders).forEach(folder => {
        const contents = folder.nextElementSibling;
        folder.classList.toggle('expanded', expand);
        folder.classList.toggle('collapsed', !expand);
        contents.style.display = expand ? 'block' : 'none';
    });
}

function updateStats() {
    document.getElementById('totalFiles').textContent = totalFiles;
    document.getElementById('totalFolders').textContent = totalFolders;
    document.getElementById('fileTypes').textContent = fileTypes.size;
}

function copyStructure() {
    if (!currentStructure) return;
    
    const statsText = `Files: ${totalFiles}\nFolders: ${totalFolders}\nFile Types: ${fileTypes.size}\n\n`;
    const structureText = `${rootName}/\n${generateTextStructure(currentStructure)}`;
    navigator.clipboard.writeText(statsText + structureText)
        .then(() => alert('Structure copied to clipboard!'))
        .catch(err => console.error('Failed to copy:', err));
}

function generateTextStructure(structure, indent = 0, prefix = '') {
    let text = '';
    const entries = Object.entries(structure);
    const lastIndex = entries.length - 1;

    entries.forEach(([name, value], index) => {
        const isLast = index === lastIndex;
        const currentPrefix = isLast ? '└── ' : '├── ';
        const nextPrefix = isLast ? '    ' : '│   ';
        
        text += `${prefix}${currentPrefix}${name}\n`;
        
        if (!value.isFile && Object.keys(value.children).length > 0) {
            text += generateTextStructure(
                value.children,
                indent + 1,
                prefix + nextPrefix
            );
        }
    });

    return text;
}

function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}