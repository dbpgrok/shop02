const fs = require('fs');

// Ton index.html
let html = fs.readFileSync('index.html', 'utf8');

// MP3 GitHub RAW URLs
const repo = 'dbpgrok/shop02';
const mp3s = fs.readdirSync('assets').filter(f => f.endsWith('.mp3'));
const tracks = mp3s.map((mp3, i) => {
  const name = mp3.replace('.mp3', '');
  const rawUrl = `https://raw.githubusercontent.com/${repo}/main/assets/${mp3}`;
  return `<div class="track">
<img src="https://raw.githubusercontent.com/${repo}/main/assets/${name}.jpg" class="cover">
<h2>${name}</h2>
<audio src="${rawUrl}#t=30" controls preload="metadata" controlsList="nodownload"></audio>
<button onclick="alert('Achat ${name}')">€0.79</button>
</div>`;
}).join('');

html = html.replace('<!-- DUPLIQUEZ ce bloc -->', tracks);
fs.writeFileSync('index.html', html);
console.log(`✅ ${mp3s.length} tracks GitHub RAW`);
