// ./src/Graphics/PostProcessing.js - Manage general post-processing with EffectComposer
import * as THREE from '/src/ExternalLib/three.js/build/three.module.js';
import * as EffectComposerModule from '/src/ExternalLib/three.js/addons/postprocessing/EffectComposer.js';
import * as RenderPassModule from '/src/ExternalLib/three.js/addons/postprocessing/RenderPass.js';

const { EffectComposer } = EffectComposerModule;
const { RenderPass } = RenderPassModule;

export class PostProcessing {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.composer = null;

        this.modes = [
            { name: 'Off', enabled: false },
            { name: 'Basic', enabled: true }
        ];
        this.currentModeIndex = 0;
        this.applySettings();
    }

    applySettings() {
        const mode = this.modes[this.currentModeIndex];
        if (this.composer) {
            this.composer.passes = [];
            this.composer = null;
        }
        if (mode.enabled) {
            this.composer = new EffectComposer(this.renderer);
            const renderPass = new RenderPass(this.scene, this.camera);
            this.composer.addPass(renderPass);
        }
        console.log(`Post-Processing appliqué : ${mode.name}`);
    }

    nextMode() {
        this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
        this.applySettings();
        console.log(`Post-Processing passe au mode : ${this.getStatus()}`);
        return this.getStatus();
    }

    getStatus() {
        return this.modes[this.currentModeIndex].name;
    }

    render() {
        if (this.composer) {
            this.composer.render();
            return true;
        }
        return false;
    }
}

export default PostProcessing;
