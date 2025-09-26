const mailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSignin = document.getElementById("btnSignin");

btnSignin.addEventListener("click", checkCredentials);

function checkCredentials() {
    //Ici il faudra appeler une API pour vérifier les identifiants en BDD

    if (mailInput.value == "test@mail.com" && passwordInput.value == "123") {
        alert("Vous êtes connecté");

        //Il faudra récupérer un vrai token en appelant une API
        const token = "nbvjknbzvkjznclknzdkjvbkjhfbk";
        setToken(token);
        //placer le token en cookie

        setCookie(RoleCookieName, "client", 7);

        window.location.replace("/");
    }
    else {
        mailInput.classList.add("is-invalid");
        passwordInput.classList.add("is-invalid");
    }
}

