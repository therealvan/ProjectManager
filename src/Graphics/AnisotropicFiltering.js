// ./src/Graphics/AnisotropicFiltering.js - Manage anisotropic filtering for Three.js textures
import * as THREE from '/src/ExternalLib/three.js/build/three.module.js';

export class AnisotropicFiltering {
    constructor(texture, renderer) {
        this.texture = texture;
        this.renderer = renderer;
        this.maxAnisotropy = (renderer instanceof THREE.WebGLRenderer) ? renderer.capabilities.getMaxAnisotropy() : 16;

        this.modes = [
            { name: 'Off', level: 1 },
            { name: '2x', level: Math.min(2, this.maxAnisotropy) },
            { name: '4x', level: Math.min(4, this.maxAnisotropy) },
            { name: '8x', level: Math.min(8, this.maxAnisotropy) },
            { name: '16x', level: Math.min(16, this.maxAnisotropy) }
        ];
        this.currentModeIndex = 0;
        this.applySettings();
    }

    applySettings() {
        const mode = this.modes[this.currentModeIndex];
        if (this.texture && this.texture instanceof THREE.Texture) {
            this.texture.anisotropy = mode.level;
            this.texture.needsUpdate = true;
            console.log(`Anisotropic Filtering appliqué : ${mode.name}`);
        } else {
            console.warn('Anisotropic Filtering : texture non définie ou invalide, paramètres non appliqués.');
        }
    }

    nextMode() {
        this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
        this.applySettings();
        console.log(`Anisotropic Filtering passe au mode : ${this.getStatus()}`);
        return this.getStatus();
    }

    getStatus() {
        return this.modes[this.currentModeIndex].name;
    }
}

export default AnisotropicFiltering;
