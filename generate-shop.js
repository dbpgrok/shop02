const fs = require('fs');
const path = require('path');
const tinytag = require('tinytag'); // npm install tinytag

const assetsDir = './assets/';
const htmlTemplate = fs.readFileSync('template.html', 'utf8'); // Votre code HTML amélioré

async function generateShop() {
    const mp3Files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.mp3'));
    let tracksHtml = '';

    for (const mp3File of mp3Files) {
        const trackId = mp3File.replace('.mp3', '');
        const tag = await tinytag.get(assetsDir + mp3File);
        
        // Génère cover depuis nom MP3 ou fichier séparé
        const coverFile = `${assetsDir}${trackId}.jpg` || `${assetsDir}${trackId}.png`;
        const coverSrc = fs.existsSync(coverFile) ? coverFile : `https://via.placeholder.com/250/e6b800/ffffff?text=${trackId}`;
        
        const title = tag.title || trackId;
        const artist = tag.artist || 'Artiste inconnu';
        
        tracksHtml += `
<div class="track">
<img src="${coverSrc}" alt="Cover ${title}" class="cover">
<div>
<h2 class="title">${title}</h2>
<p class="artist">${artist} • ${tag.year || '2026'}</p>
</div>
<div id="audio-container${trackId}" style="display:none;">
    <div class="loading" id="loading${trackId}">🔄 Chargement...</div>
    <audio id="audio${trackId}" controls preload="none" controlsList="nodownload noremoteplayback nopicture-in-picture" style="width:350px;display:none;"></audio>
</div>
<div class="price">€0.79</div>
<button class="btn play-btn" id="playBtn${trackId}" onclick="playPreview('${trackId}')">▶️ Écouter 30s</button>
<button class="btn buy" onclick="buy('${title}')">💳 Acheter</button>
</div>`;
    }

    const finalHtml = htmlTemplate.replace('<!-- DUPLIQUEZ ce bloc pour chaque nouveau titre -->', tracksHtml);
    
    // Initialise tous les audios
    const initAudios = mp3Files.map(f => {
        const id = f.replace('.mp3', '');
        return `setupAudioLimits(document.getElementById('audio${id}'));`;
    }).join('\n    ');
    
    const finalJs = finalHtml.replace('// Initialisation pour tous les audios', `// Initialisation automatique pour ${mp3Files.length} titres\n    ${initAudios}`);
    
    fs.writeFileSync('index.html', finalJs);
    console.log(`✅ Shop généré : ${mp3Files.length} titres ajoutés !`);
}

generateShop();
