const db = require('../model/queries')

//READ A l'apppel du serveur
exports.read = (req, res) => {
    db.query('SELECT * FROM parties order by id desc', (error, results) => {
        //Compteur de parties
        let count = 0;
        results.rows.forEach(ligne => {
            if (ligne.partie_termine === false) {
                count++;
            }
        })
        if (error) {
            throw error
        }
        res.render("partieDeBabyfoot", {
            model: results.rows,
            count: count
        })
    })
};


//CREATE LIGNE JOUEURS
exports.create = (data, app, wss) => {
    //INSERTION DANS LA BDD
    db.query('INSERT INTO parties (joueur1, joueur2, partie_termine) VALUES ($1,$2,$3)', [data.joueur1, data.joueur2, data.partie_termine], (error, results) => {
        if (error) {
            throw error
        }
        //RECUP L'ID DU DERNIER CREATE LIGNE JOUEURS
        let id = -1
        db.query("select  max (id) from parties", (error, results) => {
            id = results.rows[0].max
            //CALLBACK HTML
            app.render("ligne", {
                layout: false,
                id: id,
                joueur1: data.joueur1,
                joueur2: data.joueur2,
            }, function (err, html) {
                if (err) {
                    console.log(err)
                }

                let str = JSON.stringify({
                    ajoutDeLigne: html,
                    type: data.type
                })
                wss.clients.forEach(client => client.send(str));
            })
        })
    });
}



//DELETE
exports.delete = (data, wss) => {
    const id = parseInt(data.id)
    db.query('DELETE FROM parties WHERE id = $1', [data.id], (error) => {
        if (error) {
            throw error
        }
        const str = JSON.stringify({
            id: id,
            type: data.type
        })
        wss.clients.forEach(client => client.send(str));
    })
};



//TERMINE et AJOUT des SCORES
exports.termine = (data, wss) => {
    const partie_termine = true
    db.query('UPDATE parties SET partie_termine = $1, score1 = $2 , score2 = $3 where id = $4 ',
        [partie_termine, data.score1, data.score2, data.id],
        (error) => {
            if (error) {
                throw error
            }
            const str = JSON.stringify({
                id: "btn-" + data.id,
                type: data.type,
                score1: data.score1,
                score2: data.score2,
            })
            wss.clients.forEach(client => client.send(str));

        })
};