// ./src/Graphics/ShadowMapping.js - Manage shadow mapping modes for Three.js renderers
import * as THREE from '/src/ExternalLib/three.js/build/three.module.js';

export class ShadowMapping {
    constructor(renderer) {
        this.renderer = renderer;

        this.modes = [
            { name: 'Off', type: THREE.BasicShadowMap },
            { name: 'PCF', type: THREE.PCFShadowMap },
            { name: 'PCF Soft', type: THREE.PCFSoftShadowMap },
            { name: 'VSM', type: THREE.VSMShadowMap }
        ];
        this.currentModeIndex = 0;
        this.applySettings();
    }

    applySettings() {
        const mode = this.modes[this.currentModeIndex];
        this.renderer.shadowMap.enabled = mode.name !== 'Off';
        this.renderer.shadowMap.type = mode.type;
        console.log(`Shadow Mapping appliqué : ${mode.name}`);
    }

    nextMode() {
        this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
        this.applySettings();
        console.log(`Shadow Mapping passe au mode : ${this.getStatus()}`);
        return this.getStatus();
    }

    getStatus() {
        return this.modes[this.currentModeIndex].name;
    }
}

export default ShadowMapping;
