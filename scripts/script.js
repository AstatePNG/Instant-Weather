let zipCode;

let affichage = document.getElementById("affichage_communes");
let maVille = document.getElementById("maVille");
let pbPluie = document.getElementById("pbPluie");
let dureeSoleil = document.getElementById("dureeSoleil");
let tempMin = document.getElementById("tempMin");
let tempMax = document.getElementById("tempMax");
let checkWeather = document.getElementById("checkWeather");
//Testing the card's background actualisation
// let neige = document.getElementById("Neige");
// let nuage = document.getElementById("Nuage");
// let orage = document.getElementById("Orage");
// let pluie = document.getElementById("Pluie");
// let soleil = document.getElementById("Soleil");
// let rien = document.getElementById("Rien")

function clearClasses(){ //Remove all the classes to put another one after
    const classes =  ["card_snow", "card_rain", "card_sun", "card_thunder", "card_cloud", "card_fog"]
    let card = document.getElementById("card");
    card.classList.remove(...classes);
}

async function searchByZipCode(zipCode) {
    console.log(zipCode);
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
    console.log(comCode);
    try {
        const repMeteo = await fetch(
            `https://api.meteo-concept.com/api/forecast/daily/0?token=9cf70dd6f5cf12e723541e9cc253916ca487e80dbfa8f276d3c7074221882677&insee=${comCode}`
        );
        const dataMeteo = await repMeteo.json();
        console.table(dataMeteo);
        maVille.innerHTML = dataMeteo.city.name;
        tempMin.innerHTML = dataMeteo.forecast.tmin;
        tempMax.innerHTML = dataMeteo.forecast.tmax;
        pbPluie.innerHTML = dataMeteo.forecast.probarain;
        dureeSoleil.innerHTML = dataMeteo.forecast.sun_hours + " heures";

        if(dataMeteo.forecast.probarain > 60){//If Rain proba > 60% display rain background
            let card = document.getElementById("card");
            clearClasses();
            card.classList.add('card_rain');
        } else if(dataMeteo.forecast.sun_hours > 2){//We consider it sunny
            let card = document.getElementById("card");
            clearClasses();
            card.classList.add('card_sun');
        }else if(dataMeteo.forecast.probafog > 10){
            let card = document.getElementById("card");
            clearClasses();
            card.classList.add('card_fog');
        } else { //Cloudy
            let card = document.getElementById("card");
            clearClasses();
            card.classList.add('card_cloud');
        }
        
    }
    catch (error) {
        console.error("Erreur requête API météo : ", error);
        throw error;
    }
}

checkWeather.addEventListener("click", ()=> {
    getWeatherInformations(affichage.value);
});

function formInput() {
    zipCode = document.getElementById('zipCode').value;

    if(/^([1-9][1-8]){1}([0-9]){3}$/.test(zipCode)){
        searchByZipCode(zipCode);  //variable containing a valid postal code
    }
}
