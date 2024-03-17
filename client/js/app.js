var main = function (){

    "use strict";
    console.log("SANITY CHECK");

    /* CASO D'USO REGISTRAZIONE UTENTE */

    /*Definiamo un array contente i diversi span presenti nella sezione ".registrazione a" in quanto è possibile sia registrarsi come utente semplice oppure come inserzionista */
    $(".registrazione a span").toArray().forEach(function (element){

        var $element = $(element);
        /*Ogni volta che avviene l'evento, cioè viene clickato uno di essi viene rimosso il nome della classe active a chi lo aveva in
          precedenza e si aggiunge la classe active alla a dello span clickato. Infine viene fattta una clean sul tutto il cotenuto del main .container*/
        $element.on("click", function () {
            var $content, conferma=0;

                $(".registrazione a span").removeClass("active");
                $element.addClass("active");
                $("main .container").empty();

                /*Se è clickato il primo span, voglio effettuare una Registrazione Utente, la prima cosa che viene fatta è creare una serie di variabile che ci serviranno
                per la corretta renderizzazione della pagina HTML; definendo un paragrafo che introduce un determinato paramatro di input opportunatamente e il corrispettivo tag di
                input per l'inserimento di quel valore
                
                Devono essere riempiti un parametro di Nome, Cognome, Numero di cellulare, un Email che funge da chiave primaria ed un button per iscriversi o meno alla newsletter.
                Poi è aggiunto un button per l'invio dei parametri inseriti insieme ad una variabile che ci definisce un div con un nome di classe reg_utente_forn per contenere tutto
                
                */
                if ($element.parent().is(":nth-child(1)")) {
                    
                var $nomeinput = $("<input>").addClass("nome"), /*Come vediamo per il nome, definiamo un parametro di input con una classe "nome" e un paragrafo opportuno */
                $nomeinputLabel = $("<p>").text("Nome: "),
                $cognomeInput = $("<input>").addClass("cognome"),
                $cognomeLabel = $("<p>").text("Cognome: "),
                $numeroinput = $("<input>").addClass("numero"),
                $numeroinputLabel = $("<p>").text("Cellulare: "),
                $emailInput = $("<input>").addClass("email"),
                $emailLabel = $("<p>").text("E-mail: "),
                $newsletterlabel = $("<p>").text("Vuoi iscriverti alla Newsletter?"),
                $newsletterbutton = $("<button>").addClass("mailboxing_no"),
                $newsletterbutton = $newsletterbutton.text("No"),
                $button = $("<button>").text("Invio"), 
                $class = $("<div>").addClass("reg_utente_form");


                /*Questa sezione ci serve per gestire come l'utente possa passare dalla scelta di essere iscritto alla mailboxing o no, con conseguenza
                  un diverso render a schermo*/
                $newsletterbutton.on("click", function () {

                    if($newsletterbutton.hasClass("mailboxing_no"))
                    {
                        conferma=1;
                        $newsletterbutton = $newsletterbutton.text("Si");
                        $newsletterbutton = $newsletterbutton.toggleClass("mailboxing_no mailboxing_si");
                    }else{
                        conferma=0;
                        $newsletterbutton = $newsletterbutton.text("No");
                        $newsletterbutton = $newsletterbutton.toggleClass("mailboxing_si mailboxing_no");
                    }
                    
                });

                /*Concateniamo tutto alla varibile $content */
                $content = $class.append($nomeinputLabel)
                .append($nomeinput)
                .append($cognomeLabel)
                .append($cognomeInput)
                .append($numeroinputLabel)
                .append($numeroinput)
                .append($emailLabel)
                .append($emailInput).append($newsletterlabel).append($newsletterbutton)
                .append($button);

            /*Se cliccato il bottone di invio viene fatta una post al server, prima di effettuarla però viene controllato se l'email e il numero di cellulare siano corretti */
            $button.on("click", function () {

                /*Estraggo i parametri dai tag di input e li memorizzo in delle variabili */
                var nome = $nomeinput.val(),
                    cognome = $cognomeInput.val(),
                    numero = $numeroinput.val(),
                    email = $emailInput.val();

                /*Per controllare che entrambe i due parametri siano corretti dichiaro questi due variabile che possono essere vere o false e opportunamente, in base
                  a quello che inserisco variano */
                var condition1 = false, condition2 = false;

                    /*Controlliamo se l'email è corretta, basta sapere se c'è una @ ed un .*/
                    if(email.includes("@") && email.includes("."))
                    {
                        condition1 = true;
                    }else
                    {
                        window.alert("L'email deve essere nel suo formato corretto! Con una @ ed un .");
                        $emailInput.val("");
                    }

                    /*Per il cellulare devo controllare che la lunghezza sia identica a 10 e che sia composto solo da numeri, per farlo usiamo l'espressione regolare (regex)
                    dove ^ indica l'inizio della stringa, \d indica qualsiasi carattere numerico da 0 a 9, + coincide con uno o più occorrenze del carattere precedente,
                    infine $ rappresenta la fine della stringa. Usiamo quindi il metodo test per verificare se la variabile fornita contiene solo numeri*/

                    if(numero.length===10 && /^\d+$/.test(numero))
                    {
                        condition2 = true;
                    }else{
                        window.alert("Il numero deve avere una lunghezza di 10 cifre e composto solo da numeri!");
                        $numeroinput.val("");

                    }
                    /*Nel caso in cui uno dei due parametri fosse sbagliato viene fatto un avvertimento su finestra dell'errore! */
                    
                    /*Se le due variabili precedenti sono true allora entro in questa sezione per effettuare la post */
                    if(condition1 && condition2)
                    {   
                        /*Dichiaro l'oggetto user contente tutti i parametri forniti */
                        var user = {"nome":nome, "cognome":cognome, "numero":numero, "email":email, "newsletter": conferma};

                        /*Uso il metodo "user" di tipo post offertoci dal server per caricare l'oggetto user*/

                        $.post("user", user, function (result) {
                            
                            /*Se ci fosse già un email registrata verrà notificato a schermo e non verrà registrato nel DB del server questo oggetto passato*/
                            if("ERROREMAIL"===result)
                            {
                                window.alert("Email già registrata");
                                console.log("Email già registrata")
                                $emailInput.val("");
                            }
                            /*Se la registrazione è andata a buon fine ci restituirà il messaggio di SUCCESS e faremo un allert a schermo della avvenuta registrazione*/
                            else if ("SUCCESS"===result){
                                window.alert("Registrazione effettuata correttamente");
                                console.log("Registrazione effettuata correttamente");
                                $nomeinput.val("");
                                $cognomeInput.val("");
                                $numeroinput.val("");
                                $emailInput.val("");
                                $("h1").trigger("click");
                            }else if ("ERROR"===result){
                                window.alert("Qualcosa è andato storto...");
                                console.log("Qualcosa è andato storto...");
                                $nomeinput.val("");
                                $cognomeInput.val("");
                                $numeroinput.val("");
                                $emailInput.val("");
                                $("h1").trigger("click");
                            }

                        });
                    }

                });

                
                /*Concateniamo tutto ciò che c'è in $content ed un h2 con dentro scritto "Registrazione Utente" al container del main*/
                $("main .container").append($("<h2>").text("Registrazione Utente")).append($content);

            }else if($element.parent().is(":nth-child(2)")){
                window.alert("Servizio ancora non disponibile!");
                $("h1").trigger("click");
            }


            return false;
        });
    });


    $("h1").on("click",function(){

        append_homepage();
        
        return false;
    });

    $("footer .newsletterI_D_").on("click",function(){
        window.alert("Servizio ancora non disponibile!");
        return false;
    });


    append_homepage();

};

