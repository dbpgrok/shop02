const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const mp3s = fs.readdirSync('assets').filter(f => f.endsWith('.mp3'));

const tracks = mp3s.map((mp3, i) => {
  const name = mp3.replace('.mp3', '');
  return `<div class="track">
<img src="assets/${name}.jpg" class="cover">
<h2>${name}</h2>
<audio src="assets/${mp3}#t=30" controls preload="metadata" controlsList="nodownload"></audio>
<button onclick="alert('Achat ${name}')">€0.79</button>
</div>`;
}).join('');

html = html.replace('<!-- DUPLIQUEZ ce bloc -->', tracks);
fs.writeFileSync('index.html', html);
console.log(`✅ ${mp3s.length} tracks relatifs`);
