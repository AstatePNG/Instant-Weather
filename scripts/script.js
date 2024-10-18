let zipCode;

let affichage = document.getElementById("affichage_communes");
let maVille = document.getElementById("maVille");
let pbPluie = document.getElementById("pbPluie");
let dureeSoleil = document.getElementById("dureeSoleil");
let tempMin = document.getElementById("tempMin");
let tempMax = document.getElementById("tempMax");
let checkWeather = document.getElementById("checkWeather");
let openMenu = document.getElementById("openMenu");
let validFormMenu = document.getElementById("validFormMenu");

validFormMenu

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
    }
    catch (error) {
        console.error("Erreur requête API météo : ", error);
        throw error;
    }
}

checkWeather.addEventListener("click", ()=> {
    getWeatherInformations(affichage.value);
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

    if(/^([1-9][1-8]){1}([0-9]){3}$/.test(zipCode)){
        searchByZipCode(zipCode);  //variable containing a valid postal code
    }
}
