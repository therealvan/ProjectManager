// ./src/Graphics/EnvironmentMapping.js - Manage environment mapping for Three.js materials
import * as THREE from '/src/ExternalLib/three.js/build/three.module.js';

export class EnvironmentMapping {
    constructor(material) {
        this.material = material;

        this.modes = [
            { name: 'Off', envMap: null },
            { name: 'Cube Reflection', mapping: THREE.CubeReflectionMapping },
            { name: 'Cube Refraction', mapping: THREE.CubeRefractionMapping },
            { name: 'Equirectangular Reflection', mapping: THREE.EquirectangularReflectionMapping },
            { name: 'Equirectangular Refraction', mapping: THREE.EquirectangularRefractionMapping }
        ];
        this.currentModeIndex = 0;
        this.envMapTexture = null;
    }

    setEnvMap(texture) {
        this.envMapTexture = texture;
        this.applySettings();
    }

    applySettings() {
        const mode = this.modes[this.currentModeIndex];
        if (this.material && this.material instanceof THREE.Material) {
            if (mode.name === 'Off' || !this.envMapTexture) {
                this.material.envMap = null;
            } else {
                this.material.envMap = this.envMapTexture;
                this.envMapTexture.mapping = mode.mapping;
            }
            this.material.needsUpdate = true;
            console.log(`Environment Mapping appliqué : ${mode.name}`);
        } else {
            console.warn('Environment Mapping : matériau non défini ou invalide, paramètres non appliqués.');
        }
    }

    nextMode() {
        this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
        this.applySettings();
        console.log(`Environment Mapping passe au mode : ${this.getStatus()}`);
        return this.getStatus();
    }

    getStatus() {
        return this.modes[this.currentModeIndex].name;
    }
}

export default EnvironmentMapping;
