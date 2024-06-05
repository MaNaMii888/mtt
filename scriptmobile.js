document.addEventListener('DOMContentLoaded', function () {
    const imageInput = document.getElementById('image');

    imageInput.addEventListener('change', function () {
        const file = this.files[0];

        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            const imageUrl = data.imageUrl;
            // Display the uploaded image on the web page
            const imageElement = document.createElement('img');
            imageElement.src = imageUrl;
            document.body.appendChild(imageElement);
        })
        .catch(error => {
            console.error('Error uploading image:', error);
        });
    });
});
