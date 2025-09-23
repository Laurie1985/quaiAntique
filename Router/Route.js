//Classe route pour gérer les routes de l'application
export default class Route {
    constructor(url, title, pathHtml, pathJS = "") {
        this.url = url;
        this.title = title;
        this.pathHtml = pathHtml;
        this.pathJS = pathJS;
    }
}