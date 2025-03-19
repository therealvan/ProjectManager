// ./src/Graphics/FogEffects.js - Manage fog effects for Three.js scenes
import * as THREE from '/src/ExternalLib/three.js/build/three.module.js';

export class FogEffects {
    constructor(scene) {
        this.scene = scene;

        this.modes = [
            { name: 'Off', fog: null },
            { name: 'Linear Fog', fog: new THREE.Fog(0xaaaaaa, 1, 10) },
            { name: 'Exponential Fog', fog: new THREE.FogExp2(0xaaaaaa, 0.1) }
        ];
        this.currentModeIndex = 0;
        this.applySettings();
    }

    applySettings() {
        const mode = this.modes[this.currentModeIndex];
        if (this.scene && this.scene instanceof THREE.Scene) {
            this.scene.fog = mode.fog;
            console.log(`Fog Effects appliqué : ${mode.name}`);
        } else {
            console.warn('Fog Effects : scene non définie ou invalide, paramètres non appliqués.');
        }
    }

    nextMode() {
        this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
        this.applySettings();
        console.log(`Fog Effects passe au mode : ${this.getStatus()}`);
        return this.getStatus();
    }

    getStatus() {
        return this.modes[this.currentModeIndex].name;
    }
}

export default FogEffects;
