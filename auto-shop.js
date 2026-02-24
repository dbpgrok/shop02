const fs = require('fs');

console.log('🎵 AUTO-SHOP - Scan assets/');

// 1. Récupère TOUS les MP3
const mp3s = fs.readdirSync('assets').filter(f => f.endsWith('.mp3'));
console.log(`${mp3s.length} MP3 trouvés:`, mp3s.map(f => f.replace('.mp3','')).join(', '));

// 2. Template 1 track (copié de votre index.html)
const trackTemplate = (name, id) => `
<div class="track" data-track="${id}">
<img src="https://via.placeholder.com/250x250/e6b800/ffffff?text=${name.slice(0,8)}..." alt="Cover ${name}" class="cover">
<div><h2 class="title">${name}</h2><p class="artist">AI101MUSIC • Single 2026</p></div>
<div id="audio-container${id}" style="display:none;"><div class="loading" id="loading${id}">🔄 Chargement...</div><audio id="audio${id}" controls preload="none" controlsList="nodownload noremoteplayback nopicture-in-picture" style="width:350px;display:none;">Votre navigateur ne supporte pas l'audio.</audio></div>
<div class="price">€0.79</div>
<button class="btn play-btn" id="playBtn${id}" onclick="playPreview('${id}')">▶️ Écouter 30s</button>
<button class="btn buy" onclick="buy('${name}')">💳 Acheter</button>
</div>`;

// 3. Génère TOUS les tracks
const tracksHtml = mp3s.map((mp3, i) => trackTemplate(mp3.replace('.mp3',''), i+1)).join('\n');

// 4. Liste MP3 pour JS (fetch dynamique)
const mp3ListJs = `const mp3Files = ${JSON.stringify(mp3s)};`;

// 5. Init JS pour TOUS les audios
const initJs = mp3s.map((_, i) => `setupAudioLimits(document.getElementById('audio${i+1}'));`).join('\n    ');

// 6. Lit index.html original, remplace
let html = fs.readFileSync('index.html', 'utf8');

// Remplace <!-- TRACKS --> par les nouveaux tracks
html = html.replace(/<!-- TRACKS -->[\s\S]*<!-- END TRACKS -->/, `<!-- TRACKS -->\n${tracksHtml}\n<!-- END TRACKS -->`);

// Injecte liste MP3 + init
html = html.replace('let audioBlobs = {};', `let audioBlobs = {};\n${mp3ListJs}`);
html = html.replace(/setupAudioLimits\(document\.getElementById\('audio1'\)\);/, `    ${initJs}`);

fs.writeFileSync('index.html', html);
console.log('✅ index.html mis à jour avec', mp3s.length, 'tracks ! Rafraîchissez le navigateur.');
