const fs = require('fs');
const path = require('path');

console.log('🎵 SHOP02 GENERATOR v3.0 - Ultra-simple & sans dépendances');

function findTemplate() {
  const candidates = ['template.html', 'index.html'];
  for (const file of candidates) {
    if (fs.existsSync(file)) {
      console.log(`📄 Template trouvé: ${file}`);
      return file;
    }
  }
  console.error('❌ Erreur: template.html OU index.html requis');
  process.exit(1);
}

const templateFile = findTemplate();
const template = fs.readFileSync(templateFile, 'utf8');

const assetsDir = './assets/';
let mp3Files = [];

if (!fs.existsSync(assetsDir)) {
  console.log('⚠️  Dossier assets/ créé');
  fs.mkdirSync(assetsDir, { recursive: true });
}

if (fs.existsSync(assetsDir)) {
  mp3Files = fs.readdirSync(assetsDir)
    .filter(f => /\.(mp3|MP3)$/.test(f))
    .sort((a, b) => a.localeCompare(b));
}

console.log(`🎼 ${mp3Files.length} MP3: ${mp3Files.slice(0, 5).join(', ') || 'aucun'}`);

if (mp3Files.length === 0) {
  console.log('📋 Aucun MP3 → copie template');
  fs.copyFileSync(templateFile, 'index.html');
  console.log('✅ Copie terminée (mode démo)');
  process.exit(0);
}

// Génération blocs tracks
let tracksHtml = '';
mp3Files.forEach((mp3File, index) => {
  const trackId = path.basename(mp3File, path.extname(mp3File));
  const title = trackId
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/Mp3$/, '');

  // Cover intelligent
  const coverPath = path.join(assetsDir, trackId + '.jpg');
  const coverSrc = fs.existsSync(coverPath) 
    ? coverPath 
    : `https://via.placeholder.com/250/e6b800/ffffff?text=${title.slice(0,8)}`;

  tracksHtml += `
<div class="track">
<img src="${coverSrc}" alt="${title}" class="cover" loading="lazy">
<div>
<h2 class="title">${title}</h2>
<p class="artist">AI101MUSIC • 2026 (${(index+1).toString().padStart(2,'0')}/${mp3Files.length})</p>
</div>
<div id="audio-container${trackId}" style="display:none;">
<div class="loading" id="loading${trackId}">🔄 Pré-écoute sécurisée...</div>
<audio id="audio${trackId}" controls preload="metadata" 
controlsList="nodownload noremoteplayback nopicture-in-picture" 
style="width:100%;display:none;"></audio>
</div>
<div class="price">€0.79</div>
<button class="btn play-btn" id="playBtn${trackId}" onclick="playPreview('${trackId}')">▶️ 30s</button>
<button class="btn buy" onclick="buy('${title}')">💳 Acheter</button>
</div>`;
});

// Remplacement + init JS auto
let finalHtml = template.replace(/<!--\s*DUPLIQUEZ\s*(ce bloc[^>]*?)?\s*-->/i, tracksHtml);

// Auto-init TOUS les audios
const initCode = mp3Files.map(f => {
  const id = path.basename(f, path.extname(f));
  return `setupAudioLimits(document.getElementById('audio${id}'));`;
}).join('\n    ');

finalHtml = finalHtml.replace(
  /(\/\/\s*Initialisation\s*(pour tous les audios|auto)[^]*?)/i,
  `$1\n    ${initCode}`
);

fs.writeFileSync('index.html', finalHtml);
console.log(`\n✨ ✅ BOUTIQUE GÉNÉRÉE: ${mp3Files.length} titres !`);
console.log(`📊 Tracks: ${mp3Files.join(', ').slice(0, 50)}...`);
console.log('🎉 Ouvrez index.html');
