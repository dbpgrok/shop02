const fs = require('fs');
const path = require('path');
// Note: tinytag optionnel, script fonctionne sans

const assetsDir = './assets/';
const templateFile = fs.existsSync('template.html') ? 'template.html' : 'index.html';

console.log('🎵 Shop02 Generator v2');
console.log(`📁 Assets: ${assetsDir}`);
console.log(`📄 Template: ${templateFile}`);

if (!fs.existsSync(templateFile)) {
  console.error('❌ Erreur: template.html ou index.html manquant');
  process.exit(1);
}

const template = fs.readFileSync(templateFile, 'utf8');

let mp3Files = [];
if (fs.existsSync(assetsDir)) {
  mp3Files = fs.readdirSync(assetsDir)
    .filter(f => f.match(/\.mp3$/i))
    .sort();
}

console.log(`🎼 ${mp3Files.length} MP3 détectés: ${mp3Files.slice(0,3).join(', ')}${mp3Files.length>3 ? '...' : ''}`);

if (mp3Files.length === 0) {
  console.log('⚠️ Aucun MP3 → copie template vers index.html');
  fs.copyFileSync(templateFile, 'index.html');
  console.log('✅ Copie terminée');
  process.exit(0);
}

let tracksHtml = '';
mp3Files.forEach((mp3File, index) => {
  const trackId = mp3File.replace(/\.mp3$/i, '');
  
  // Cover auto (jpg/png ou placeholder)
  const coverExts = ['.jpg', '.jpeg', '.png'];
  let coverSrc = `https://via.placeholder.com/250/e6b800/ffffff?text=${trackId}`;
  for (const ext of coverExts) {
    const coverPath = path.join(assetsDir, trackId + ext);
    if (fs.existsSync(coverPath)) {
      coverSrc = coverPath;
      break;
    }
  }
  
  const title = trackId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  tracksHtml += `
<div class="track">
  <img src="${coverSrc}" alt="Cover ${title}" class="cover">
  <div>
    <h2 class="title">${title}</h2>
    <p class="artist">AI101MUSIC • Single 2026</p>
  </div>
  <div id="audio-container${trackId}" style="display:none;">
    <div class="loading" id="loading${trackId}">🔄 Chargement sécurisé...</div>
    <audio id="audio${trackId}" controls preload="none" controlsList="nodownload noremoteplayback nopicture-in-picture" style="width:350px;display:none;"></audio>
  </div>
  <div class="price">€0.79</div>
  <button class="btn play-btn" id="playBtn${trackId}" onclick="playPreview('${trackId}')">▶️ Écouter 30s</button>
  <button class="btn buy" onclick="buy('${title}')">💳 Acheter</button>
</div>`;
});

const finalHtml = template.replace('<!-- DUPLIQUEZ ce bloc pour chaque nouveau titre -->', tracksHtml);

// Initialise tous les audios JS
const initJs = mp3Files.map(f => {
  const id = f.replace(/\.mp3$/i, '');
  return `setupAudioLimits(document.getElementById('audio${id}'));`;
}).join('\n    ');

const finalJs = finalHtml.replace(
  '// Initialisation pour tous les audios',
  `// Auto-init ${mp3Files.length} audios\n    ${initJs}`
);

fs.writeFileSync('index.html', finalJs);
console.log(`✅ Boutique générée: ${mp3Files.length} titres !`);
console.log('✨ Ouvrez index.html');
