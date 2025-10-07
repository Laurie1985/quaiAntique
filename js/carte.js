const foodsByCategory = document.getElementById("foodsByCategory");
const menusList = document.getElementById("menusList");

// Charger la carte et les menus au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
    loadFoodsByCategory();
    loadMenus();
});


// 1 : CHARGER LES PLATS PAR CATÉGORIE


async function loadFoodsByCategory() {
    try {
        const response = await fetch(apiUrl + "category");

        if (!response.ok) {
            throw new Error("Erreur lors du chargement des catégories");
        }

        const categories = await response.json();

        if (categories.length === 0) {
            foodsByCategory.innerHTML = '<p class="text-center text-muted">Aucune catégorie disponible</p>';
            return;
        }

        displayFoodsByCategory(categories);

    } catch (error) {
        console.error("Erreur:", error);
        foodsByCategory.innerHTML = '<p class="text-center text-danger">Impossible de charger la carte</p>';
    }
}

function displayFoodsByCategory(categories) {
    let html = '';

    // Pour chaque catégorie, créer un conteneur
    categories.forEach(category => {
        html += `
            <div class="category-section mb-4">
                <h4 class="m-4">${sanitizeHtml(category.title)}</h4>
                <div class="category-foods" id="category-${category.id}">
                    <p class="text-muted small">Chargement...</p>
                </div>
            </div>
        `;
    });

    foodsByCategory.innerHTML = html;

    // Charger les plats de chaque catégorie
    categories.forEach(category => {
        loadFoodsForCategory(category.id);
    });
}

async function loadFoodsForCategory(categoryId) {
    try {
        const response = await fetch(apiUrl + "food/category/" + categoryId);

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}`);
        }

        const foods = await response.json();
        displayFoodsForCategory(categoryId, foods);

    } catch (error) {
        console.error("Erreur lors du chargement des plats:", error);
        const categoryContainer = document.getElementById("category-" + categoryId);
        if (categoryContainer) {
            categoryContainer.innerHTML = '<p class="text-muted small text-danger">Erreur de chargement</p>';
        }
    }
}

function displayFoodsForCategory(categoryId, foods) {
    const categoryContainer = document.getElementById("category-" + categoryId);

    if (!categoryContainer) return;

    if (foods.length === 0) {
        categoryContainer.innerHTML = '<p class="text-muted small fst-italic">Aucun plat disponible</p>';
        return;
    }

    let html = '';
    foods.forEach((food, index) => {
        html += `
            <div class="food-item mb-3">
                <p class="mb-1 fw-bold">${sanitizeHtml(food.title)}</p>
                <p class="small mb-1 fst-italic">${sanitizeHtml(food.description)}</p>
                ${food.price ? `<p class="text-warning mb-2"><strong>${food.price}€</strong></p>` : ''}
                ${index < foods.length - 1 ? '<p class="text-center">. . . . .</p>' : ''}
            </div>
        `;
    });

    categoryContainer.innerHTML = html;
}


// 2 : CHARGER LES MENUS


async function loadMenus() {
    try {
        const response = await fetch(apiUrl + "menu");

        if (!response.ok) {
            throw new Error("Erreur lors du chargement des menus");
        }

        const menus = await response.json();
        displayMenus(menus);

    } catch (error) {
        console.error("Erreur:", error);
        menusList.innerHTML = '<p class="text-center text-danger">Impossible de charger les menus</p>';
    }
}

function displayMenus(menus) {
    if (menus.length === 0) {
        menusList.innerHTML = '<p class="text-center text-muted">Aucun menu disponible</p>';
        return;
    }

    let html = '';

    // Mise en bouche
    html += `
        <div class="mb-4">
            <h5 class="mb-2">Mise en Bouche</h5>
            <p class="small fst-italic">Mini-tartelette fine aux cèpes et truffe noire</p>
        </div>
    `;

    // Afficher chaque menu
    menus.forEach(menu => {
        html += `
            <div class="menu-item mb-4">
                <h4 class="m-3">${sanitizeHtml(menu.title)} - ${menu.price}€</h4>
                <p class="text-white-50 mb-0">${sanitizeHtml(menu.description)}</p>
            </div>
        `;
    });

    menusList.innerHTML = html;
}