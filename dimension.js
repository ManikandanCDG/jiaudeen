document.addEventListener('click', (e) => {
    if (e.target.classList.contains('glb_viewer')) {

        const modelViewer = document.querySelector('#dimension-demo');
        // console.log('modelViewer: ', modelViewer);
        modelViewer.src = modelViewer.src;
        // console.log('modelViewer.src: ', modelViewer.src);
        const checkbox = modelViewer.querySelector('#show-dimensions');
        const dimElements = [...modelViewer.querySelectorAll('button'), modelViewer.querySelector('#dimLines')];

        dimElements.forEach((element) => {
            try {
                element.classList.add('hide');
                // console.log("added the class");
            } catch (error) {
                console.error("Error adding class:", error);
            }
        });

        function setVisibility(visible) {
            dimElements.forEach((element) => {
                if (visible) {
                    try {
                        element.classList.remove('hide');
                    } catch (error) {
                        console.error("Error adding class:", error);
                    }
                } else {
                    try {
                        element.classList.add('hide');
                    } catch (error) {
                        console.error("Error adding class:", error);
                    }
                }
            });
        }
        checkbox.addEventListener('change', () => {
            console.log('checkbox: ', checkbox);
            setVisibility(checkbox.checked);
        });

        modelViewer.addEventListener('ar-status', (event) => {
            setVisibility(checkbox.checked && event.detail.status !== 'session-started');
        });

        // update svg
        function drawLine(svgLine, dotHotspot1, dotHotspot2, dimensionHotspot) {
            if (dotHotspot1 && dotHotspot2) {
                svgLine.setAttribute('x1', dotHotspot1.canvasPosition.x);
                svgLine.setAttribute('y1', dotHotspot1.canvasPosition.y);
                svgLine.setAttribute('x2', dotHotspot2.canvasPosition.x);
                svgLine.setAttribute('y2', dotHotspot2.canvasPosition.y);

                if (dimensionHotspot && !dimensionHotspot.facingCamera) {
                    svgLine.classList.add('hide');
                } else {
                    svgLine.classList.remove('hide');
                }
            }
        }

        const dimLines = modelViewer.querySelectorAll('line');

        function renderSVG() {
            drawLine(dimLines[0], modelViewer.queryHotspot('hotspot-dot+X-Y+Z'), modelViewer.queryHotspot('hotspot-dot+X-Y-Z'), modelViewer.queryHotspot('hotspot-dim+X-Y'));
            drawLine(dimLines[1], modelViewer.queryHotspot('hotspot-dot+X-Y-Z'), modelViewer.queryHotspot('hotspot-dot+X+Y-Z'), modelViewer.queryHotspot('hotspot-dim+X-Z'));
            drawLine(dimLines[2], modelViewer.queryHotspot('hotspot-dot+X+Y-Z'), modelViewer.queryHotspot('hotspot-dot-X+Y-Z')); // always visible
            drawLine(dimLines[3], modelViewer.queryHotspot('hotspot-dot-X+Y-Z'), modelViewer.queryHotspot('hotspot-dot-X-Y-Z'), modelViewer.queryHotspot('hotspot-dim-X-Z'));
            drawLine(dimLines[4], modelViewer.queryHotspot('hotspot-dot-X-Y-Z'), modelViewer.queryHotspot('hotspot-dot-X-Y+Z'), modelViewer.queryHotspot('hotspot-dim-X-Y'));
        }

        function updateDimensions() {
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
            modelViewer.querySelector('button[slot="hotspot-dim+X-Y"]').textContent =
                `${(size.z * 100).toFixed(0)} cm`;

            modelViewer.updateHotspot({
                name: 'hotspot-dot+X-Y-Z',
                position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`
            });

            modelViewer.updateHotspot({
                name: 'hotspot-dim+X-Z',
                position: `${center.x + x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
            });
            modelViewer.querySelector('button[slot="hotspot-dim+X-Z"]').textContent =
                `${(size.y * 100).toFixed(0)} cm`;

            modelViewer.updateHotspot({
                name: 'hotspot-dot+X+Y-Z',
                position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`
            });

            modelViewer.updateHotspot({
                name: 'hotspot-dim+Y-Z',
                position: `${center.x} ${center.y + y2 * 1.1} ${center.z - z2 * 1.1}`
            });
            modelViewer.querySelector('button[slot="hotspot-dim+Y-Z"]').textContent =
                `${(size.x * 100).toFixed(0)} cm`;

            modelViewer.updateHotspot({
                name: 'hotspot-dot-X+Y-Z',
                position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`
            });

            modelViewer.updateHotspot({
                name: 'hotspot-dim-X-Z',
                position: `${center.x - x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
            });
            modelViewer.querySelector('button[slot="hotspot-dim-X-Z"]').textContent =
                `${(size.y * 100).toFixed(0)} cm`;

            modelViewer.updateHotspot({
                name: 'hotspot-dot-X-Y-Z',
                position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`
            });

            modelViewer.updateHotspot({
                name: 'hotspot-dim-X-Y',
                position: `${center.x - x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
            });
            modelViewer.querySelector('button[slot="hotspot-dim-X-Y"]').textContent =
                `${(size.z * 100).toFixed(0)} cm`;

            modelViewer.updateHotspot({
                name: 'hotspot-dot-X-Y+Z',
                position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`
            });

            renderSVG();
        }

        modelViewer.addEventListener('load', () => {
            updateDimensions();

            modelViewer.addEventListener('camera-change', renderSVG);

            // Set interval to update dimensions during autorotation
            setInterval(() => {
                updateDimensions();
            }, 100); // Adjust interval duration as needed
        });

        const checkbox2 = modelViewer.querySelector('#show-dimensions');

        checkbox2.addEventListener('change', () => {
            const visibility = checkbox2.checked && (!modelViewer.arRenderer || modelViewer.arRenderer.state === 'inactive');
            dimLines.forEach(line => line.style.display = visibility ? 'block' : 'none');
        });

        modelViewer.addEventListener('load', () => {
            const center = modelViewer.getBoundingBoxCenter();
            const size = modelViewer.getDimensions();
            //   console.log('size: ', size);
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
            modelViewer.querySelector('button[slot="hotspot-dim+X-Y"]').textContent =
                `${(size.z * 100).toFixed(0)} cm`;

            modelViewer.updateHotspot({
                name: 'hotspot-dot+X-Y-Z',
                position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`
            });

            modelViewer.updateHotspot({
                name: 'hotspot-dim+X-Z',
                position: `${center.x + x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
            });
            modelViewer.querySelector('button[slot="hotspot-dim+X-Z"]').textContent =
                `${(size.y * 100).toFixed(0)} cm`;

            modelViewer.updateHotspot({
                name: 'hotspot-dot+X+Y-Z',
                position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`
            });

            modelViewer.updateHotspot({
                name: 'hotspot-dim+Y-Z',
                position: `${center.x} ${center.y + y2 * 1.1} ${center.z - z2 * 1.1}`
            });
            modelViewer.querySelector('button[slot="hotspot-dim+Y-Z"]').textContent =
                `${(size.x * 100).toFixed(0)} cm`;

            modelViewer.updateHotspot({
                name: 'hotspot-dot-X+Y-Z',
                position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`
            });

            modelViewer.updateHotspot({
                name: 'hotspot-dim-X-Z',
                position: `${center.x - x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
            });
            modelViewer.querySelector('button[slot="hotspot-dim-X-Z"]').textContent =
                `${(size.y * 100).toFixed(0)} cm`;

            modelViewer.updateHotspot({
                name: 'hotspot-dot-X-Y-Z',
                position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`
            });

            modelViewer.updateHotspot({
                name: 'hotspot-dim-X-Y',
                position: `${center.x - x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
            });
            modelViewer.querySelector('button[slot="hotspot-dim-X-Y"]').textContent =
                `${(size.z * 100).toFixed(0)} cm`;

            modelViewer.updateHotspot({
                name: 'hotspot-dot-X-Y+Z',
                position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`
            });

            renderSVG();

            modelViewer.addEventListener('camera-change', renderSVG);
        });
    }
});