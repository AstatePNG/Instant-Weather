const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const classes =  ["card_snow", "card_rain", "card_sun", "card_thunder", "card_cloud", "card_fog"];

let zipCode;

let affichage = document.getElementById("affichage_communes");
let maVille = document.getElementById("maVille");
let duree = document.getElementById("duree");
let pbPluie = document.getElementById("pbPluie");
let dureeSoleil = document.getElementById("dureeSoleil");
let tempMin = document.getElementById("tempMin");
let tempMax = document.getElementById("tempMax");
let checkWeather = document.getElementById("checkWeather");
let nextDaysContainer = document.getElementById("nextDays");
let openMenu = document.getElementById("openMenu");
let validFormMenu = document.getElementById("validFormMenu");
let card = document.getElementById("card");

function clearCardClasses(){ //Remove all the classes to put another one after
    card.classList.remove(...classes);
}

async function searchByZipCode(zipCode) {
    try {
        const reponse = await fetch(
            `https://geo.api.gouv.fr/communes?codePostal=${zipCode}`
        );
        const data = await reponse.json();
        console.table(data)

        affichage.innerHTML = "";
        let option = document.createElement("option");
        option.value = "";
        option.textContent = "Choisissez une ville";
        affichage.appendChild(option);

        if (data.length > 0) {
            data.forEach((commune) => {
            option = document.createElement("option");
            option.value = commune.code;
            option.textContent = commune.nom;
            affichage.appendChild(option);
        });
        }

    }
    catch (error){
        console.error("Erreur requête API commune : ", error);
        throw error;
    }
}

async function getWeatherInformations(comCode) {
    try {
        const repMeteo = await fetch(
            `https://api.meteo-concept.com/api/forecast/daily?token=9cf70dd6f5cf12e723541e9cc253916ca487e80dbfa8f276d3c7074221882677&insee=${comCode}`
        );
        const dataMeteo = await repMeteo.json();
        console.table(dataMeteo);
        maVille.innerHTML = dataMeteo.city.name;
        const date = new Date(dataMeteo.forecast[0].datetime);
        duree.innerHTML = days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
        tempMin.innerHTML = dataMeteo.forecast[0].tmin;
        tempMax.innerHTML = dataMeteo.forecast[0].tmax;
        pbPluie.innerHTML = dataMeteo.forecast[0].probarain;
        let hours = dataMeteo.forecast[0].sun_hours;
        if(hours == 1){
            dureeSoleil.innerHTML = hours + " heure";
        }
        else{
            dureeSoleil.innerHTML = hours + " heures";
        }

        clearCardClasses();
        card.classList.add('card');
        if(dataMeteo.forecast[0].probarain > 50){//If Rain proba > 60% display rain background
            card.classList.add('card-rain');
        } else if(dataMeteo.forecast[0].sun_hours >= 5){//We consider it sunny
            card.classList.add('card-sun');
        }else if(dataMeteo.forecast[0].probafog > 50){ // Doesn't seems to work for now...
            card.classList.add('card-fog');
        } else { //Cloudy
            card.classList.add('card-cloud');
        }
        for(let i=1; i<7; i++){
            addDayCard(dataMeteo.forecast[i].datetime, dataMeteo.forecast[i].tmin, dataMeteo.forecast[i].tmax, dataMeteo.forecast[i].probarain, dataMeteo.forecast[i].sun_hours);
        }
    }
    catch (error) {
        console.error("Erreur requête API météo : ", error);
        throw error;
    }
}

checkWeather.addEventListener("click", ()=> {
    getWeatherInformations(affichage.value);
    nextDaysContainer.innerHTML = '';
});

openMenu.addEventListener("click", ()=> {
    document.getElementById('formMenu').style.display = 'flex';
    document.getElementById('information').style.display = 'none';

})

validFormMenu.addEventListener("click", ()=> {
    document.getElementById('information').style.display = 'inline';
    document.getElementById('formMenu').style.display = 'none';

})

function formInput() {
    zipCode = document.getElementById('zipCode').value;
    if(/^(0[1-9]|[1-8][0-9]|9[0-8]){1}([0-9]){3}$/.test(zipCode)){
        searchByZipCode(zipCode);  //variable containing a valid postal code
    }
}

function addDayCard(date, min, max, proba, sol) {
    const dateI = new Date(date);
    let meteoDay = document.createElement("div");
    meteoDay.classList.add("card");
    let meteoBody = document.createElement("div");
    meteoBody.classList.add("card-body");
    let time = document.createElement("p");
    let probrain = document.createElement("p");
    let suntime = document.createElement("p");
    let minmax = document.createElement("p");
    time.classList.add("card-text", "d-flex", "flex-row", "justify-content-center", "mb-3");
    probrain.classList.add("card-text", "d-flex", "flex-row", "justify-content-center");
    suntime.classList.add("card-text", "d-flex", "flex-row", "justify-content-center");
    minmax.classList.add("card-text", "d-flex", "flex-row", "justify-content-center");
    time.innerHTML = days[dateI.getDay()] + " " + dateI.getDate() + " " + months[dateI.getMonth()] + " " + dateI.getFullYear();
    probrain.innerHTML = "Probabilité de pluie : " + proba + "%";
    if(sol == 1){
        suntime.innerHTML = "Ensoleillement : " + sol + " heure";
    }
    else {
        suntime.innerHTML = "Ensoleillement : " + sol + " heures";
    }
    minmax.innerHTML = min + '°C <span class="fleche"><span class="gauche">⬅</span><span class="droite">➡</span></span>' + max + "°C";


    meteoBody.appendChild(time);
    meteoBody.appendChild(probrain);
    meteoBody.appendChild(suntime);
    meteoBody.appendChild(minmax);
    meteoDay.appendChild(meteoBody);
    nextDaysContainer.appendChild(meteoDay);
}