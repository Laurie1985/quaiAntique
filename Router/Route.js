//Classe route pour gérer les routes de l'application
export default class Route {
    constructor(url, title, pathHtml, authorize, pathJS = "") {
        this.url = url;
        this.title = title;
        this.pathHtml = pathHtml;
        this.pathJS = pathJS;
        this.authorize = authorize;
    }
}

/**
[] -> Tout le monde peut y accéder
["admin"] -> Seulement les admins
["client"] -> Seulement les clients
["admin","client"] -> Les admins et les clients
 */