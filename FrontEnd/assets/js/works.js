const gallery = document.querySelector(".gallery")

const getWorks = async () => {
    const response = await fetch('http://localhost:5678/api/works')
    const works = await response.json()

    return works
}
const works = await getWorks()

const displayWorks = (worksToDisplay) => {
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
displayWorks(works)

const categories = document.querySelector(".categories");

const getCategories = async () => {
    const response = await fetch("http://localhost:5678/api/categories");
    const categoriesApi = await response.json()

    for (const category of categoriesApi) {
        const button = document.createElement("button")
        button.className = "buttonCategories"
        button.textContent = category.name
        button.addEventListener('click', function () {
            filterWorksByCategory(category.id);

            const buttonsCouleur = document.querySelectorAll('.buttonCategories');
            buttonsCouleur.forEach(btn => {
                if (btn.textContent === button.textContent) {
                    btn.style.backgroundColor = "#1D6154";
                    btn.style.color = "white";
                } else {
                    btn.style.backgroundColor = "white";
                    btn.style.color = "black";
                }
            });
        });
        categories.appendChild(button)
    }
}
getCategories()

const createButtonTous = () => {
    const buttonTous = document.createElement('button')
    buttonTous.className = "buttonCategories btnTous"
    buttonTous.textContent = "Tous"
    buttonTous.addEventListener('click', function () {
        displayWorks(works)

        const buttonCouleurTous = document.querySelectorAll('.buttonCategories');
        buttonCouleurTous.forEach(btn => {
            btn.style.backgroundColor = "white";
            btn.style.color = "black";
        });
        buttonTous.style.backgroundColor = "#1D6154";
        buttonTous.style.color = "white";
    });
    categories.appendChild(buttonTous)
}
createButtonTous()

const categorySelect = document.getElementById('category');

const getCategoriesModal = async () => {
    const response = await fetch("http://localhost:5678/api/categories");
    const categoriesModalApi = await response.json();

    for (const category of categoriesModalApi) {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        option.addEventListener('click', function () {
            filterWorksByCategory(category.id);
        });
        categorySelect.appendChild(option)
    }
};
getCategoriesModal();

const filterWorksByCategory = (categoryId) => {
    const filteredWorks = works.filter(work => work.categoryId === categoryId);
    displayWorks(filteredWorks);
};

const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const iconModifier = document.querySelector('.icon-modifier');
const buttonModifer = document.querySelector('.button-modifier')
const categoriesButtons = document.querySelectorAll('.categories');

const token = localStorage.getItem('token');

if (token) {
    if (loginButton) loginButton.style.display = 'none';
    if (logoutButton) logoutButton.style.display = 'block';
    if (iconModifier) iconModifier.style.display = 'block';
    if (buttonModifer) buttonModifer.style.display = 'block';
    logoutButton.addEventListener('click', () => {
        localStorage.clear();
        location.href = "http://127.0.0.1:5500/index.html";
    });
    categoriesButtons.forEach(button => {
        button.style.display = 'none';
    });
}





