/*Questa funzione ci permettte di concatenare il codice HTML dell'homepage all'interno del main container*/
function append_homepage(){

    //<div class="ricerca_proprieta_form"><h2>Cerca Proprietà</h2><p>Tipologia:</p><select id="tipologia" name="tipologia"><option value="Affitto">Affitto</option><option value="Vendita">Vendita</option></select><p>Città:</p><input class="citta" placeholder="Inserisci la città"></input><p>CAP:</p><input class="cap" placeholder="Inserisci CAP"></input><p>Numero di vani:</p><input class="nvani" placeholder="Inserisci il numero di vani"></input><p>Email utente:</p><input class="email" placeholder=" Inserisci email utente"></input></div>

    var $indexHTML = '<div class="ricerca_proprieta_form"><h2>Cerca Proprietà</h2><p>Tipologia:</p><select id="tipologia" name="tipologia"><option value="Affitto">Affitto</option><option value="Vendita">Vendita</option></select><p>Città:</p><input class="citta" placeholder="Inserisci la città"></input><p>CAP:</p><input class="cap" placeholder="Inserisci CAP"></input><p>Numero di vani:</p><input class="nvani" placeholder="Inserisci il numero di vani"></input><p>Email utente:</p><input class="email" placeholder=" Inserisci email utente"></input></div>';
    
    /*L'oggetto bottone per la ricerca degli immobili lo creo separatamente in modo tale d'associare correttamente l'evento attuale al bottone*/

    var $button = $("<button>").text("Invio");
    $button = $button.addClass("bottone_ricerca");

    /*Nel caso in cui lo premessero verrà stampato un window allert dicendo che il servizio non è ancora disponibile */
    $button.on("click", function () {
        button_search_immobili();
    });

    $(".registrazione a span").removeClass("active");

    $("main .container").empty();
    $("main .container").append($indexHTML).append($button);

}

function button_search_immobili(){
    window.alert("Servizio ancora non disponibile!");
    return false;
}

$(document).ready(main);

