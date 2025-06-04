$(document).ready(function () {
    $('body').on('click', '.3d-gal', function () {
        auto_rotate_btn = false;
        $('#myModal').modal("show");
        $('.glb_details').addClass('d-none');

        var file = $(this).data('file');
        var glb_folder = $(this).data('folder');
        var glb_polycount = $(this).data('polycount');
        $('.modal-title').html();
        $('.polycount').html();
        $('.glb_download_btn').html();
        $('.glb_file').html();

        // 3d-files/walmart_samples.glb
        $('.glb_file').html(
            `
            <model-viewer id="dimension-demo" ar ar-modes="webxr" ar-scale="fixed" camera-orbit="-30deg auto auto" shadow-intensity="1" camera-controls src="assets/` + file +`" auto-rotate-delay="0" alt="A 3D model of an armchair." disable-pan="true" interaction-prompt="none" rotation-per-second="15deg" animation-canceling="none">
                <div class="progress-bar hide" slot="progress-bar">
                    <div class="update-bar"></div>
                </div>
                <div class="loader-container" style="display: flex;flex-direction: column;flex-wrap: wrap;align-content: center;justify-content: center;align-items: center;height: 100%;">
                    <div class="spinner-border" role="status" style="color: #4458dc">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div class="intern" id="load_status">
                    </div>
                </div>
                <div id="checkbox_container">
                    <input type="checkbox" class="rotate_btn" id="checkbox">
                    <label class="switch" for="checkbox">
                        <span class="slider"></span>
                        <br><p style=" font-size: small;margin-left: 0px;font-weight: 600;padding-top: 10px;">Rotation</p>
                    </label>
                </div>
            </model-viewer>
        `);

        function initializeModelViewer() {
            const modelViewer = document.querySelector('#dimension-demo');
            const loaderContainer = $('.loader-container');
            // const loaderBar = document.getElementById('loader-bar');
            const loaderText = document.getElementById('load_status');
            // Reset loader progress and text
            // loaderBar.style.width = '0%';
            loaderText.textContent = 'Loading...';

            // Show loader container
            loaderContainer.fadeIn();

            // Add event listener for progress
            modelViewer.addEventListener('progress', function (event) {
                const progressPercent = Math.round(event.detail.totalProgress * 100);
                // loaderBar.style.width = progressPercent + '%';
                loaderText.textContent = progressPercent + '%';
            });

            // Add event listener for load complete
            modelViewer.addEventListener('load', function () {
                // Hide loader when model is fully loaded
                loaderContainer.fadeOut();
                $('.glb_details').removeClass('d-none');
            });
        }

        // Call initialize function on document ready
        initializeModelViewer();

    });

    //auto rotate btn process
    $('body').on('change', '.rotate_btn', function () {
        if ($(this).is(':checked')) {
            // console.log('Checkbox is checked');
            $('#dimension-demo').attr('auto-rotate', 'true');
        } else {
            $('#dimension-demo').removeAttr('auto-rotate');
            // console.log('Checkbox is not checked');
        }
    });
});

const carousel = new bootstrap.Carousel('#carouselExampleIndicators');
