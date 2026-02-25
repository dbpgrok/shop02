const fs = require('fs');
const path = require('path');

console.log('🔍 Scan assets/');

// Vérif dossier assets/
if (!fs.existsSync('assets')) {
  console.error('❌ Créez dossier "assets/" d\'abord !');
  process.exit(1);
}

// Récup MP3
let mp3s = [];
try {
  mp3s = fs.readdirSync('assets').filter(f => f.endsWith('.mp3')).sort();
} catch(e) {
  console.error('❌ Erreur lecture assets/ :', e.message);
  process.exit(1);
}

console.log(`✅ ${mp3s.length} MP3:`, mp3s.map(f=>f.replace('.mp3','')).join(', ') || 'aucun');

// Template track (SIMPLIFIÉ)
const trackTemplate = (name, id) => `<div class="track">
<img src="https://via.placeholder.com/250x250/e6b800/ffffff?text=${name.slice(0,8)}" class="cover">
<h2>${name}</h2>
<div id="audio-container${id}" style="display:none;"><audio id="audio${id}"></audio></div>
<button onclick="playPreview('${id}')">▶️ ${name}</button>
</div>`;

// Génère tracks
const tracksHtml = mp3s.map((mp3,i)=>trackTemplate(mp3.replace('.mp3',''),i+1)).join('\n\n');

// Génère JS list + init
const mp3List = `const mp3Files = ${JSON.stringify(mp3s)};`;
const initJs = mp3s.map((_,i)=>`setupAudioLimits(document.getElementById('audio${i+1}'));`).join('\n  ');

// Remplace dans index.html
let html = fs.readFileSync('index.html','utf8');

// Points d'insertion (ajoutez-les dans votre index.html)
html = html.replace('<!-- INSERT_TRACKS -->', tracksHtml);
html = html.replace('// INSERT_MP3LIST', mp3List);
html = html.replace('// INSERT_INIT', initJs);

fs.writeFileSync('index.html', html);
console.log('🎉 index.html mis à jour ! Ouvrez-le.');
