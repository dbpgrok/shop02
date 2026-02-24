console.log('1. Node OK');
const fs = require('fs');
console.log('2. fs OK');

console.log('3. Fichiers:', fs.readdirSync('.'));
if (fs.existsSync('assets')) {
  console.log('4. MP3:', fs.readdirSync('assets'));
} else {
  console.log('❌ assets/ manquant');
}

if (fs.existsSync('index.html')) {
  console.log('5. index.html OK');
  console.log('6. DUPLIQUEZ trouvé:', fs.readFileSync('index.html').includes('DUPLIQUEZ'));
} else {
  console.log('❌ index.html manquant');
}
console.log('✅ Test terminé');
