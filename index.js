const viewer = document.getElementById('dimension-demo');
const modelInput = document.getElementById('model-field');
const bgInput = document.getElementById('bg-field');

window.addEventListener('load', () => {
    console.log(window.location.search)
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    if (urlParams.size) {
        viewer.src = urlParams.get('url');
    }
})

bgInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const skyboxURL = URL.createObjectURL(file);
    viewer.setAttribute('skybox-image', skyboxURL);
    console.log('Skybox aplicada:', file.name);
});


modelInput.addEventListener('change', (event) => {
    const files = event.target.files;
    console.log({ files });

    if (!files || files.length === 0) return;

    // Procura arquivo principal (.gltf ou .glb)
    const gltfFile = Array.from(files).find(f =>
        f.name.toLowerCase().endsWith('.gltf')
    );
    const glbFile = Array.from(files).find(f =>
        f.name.toLowerCase().endsWith('.glb')
    );

    // Se houver um .glb, usamos diretamente
    if (glbFile) {
        const glbURL = URL.createObjectURL(glbFile);
        viewer.src = glbURL;
        console.log('Carregado .glb:', glbFile.name);
        return;
    }

    // Caso contrário, processa o .gltf + assets
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
            if (data.images) {
                data.images.forEach(img => {
                    if (fileMap.has(img.uri)) img.uri = fileMap.get(img.uri);
                });
            }

            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            viewer.src = url;
            console.log('Carregado .gltf:', gltfFile.name);
        })
        .catch(err => console.error('Erro ao carregar GLTF:', err));
});
