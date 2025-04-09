import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Source folder containing characters
const charactersDir = path.join(__dirname, './public/Ninja Adventure - Asset Pack/Actor/Characters');

// ✅ Destination JSON file path (in src/assets)
const outputFile = path.join(__dirname, './src/assets/characters.json');

try {
    const characterFolders = fs.readdirSync(charactersDir).filter((name) =>
        fs.statSync(path.join(charactersDir, name)).isDirectory()
    );

    const characters = characterFolders.map((folderName) => {
        const facePath = `/Ninja Adventure - Asset Pack/Actor/Characters/${folderName}/Faceset.png`;
        const walkPath = `/Ninja Adventure - Asset Pack/Actor/Characters/${folderName}/SeparateAnim/Walk.png`;
        const idlePath = `/Ninja Adventure - Asset Pack/Actor/Characters/${folderName}/SeparateAnim/Idle.png`;
        const deadPath = `/Ninja Adventure - Asset Pack/Actor/Characters/${folderName}/SeparateAnim/Dead.png`;


        return {
            name: folderName,
            avatar: facePath,
            animation: {
                walk: walkPath,
                idle: idlePath,
            },
            dead: deadPath,
        };
    });

    fs.writeFileSync(outputFile, JSON.stringify(characters, null, 2));
    console.log(`✅ Character list successfully saved to: ${outputFile}`);
} catch (error) {
    console.error('❌ Error generating character list:', error.message);
}
