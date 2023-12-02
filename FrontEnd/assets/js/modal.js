const overlayGallery = document.querySelector(".overlay-gallery")
const token = localStorage.getItem('token')
const gallery = document.querySelector(".gallery")

const getWorks = async () => {
	const response = await fetch('http://localhost:5678/api/works')
	const works = await response.json()

	return works
}

let works = await getWorks()

const refreshGallery = (worksToDisplay) => {
	gallery.innerHTML = "";
	for (const work of worksToDisplay) {
		const figure = document.createElement("figure")
		const figcaption = document.createElement("figcaption")
		const image = document.createElement("img")

		figcaption.innerHTML = work.title
		image.src = work.imageUrl
		figure.append(image, figcaption)
		gallery.appendChild(figure)
	}
}
refreshGallery(works)

const displayWorksModal = (worksToDisplay) => {
	overlayGallery.innerHTML = ""
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
		overlayGallery.appendChild(figure)
		trashIcon.addEventListener('click', async () => {
			const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
				method: 'DELETE',
				headers: {
					Authorization: `bearer ${token}`
				}
			});

			if (response.ok) {
				figure.remove();
				works = works.filter(item => item.id !== workId);
				refreshGallery(works)
			}
		});
	}
}
displayWorksModal(works)


const modalContainer = document.getElementById("modal-container")
modalContainer.style.display = "none"

const iconModify = document.querySelector(".icon-modify")
const buttonModify = document.querySelector(".button-modify")
const closeModal = document.querySelector(".close-modal")
const overlay = document.querySelector('.overlay')

const addPhoto = document.querySelector(".button-add-photo")
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
	buttonModify?.addEventListener('click', () => toggleModal('modal-container'));
	iconModify?.addEventListener('click', () => toggleModal('modal-container'));
	closeModal?.addEventListener('click', () => toggleModal('modal-container'));
	overlay?.addEventListener('click', () => toggleModal('modal-container'));

	addPhoto?.addEventListener('click', () => toggleModal('modal-container-two'));
	returnModal.addEventListener('click', () => {
		form.reset();
		imagePreview.style.display = 'none';
		fileLabel.style.display = 'block';
		toggleModal('modal-container-two');
	});
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

const validateButton = document.querySelector('.validate-photo');
const form = document.querySelector('form');

if (token) {
	validateButton.addEventListener('click', async (event) => {
		event.preventDefault();
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

			works = [...works, data]
			refreshGallery(works)
			displayWorksModal(works)

			form.reset();
			imagePreview.style.display = 'none'
			fileLabel.style.display = 'block'

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
	});
}

const checkInputs = () => {
	const file = fileInput.files[0];
	const title = titleInput.value;
	const category = categoryInput.value;
	if (file && title && category) {
		validateButton.style.backgroundColor = '#1D6154';
		validateButton.disabled = false;
		validateButton.style.cursor = "pointer"
	} else {
		validateButton.style.backgroundColor = '#A7A7A7';
		validateButton.disabled = true;
		validateButton.style.cursor = "not-allowed";
	}
	[fileInput, titleInput, categoryInput].forEach(input => input.addEventListener('input', checkInputs));
};
checkInputs()



