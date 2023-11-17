const overlayGalerie = document.querySelector(".overlay-gallery")
const token = localStorage.getItem('token')

const getWorks = async () => {
    const response = await fetch('http://localhost:5678/api/works')
    const works = await response.json()

    return works
}
const works = await getWorks()

const displayWorks = (worksToDisplay) => {
    for (const work of worksToDisplay) {
        const figure = document.createElement("figure")
        const image = document.createElement("img")
        const trashIcon = document.createElement("i")
        const workId = work.id;

        image.className = "overlay-image"
        trashIcon.className = "delete-icon"
        image.src = work.imageUrl
        trashIcon.classList.add('fa-solid', 'fa-trash-can');
        trashIcon.setAttribute('data-id', workId);
        figure.append(image, trashIcon)
        overlayGalerie.appendChild(figure)
        trashIcon.addEventListener('click', async () => {

            const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `bearer ${token}`
                }
            });

            if (response.ok) {
                figure.remove()
            } else {
                console.error('La suppression a échoué');
            }


        });
    }
}
displayWorks(works)


const modalContainer = document.getElementById("modal-container")
modalContainer.style.display = "none"

const iconModifier = document.querySelector(".icon-modifier")
const buttonModifier = document.querySelector(".button-modifier")
const closeModal = document.querySelector(".close-modal")
const overlay = document.querySelector('.overlay')

const ajouterPhoto = document.querySelector(".button-ad-photo")
const returnModal = document.querySelector(".return-modal")
const closeModalTwo = document.querySelector('.close-modal-two')
const overlayTwo = document.querySelector('.overlay-two')


const toggleModal = (modalClassName) => {
    const isShownModal = document.querySelector(`.${modalClassName}`).style.display !== "none";
    const elementsModal = document.querySelectorAll(`.${modalClassName}`);

    elementsModal.forEach((elem) => {
        elem.style.display = isShownModal ? "none" : "block";
    });
};

if (token) {
    buttonModifier?.addEventListener('click', () => toggleModal('modal-container'));
    iconModifier?.addEventListener('click', () => toggleModal('modal-container'));
    closeModal?.addEventListener('click', () => toggleModal('modal-container'));
    overlay?.addEventListener('click', () => toggleModal('modal-container'));

    ajouterPhoto?.addEventListener('click', () => toggleModal('modal-container-two'));
    returnModal?.addEventListener('click', () => toggleModal('modal-container-two'));
    closeModalTwo?.addEventListener('click', () => toggleModal('modal-container-two'));
    overlayTwo?.addEventListener('click', () => toggleModal('modal-container-two'));
}

const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const fileLabel = document.querySelector('.file-label');
const titleInput = document.getElementById('title')
const categoryInput = document.getElementById('category')
const maxSize = 4 * 1024 * 1024; // 4Mo en octets

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    const error = document.querySelector('.error');

    if (file) {
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            error.textContent = 'Le fichier doit être de type JPG ou PNG.';
            return;
        }

        if (file.size > maxSize) {
            error.textContent = 'La taille de l\'image ne doit pas dépasser 4Mo.';
            return;
        }
        const reader = new FileReader();

        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            fileLabel.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

const validerButton = document.querySelector('.valider-photo');

if (token) {
    validerButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const form = document.querySelector('form');
        const formData = new FormData();
        formData.append("title", titleInput.value)
        formData.append('category', categoryInput.value)
        formData.append('image', fileInput.files[0])

        if (form) {
            const response = await fetch(`http://localhost:5678/api/works`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            });
            const data = await response.json();

            const gallery = document.querySelector(".gallery")
            const figure = document.createElement("figure")
            const figcaption = document.createElement("figcaption")
            const image = document.createElement("img")

            // Actualiser les images dans la galerie après avoir cliqué sur le bouton Ajouter une photo + fermer les 2 modales.
            if (data) {
                figcaption.innerHTML = data.title
                image.src = data.imageUrl
                figure.append(image, figcaption)
                gallery.appendChild(figure)

                const modalContainer = document.querySelector(".modal-container")
                const ModalContainerTwo = document.querySelector(".modal-container-two")

                if (modalContainer) {
                    modalContainer.style.display = "block"
                    modalContainer.style.display = "none"
                }
                if (ModalContainerTwo) {
                    ModalContainerTwo.style.display = "block";
                    ModalContainerTwo.style.display = 'none'
                }
            }

            // Actualiser les images dans la modal 1 après avoir cliqué sur le bouton Ajouter une photo + fermer les 2 modales.
            if (data) {
                const figure = document.createElement("figure");
                const image = document.createElement("img");
                const trashIcon = document.createElement("i");
                const workId = data.id;

                image.className = "overlay-image";
                trashIcon.className = "delete-icon";
                image.src = data.imageUrl;
                trashIcon.classList.add('fa-solid', 'fa-trash-can');
                trashIcon.setAttribute('data-id', workId);
                figure.append(image, trashIcon);
                overlayGalerie.appendChild(figure);

                // Actualiser les images dans la galerie après avoir supprimé une photo.
                trashIcon.addEventListener('click', async () => {
                    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        figure.remove();
                    }
                });
            }
        }
    });
}

const checkInputs = () => {
    const file = fileInput.files[0];
    const title = titleInput.value;
    const category = categoryInput.value;
    if (file && title && category) {
        validerButton.style.backgroundColor = '#1D6154';
        validerButton.disabled = false;
        validerButton.style.cursor = "pointer"
    } else {
        validerButton.style.backgroundColor = '#A7A7A7';
        validerButton.disabled = true;
        validerButton.style.cursor = "not-allowed";
    }
    [fileInput, titleInput, categoryInput].forEach(input => input.addEventListener('input', checkInputs));
};
checkInputs()




















// buttonModifier && iconModifier && closeModal.addEventListener('click', () => {
//     toggleModal();
// });

// closeModal && iconModifier.addEventListener('click', () => {
//     toggleModal();
// });

// closeModal && buttonModifier.addEventListener('click', () => {
//     toggleModal();
// });






