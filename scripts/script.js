
let affichage = document.getElementById("affichage_communes");
let button = document.getElementById("launch");

button.addEventListener('click', rechercheParCodePostal);

async function rechercheParCodePostal() {
    try {
        const reponse = await fetch(
            `https://geo.api.gouv.fr/communes?codePostal=76940`
        );
        const data = await reponse.json();
        console.table(data)

        affichage.innerHTML = "";
        let option = document.createElement("option");
        option.value = "";
        option.textContent = "Choisissez une ville";
        affichage.appendChild(option);

        if (data.length > 1) {
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