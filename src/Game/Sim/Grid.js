import * as THREE from '/src/ExternalLib/three.js/build/three.module.js';

function createGrid(scene, size = 10) {
    const grid = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ color: 0xcccccc, wireframe: true });
    
    for (let x = 0; x < size; x++) {
        for (let z = 0; z < size; z++) {
            const geometry = new THREE.PlaneGeometry(1, 1);
            const cell = new THREE.Mesh(geometry, material);
            cell.position.set(x - size / 2 + 0.5, 0, z - size / 2 + 0.5);
            cell.rotation.x = -Math.PI / 2;
            cell.userData = { occupied: false, x, z };
            grid.add(cell);
        }
    }
    
    scene.add(grid);
    return grid;
}

export { createGrid };
