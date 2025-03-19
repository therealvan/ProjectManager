// ./src/Graphics/HDR.js - Manage HDR rendering for Three.js renderers
import * as THREE from '/src/ExternalLib/three.js/build/three.module.js';

export class HDR {
    constructor(renderer) {
        this.renderer = renderer;

        this.modes = [
            { name: 'Off', outputEncoding: THREE.LinearEncoding },
            { name: 'sRGB', outputEncoding: THREE.sRGBEncoding },
            { name: 'RGBE', outputEncoding: THREE.RGBEEncoding }
        ];
        this.currentModeIndex = 0;
        this.applySettings();
    }

    applySettings() {
        const mode = this.modes[this.currentModeIndex];
        this.renderer.outputEncoding = mode.outputEncoding;
        console.log(`HDR appliqué : ${mode.name}`);
    }

    nextMode() {
        this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
        this.applySettings();
        console.log(`HDR passe au mode : ${this.getStatus()}`);
        return this.getStatus();
    }

    getStatus() {
        return this.modes[this.currentModeIndex].name;
    }
}

export default HDR;
