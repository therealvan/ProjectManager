// Antialiasing.js - Manage all antialiasing modes for Three.js renderers
import * as THREE from '/src/ExternalLib/three.js/build/three.module.js';
import * as EffectComposerModule from '/src/ExternalLib/three.js/addons/postprocessing/EffectComposer.js';
import * as RenderPassModule from '/src/ExternalLib/three.js/addons/postprocessing/RenderPass.js';
import * as ShaderPassModule from '/src/ExternalLib/three.js/addons/postprocessing/ShaderPass.js';
import * as FXAAShaderModule from '/src/ExternalLib/three.js/addons/shaders/FXAAShader.js';
import * as SMAAPassModule from '/src/ExternalLib/three.js/addons/postprocessing/SMAAPass.js';
import * as SSAARenderPassModule from '/src/ExternalLib/three.js/addons/postprocessing/SSAARenderPass.js';
import * as TAARenderPassModule from '/src/ExternalLib/three.js/addons/postprocessing/TAARenderPass.js';

const { EffectComposer } = EffectComposerModule;
const { RenderPass } = RenderPassModule;
const { ShaderPass } = ShaderPassModule;
const { FXAAShader } = FXAAShaderModule;
const { SMAAPass } = SMAAPassModule;
const { SSAARenderPass } = SSAARenderPassModule;
const { TAARenderPass } = TAARenderPassModule;

export class Antialiasing {
    constructor(renderer, scene, camera, width, height) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.width = width;
        this.height = height;
        this.composer = null;

        // Liste des modes d'antialiasing disponibles
        this.modes = [
            { name: 'Off', type: 'none' },
            { name: 'MSAA x2', type: 'msaa', level: 2 },
            { name: 'MSAA x4', type: 'msaa', level: 4 },
            { name: 'MSAA x8', type: 'msaa', level: 8 },
            { name: 'FXAA', type: 'fxaa' },
            { name: 'SMAA', type: 'smaa' },
            { name: 'SSAA x2', type: 'ssaa', level: 2 },
            { name: 'SSAA x4', type: 'ssaa', level: 4 },
            { name: 'TAA x2', type: 'taa', level: 2 },
            { name: 'TAA x4', type: 'taa', level: 4 }
        ];
        this.currentModeIndex = 2; // Démarre avec MSAA x4 par défaut
        this.applySettings();
    }

    // Appliquer les paramètres d'antialiasing
    applySettings() {
        const mode = this.modes[this.currentModeIndex];
        
        // Réinitialiser le composer
        if (this.composer) {
            this.composer.passes = [];
            this.composer = null;
        }

        if (mode.type === 'none') {
            if (this.renderer instanceof THREE.WebGLRenderer) {
                this.renderer.antialias = false; // Note: nécessite recréation
            } else {
                this.renderer.sampleCount = 1;
            }
        } else if (mode.type === 'msaa') {
            if (this.renderer instanceof THREE.WebGLRenderer) {
                this.renderer.antialias = true; // Note: nécessite recréation
            } else {
                this.renderer.sampleCount = mode.level; // WebGPU ajuste dynamiquement
            }
        } else {
            // Post-processing avec EffectComposer
            this.composer = new EffectComposer(this.renderer);
            const renderPass = new RenderPass(this.scene, this.camera);
            this.composer.addPass(renderPass);

            switch (mode.type) {
                case 'fxaa':
                    const fxaaPass = new ShaderPass(FXAAShader);
                    fxaaPass.uniforms['resolution'].value.set(1 / this.width, 1 / this.height);
                    this.composer.addPass(fxaaPass);
                    break;
                case 'smaa':
                    const smaaPass = new SMAAPass(this.width, this.height);
                    this.composer.addPass(smaaPass);
                    break;
                case 'ssaa':
                    const ssaaPass = new SSAARenderPass(this.scene, this.camera, 0x000000, 0);
                    ssaaPass.sampleLevel = mode.level === 2 ? 1 : 2; // x2 = level 1, x4 = level 2
                    this.composer.addPass(ssaaPass);
                    break;
                case 'taa':
                    const taaPass = new TAARenderPass(this.scene, this.camera, 0x000000, 0);
                    taaPass.sampleLevel = mode.level === 2 ? 1 : 2; // x2 = level 1, x4 = level 2
                    this.composer.addPass(taaPass);
                    break;
            }
        }
    }

    // Passer au mode suivant
    nextMode() {
        this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
        this.applySettings();
        return this.getStatus();
    }

    // Obtenir l'état actuel
    getStatus() {
        return this.modes[this.currentModeIndex].name;
    }

    // Rendre avec le composer si actif
    render() {
        if (this.composer) {
            this.composer.render();
            return true;
        }
        return false;
    }
}

export default Antialiasing;
