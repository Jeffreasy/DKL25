// scripts/remove-old-schema.js
const fs = require('fs'); // Gebruik require
const path = require('path'); // Gebruik require

// Bepaal paden relatief aan het script
// __dirname werkt direct in CommonJS
const projectRoot = path.resolve(__dirname, '..'); // Ga één niveau omhoog van scripts naar de project root
const filePath = path.join(projectRoot, 'dist', 'index.html');

console.log(`Attempting to modify: ${filePath}`);

try {
  // Lees het bestand
  let content = fs.readFileSync(filePath, 'utf8');
  console.log('Successfully read dist/index.html.');

  // Regex om de *specifieke* hardcoded JSON-LD te vinden en te verwijderen
  // We maken het iets specifieker om te voorkomen dat we ons eigen schema verwijderen
  // We zoeken naar het begin van het grote @graph array.
  const regex = /<script type="application\/ld\+json">\s*{\s*"@context": "https:\/\/schema\.org",\s*"@graph": \[\s*{[\s\S]*?<\/script>/i;

  const originalLength = content.length;
  const modifiedContent = content.replace(regex, '');
  const newLength = modifiedContent.length;

  if (originalLength !== newLength) {
    // Schrijf de aangepaste inhoud terug
    fs.writeFileSync(filePath, modifiedContent, 'utf8');
    console.log('Successfully removed the hardcoded JSON-LD schema from dist/index.html.');
  } else {
    console.log('Hardcoded JSON-LD schema not found in dist/index.html. No changes made.');
  }

} catch (err) {
  console.error(`Error processing ${filePath}:`, err);
  process.exit(1); // Stop het build proces bij een fout
}