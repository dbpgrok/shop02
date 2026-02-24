const fs = require('fs');
const path = require('path');

console.log('🎵 SHOP02 v4 - 100% GitHub Actions');

try {
  // Template (index.html ou template.html)
  const templateName = fs.existsSync('template.html') ? 'template.html' : 'index.html';
  if (!fs.existsSync(templateName)) {
    console.error('❌ ' + templateName + ' manquant');
    process.exit(1);
  }
  const template = fs.readFileSync(templateName, 'utf8');
  console.log('📄 Template OK:', templateName);

  // Assets
  const assetsDir = 'assets';
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
    console.log('📁 assets/ créé');
  }

  const files = fs.readdirSync(assetsDir);
  const mp3s = files.filter(f => f.toLowerCase().endsWith('.mp3')).sort();
  console.log('🎵 MP3:', mp3s.length);

  if (mp3s.length === 0) {
    fs.copyFileSync(templateName, 'index.html');
    console.log('✅ Mode démo: index.html copié');
    return;
  }

  // Tracks HTML
  let tracks = '';
  mp3s.forEach((file, i) => {
    const id = path.parse(file).name;
    const title = id.charAt(0).toUpperCase() + id.slice(1).replace(/[-_]/g, ' ');

    const cover = path.join(assetsDir, id + '.jpg');
    const coverUrl = fs.existsSync(cover) ? cover : `https://via.placeholder.com/250?text=${id}`;

    tracks += `<div class="track">
<img src="${coverUrl}" class="cover">
<div><h2>${title}</h2><p>AI101MUSIC 2026</p></div>
<div id="audio-container${id}" style="display:none;"><div class="loading">Chargement...</div><audio id="audio${id}" controls style="display:none;"></audio></div>
<div class="price">€0.79</div>
<button class="btn" onclick="playPreview('${id}')">▶️</button>
<button class="btn buy" onclick="buy('${title}')">💳</button>
</div>`;
  });

  let html = template.replace(/<!--\s*DUPLIQUEZ\s*-->/gi, tracks);

  // Init JS
  const inits = mp3s.map(f => {
    const id = path.parse(f).name;
    return `setupAudioLimits(document.getElementById('audio${id}'));`;
  }).join('\n');

  html = html.replace(/\/\/ Initialisation/gi, `// Auto-init\n${inits}`);

  fs.writeFileSync('index.html', html);
  console.log(`✅ ${mp3s.length} titres → index.html`);

} catch (e) {
  console.error('❌ ERREUR:', e.message);
  process.exit(1);
}
