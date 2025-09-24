import Route from "./Route.js";

//Définition des routes de l'application
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html"),
    new Route("/galerie", "La galerie", "/pages/galerie.html"),
    new Route("/menu", "Les menus", "/pages/menu.html"),
    new Route("/signin", "connexion", "/pages/signin.html"),
    new Route("/signup", "inscription", "/pages/signup.html"),
    new Route("/contact", "Contact", "/pages/contact.html"),
    new Route("/reservation", "Réservation", "/pages/reservation.html"),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Quai Antique";