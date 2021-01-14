const PARTIE_TERMINEE = "partieClientTermine"
const PARTIE_SUPPRIMEE = "partieclientSupprime"
const PARTIE_CREE = "partieclientCrée"
const HOST = location.origin.replace(/^http/, 'ws')
const ws = new WebSocket(HOST);


//Message du serveur WebSocket
ws.onmessage = function (event) {
    var data = JSON.parse(event.data)

    //MODIFICATIONS DU DOM PARTIE_CREE
    if (data.type === PARTIE_CREE) {
        let ajoutTable = document.querySelector("table tbody")
        ajoutTable.insertAdjacentHTML('afterbegin', data.ajoutDeLigne)
        let input = document.querySelector(".elt-supprimer")
        input.addEventListener('click', event => {
            supprimePartie(input)
        })
        let button = document.querySelector(".btn-terminer")
        button.addEventListener('click', event => {
            terminePartie(button)
        })
        //compteur de parties en plus
        let span = document.querySelector("#compteur")
        let compteur = span.innerText
        let compteurAjout = parseInt(compteur)
        span.innerText = ++compteurAjout
    }

    //MODIFICATIONS DU DOM PARTIE_SUPPRIMEE
    if (data.type === PARTIE_SUPPRIMEE) {
        let tr = document.querySelector(".ligne[data-id='" + data.id + "']")
        let span = document.querySelector("#compteur")
        let compteur = span.innerText
        let compteurEnleve = parseInt(compteur)
        span.innerText = --compteurEnleve
        tr.remove()
    }


    //MODIFICATIONS DU DOM BOUTON PARTIE_TERMINEE ET SCORE
    if (data.type === PARTIE_TERMINEE) {
        let button = document.getElementById(data.id)
        let span = document.createElement("span")
        span.innerText = "Terminée"
        span.className = "termine"
        button.innerHTML = ""
        button.append(span)
        //Boutton hors fonction
        this.disabled = true;
        //ajout score dans input
        let score1 = parseInt(data.score1)
        let score2 = parseInt(data.score2)
        let trButton = button.closest("tr")
        let input1 = trButton.querySelector("td .inputJ1")
        let input2 = trButton.querySelector("td .inputJ2")
        input1.insertAdjacentHTML('beforebegin', score1)
        input2.insertAdjacentHTML('beforebegin', score2)
        let inputJ1 = trButton.querySelector(".inputJ1")
        let inputJ2 = trButton.querySelector(".inputJ2")
        inputJ1.remove()
        inputJ2.remove()
        //Recuperation du td "joueur 1" pour modifier le css backgroundcolor 
        if (score1 > score2) {
            trButton.querySelector(".j1").classList.add("vert")
            trButton.querySelector(".j2").classList.add("gray")
            trButton.querySelector(".vs").classList.add("gray")
        } else if (score1 < score2) {
            trButton.querySelector(".j1").classList.add("gray")
            trButton.querySelector(".j2").classList.add("vert")
            trButton.querySelector(".vs").classList.add("gray")
        }
        //Recuperation du tr "ligne" pour modifier le css color joueur1 et 2
        trButton.classList.add("lesjoueurs")
        //compteur de parties en moins
        let spanEnleve = document.querySelector("#compteur")
        let compteur = spanEnleve.innerText
        let compteurAjout = parseInt(compteur)
        spanEnleve.innerText = --compteurAjout
    }
};