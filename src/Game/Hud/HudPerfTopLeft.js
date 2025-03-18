// HudPerfTopLeft.js - Graphics options HUD in top-left corner with clickable antialiasing
import Antialiasing from '/src/Graphics/Antialiasing.js';

export function setupHudTopLeft(container, renderer, scene, camera, width, height) {
    const infoDiv = document.createElement('div');
    infoDiv.id = 'info-left';
    infoDiv.style.position = 'absolute';
    infoDiv.style.top = '10px';
    infoDiv.style.left = '10px';
    infoDiv.style.color = 'white';
    infoDiv.style.background = 'rgba(0, 0, 0, 0.7)';
    infoDiv.style.padding = '5px';
    infoDiv.style.borderRadius = '3px';
    infoDiv.style.cursor = 'pointer'; // Indique que c'est cliquable
    container.appendChild(infoDiv);

    // Add CSS for colored options
    const style = document.createElement('style');
    style.textContent = `
        .option-green { color: #00FF00; }
        .option-orange { color: #FFA500; }
        .option-red { color: #FF0000; }
    `;
    document.head.appendChild(style);

    // Initialize antialiasing
    const antialiasing = new Antialiasing(renderer, scene, camera, width, height);

    function updateInfo() {
        const aaStatus = antialiasing.getStatus();
        infoDiv.innerHTML = `Graphique Options :<br>Antialiasing: <span class="option-green">${aaStatus}</span>`;
        console.log('HudPerfTopLeft updated with antialiasing status: ' + aaStatus);
    }

    // Add click event to cycle through modes
    infoDiv.addEventListener('click', () => {
        antialiasing.nextMode();
        updateInfo();
    });

    // Initial update
    updateInfo();

    return {
        updateInfo,
        getAntialiasing: () => antialiasing // Expose antialiasing pour rendu
    };
}
