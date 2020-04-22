
const sharp = require('sharp');
const path = require('path');

class Resize {
    constructor(folder) {
        this.folder = folder;
    }
    async save(buffer,fileName,width = false,height = false) {
        const filename = fileName;
        const filepath = this.filepath(filename);

        if(width && height) {
            await sharp(buffer)
                .resize(width, height, {
                    fit: 'fill'
                })
                .toFile(filepath);
        } else {
            await sharp(buffer)
                .toFile(filepath);
        }

        return filename;
    }

    filepath(filename) {
        return path.resolve(`${this.folder}/${filename}`)
    }
}
module.exports = Resize;