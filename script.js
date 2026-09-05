const urlParameter = new URLSearchParams(window.location.search);
const tourParameter = urlParameter.get("tour");

let aktuelleTour = "";
let aktuelleSchicht = "";

let fahrer = localStorage.getItem("fahrer");

let html5QrCode = null;


window.onload = function () {

    document.getElementById("fahrerScreen").style.display = "none";
    document.getElementById("scanScreen").style.display = "none";
    document.getElementById("cameraScreen").style.display = "none";
    document.getElementById("statusScreen").style.display = "none";
    document.getElementById("successScreen").style.display = "none";

    if (fahrer) {

        if (tourParameter) {

            tourOeffnen(tourParameter);

        } else {

            document.getElementById("scanScreen").style.display = "block";

        }

    } else {

        document.getElementById("fahrerScreen").style.display = "block";

    }

};


function fahrerSpeichern() {

    let name = document.getElementById("fahrerName").value.trim();

    if (name === "") {

        alert("Bitte Namen eingeben.");
        return;

    }

    localStorage.setItem("fahrer", name);

    fahrer = name;

    document.getElementById("fahrerScreen").style.display = "none";

    if (tourParameter) {

        tourOeffnen(tourParameter);

    } else {

        document.getElementById("scanScreen").style.display = "block";

    }

}


function fahrerWechseln() {

    localStorage.removeItem("fahrer");

    location.reload();

}


function startQrScanner() {

    document.getElementById("scanScreen").style.display = "none";
    document.getElementById("cameraScreen").style.display = "block";

    html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(

        { facingMode: "environment" },

        {
            fps: 10,
            qrbox: 250
        },

        function (text) {

            if (html5QrCode) {

                html5QrCode.stop().then(function () {

                    html5QrCode = null;

                    qrInhaltVerarbeiten(text);

                }).catch(function () {

                    html5QrCode = null;

                    qrInhaltVerarbeiten(text);

                });

            } else {

                qrInhaltVerarbeiten(text);

            }

        }

    );

}


function qrInhaltVerarbeiten(text) {

    let tourText = text.trim();

    // Neuer QR-Code mit kompletter Internetadresse
    if (tourText.startsWith("http://") || tourText.startsWith("https://")) {

        try {

            let qrUrl = new URL(tourText);
            let qrTour = qrUrl.searchParams.get("tour");

            if (qrTour) {

                tourText = qrTour;

            }

        } catch (fehler) {

            alert("QR-Code konnte nicht gelesen werden.");
            return;

        }

    }

    tourOeffnen(tourText);

}


function tourOeffnen(text) {

    let daten = text.split("-");

    if (daten.length < 2) {

        alert("Ungültiger QR-Code.");
        return;

    }

    aktuelleTour = daten[0].trim();
    aktuelleSchicht = daten[1].trim().toUpperCase();

    document.getElementById("cameraScreen").style.display = "none";
    document.getElementById("scanScreen").style.display = "none";
    document.getElementById("statusScreen").style.display = "block";

    document.getElementById("tour").innerHTML =
        "Tour " + aktuelleTour;

    document.getElementById("schicht").innerHTML =
        "👤 Fahrer: <b>" + fahrer + "</b><br><br>";

    switch (aktuelleSchicht) {

        case "F8":

            document.getElementById("schicht").innerHTML +=
                "🌅 Frühschicht (8 Stunden)";

            break;


        case "S8":

            document.getElementById("schicht").innerHTML +=
                "🌇 Spätschicht (8 Stunden)";

            break;


        case "T12":

            document.getElementById("schicht").innerHTML +=
                "☀️ Tagschicht (12 Stunden)";

            break;


        case "N8":

            document.getElementById("schicht").innerHTML +=
                "🌙 Nachtschicht (8 Stunden)";

            break;


        case "N12":

            document.getElementById("schicht").innerHTML +=
                "🌙 Nachtschicht (12 Stunden)";

            break;


        default:

            document.getElementById("schicht").innerHTML +=
                "Schicht: " + aktuelleSchicht;

            break;

    }

}


function statusSenden(status) {

    document.getElementById("statusScreen").style.display = "none";
    document.getElementById("successScreen").style.display = "block";

    let zeit = new Date().toLocaleTimeString("de-DE");

    document.getElementById("meldung").innerHTML =

        "👤 " + fahrer +
        "<br><br>" +
        "Tour " + aktuelleTour +
        "<br>" +
        status +
        "<br>" +
        zeit;

    setTimeout(function () {

        document.getElementById("successScreen").style.display = "none";
        document.getElementById("statusScreen").style.display = "block";

    }, 2000);

}