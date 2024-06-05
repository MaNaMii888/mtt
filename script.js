document.addEventListener('DOMContentLoaded', function () {
    const openFormBtn = document.getElementById('openFormBtn');
    const formPopup = document.getElementById('formPopup');
    const closeFormBtn = document.getElementById('closeFormBtn');
    const dataForm = document.getElementById('dataForm');
    const dropZone = document.getElementById('dropZone');
    const dataDisplay = document.getElementById('dataDisplay');
    const changeImageCheckbox = document.getElementById('changeImage');
    const changeImageContainer = document.getElementById('changeImageContainer');
    const newImageInput = document.getElementById('newImageInput');
    const imageInputContainer = document.getElementById('imageInputContainer');
    const formTitle = document.getElementById('formTitle');

    let editIndex = -1;

    loadSavedData();

    openFormBtn.innerHTML = '&#128193;'; // 📂

    openFormBtn.addEventListener('click', function () {
        formPopup.style.display = 'block';
        editIndex = -1;
        changeImageContainer.style.display = 'none';
        imageInputContainer.style.display = 'block';
        formTitle.textContent = 'Enter Data';
    });

    closeFormBtn.addEventListener('click', function () {
        formPopup.style.display = 'none';
    });

    changeImageCheckbox.addEventListener('change', function () {
        if (this.checked) {
            newImageInput.style.display = 'block';
        } else {
            newImageInput.style.display = 'none';
        }
    });

    dataForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(dataForm);
        
        if (editIndex >= 0) {
            const savedData = JSON.parse(localStorage.getItem('data')) || [];
            savedData[editIndex].name = formData.get('name');
            savedData[editIndex].description = formData.get('description');

            if (changeImageCheckbox.checked) {
                const newFiles = formData.getAll('newImages[]');
                if (newFiles.length > 0) {
                    uploadImages(newFiles, function(imageUrls) {
                        savedData[editIndex].imageUrls = imageUrls;
                        updateData(savedData[editIndex], editIndex);
                        formPopup.style.display = 'none';
                        dataForm.reset();
                    });
                } else {
                    updateData(savedData[editIndex], editIndex);
                    formPopup.style.display = 'none';
                    dataForm.reset();
                }
            } else {
                updateData(savedData[editIndex], editIndex);
                formPopup.style.display = 'none';
                dataForm.reset();
            }
        } else {
            const files = formData.getAll('images[]');
            if (files.length > 0) {
                uploadImages(files, function(imageUrls) {
                    const data = { name: formData.get('name'), description: formData.get('description'), imageUrls };
                    saveData(data);
                    displayData(data, JSON.parse(localStorage.getItem('data')).length - 1);
                    formPopup.style.display = 'none';
                    dataForm.reset();
                });
            }
        }
    });

    dropZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        dropZone.style.backgroundColor = '#f0f0f0';
    });

    dropZone.addEventListener('dragleave', function (e) {
        e.preventDefault();
        dropZone.style.backgroundColor = '#fff';
    });

    dropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        dropZone.style.backgroundColor = '#fff';
        const files = e.dataTransfer.files;
        const imageFiles = [];
        for (let file of files) {
            if (file.type.startsWith('image/')) {
                imageFiles.push(file);
            }
        }
        if (imageFiles.length > 0) {
            uploadImages(imageFiles, function(imageUrls) {
                const name = 'Dropped Image';
                const description = 'No description';
                const data = { name, description, imageUrls };
                saveData(data);
                displayData(data, JSON.parse(localStorage.getItem('data')).length - 1);
            });
        }
    });

    function uploadImages(files, callback) {
        const promises = Array.from(files).map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function (event) {
                    resolve(event.target.result);
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises).then(callback);
    }

    function displayData(data, index) {
        const dataItem = document.createElement('div');
        dataItem.className = 'data-item';
        dataItem.dataset.index = index;
        let imagesHtml = '';
        data.imageUrls.forEach(url => {
            imagesHtml += `<img src="${url}" alt="${data.name}">`;
        });
        dataItem.innerHTML = `
            <h3>${data.name}</h3>
            <p>${data.description}</p>
            ${imagesHtml}
            <div class="actions">
                <button onclick="editData(${index})">✏️</button>
                <button onclick="deleteData(${index})">❌</button>
            </div>
        `;
        dataDisplay.appendChild(dataItem);
    }

    function saveData(data) {
        let savedData = JSON.parse(localStorage.getItem('data')) || [];
        savedData.push(data);
        localStorage.setItem('data', JSON.stringify(savedData));
    }

    function loadSavedData() {
        const savedData = JSON.parse(localStorage.getItem('data')) || [];
        savedData.forEach((data, index) => displayData(data, index));
    }

    window.deleteData = function (index) {
        let savedData = JSON.parse(localStorage.getItem('data')) || [];
        savedData.splice(index, 1);
        localStorage.setItem('data', JSON.stringify(savedData));
        dataDisplay.innerHTML = '';
        loadSavedData();
    };

    window.editData = function (index) {
        let savedData = JSON.parse(localStorage.getItem('data')) || [];
        const data = savedData[index];
        document.getElementById('name').value = data.name;
        document.getElementById('description').value = data.description;
        formTitle.textContent = 'Edit Data';
        formPopup.style.display = 'block';
        changeImageContainer.style.display = 'block';
        newImageInput.style.display = 'none';
        imageInputContainer.style.display = 'none';
        editIndex = index;
    };

    function updateData(data, index) {
        let savedData = JSON.parse(localStorage.getItem('data')) || [];
        savedData[index] = data;
        localStorage.setItem('data', JSON.stringify(savedData));
        dataDisplay.innerHTML = '';
        loadSavedData();
    }

    const searchBox = document.getElementById('searchBox');
    searchBox.addEventListener('input', function () {
        const searchTerm = searchBox.value.toLowerCase();
        const items = document.querySelectorAll('.data-item');
        items.forEach(item => {
            const name = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            if (name.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});
