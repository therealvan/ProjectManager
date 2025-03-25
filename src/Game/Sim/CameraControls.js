import * as THREE from '/src/ExternalLib/three.js/build/three.module.js';

function setupCameraControls(camera) {
    const speed = 0.1;
    const keys = { z: false, q: false, s: false, d: false };

    function updateCamera() {
        const direction = new THREE.Vector3();
        // Get the camera's forward direction in the XZ plane (horizontal)
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        forward.y = 0; // Keep movement in the XZ plane
        forward.normalize();

        // Get the camera's right direction in the XZ plane
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
        right.y = 0; // Keep movement in the XZ plane
        right.normalize();

        if (keys.z) direction.add(forward);
        if (keys.s) direction.sub(forward);
        if (keys.q) direction.sub(right);
        if (keys.d) direction.add(right);

        if (direction.length() > 0) {
            direction.normalize().multiplyScalar(speed);
            camera.position.add(direction);
        }
    }

    document.addEventListener('keydown', (event) => {
        switch (event.key.toLowerCase()) {
            case 'z': keys.z = true; break;
            case 'q': keys.q = true; break;
            case 's': keys.s = true; break;
            case 'd': keys.d = true; break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch (event.key.toLowerCase()) {
            case 'z': keys.z = false; break;
            case 'q': keys.q = false; break;
            case 's': keys.s = false; break;
            case 'd': keys.d = false; break;
        }
    });

    return { updateCamera };
}

export { setupCameraControls };
