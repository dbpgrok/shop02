const fs = require('fs');
const path = require('path');

console.log('🚀 SHOP02 Generator - Scan...');

const template = fs.readFileSync('index.html', 'utf8');

// Scan assets/
const assetsDir = './assets/';
let mp3Files = [];
if (fs.existsSync(assetsDir)) {
  mp3Files = fs.readdirSync(assetsDir)
    .filter(f => f.toLowerCase().endsWith('.mp3'))
    .sort();
}

console.log(`📂 ${mp3Files.length} MP3 trouvés:`, mp3Files.slice(0,3).join(', ') || 'aucun');

if (mp3Files.length === 0) {
  console.log('ℹ️ Aucun MP3 - garde template original');
  fs.writeFileSync('index.html', template);
} else {
  let tracksHtml = '';
  
  mp3Files.forEach((mp3File, index) => {
    const trackId = path.parse(mp3File).name;
    const safeId = index + 1; // ID numérique comme votre exemple (audio1, audio2...)
    
    // Cover
    const coverFile = path.join(assetsDir, trackId + '.jpg');
    const coverSrc = fs.existsSync(coverFile) 
      ? coverFile 
      : `https://via.placeholder.com/250/e6b800/ffffff?text=${trackId.slice(0,8)}`;
    
    const title = trackId.charAt(0).toUpperCase() + trackId.slice(1);
    
    tracksHtml += `
<div class="track">
<img src="${coverSrc}" alt="Cover ${title}" class="cover">
<div>
<h2 class="title">${title}</h2>
<p class="artist">AI101MUSIC • Single 2026</p>
</div>
<div id="audio-container${safeId}" style="display:none;">
<div class="loading" id="loading${safeId}">🔄 Chargement sécurisé...</div>
<audio id="audio${safeId}" controls preload="none" controlsList="nodownload noremoteplayback nopicture-in-picture" style="width:350px;display:none;">
Votre navigateur ne supporte pas l'audio.
</audio>
</div>
<div class="price">€0.79</div>
<button class="btn play-btn" id="playBtn${safeId}" onclick="playPreview('${safeId}')">▶️ Écouter 30s</button>
<button class="btn buy" onclick="buy('${title}')">💳 Acheter</button>
</div>`;
  });

  // Remplace le bloc DUPLIQUEZ
  let newHtml = template.replace(
    /<!--\s*DUPLIQUEZ ce bloc pour chaque nouveau titre[^]*?-->/s,
    tracksHtml
  );

  // Initialise TOUS les audios (comme votre audio1)
  const initCode = Array.from({length: mp3Files.length}, (_, i) => 
    `setupAudioLimits(document.getElementById('audio${i+1}'));`
  ).join('\n    ');

  newHtml = newHtml.replace(
    `setupAudioLimits(document.getElementById('audio1'));`,
    `// Auto-init ${mp3Files.length} audios\n    ${initCode}`
  );

  fs.writeFileSync('index.html', newHtml);
}

console.log('✅ index.html mis à jour !');
