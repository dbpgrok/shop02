#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

async function generateShop() {
  console.log('🎵 Shop auto');
  
  // 1. Template
  const template = fs.readFileSync('template.html', 'utf8');
  
  // 2. MP3 list
  const mp3s = fs.readdirSync('./assets')
    .filter(f => f.endsWith('.mp3'))
    .map(f => path.parse(f).name);
  
  // 3. Tracks
  const tracks = mp3s.map((name, i) => `
<div class="track">
<img src="./assets/${name}.jpg" class="cover">
<h2>${name}</h2>
<div id="audio${i}">
  <audio controls src="./assets/${name}.mp3#t=30"></audio>
</div>
<button onclick="buy('${name}')">Acheter €0.79</button>
</div>`).join('');
  
  // 4. Output
  const html = template.replace('<!-- TRACKS -->', tracks);
  fs.writeFileSync('index.html', html);
  console.log(`✅ ${mp3s.length} tracks`);
}

generateShop();
