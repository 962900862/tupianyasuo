document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const previewArea = document.getElementById('previewArea');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalImage = null;

    // 上传区域点击事件
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    // 拖放功能
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#0071e3';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#d2d2d7';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#d2d2d7';
        const file = e.dataTransfer.files[0];
        if (file && file.type.match('image.*')) {
            handleImageUpload(file);
        }
    });

    // 文件输入处理
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });

    // 质量滑块变化事件
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value + '%';
        if (originalImage) {
            compressImage(originalImage, e.target.value / 100);
        }
    });

    // 处理图片上传
    function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage = new Image();
            originalImage.onload = () => {
                displayOriginalImage(originalImage, file);
                compressImage(originalImage, qualitySlider.value / 100);
                previewArea.style.display = 'block';
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 显示原始图片
    function displayOriginalImage(image, file) {
        originalPreview.src = image.src;
        originalSize.textContent = formatFileSize(file.size);
    }

    // 压缩图片
    function compressImage(image, quality) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        compressedPreview.src = compressedDataUrl;

        // 计算压缩后的大小
        const compressedSize = Math.round((compressedDataUrl.length - 22) * 3 / 4);
        document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);

        // 设置下载按钮
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.download = 'compressed-image.jpg';
            link.href = compressedDataUrl;
            link.click();
        };
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 