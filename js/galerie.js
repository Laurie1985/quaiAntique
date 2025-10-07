const galerieImage = document.getElementById("allImages");

// Récupérer les images depuis l'API
fetch(apiUrl + "pictures")
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error("Erreur lors du chargement des images");
    })
    .then(pictures => {
        let imagesHTML = '';

        if (pictures.length === 0) {
            galerieImage.innerHTML = '<p class="text-center">Aucune image disponible</p>';
            return;
        }

        pictures.forEach(picture => {
            imagesHTML += getImage(picture.title, picture.slug);
        });
        galerieImage.innerHTML = imagesHTML;
    })
    .catch(error => {
        console.error("Erreur:", error);
        galerieImage.innerHTML = '<p class="text-center text-danger">Erreur lors du chargement des images</p>';
    });

function getImage(titre, slug) {
    titre = sanitizeHtml(titre);
    slug = sanitizeHtml(slug);

    return `<div class="col p-4">
                <div class="image-card text-white">
                    <img src="/uploads/pictures/${slug}" class="rounded w-100" alt="${titre}">
                    <p class="titre-image">${titre}</p>
                    <div class="action-image-buttons" data-show="admin">
                        <button type="button" class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#EditionPhotoModal"><i class="bi bi-pencil-square"></i></button>
                        <button type="button" class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#DeletePhotoModal"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            </div>`;
}