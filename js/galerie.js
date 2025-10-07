const galerieImage = document.getElementById("allImages");
const addPhotoForm = document.getElementById("addPhotoForm");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

const editionPhotoModal = new bootstrap.Modal(document.getElementById('EditionPhotoModal'));
const deletePhotoModal = new bootstrap.Modal(document.getElementById('DeletePhotoModal'));

let currentDeletePhotoId = null;
let currentDeletePhotoSlug = null;

// Charger la galerie au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
    loadGallery();
});

// Récupérer les images depuis l'API
function loadGallery() {
    fetch(apiUrl + "picture")
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Erreur lors du chargement des images");
        })
        .then(pictures => {
            displayGallery(pictures);
        })
        .catch(error => {
            console.error("Erreur:", error);
            galerieImage.innerHTML = '<p class="text-center text-danger">Erreur lors du chargement des images</p>';
        });
}

// Afficher la galerie
function displayGallery(pictures) {
    if (pictures.length === 0) {
        galerieImage.innerHTML = '<p class="text-center">Aucune image disponible</p>';
        return;
    }

    const isAdmin = getRole() === "admin";
    let imagesHTML = '';

    pictures.forEach(picture => {
        imagesHTML += getImage(picture.id, picture.title, picture.slug, isAdmin);
    });

    galerieImage.innerHTML = imagesHTML;
}

// Générer le HTML d'une image
function getImage(id, titre, slug, isAdmin) {
    titre = sanitizeHtml(titre);
    slug = sanitizeHtml(slug);

    return `<div class="col p-4" data-picture-id="${id}">
                <div class="image-card text-white">
                    <img src="/uploads/pictures/${slug}" class="rounded w-100" alt="${titre}">
                    <p class="titre-image">${titre}</p>
                    ${isAdmin ? `
                    <div class="action-image-buttons">
                        <button type="button" class="btn btn-outline-light" onclick="openDeleteModal(${id}, '${titre.replace(/'/g, "\\'")}', '${slug}')" title="Supprimer">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    ` : ''}
                </div>
            </div>`;
}

// Ajouter une photo
if (addPhotoForm) {
    addPhotoForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("NamePhotoInput").value;
        const fileInput = document.getElementById("ImageInput");
        const file = fileInput.files[0];

        if (!file) {
            alert("Veuillez sélectionner une image");
            return;
        }

        // Générer un slug à partir du nom du fichier
        const fileName = file.name;
        const slug = fileName.toLowerCase()
            .replace(/\s+/g, '-')           // Remplacer espaces par -
            .replace(/[^a-z0-9.-]/g, '')    // Garder seulement lettres, chiffres, points et tirets
            .replace(/-+/g, '-');           // Éviter les doubles tirets

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-AUTH-TOKEN", getToken());

        const raw = JSON.stringify({
            "title": title,
            "slug": slug,
            "restaurantId": 1
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(apiUrl + "picture", requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Erreur lors de l'ajout de la photo");
                }
            })
            .then(result => {
                alert(`Photo ajoutée avec succès !${slug}`);
                editionPhotoModal.hide();
                addPhotoForm.reset();
                loadGallery();
            })
            .catch(error => {
                console.error("Erreur:", error);
                alert("Erreur lors de l'ajout de la photo");
            });
    });
}

// Ouvrir la modal de suppression
function openDeleteModal(id, title, slug) {
    currentDeletePhotoId = id;
    currentDeletePhotoSlug = slug;

    document.getElementById("deletePhotoTitle").textContent = title;
    document.getElementById("deletePhotoImage").src = "/uploads/pictures/" + slug;

    deletePhotoModal.show();
}

// Supprimer une photo
if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", function () {
        if (!currentDeletePhotoId) return;

        const myHeaders = new Headers();
        myHeaders.append("X-AUTH-TOKEN", getToken());

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(apiUrl + "picture/" + currentDeletePhotoId, requestOptions)
            .then(response => {
                if (response.ok || response.status === 204) {
                    alert(`Photo supprimée avec succès !${currentDeletePhotoSlug}`);
                    deletePhotoModal.hide();
                    loadGallery();
                } else {
                    throw new Error("Erreur lors de la suppression");
                }
            })
            .catch(error => {
                console.error("Erreur:", error);
                alert("Erreur lors de la suppression de la photo");
            });
    });
}