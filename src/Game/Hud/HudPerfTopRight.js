// HudPerfTopRight.js - Performance HUD with CPU, system RAM, and used game RAM
import * as THREE from '/src/ExternalLib/three.js/build/three.module.js';

export function setupHud(renderer, container, isWebGPU) {
    const infoDiv = document.createElement('div');
    infoDiv.id = 'info';
    infoDiv.style.position = 'absolute';
    infoDiv.style.top = '10px';
    infoDiv.style.right = '10px';
    infoDiv.style.color = 'white';
    infoDiv.style.background = 'rgba(0, 0, 0, 0.7)';
    infoDiv.style.padding = '5px';
    infoDiv.style.borderRadius = '3px';
    infoDiv.style.zIndex = '1000';
    container.appendChild(infoDiv);

    const style = document.createElement('style');
    style.textContent = `
        .ram-green { color: #00FF00; }
        .ram-orange { color: #FFA500; }
        .ram-red { color: #FF0000; }
        .cpu-green { color: #00FF00; }
        .cpu-orange { color: #FFA500; }
        .cpu-red { color: #FF0000; }
        .fps-green { color: #00FF00; }
        .fps-orange { color: #FFA500; }
        .fps-red { color: #FF0000; }
    `;
    document.head.appendChild(style);

    let lastTime = 0, frameCount = 0, fps = 0, cpuUsage = 0, systemRam = 'N/A';
    let lastRamFetchTime = 0, ramFetchInterval = 5000;

    const worker = new Worker(URL.createObjectURL(new Blob([`onmessage = function() {
        const start = performance.now();
        let i = 0;
        while (i < 1e7) i++;
        const end = performance.now();
        const duration = end - start;
        const cpuLoad = Math.min(100, Math.round((duration / 10) * 100));
        postMessage(cpuLoad);
    };`], { type: 'application/javascript' })));
    
    worker.onmessage = (e) => {
        cpuUsage = e.data;
    };

    async function fetchSystemRam() {
        try {
            const response = await fetch('http://localhost:3000/system-info');
            const data = await response.json();
            const used = parseFloat(data.ram.used);
            const total = parseFloat(data.ram.total);
            const usagePercent = (used / total) * 100;
            let ramClass = '';
            if (usagePercent <= 50) ramClass = 'ram-green';
            else if (usagePercent <= 90) ramClass = 'ram-orange';
            else ramClass = 'ram-red';
            systemRam = `<span class="${ramClass}">${data.ram.used}</span>/${data.ram.total} MB`;
        } catch (error) {
            console.error('Failed to fetch system RAM:', error);
        }
    }

    function getDirectXVersion() {
        if (isWebGPU) {
            if (navigator.gpu && navigator.platform.includes('Win')) {
                return 'DirectX 12';
            }
            return 'N/A (WebGPU)';
        } else {
            const gl = renderer.getContext();
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            const rendererStr = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';
            return rendererStr.includes('Direct3D') ? 'DirectX 11' : 'N/A (WebGL)';
        }
    }

    function getGameRam() {
        if ('memory' in performance) {
            const used = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
            return `${used} MB`;
        }
        return 'N/A';
    }

    function updateInfo(time) {
        frameCount++;
        const delta = time - lastTime;

        if (delta >= 1000) {
            fps = Math.round(frameCount * 1000 / delta);
            frameCount = 0;
            lastTime = time;
            worker.postMessage('');

            if (time - lastRamFetchTime >= ramFetchInterval) {
                fetchSystemRam();
                lastRamFetchTime = time;
            }

            const version = getDirectXVersion();
            const gameRam = getGameRam();
            let cpuClass = '';
            if (cpuUsage <= 50) cpuClass = 'cpu-green';
            else if (cpuUsage <= 90) cpuClass = 'cpu-orange';
            else cpuClass = 'cpu-red';
            const coloredCpu = `<span class="${cpuClass}">${cpuUsage}</span>`;

            let fpsClass = '';
            if (fps >= 50) fpsClass = 'fps-green';
            else if (fps >= 30) fpsClass = 'fps-orange';
            else fpsClass = 'fps-red';
            const coloredFps = `<span class="${fpsClass}">${fps}</span>`;

            infoDiv.innerHTML = `DirectX: ${version}<br>FPS: ${coloredFps}<br>CPU: ${coloredCpu}%<br>Ram: ${systemRam}<br>Game Ram: ${gameRam}`;
        }
    }

    fetchSystemRam();

    return { updateInfo, setLastTime: (time) => { lastTime = time; } };
}
