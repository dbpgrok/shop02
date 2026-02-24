const fs = require('fs');
const chokidar = require('chokidar'); // npm install chokidar

function rebuild() {
  const mp3s = fs.readdirSync('assets').filter(f => f.endsWith('.mp3'));
  console.clear();
  console.log(`🎵 LIVE SHOP: ${mp3s.length} tracks | Rafraîchis index.html`);
  
  let html = fs.readFileSync('index.html', 'utf8');
  const tracks = mp3s.map((mp3, i) => `<div class="track"><h2>${mp3}</h2><audio src="assets/${mp3}#t=30" controls></audio></div>`).join('');
  html = html.replace(/<!-- DUPLIQUEZ[^]*?-->/s, tracks);
  fs.writeFileSync('index.html', html);
}

// WATCH assets/ + rebuild auto
chokidar.watch('assets').on('all', rebuild);
rebuild(); // 1er build
console.log('👀 Surveille assets/ - Ajoute MP3 → Auto-update !');
