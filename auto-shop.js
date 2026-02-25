const fs = require('fs');
const path = require('path');

console.log('🎵 SHOP02 GENERATOR v5 - Réparé & Covers auto');

try {
  // 1. Template (index.html si pas de template.html)
  const templateFile = fs.existsSync('template.html') ? 'template.html' : 'index.html';
  if (!fs.existsSync(templateFile)) {
    console.error(`❌ ${templateFile} manquant. Créez-le avec <!-- INSERT_TRACKS -->`);
    process.exit(1);
  }
  let html = fs.readFileSync(templateFile, 'utf8');
  console.log(`📄 Template: ${templateFile}`);

  // 2. Crée assets/ si absent
  if (!fs.existsSync('assets')) {
    fs.mkdirSync('assets');
    console.log('📁 assets/ créé');
  }

  // 3. Scan MP3 + covers
  const files = fs.readdirSync('assets');
  const mp3s = files.filter(f => f.toLowerCase().endsWith('.mp3')).sort();
  console.log(`✅ ${mp3s.length} MP3: ${mp3s.map(f => f.replace('.mp3', '')).join(', ') || 'aucun'}`);

  if (mp3s.length === 0) {
    console.log('ℹ️ Ajoutez MP3 dans assets/');
    process.exit(0);
  }

  // 4. Template track avec cover auto (150x150 comme demandé)
  const trackTemplate = (mp3, i) => {
    const name = mp3.replace('.mp3', '');
    const cover = files.find(f => f.toLowerCase().replace(/\.(jpg|png|jpeg)$/, '') === name.toLowerCase()) || `https://via.placeholder.com/150x150/e6b800/ffffff?text=${name.slice(0,10)}`;
    const ext = cover.endsWith('.jpg') || cover.endsWith('.jpeg') ? 'jpg' : cover.endsWith('.png') ? 'png' : '';
    return `<div class="track">
  <img src="assets/${cover}" alt="Cover ${name}" width="150" height="150" style="border-radius:10px; object-fit:cover;">
  <h3>${name}</h3>
  <audio id="audio${i+1}" controlsList="nodownload" preload="metadata" style="width:100%;"></audio>
  <button onclick="buy('${name}')">Acheter €1.99</button>
</div>`;
  };

  const tracksHtml = mp3s.map(trackTemplate).join('\n\n');

  // 5. JS mp3List + init (un lecteur à la fois)
  const mp3List = `const mp3Files = ${JSON.stringify(mp3s)};`;
  const initJs = mp3s.map((_, i) => `setupAudioLimits(document.getElementById('audio${i+1}'));`).join('\n  ');

  // 6. Insertion robuste (marqueurs simples)
  html = html.replace(/<!--\s*INSERT_TRACKS\s*-->/i, tracksHtml);
  html = html.replace(/\/\/\s*INSERT_MP3LIST/i, mp3List);
  html = html.replace(/\/\/\s*INSERT_INIT/i, initJs);

  // Sauvegarde (backup auto)
  fs.copyFileSync('index.html', 'index.backup.html');
  fs.writeFileSync('index.html', html);
  console.log(`🎉 index.html généré (${mp3s.length} tracks) ! Ouvrez-le ou push GitHub.`);

} catch (e) {
  console.error('❌ Erreur:', e.message);
  process.exit(1);
}
