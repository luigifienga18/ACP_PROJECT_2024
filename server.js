var express = require("express"),
    http = require("http"),
    mongoose = require("mongoose"),
    app = express();

app.use(express.static(__dirname + "/client"));

app.use(express.urlencoded());

mongoose.connect('mongodb://localhost/ImmobiliShop');

/*
    Definiamo uno schema per la collezione di utenti nel database
*/ 
var UserSchema = mongoose.Schema({
    
    nome: String,
    cognome: String,
    numero: Number,
    email: String,
    newsletter: Number

});

/*
 Creaiamo un modello mongoose chiamato User basato sullo schema definito sopra
*/

var User = mongoose.model("User", UserSchema);

http.createServer(app).listen(3000);

/* Definisco questa route che è una get che mi restituisce tutti gli utenti nel DB come un file json*/
app.get("/users", function (req, res) {

	User.find({}, function (err, users) {
		res.json(users);
    	});
});
/*
    Definisco la route user che è una post per caricare l'utente nel DB, per farlo si controlla però prima se c'è già un'email registrata a quel nome, nel caso in cui ci fosse
    resstituisce un messaggio di ERROREMAIL, SUCCESS se è andato tutto bene, ERRROR per un errore generico  
*/

app.post("/user", function (req, res) {
    
	console.log(req.body);

	var user = new User({"nome":req.body.nome, "cognome":req.body.cognome, "numero":req.body.numero, "email":req.body.email, "newsletter":req.body.newsletter});


    User.find({"email":req.body.email},function (err,ris){
        if (err !== null) {
			console.log(err);
			ris.send("ERROR");
            return;
		}

        /*
        in ris è contenuto l'array dell'estrazione degli utenti che hanno quell'email nel DB e la lunghezza appunto 
        deve essere 0 per caricare il nuovo user
        */

        console.log(ris);
        
        if(ris.length===0)
        {
            user.save(function (err, result) {
                if (err !== null) {
                    console.log(err);
                    res.send("ERROR");
                }
            });
            console.log("Registrazione EFFETTUATA");
            res.send("SUCCESS");               
        }
        else{
            console.log("E-mail gia presente");
            res.send("ERROREMAIL");            
        }
    });
    
});
