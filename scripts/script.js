const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const classes =  ["card-snow", "card-rain", "card-sun", "card-thunder", "card-cloud", "card-fog"];

let zipCode = document.getElementById("zipCode");
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
let slider = document.getElementById("duration");
let sliderValueDisplay = document.getElementById("durationValueDisplay");
let infoLatitude = document.getElementById("infoLatitude");
let infoLongitude = document.getElementById("infoLongitude");
let infoTotalRainfall = document.getElementById("infoTotalRainfall");
let infoAverageWind = document.getElementById("infoAverageWind");
let infoWindDirection = document.getElementById("infoWindDirection");

// Remove all the card's classes
function clearCardClasses(cardToClear){ 
    cardToClear.classList.remove(...classes);
}

// Call of the API to get commune code with ZIP code
async function searchByZipCode(zipCode) {
    try {
        const reponse = await fetch(
            `https://geo.api.gouv.fr/communes?codePostal=${zipCode}`
        );
        const data = await reponse.json();

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

// Call of the Weather API to get the informations weather information based on the zipCode.
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

        infoLatitude.innerHTML = dataMeteo.forecast[0].latitude;
        infoLongitude.innerHTML = dataMeteo.forecast[0].longitude;
        infoTotalRainfall.innerHTML = dataMeteo.forecast[0].rr10 + 'mm';
        infoAverageWind.innerHTML = dataMeteo.forecast[0].wind10m + ' km/h';
        infoWindDirection.innerHTML = dataMeteo.forecast[0].dirwind10m + '°';

        let hours = dataMeteo.forecast[0].sun_hours;
        if(hours == 1){
            dureeSoleil.innerHTML = hours + " heure";
        }
        else{
            dureeSoleil.innerHTML = hours + " heures";
        }
    
        setVisualOfWeather(card, dataMeteo.forecast[0].weather);
        for(let i=1; i<slider.value; i++){
            addDayCard(dataMeteo.forecast[i].datetime, dataMeteo.forecast[i].tmin, dataMeteo.forecast[i].tmax, dataMeteo.forecast[i].probarain, dataMeteo.forecast[i].sun_hours, dataMeteo.forecast[i].weather);
        }

    }
    catch (error) {
        console.error("Erreur requête API météo : ", error);
        throw error;
    }
}


// Call of the Weather API on click
checkWeather.addEventListener("click", ()=> {
    getWeatherInformations(affichage.value);
    nextDaysContainer.innerHTML = '';
});

// Open the settings menu on click
openMenu.addEventListener("click", ()=> {
    document.getElementById('formMenu').style.display = 'flex';
    document.getElementById('information').style.display = 'none';
});

// Valid the settings on click
validFormMenu.addEventListener("click", ()=> {
    isChecked("latitude", infoLatitude, "infoLatitudeText");
    isChecked("longitude", infoLongitude, "infoLongitudeText");
    isChecked("totalRainfall", infoTotalRainfall, "infoTotalRainfallText");
    isChecked("averageWind", infoAverageWind, "infoAverageWindText");
    isChecked("windDirection", infoWindDirection, "infoWindDirectionText");

    document.getElementById('information').style.display = 'inline';
    document.getElementById('formMenu').style.display = 'none';


    getWeatherInformations(affichage.value);
    nextDaysContainer.innerHTML = '';
});

// Update the display above the slider to make it match the current value set
slider.addEventListener("input", ()=> {
    if(slider.value == 1){
        sliderValueDisplay.innerHTML = "aujourd'hui";
    }
    else{
        sliderValueDisplay.innerHTML = "les " + slider.value + " prochains jours";
    }
});

//checks which items are checked to display the additional information the user wants to see
function isChecked(elementId, infoElement, infoTextElement) {
    if (document.getElementById(elementId).checked == false) {
        document.getElementById(infoTextElement).classList.add("hiddenInfo");
    }
    else{
        document.getElementById(infoTextElement).classList.remove("hiddenInfo");
    }
}

// Call the function for the commune code when a valid Zip code is detected
function formInput() {
    let zipCodeVal = zipCode.value;
    if(/^(0[1-9]|[1-8][0-9]|9[0-8]){1}([0-9]){3}$/.test(zipCodeVal)){
        searchByZipCode(zipCodeVal);  //variable containing a valid postal code
    }
}

// Add a new weather card when called
function addDayCard(date, min, max, proba, sol, weather) {
    const dateI = new Date(date);
    let inline = document.createElement("div");
    let meteoDay = document.createElement("div");
    let meteoBody = document.createElement("div");
    let time = document.createElement("p");
    let probrain = document.createElement("p");
    let suntime = document.createElement("p");
    let minmax = document.createElement("p");

    time.innerHTML = days[dateI.getDay()] + " " + dateI.getDate() + " " + months[dateI.getMonth()] + " " + dateI.getFullYear();
    probrain.innerHTML = "Probabilité de pluie : " + proba + "%";
    if(sol == 1){
        suntime.innerHTML = "Ensoleillement : " + sol + " heure";
    }
    else {
        suntime.innerHTML = "Ensoleillement : " + sol + " heures";
    }
    minmax.innerHTML = min + '°C <span class="fleche"><span class="gauche">⬅</span><span class="droite">➡</span></span>' + max + "°C";

    //Information on the card (for the next few days)
    meteoBody.appendChild(time);
    meteoBody.appendChild(probrain);
    meteoBody.appendChild(suntime);
    meteoBody.appendChild(minmax);
    meteoDay.appendChild(meteoBody);
    inline.appendChild(meteoDay);
    nextDaysContainer.appendChild(inline);
    setVisualOfWeather(meteoDay, weather);

    inline.classList.add("col", "mb-4");
    meteoDay.classList.add("card", "text-center", "border-0");
    meteoBody.classList.add("card-body");
    time.classList.add("card-text");
    probrain.classList.add("card-text");
    suntime.classList.add("card-text");
    minmax.classList.add("card-text");
}

// Changes the background image according to weather information
function setVisualOfWeather(cardToUpdate, weather) {
    clearCardClasses(cardToUpdate);
    cardToUpdate.classList.add('card');
    if((10 <= weather && weather <= 16) ||
        (40 <= weather && weather <= 47) ||
        (70 <= weather && weather <= 76) ||
        (210 <= weather && weather <= 212)) //Codes for rain (exlcuding those who mix snow and rain)
    {
        cardToUpdate.classList.add('card-rain'); //To update the maps 
    } 

    else if(0 <= weather && weather <= 2){//The only codes where we consider it sunny
        cardToUpdate.classList.add('card-sun');
    }

    else if(6 <= weather && weather <= 7){ // Codes for Fog
        cardToUpdate.classList.add('card-fog');
    } 

    else if(3 <= weather && weather <= 4){ //Codes for cloud
        cardToUpdate.classList.add('card-cloud');
    } 

    else if((20 <= weather && weather <= 22) ||
            (30 <= weather && weather <= 32) ||
            (60 <= weather && weather <= 68)) //Codes for snow (exlcuding those who mix snow and rain)
    { 
        cardToUpdate.classList.add('card-snow');
    } 

    else if((100 <= weather && weather <= 142) || (weather == 141)){ //Codes for Thunder
        cardToUpdate.classList.add('card-thunder');
    } 
}
