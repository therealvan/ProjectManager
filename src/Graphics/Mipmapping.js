// ./src/Graphics/Mipmapping.js - Manage mipmapping and texture filtering for Three.js textures
import * as THREE from '/src/ExternalLib/three.js/build/three.module.js';

export class Mipmapping {
    constructor(texture) {
        this.texture = texture;

        this.modes = [
            { name: 'Off', minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter },
            { name: 'Nearest Mipmap Nearest', minFilter: THREE.NearestMipmapNearestFilter, magFilter: THREE.NearestFilter },
            { name: 'Nearest Mipmap Linear', minFilter: THREE.NearestMipmapLinearFilter, magFilter: THREE.NearestFilter },
            { name: 'Linear', minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter },
            { name: 'Linear Mipmap Nearest', minFilter: THREE.LinearMipmapNearestFilter, magFilter: THREE.LinearFilter },
            { name: 'Linear Mipmap Linear', minFilter: THREE.LinearMipmapLinearFilter, magFilter: THREE.LinearFilter }
        ];
        this.currentModeIndex = 0;
        this.applySettings();
    }

    applySettings() {
        const mode = this.modes[this.currentModeIndex];
        if (this.texture && this.texture instanceof THREE.Texture) {
            this.texture.minFilter = mode.minFilter;
            this.texture.magFilter = mode.magFilter;
            this.texture.needsUpdate = true;
            console.log(`Mipmapping appliqué : ${mode.name}`);
        } else {
            console.warn('Mipmapping : texture non définie ou invalide, paramètres non appliqués.');
        }
    }

    nextMode() {
        this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
        this.applySettings();
        console.log(`Mipmapping passe au mode : ${this.getStatus()}`);
        return this.getStatus();
    }

    getStatus() {
        return this.modes[this.currentModeIndex].name;
    }
}

export default Mipmapping;
