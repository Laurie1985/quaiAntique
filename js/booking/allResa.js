let currentBookingId = null;
const reservationsList = document.getElementById("reservationsList");
const deleteResaBtn = document.getElementById("deleteResaBtn");
const showResaModal = new bootstrap.Modal(document.getElementById('ShowResaModal'));

// Charger les réservations au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
    loadUserBookings();
});

// Charger les réservations de l'utilisateur
function loadUserBookings() {
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch(apiUrl + "bookings", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Erreur lors du chargement des réservations");
            }
        })
        .then(bookings => {
            displayBookings(bookings);
        })
        .catch(error => {
            console.error("Erreur:", error);
            reservationsList.innerHTML = '<p class="text-danger">Impossible de charger vos réservations</p>';
        });
}

// Afficher les réservations
function displayBookings(bookings) {
    if (bookings.length === 0) {
        reservationsList.innerHTML = '<p class="text-muted">Vous n\'avez aucune réservation</p>';
        return;
    }

    let html = '<div class="allreservations">';

    bookings.forEach(booking => {
        const date = new Date(booking.bookingDate);
        const formattedDate = date.toLocaleDateString('fr-FR');
        const formattedTime = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

        html += `
            <a href="#" class="d-block mb-2 text-decoration-none" onclick="showBookingDetails(${booking.id}, '${formattedDate}', '${formattedTime}', ${booking.guestNumber}, '${booking.allergy || 'Aucune'}')">
                <span>${formattedDate}</span> |
                <span>${formattedTime}</span> |
                <span>${booking.guestNumber} personne(s)</span> |
                <span>${booking.allergy || 'Aucune allergie'}</span>
            </a>
        `;
    });

    html += '</div>';
    reservationsList.innerHTML = html;
}

// Afficher les détails d'une réservation dans la modal
function showBookingDetails(id, date, time, guests, allergy) {
    currentBookingId = id;

    document.getElementById("modalDate").textContent = date;
    document.getElementById("modalTime").textContent = time;
    document.getElementById("modalGuests").textContent = guests;
    document.getElementById("modalAllergy").textContent = allergy;

    showResaModal.show();
}

// Supprimer une réservation
deleteResaBtn.addEventListener("click", function () {
    if (!currentBookingId) return;

    if (confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
        const myHeaders = new Headers();
        myHeaders.append("X-AUTH-TOKEN", getToken());

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(apiUrl + "bookings/" + currentBookingId, requestOptions)
            .then(response => {
                if (response.ok) {
                    alert("Réservation supprimée avec succès");
                    showResaModal.hide();
                    loadUserBookings(); // Recharger la liste
                } else {
                    throw new Error("Erreur lors de la suppression");
                }
            })
            .catch(error => {
                console.error("Erreur:", error);
                alert("Impossible de supprimer cette réservation");
            });
    }
});