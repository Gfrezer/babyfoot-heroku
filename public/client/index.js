//CREATION D'UNE NOUVELLE PARTIE
const createPartie = function () {
    let joueur1 = document.getElementById("joueur1").value
    let joueur2 = document.getElementById("joueur2").value
    let partie_termine = false

    //Envoie sur le serveur par les websockets
    let str = JSON.stringify({
        joueur1: joueur1,
        joueur2: joueur2,
        partie_termine: partie_termine,
        type: PARTIE_CREE,
    })
    //vider les champs formulaire
    document.getElementById("joueur1").value = ""
    document.getElementById("joueur2").value = ""

    ws.send(str)
    location.href = '#modal-close'
}

//SUPPRIMER UNE PARTIE 
const supprimePartie = function (element) {
    //Recuperation l'id de la partie et l'envoyer dans la requete websocket
    const idPartie = element.closest("tr").getAttribute("data-id");
    //Envoie sur le serveur pour les websockets
    let str = JSON.stringify({
        id: idPartie,
        type: PARTIE_SUPPRIMEE
    })
    ws.send(str)
}


//TERMINER UNE PARTIE

const terminePartie = function (button) {
    const trButton = button.closest("tr")
    const idButton = trButton.getAttribute("data-id");
    let score1 = trButton.querySelector(".inputJ1").value
    let score2 = trButton.querySelector(".inputJ2").value

    if ((score1 === "") || (score2 === "")) {
        let noValide = trButton.querySelector(".noValidScore")
        noValide.classList.remove("hidden")

    } else {
        let noValide = trButton.querySelector(".noValidScore")
        noValide.classList.remove("noValidScore")
        noValide.classList.add("hidden")

        //Envoie sur le serveur pour les websockets
        let str = JSON.stringify({
            id: idButton,
            score1: score1,
            score2: score2,
            type: PARTIE_TERMINEE
        })

        ws.send(str)
    }

}



//RECUP LES EVENEMENTS ET APPEL DES FONCTIONS

//CREATION D'UNE NOUVELLE PARTIE
let button = document.querySelectorAll('.boutonCreat');
//Boucle pour recuperer le bouton clické
button.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        createPartie(button)
    });
})

//SUPPRIMER UNE PARTIE
//recuperation des boutons de chaque ligne partie
let elements = document.querySelectorAll('.elt-supprimer');
//Boucle pour recuperer le bouton clické
elements.forEach(element => {
    element.addEventListener('click', (event) => {
        event.preventDefault();
        supprimePartie(element)
    });
})

//TERMINER UNE PARTIE
//recuperation des boutons de chaque ligne partie
let buttons = document.querySelectorAll('.btn-terminer');
//Boucle pour recuperer le bouton clické
buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        terminePartie(button)
    });

})