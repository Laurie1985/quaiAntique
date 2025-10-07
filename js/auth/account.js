const accountForm = document.getElementById("accountForm");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");

// Charger les infos utilisateur au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
    loadUserInfo();
});

// Charger les informations de l'utilisateur
function loadUserInfo() {
    getInfosUser()
        .then(user => {
            document.getElementById("NomInput").value = user.lastname || '';
            document.getElementById("PrenomInput").value = user.firstname || '';
            document.getElementById("EmailInput").value = user.email || '';
            document.getElementById("AllergieInput").value = user.allergy || '';
            document.getElementById("NbConvivesInput").value = user.guestNumber || '';
        })
        .catch(error => {
            console.error("Erreur lors du chargement des informations:", error);
            alert("Impossible de charger vos informations");
        });
}

// Modifier les informations
accountForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(accountForm);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-AUTH-TOKEN", getToken());

    const raw = JSON.stringify({
        "lastname": formData.get("Nom"),
        "firstname": formData.get("Prenom"),
        "allergy": formData.get("Allergies"),
        "guestNumber": parseInt(formData.get("NbConvives"))
    });

    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch(apiUrl + "me", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Erreur lors de la modification");
            }
        })
        .then(result => {
            alert("Vos informations ont été modifiées avec succès !");
            loadUserInfo(); // Recharger les infos
        })
        .catch(error => {
            console.error("Erreur:", error);
            alert("Erreur lors de la modification de vos informations");
        });
});

// Supprimer le compte
deleteAccountBtn.addEventListener("click", function () {
    if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
        const myHeaders = new Headers();
        myHeaders.append("X-AUTH-TOKEN", getToken());

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(apiUrl + "me", requestOptions)
            .then(response => {
                if (response.ok) {
                    alert("Votre compte a été supprimé");
                    signout(); // Déconnexion
                } else {
                    throw new Error("Erreur lors de la suppression");
                }
            })
            .catch(error => {
                console.error("Erreur:", error);
                alert("Erreur lors de la suppression du compte");
            });
    }
});