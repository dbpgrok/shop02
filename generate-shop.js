const fs = require('fs');
const path = require('path');

console.log('🎵 SHOP02 GENERATOR v3.1 - CORRIGÉ');

function findTemplate() {
  const candidates = ['template.html', 'index.html'];
  for (const file of candidates) {
    if (fs.existsSync(file)) {
      console.log(`📄 Template: ${file}`);
      return file;
    }
  }
  console.error('❌ Besoin template.html OU index.html');
  process.exit(1);
}

const templateFile = findTemplate();
const template = fs.readFileSync(templateFile, 'utf8');

const assetsDir = './assets/';
let mp3Files = [];

if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

mp3Files = fs.readdirSync(assetsDir)
  .filter(f => /\.(mp3|MP3)$/.test(f))
  .sort();

console.log(`🎼 ${mp3Files.length} MP3 trouvés`);

if (mp3Files.length === 0) {
  console.log('📋 Mode démo: copie template');
  fs.copyFileSync(templateFile, 'index.html');
  console.log('✅ TERMINÉ');
  process.exit(0);
}

let tracksHtml = '';
mp3Files.forEach((mp3File, i) => {
  const trackId = path.basename(mp3File, path.extname(mp3File));
  const title = trackId.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  
  const coverPath = path.join(assetsDir, trackId + '.jpg');
  const coverSrc = fs.existsSync(coverPath) ? coverPath : `https://via.placeholder.com/250/e6b800/ffffff?text=${title}`;

  tracksHtml += `
<div class="track">
<img src="${coverSrc}" alt="${title}" class="cover">
<div>
<h2 class="title">${title}</h2>
<p class="artist">AI101MUSIC • 2026 (${i+1}/${mp3Files.length})</p>
</div>
<div id="audio-container${trackId}" style="display:none;">
<div class="loading" id="loading${trackId}">🔄 Chargement...</div>
<audio id="audio${trackId}" controls preload="none" controlsList="nodownload noremoteplayback nopicture-in-picture" style="width:100%;display:none;"></audio>
</div>
<div class="price">€0.79</div>
<button class="btn play-btn" id="playBtn${trackId}" onclick="playPreview('${trackId}')">▶️ 30s</button>
<button class="btn buy" onclick="buy('${title}')">💳 Acheter</button>
</div>`;
});

let finalHtml = template.replace(/<!--.*?DUPLIQUEZ.*?-->/gis, tracksHtml);

const initJs = mp3Files.map(f => {
  const id = path.basename(f, path.extname(f));
  return `setupAudioLimits(document.getElementById('audio${id}'));`;
}).join('\n    ');

finalHtml = finalHtml.replace(/\/\/\s*Initialisation.*?audios/i, 
  `$&\n    ${initJs}`
);

fs.writeFileSync('index.html', finalHtml);
console.log(`✅ ${mp3Files.length} titres générés !`);
