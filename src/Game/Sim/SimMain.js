import * as THREE from '/src/ExternalLib/three.js/build/three.module.js';
import { WebGPURenderer } from '/src/ExternalLib/three.js/build/three.webgpu.js';
import { setupHud } from '/src/Game/Hud/HudPerfTopRight.js';
import { setupHudTopLeft } from '/src/Game/Hud/HudPerfTopLeft.js';
import { setupCameraControls } from './CameraControls.js';
import { createGrid } from './Grid.js';

function initSimCity() {
    if (!navigator.gpu) throw new Error('WebGPU not supported');
    const width = window.innerWidth, height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 100);
    camera.position.set(5, 10, 5);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    const renderer = new WebGPURenderer({ antialias: true });
    renderer.setSize(width, height);

    const container = document.getElementById('three-container');
    container.appendChild(renderer.domElement);

    const grid = createGrid(scene);
    const hud = setupHud(renderer, container, true);
    const hudLeft = setupHudTopLeft(container, renderer);
    const controls = setupCameraControls(camera);

    async function animate(time) {
        controls.updateCamera();
        await renderer.renderAsync(scene, camera);
        hud.updateInfo(time);
        hudLeft.updateInfo();
        requestAnimationFrame(animate);
    }

    window.onload = async () => {
        await renderer.init();
        hud.setLastTime(performance.now());
        await renderer.renderAsync(scene, camera);
        requestAnimationFrame(animate);
    };
}

function init() {
    initSimCity();
}

export { init };
