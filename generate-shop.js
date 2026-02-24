const fs = require('fs');
console.log('🎵 Shop Generator');

// Utilise index.html ou template.html comme base
const templateFile = fs.existsSync('template.html') ? 'template.html' : 'index.html';
if (!fs.existsSync(templateFile)) {
  console.log('❌ Pas de template.html ni index.html');
  process.exit(1);
}

const template = fs.readFileSync(templateFile, 'utf8');
console.log(`📄 Template: ${templateFile}`);

const assetsDir = './assets/';
let mp3s = [];
if (fs.existsSync(assetsDir)) {
  mp3s = fs.readdirSync(assetsDir).filter(f => f.endsWith('.mp3'));
}

console.log(`${mp3s.length} MP3 trouvés`);

if (mp3s.length === 0) {
  console.log('⚠️  Aucun MP3 → Copie template');
  fs.copyFileSync(templateFile, 'index.html');
} else {
  let tracksHtml = '';
  mp3s.forEach((mp3, i) => {
    const id = mp3.replace(/\.mp3$/, '');
    tracksHtml += `
<div class="track" id="track${i+1}">
<img src="${assetsDir}${id}.jpg" class="cover">
<div><h2>${id}</h2><p>Artiste • 2026</p></div>
<div id="audio-container${id}">
  <div class="loading" id="loading${id}">🔄 Chargement...</div>
  <audio id="audio${id}" controls style="display:none;"></audio>
</div>
<div class="price">€0.79</div>
<button class="btn play-btn" id="playBtn${id}" onclick="playPreview('${id}')">▶️ 30s</button>
<button class="btn buy" onclick="buy('${id}')">💳 Acheter</button>
</div>`;
  });

  const newHtml = template.replace('<!-- DUPLIQUEZ ce bloc pour chaque nouveau titre -->', tracksHtml);
  fs.writeFileSync('index.html', newHtml);
  console.log(`✅ ${mp3s.length} tracks ajoutés`);
}

console.log('✨ index.html prêt !');
