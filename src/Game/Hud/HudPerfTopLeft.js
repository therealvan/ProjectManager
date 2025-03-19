// HudPerfTopLeft.js - Graphics options HUD in top-left corner with clickable controls
import * as THREE from '/src/ExternalLib/three.js/build/three.module.js';
import Antialiasing from '/src/Graphics/Antialiasing.js';
import ToneMapping from '/src/Graphics/ToneMapping.js';
import ShadowMapping from '/src/Graphics/ShadowMapping.js';
import Mipmapping from '/src/Graphics/Mipmapping.js';
import AnisotropicFiltering from '/src/Graphics/AnisotropicFiltering.js';
import PostProcessing from '/src/Graphics/PostProcessing.js';
import HDR from '/src/Graphics/HDR.js';
import EnvironmentMapping from '/src/Graphics/EnvironmentMapping.js';
import TextureCompression from '/src/Graphics/TextureCompression.js';
import FogEffects from '/src/Graphics/FogEffects.js';

export function setupHudTopLeft(container, renderer, scene = new THREE.Scene(), camera, texture = new THREE.Texture(), material, width, height) {
    const infoDiv = document.createElement('div');
    infoDiv.id = 'info-left';
    infoDiv.style.position = 'absolute';
    infoDiv.style.top = '10px';
    infoDiv.style.left = '10px';
    infoDiv.style.color = 'white';
    infoDiv.style.background = 'rgba(0, 0, 0, 0.7)';
    infoDiv.style.padding = '5px';
    infoDiv.style.borderRadius = '3px';
    infoDiv.style.zIndex = '2000';
    infoDiv.style.width = '250px';
    infoDiv.style.minHeight = '300px';
    infoDiv.style.pointerEvents = 'auto';
    infoDiv.style.userSelect = 'none';
    container.appendChild(infoDiv);

    const style = document.createElement('style');
    style.textContent = `
        .option-green { color: #00FF00; }
        .option-orange { color: #FFA500; }
        .option-red { color: #FF0000; }
        .option-button { cursor: pointer; margin-bottom: 5px; padding: 2px; display: block; }
    `;
    document.head.appendChild(style);

    const antialiasing = new Antialiasing(renderer, scene, camera, width, height);
    const toneMapping = new ToneMapping(renderer);
    const shadowMapping = new ShadowMapping(renderer);
    const mipmapping = new Mipmapping(texture);
    const anisotropicFiltering = new AnisotropicFiltering(texture, renderer);
    const postProcessing = new PostProcessing(renderer, scene, camera);
    const hdr = new HDR(renderer);
    const environmentMapping = new EnvironmentMapping(material);
    const textureCompression = new TextureCompression(texture);
    const fogEffects = new FogEffects(scene);

    const buttons = [
        { name: 'Antialiasing', instance: antialiasing },
        { name: 'Tone Mapping', instance: toneMapping },
        { name: 'Shadow Mapping', instance: shadowMapping },
        { name: 'Mipmapping', instance: mipmapping },
        { name: 'Anisotropic Filtering', instance: anisotropicFiltering },
        { name: 'Post-processing', instance: postProcessing },
        { name: 'HDR', instance: hdr },
        { name: 'Environment Mapping', instance: environmentMapping },
        { name: 'Texture Compression', instance: textureCompression },
        { name: 'Fog Effects', instance: fogEffects }
    ];

    let isInitialized = false;

    function updateInfo() {
        if (!isInitialized) {
            infoDiv.innerHTML = 'Graphique Options :<br>';
            buttons.forEach(({ name, instance }) => {
                const buttonDiv = document.createElement('div');
                buttonDiv.className = 'option-button';
                buttonDiv.setAttribute('data-feature', name);
                const status = instance.getStatus();
                const colorClass = status === 'Off' ? 'option-red' : 'option-green';
                buttonDiv.innerHTML = `${name}: <span class="${colorClass}">${status}</span>`;
                infoDiv.appendChild(buttonDiv);
                buttonDiv.addEventListener('click', (event) => {
                    event.stopPropagation();
                    instance.nextMode();
                    updateStatus(buttonDiv, instance);
                });
            });
            isInitialized = true;
        }
    }

    function updateStatus(buttonDiv, instance) {
        const status = instance.getStatus();
        const colorClass = status === 'Off' ? 'option-red' : 'option-green';
        buttonDiv.innerHTML = `${buttonDiv.getAttribute('data-feature')}: <span class="${colorClass}">${status}</span>`;
    }

    updateInfo();

    return {
        updateInfo,
        getAntialiasing: () => antialiasing,
        getToneMapping: () => toneMapping,
        getShadowMapping: () => shadowMapping,
        getMipmapping: () => mipmapping,
        getAnisotropicFiltering: () => anisotropicFiltering,
        getPostProcessing: () => postProcessing,
        getHDR: () => hdr,
        getEnvironmentMapping: () => environmentMapping,
        getTextureCompression: () => textureCompression,
        getFogEffects: () => fogEffects
    };
}
