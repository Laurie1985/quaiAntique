import Route from "./Route.js";

//Définition des routes de l'application
export const allRoutes = [
    // Pages publiques
    new Route("/", "Accueil", "/pages/home.html", []),
    new Route("/galerie", "Galerie", "/pages/galerie.html", [], "/js/galerie.js"),
    new Route("/carte", "La carte", "/pages/carte.html", [], "/js/carte.js"),

    // Authentification
    new Route("/signin", "Connexion", "/pages/auth/signin.html", ["disconnected"], "/js/auth/signin.js"),
    new Route("/signup", "Inscription", "/pages/auth/signup.html", ["disconnected"], "/js/auth/signup.js"),

    // Pages utilisateur connecté
    new Route("/account", "Mon compte", "/pages/auth/account.html", ["client", "admin"], "/js/auth/account.js"),
    new Route("/allResa", "Mes réservations", "/pages/reservations/allResa.html", ["client", "admin"], "/js/reservations/allResa.js"),
    new Route("/reserver", "Réserver", "/pages/reservations/reserver.html", ["client", "admin"], "/js/reservations/reserver.js"),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Quai Antique";