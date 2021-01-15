const express = require('express');
const bodyParser = require('body-parser');
const hbs = require("hbs");
const partieCrud = require("./controllers/partiesCrud")
const app = express();
const WebSocket = require('ws');

const PARTIE_TERMINEE = "partieClientTermine"
const PARTIE_SUPPRIMEE = "partieclientSupprime"
const PARTIE_CREE = "partieclientCrée"


//ROUTE READ A L'APPEL DU SERVEUR
app.get("/", partieCrud.read);
const port = 3000
//WEBSOCKET
const wss = new WebSocket.Server({
    server: app.listen(port)
});
wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('onclose', () => console.log('Client disconnected'));
    ws.on('message', (message) => {
        let data = JSON.parse(message)
        //Create
        switch (data.type) {
            case PARTIE_CREE:
                partieCrud.create(data, app, wss)
                break;
            case PARTIE_SUPPRIMEE:
                partieCrud.delete(data, wss)
                break;
            case PARTIE_TERMINEE:
                partieCrud.termine(data, wss)
                break;
        }
    })
});
console.log("L'application est disponible à l'adresse: http:// localhost:" + port)
//helper handlebars pour valider la condition score plus grand
hbs.registerHelper('estPlusGrand', function (score1, score2) {
    return score1 > score2;
});




app.set("view engine", "hbs")
hbs.registerPartials(__dirname + '/views/partials');


app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)