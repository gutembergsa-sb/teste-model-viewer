const modelViewer = document.getElementById('dimension-demo');
const modelInput = document.getElementById('model-field');


modelInput.addEventListener('change', (event) => {
    const files = event.target.files;
    const gltfFile = Array.from(files).find(f => f.name.endsWith('.gltf'));
    if (!gltfFile) return;

    const fileMap = new Map();
    for (const file of files) {
        fileMap.set(file.name, URL.createObjectURL(file));
    }

    const gltfURL = fileMap.get(gltfFile.name);

    // Modifica o conteúdo do .gltf em tempo real
    fetch(gltfURL)
        .then(res => res.json())
        .then(data => {
            if (data.buffers) {
                data.buffers.forEach(b => {
                    if (fileMap.has(b.uri)) b.uri = fileMap.get(b.uri);
                });
            }
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            modelViewer.src = url;
        });
});

const dimElements = [...modelViewer.querySelectorAll('button'), modelViewer.querySelector('#dimLines')];

// update svg
function drawLine(svgLine, dotHotspot1, dotHotspot2, dimensionHotspot) {
    if (dotHotspot1 && dotHotspot2) {
        svgLine.setAttribute('x1', dotHotspot1.canvasPosition.x);
        svgLine.setAttribute('y1', dotHotspot1.canvasPosition.y);
        svgLine.setAttribute('x2', dotHotspot2.canvasPosition.x);
        svgLine.setAttribute('y2', dotHotspot2.canvasPosition.y);

        // use provided optional hotspot to tie visibility of this svg line to
        if (dimensionHotspot && !dimensionHotspot.facingCamera) {
        svgLine.classList.add('hide');
        }
        else {
        svgLine.classList.remove('hide');
        }
    }
}

const dimLines = modelViewer.querySelectorAll('line');

const renderSVG = () => {
    drawLine(dimLines[0], modelViewer.queryHotspot('hotspot-dot+X-Y+Z'), modelViewer.queryHotspot('hotspot-dot+X-Y-Z'), modelViewer.queryHotspot('hotspot-dim+X-Y'));
    drawLine(dimLines[1], modelViewer.queryHotspot('hotspot-dot+X-Y-Z'), modelViewer.queryHotspot('hotspot-dot+X+Y-Z'), modelViewer.queryHotspot('hotspot-dim+X-Z'));
    drawLine(dimLines[2], modelViewer.queryHotspot('hotspot-dot+X+Y-Z'), modelViewer.queryHotspot('hotspot-dot-X+Y-Z')); // always visible
    drawLine(dimLines[3], modelViewer.queryHotspot('hotspot-dot-X+Y-Z'), modelViewer.queryHotspot('hotspot-dot-X-Y-Z'), modelViewer.queryHotspot('hotspot-dim-X-Z'));
    drawLine(dimLines[4], modelViewer.queryHotspot('hotspot-dot-X-Y-Z'), modelViewer.queryHotspot('hotspot-dot-X-Y+Z'), modelViewer.queryHotspot('hotspot-dim-X-Y'));
};

