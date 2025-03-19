// ./src/Graphics/TextureCompression.js - Manage texture compression formats for Three.js textures
import * as THREE from '/src/ExternalLib/three.js/build/three.module.js';

export class TextureCompression {
    constructor(texture) {
        this.texture = texture;

        this.modes = [
            { name: 'Off', format: THREE.RGBAFormat },
            { name: 'DXT1', format: THREE.RGB_S3TC_DXT1_Format },
            { name: 'DXT3', format: THREE.RGBA_S3TC_DXT3_Format },
            { name: 'DXT5', format: THREE.RGBA_S3TC_DXT5_Format },
            { name: 'ETC1', format: THREE.RGB_ETC1_Format }
        ];
        this.currentModeIndex = 0;
        this.applySettings();
    }

    applySettings() {
        const mode = this.modes[this.currentModeIndex];
        if (this.texture && this.texture instanceof THREE.Texture) {
            this.texture.format = mode.format;
            this.texture.needsUpdate = true;
            console.log(`Texture Compression appliquée : ${mode.name}`);
        } else {
            console.warn('Texture Compression : texture non définie ou invalide, paramètres non appliqués.');
        }
    }

    nextMode() {
        this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
        this.applySettings();
        console.log(`Texture Compression passe au mode : ${this.getStatus()}`);
        return this.getStatus();
    }

    getStatus() {
        return this.modes[this.currentModeIndex].name;
    }
}

export default TextureCompression;
