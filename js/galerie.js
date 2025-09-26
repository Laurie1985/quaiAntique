const galerieImage = document.getElementById("allImages");

//Récupérer les informations des images depuis une API

let titre
let imgSource
let monImage = getImage("titre", "../images/pexels-pixabay-262978.jpg");


galerieImage.innerHTML = monImage;


function getImage(titre, urlImage) {
    titre = sanitizeHtml(titre);
    urlImage = sanitizeHtml(urlImage);
    return `<div class="col p-4">
                <div class="image-card text-white">
                    <img src="${urlImage}" class="rounded w-100" alt="photos d'assiettes présentées">
                    <p class="titre-image">${titre}</p>
                    <div class="action-image-buttons" data-show="admin">
                        <button type="button" class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#EditionPhotoModal"><i class="bi bi-pencil-square"></i></button>
                        <button type="button" class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#DeletePhotoModal"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            </div>`;
}