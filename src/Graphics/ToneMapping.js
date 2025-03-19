// ./src/Graphics/ToneMapping.js - Manage tone mapping modes for Three.js renderers
import * as THREE from '/src/ExternalLib/three.js/build/three.module.js';

export class ToneMapping {
    constructor(renderer) {
        this.renderer = renderer;

        this.modes = [
            { name: 'Off', type: THREE.NoToneMapping },
            { name: 'Linear', type: THREE.LinearToneMapping },
            { name: 'Reinhard', type: THREE.ReinhardToneMapping },
            { name: 'Cineon', type: THREE.CineonToneMapping },
            { name: 'ACES Filmic', type: THREE.ACESFilmicToneMapping },
            { name: 'Custom', type: THREE.CustomToneMapping },
            { name: 'AgX', type: THREE.AgXToneMapping },
            { name: 'Neutral', type: THREE.NeutralToneMapping }
        ];
        this.currentModeIndex = 0;
        this.applySettings();
    }

    applySettings() {
        const mode = this.modes[this.currentModeIndex];
        this.renderer.toneMapping = mode.type;
        console.log(`Tone Mapping appliqué : ${mode.name}`);
    }

    nextMode() {
        this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
        this.applySettings();
        console.log(`Tone Mapping passe au mode : ${this.getStatus()}`);
        return this.getStatus();
    }

    getStatus() {
        return this.modes[this.currentModeIndex].name;
    }
}

export default ToneMapping;
