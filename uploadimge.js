function uploadImages(files, callback) {
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const maxWidth = 1920; // Maximum width
    const maxHeight = 1080; // Maximum height
    const quality = 0.7; // Compression quality

    const promises = Array.from(files).map(file => {
        if (file.size > maxFileSize) {
            // Compress the file if it exceeds the maximum file size
            return compressImage(file, maxWidth, maxHeight, quality);
        } else {
            // No need to compress, return the original file
            return Promise.resolve(file);
        }
    });

    Promise.all(promises).then(compressedFiles => {
        const urls = compressedFiles.map(file => URL.createObjectURL(file));
        callback(urls);
    });
}
