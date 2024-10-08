let zipCode;

let affichage = document.getElementById("affichage_communes");
let button = document.getElementById("launch");
let maVille = document.getElementById("maVille");
let temperature = document.getElementById("temperature");
let pbPluie = document.getElementById("pbPluie");
let dureeSoleil = document.getElementById("dureeSoleil");
let tempMin = document.getElementById("tempMin");
let tempMax = document.getElementById("tempMax");

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
        console.error("Erreur requête API : ", error);
        throw error;
    }
}


async function getWeatherInformations() {
    
    9cf70dd6f5cf12e723541e9cc253916ca487e80dbfa8f276d3c7074221882677
}


function formInput() {
    zipCode = document.getElementById('zipCode').value;

    if(/^([1-9][1-8]){1}([0-9]){3}$/.test(zipCode)){
        searchByZipCode(zipCode);  //variable containing a valid postal code
    }
}