modelViewer.addEventListener('load', () => {
    const center = modelViewer.getBoundingBoxCenter();
    const size = modelViewer.getDimensions();
    const x2 = size.x / 2;
    const y2 = size.y / 2;
    const z2 = size.z / 2;

    modelViewer.updateHotspot({
        name: 'hotspot-dot+X-Y+Z',
        position: `${center.x + x2} ${center.y - y2} ${center.z + z2}`
    });

    modelViewer.updateHotspot({
        name: 'hotspot-dim+X-Y',
        position: `${center.x + x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
    });
    modelViewer.querySelector('button[slot="hotspot-dim+X-Y"]').textContent = `${(size.z * 100).toFixed(0)} cm`;

    modelViewer.updateHotspot({
        name: 'hotspot-dot+X-Y-Z',
        position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`
    });

    modelViewer.updateHotspot({
        name: 'hotspot-dim+X-Z',
        position: `${center.x + x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
    });
    modelViewer.querySelector('button[slot="hotspot-dim+X-Z"]').textContent = `${(size.y * 100).toFixed(0)} cm`;

    modelViewer.updateHotspot({
        name: 'hotspot-dot+X+Y-Z',
        position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`
    });

    modelViewer.updateHotspot({
        name: 'hotspot-dim+Y-Z',
        position: `${center.x} ${center.y + y2 * 1.1} ${center.z - z2 * 1.1}`
    });
    modelViewer.querySelector('button[slot="hotspot-dim+Y-Z"]').textContent = `${(size.x * 100).toFixed(0)} cm`;

    modelViewer.updateHotspot({
        name: 'hotspot-dot-X+Y-Z',
        position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`
    });

    modelViewer.updateHotspot({
        name: 'hotspot-dim-X-Z',
        position: `${center.x - x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
    });
    modelViewer.querySelector('button[slot="hotspot-dim-X-Z"]').textContent = `${(size.y * 100).toFixed(0)} cm`;

    modelViewer.updateHotspot({
        name: 'hotspot-dot-X-Y-Z',
        position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`
    });

    modelViewer.updateHotspot({
        name: 'hotspot-dim-X-Y',
        position: `${center.x - x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
    });
    modelViewer.querySelector('button[slot="hotspot-dim-X-Y"]').textContent = `${(size.z * 100).toFixed(0)} cm`;

    modelViewer.updateHotspot({
        name: 'hotspot-dot-X-Y+Z',
        position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`
    });

    renderSVG();

    modelViewer.addEventListener('camera-change', renderSVG);
});
// const modelInput = document.getElementById('model-field');
// const viewer = document.getElementById('viewer');
// const dims = document.getElementById('dimensions');


// modelInput.addEventListener('change', (event) => {
//     const files = event.target.files;
//     const gltfFile = Array.from(files).find(f => f.name.endsWith('.gltf'));
//     if (!gltfFile) return;

//     const fileMap = new Map();
//     for (const file of files) {
//         fileMap.set(file.name, URL.createObjectURL(file));
//     }

//     const gltfURL = fileMap.get(gltfFile.name);

//     // Modifica o conteúdo do .gltf em tempo real
//     fetch(gltfURL)
//         .then(res => res.json())
//         .then(data => {
//             if (data.buffers) {
//                 data.buffers.forEach(b => {
//                     if (fileMap.has(b.uri)) b.uri = fileMap.get(b.uri);
//                 });
//             }
//             const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
//             const url = URL.createObjectURL(blob);
//             viewer.src = url;
//         });
// });

// viewer.querySelector('#src').addEventListener('input', (event) => {
//     viewer.src = event.target.value;
// });

// const checkbox = viewer.querySelector('#show-dimensions');

// const dimElements = [...viewer.querySelectorAll('button'), viewer.querySelector('#dimLines')];

// function setVisibility(visible) {
//     dimElements.forEach((element) => {
//     if (visible) {
//         element.classList.remove('hide');
//     } else {
//         element.classList.add('hide');
//     }
//     });
// }

// checkbox.addEventListener('change', () => {
//     setVisibility(checkbox.checked);
// });

// viewer.addEventListener('ar-status', (event) => {
//     setVisibility(checkbox.checked && event.detail.status !== 'session-started');
// });

// // update svg
// function drawLine(svgLine, dotHotspot1, dotHotspot2, dimensionHotspot) {
//     if (dotHotspot1 && dotHotspot2) {
//     svgLine.setAttribute('x1', dotHotspot1.canvasPosition.x);
//     svgLine.setAttribute('y1', dotHotspot1.canvasPosition.y);
//     svgLine.setAttribute('x2', dotHotspot2.canvasPosition.x);
//     svgLine.setAttribute('y2', dotHotspot2.canvasPosition.y);

//     // use provided optional hotspot to tie visibility of this svg line to
//     if (dimensionHotspot && !dimensionHotspot.facingCamera) {
//         svgLine.classList.add('hide');
//     }
//     else {
//         svgLine.classList.remove('hide');
//     }
//     }
// }

// const dimLines = viewer.querySelectorAll('line');

// const renderSVG = () => {
//     drawLine(dimLines[0], viewer.queryHotspot('hotspot-dot+X-Y+Z'), viewer.queryHotspot('hotspot-dot+X-Y-Z'), viewer.queryHotspot('hotspot-dim+X-Y'));
//     drawLine(dimLines[1], viewer.queryHotspot('hotspot-dot+X-Y-Z'), viewer.queryHotspot('hotspot-dot+X+Y-Z'), viewer.queryHotspot('hotspot-dim+X-Z'));
//     drawLine(dimLines[2], viewer.queryHotspot('hotspot-dot+X+Y-Z'), viewer.queryHotspot('hotspot-dot-X+Y-Z')); // always visible
//     drawLine(dimLines[3], viewer.queryHotspot('hotspot-dot-X+Y-Z'), viewer.queryHotspot('hotspot-dot-X-Y-Z'), viewer.queryHotspot('hotspot-dim-X-Z'));
//     drawLine(dimLines[4], viewer.queryHotspot('hotspot-dot-X-Y-Z'), viewer.queryHotspot('hotspot-dot-X-Y+Z'), viewer.queryHotspot('hotspot-dim-X-Y'));
// };

// viewer.addEventListener('load', () => {
//     const center = viewer.getBoundingBoxCenter();
//     const size = viewer.getDimensions();
//     const x2 = size.x / 2;
//     const y2 = size.y / 2;
//     const z2 = size.z / 2;

//     viewer.updateHotspot({
//         name: 'hotspot-dot+X-Y+Z',
//         position: `${center.x + x2} ${center.y - y2} ${center.z + z2}`
//     });

//     viewer.updateHotspot({
//         name: 'hotspot-dim+X-Y',
//         position: `${center.x + x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
//     });

//     viewer.querySelector('button[slot="hotspot-dim+X-Y"]').textContent =`${(size.z * 100).toFixed(0)} cm`;

//     viewer.updateHotspot({
//         name: 'hotspot-dot+X-Y-Z',
//         position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`
//     });

//     viewer.updateHotspot({
//         name: 'hotspot-dim+X-Z',
//         position: `${center.x + x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
//     });

//     viewer.querySelector('button[slot="hotspot-dim+X-Z"]').textContent =`${(size.y * 100).toFixed(0)} cm`;

//     viewer.updateHotspot({
//         name: 'hotspot-dot+X+Y-Z',
//         position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`
//     });

//     viewer.updateHotspot({
//         name: 'hotspot-dim+Y-Z',
//         position: `${center.x} ${center.y + y2 * 1.1} ${center.z - z2 * 1.1}`
//     });

//     viewer.querySelector('button[slot="hotspot-dim+Y-Z"]').textContent =`${(size.x * 100).toFixed(0)} cm`;

//     viewer.updateHotspot({
//         name: 'hotspot-dot-X+Y-Z',
//         position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`
//     });

//     viewer.updateHotspot({
//         name: 'hotspot-dim-X-Z',
//         position: `${center.x - x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
//     });

//     viewer.querySelector('button[slot="hotspot-dim-X-Z"]').textContent =`${(size.y * 100).toFixed(0)} cm`;

//     viewer.updateHotspot({
//         name: 'hotspot-dot-X-Y-Z',
//         position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`
//     });

//     viewer.updateHotspot({
//         name: 'hotspot-dim-X-Y',
//         position: `${center.x - x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
//     });

//     viewer.querySelector('button[slot="hotspot-dim-X-Y"]').textConten =`${(size.z * 100).toFixed(0)} cm`;

//     viewer.updateHotspot({
//         name: 'hotspot-dot-X-Y+Z',
//         position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`
//     });

//     renderSVG();

//     viewer.addEventListener('camera-change', renderSVG);
// });