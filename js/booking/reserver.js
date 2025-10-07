const bookingForm = document.getElementById("bookingForm");
const dateInput = document.getElementById("DateInput");
const selectHour = document.getElementById("selectHour");
const nbConvivesInput = document.getElementById("NbConvivesInput");
const serviceRadios = document.querySelectorAll('input[name="serviceChoisi"]');
const availabilityMessage = document.getElementById("availabilityMessage");
const btnReserver = document.getElementById("btnReserver");

let restaurantData = null;

// Charger les infos au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
    loadUserInfo();
    loadRestaurantInfo();

    // Événements pour vérification de disponibilité
    dateInput.addEventListener("change", checkAvailability);
    selectHour.addEventListener("change", checkAvailability);
    nbConvivesInput.addEventListener("change", checkAvailability);
    serviceRadios.forEach(radio => {
        radio.addEventListener("change", updateTimeSlots);
    });
});

// Charger les infos utilisateur
function loadUserInfo() {
    if (!isConnected()) {
        alert("Vous devez être connecté pour réserver");
        window.location.href = "/signin";
        return;
    }

    getInfosUser()
        .then(user => {
            document.getElementById("NomInput").value = user.lastname || '';
            document.getElementById("PrenomInput").value = user.firstname || '';
            document.getElementById("EmailInput").value = user.email || '';
            document.getElementById("AllergieInput").value = user.allergy || '';
            document.getElementById("NbConvivesInput").value = user.guestNumber || 1;
        })
        .catch(error => {
            console.error("Erreur:", error);
        });
}

// Charger les infos du restaurant (horaires)
function loadRestaurantInfo() {
    fetch(apiUrl + "restaurant")
        .then(response => response.json())
        .then(data => {
            restaurantData = data;
            // Afficher les horaires
            document.getElementById("lunchHours").textContent =
                `${data.lunchStartTime} - ${data.lunchEndTime}`;
            document.getElementById("dinnerHours").textContent =
                `${data.dinnerStartTime} - ${data.dinnerEndTime}`;

            updateTimeSlots();
        })
        .catch(error => {
            console.error("Erreur:", error);
        });
}

// Générer les créneaux horaires par tranches de 15 minutes
function updateTimeSlots() {
    if (!restaurantData) return;

    const service = document.querySelector('input[name="serviceChoisi"]:checked').value;
    let startTime, endTime;

    if (service === "midi") {
        startTime = restaurantData.lunchStartTime;
        endTime = restaurantData.lunchEndTime;
    } else {
        startTime = restaurantData.dinnerStartTime;
        endTime = restaurantData.dinnerEndTime;
    }

    selectHour.innerHTML = '<option value="">Sélectionnez une heure</option>';

    const slots = generateTimeSlots(startTime, endTime);
    slots.forEach(slot => {
        const option = document.createElement("option");
        option.value = slot;
        option.textContent = slot;
        selectHour.appendChild(option);
    });
}

// Générer les créneaux de 15 minutes
function generateTimeSlots(start, end) {
    const slots = [];
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
        slots.push(timeStr);

        currentMin += 15;
        if (currentMin >= 60) {
            currentMin = 0;
            currentHour++;
        }
    }

    return slots;
}

// Vérifier la disponibilité (sans rechargement)
function checkAvailability() {
    const date = dateInput.value;
    const time = selectHour.value;
    const guests = nbConvivesInput.value;

    if (!date || !time || !guests) {
        availabilityMessage.style.display = "none";
        return;
    }

    const bookingDateTime = `${date}T${time}:00`;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "bookingDate": bookingDateTime,
        "guestNumber": parseInt(guests)
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch(apiUrl + "bookings/check-availability", requestOptions)
        .then(response => response.json())
        .then(result => {
            availabilityMessage.style.display = "block";

            if (result.available) {
                availabilityMessage.className = "alert alert-success";
                availabilityMessage.textContent = "Disponible ! Vous pouvez réserver.";
                btnReserver.disabled = false;
            } else {
                availabilityMessage.className = "alert alert-danger";
                availabilityMessage.textContent = "Indisponible. " + (result.message || "Choisissez un autre créneau.");
                btnReserver.disabled = true;
            }
        })
        .catch(error => {
            console.error("Erreur:", error);
            availabilityMessage.style.display = "block";
            availabilityMessage.className = "alert alert-warning";
            availabilityMessage.textContent = "Impossible de vérifier la disponibilité";
        });
}

// Soumettre la réservation
bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(bookingForm);
    const date = formData.get("Date");
    const time = formData.get("Heure");
    const bookingDateTime = `${date}T${time}:00`;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-AUTH-TOKEN", getToken());

    const raw = JSON.stringify({
        "bookingDate": bookingDateTime,
        "guestNumber": parseInt(formData.get("NbConvives")),
        "allergy": formData.get("Allergies") || null
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch(apiUrl + "bookings", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Erreur lors de la réservation");
            }
        })
        .then(result => {
            alert("Réservation confirmée !");
            window.location.href = "/allResa";
        })
        .catch(error => {
            console.error("Erreur:", error);
            alert("Erreur lors de la réservation. Veuillez réessayer.");
        });
});