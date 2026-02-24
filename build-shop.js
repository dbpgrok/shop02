const fs = require('fs');
console.log('🎵 Build shop avec', 4, 'MP3');

// Template
let html = fs.readFileSync('index.html', 'utf8');

// Génère 4 tracks
const mp3s = ['Hamsterrad-Revolte.mp3', 'Self Care Groove.mp3', 'The Hope Wins.mp3', 'trk3.mp3'];
let tracksHtml = '';

mp3s.forEach((mp3, i) => {
  const id = i + 1;
  const name = mp3.replace('.mp3', '');
  const cover = name + '.jpg';
  
  tracksHtml += `
<div class="track">
<img src="assets/${cover}" alt="${name}" class="cover">
<div>
<h2 class="title">${name}</h2>
<p class="artist">AI101MUSIC • 2026</p>
</div>
<div id="audio-container${id}" style="display:none;">
<div class="loading" id="loading${id}">🔄 Chargement...</div>
<audio id="audio${id}" controls preload="none" controlsList="nodownload" style="width:350px;display:none;"></audio>
</div>
<div class="price">€0.79</div>
<button class="btn play-btn" id="playBtn${id}" onclick="playPreview('${id}')">▶️ 30s</button>
<button class="btn buy" onclick="buy('${name}')">💳 Acheter</button>
</div>`;
});

// Remplace
html = html.replace('<!-- DUPLIQUEZ ce bloc pour chaque nouveau titre (changez les IDs: audio-container2, audio2, etc.) -->', tracksHtml);

// Init audios 1-4
const init = 'setupAudioLimits(document.getElementById("audio1"));\n' +
  'setupAudioLimits(document.getElementById("audio2"));\n' +
  'setupAudioLimits(document.getElementById("audio3"));\n' +
  'setupAudioLimits(document.getElementById("audio4"));';

html = html.replace('setupAudioLimits(document.getElementById(\'audio1\'));', init);

fs.writeFileSync('index.html', html);
console.log('✅ 4 tracks ajoutés → rafraîchis ton navigateur !');
