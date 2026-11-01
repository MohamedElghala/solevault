const fs = require('fs');
const path = require('path');
const https = require('https');

const OWNER = 'MohamedElghala';
const REPO = 'solevault';
const TOKEN = process.env.GITHUB_PAT || process.env.GITHUB_TOKEN;
const ROOT_DIR = __dirname;

if (!TOKEN) {
  console.error('Error: GITHUB_PAT or GITHUB_TOKEN is required. Pass it via env or command line.');
  process.exit(1);
}

function githubRequest(endpoint, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request(`https://api.github.com${endpoint}`, {
      method,
      headers: {
        'User-Agent': 'SoleVault-Uploader',
        'Authorization': `Bearer ${TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject({ status: res.statusCode, data: parsed });
          }
        } catch (e) {
          reject({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function getFiles(dir, baseDir = '') {
  const ignoreList = [
    'node_modules',
    '.next',
    '.git',
    'out',
    'build',
    '.DS_Store',
    '.vercel',
    'push_to_github.js',
    '.env.local'
  ];
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (ignoreList.includes(file)) continue;
    const fullPath = path.join(dir, file);
    const relPath = baseDir ? `${baseDir}/${file}` : file;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, relPath));
    } else {
      results.push({ fullPath, relPath });
    }
  }
  return results;
}

async function uploadAll() {
  console.log(`🔍 Checking repository https://github.com/${OWNER}/${REPO}...`);
  let repo;
  try {
    repo = await githubRequest(`/repos/${OWNER}/${REPO}`);
    console.log(`✅ Repository exists: ${repo.full_name}`);
  } catch (err) {
    if (err.status === 404) {
      console.log(`Creating new repository https://github.com/${OWNER}/${REPO}...`);
      repo = await githubRequest('/user/repos', 'POST', {
        name: REPO,
        description: 'SOLEVAULT - High-End Sneaker & Luxury Streetwear E-Commerce Store (Next.js 14)',
        private: false,
        auto_init: false
      });
      console.log(`✅ Repository created successfully: ${repo.full_name}`);
    } else {
      console.error(`❌ Failed to access GitHub:`, err);
      return;
    }
  }

  const files = getFiles(ROOT_DIR);
  console.log(`📦 Found ${files.length} clean project files to upload...`);

  const treeItems = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileBuffer = fs.readFileSync(file.fullPath);
    const base64Content = fileBuffer.toString('base64');
    
    process.stdout.write(`Uploading [${i + 1}/${files.length}] ${file.relPath}... `);
    const blob = await githubRequest(`/repos/${OWNER}/${REPO}/git/blobs`, 'POST', {
      content: base64Content,
      encoding: 'base64'
    });
    treeItems.push({
      path: file.relPath.replace(/\\/g, '/'),
      mode: '100644',
      type: 'blob',
      sha: blob.sha
    });
    console.log('✓');
  }

  console.log('🌲 Creating Git Tree...');
  const tree = await githubRequest(`/repos/${OWNER}/${REPO}/git/trees`, 'POST', {
    tree: treeItems
  });

  console.log('📝 Creating Initial Git Commit...');
  const commit = await githubRequest(`/repos/${OWNER}/${REPO}/git/commits`, 'POST', {
    message: 'feat: launch SOLEVAULT luxury sneaker store (3D viewer, slide-out cart, bosta AWB, whatsapp integration)',
    tree: tree.sha
  });

  console.log('🚀 Updating main branch reference...');
  try {
    await githubRequest(`/repos/${OWNER}/${REPO}/git/refs/heads/main`, 'PATCH', {
      sha: commit.sha,
      force: true
    });
  } catch (e) {
    await githubRequest(`/repos/${OWNER}/${REPO}/git/refs`, 'POST', {
      ref: 'refs/heads/main',
      sha: commit.sha
    });
  }

  console.log(`\n🎉 SUCCESS! All ${files.length} files pushed to https://github.com/${OWNER}/${REPO}`);
}

uploadAll().catch(console.error);
