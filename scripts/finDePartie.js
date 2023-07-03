
function comparaisonNombrePourTri(a, b) {
    return  b.score - a.score;
}
function calculScore(partie){
    let valeurFinal = calsulScoreBase(partie);
    valeurFinal -= calculScoreMalusCoup(partie);
    valeurFinal -= calculScoreMalusTemps(partie);
    return Math.floor(valeurFinal);
}
function calsulScoreBase(partie){
    return partie.paire * partie.paire * partie.paire;
}
function calculScoreMalusCoup(partie){
    return partie.coups ;
}
function calculScoreMalusTemps(partie){
    return Math.round(partie.timer);
}

function ajoutAuClassement(){

    if (!memory.classement){
        memory["classement"] =[];
    }

    if(memory.partie.score == 0){
        
        memory.partie.score = calculScore(memory.partie);
        let pseudo = memory.partie.pseudo;

        let scoreActuelle = {
            "pseudo" : pseudo,
            "score" : memory.partie.score
        }

        if (memory.classement.length==0){
            
            memory.classement.push(scoreActuelle);
        }
        else{
            if(memory.classement.length<10){
                memory.classement.push(scoreActuelle);
            }
            else{
                memory.classement.push(scoreActuelle);
                memory.classement = memory.classement.sort(comparaisonNombrePourTri).slice(0, 10);
            }
        }
    }
    localStorage.setItem("memory",JSON.stringify(memory));
}
function ajoutDeLigne(étape){
    //max 3 étapes
    let ligne = document.createElement("tr");
    let td1 =document.createElement("td");
    ligne.appendChild(td1);

    let texte = obtenirEtapeCalculScore(étape).toString();
    let tailleTexte = Math.round(texte.length/2.5) <=1 ? Math.round(texte.length/2.5) : 1;

    let intervalTexte = setInterval(()=>{
        td1.innerHTML = texte.substring(0,td1.innerHTML.length + tailleTexte);
        if(td1.innerHTML == texte){
            clearInterval(intervalTexte);
        }

    },20);

    //to-do faire de vrai ligne
    td1.innerHTML = étape
    return ligne
}
function obtenirEtapeCalculScore(étape){
    let texte;

    switch(étape){
        case 1 :
            texte = "base selon la difficulté : "+calsulScoreBase(memory.partie);
            break;
        case 2 :
            texte = "malus lié au nombre de coups :     - "+calculScoreMalusCoup(memory.partie);
            break;
        case 3 : 
            texte = "malus lié au temps de partie :     - "+calculScoreMalusTemps(memory.partie);
            break;
        case 4 :
             texte= "Score final : "+calculScore(memory.partie);
             break;

    }
    return texte;
}
function demandePseudo(){
    document.getElementById("demandePseudo").style.visibility ="visible";
}
function validerPseudo(){
    let pseudo = document.forms["demandePseudo"]["inputPseudo"].value;
    console.log(pseudo);
    if(!pseudo || pseudo == ""){
        document.forms["demandePseudo"]["inputPseudo"].placeholder = "ça manque de valeur"
    }
    else{
        memory.partie["pseudo"] = pseudo;
        localStorage.setItem("memory",JSON.stringify(memory));
        ajoutAuClassement();
        retourAuMenu();
    }
    return false;
}
function retourAuMenu(){
    let cheminMenu = "./index.html"
    //window.location.href = cheminMenu;
    window.location.replace(cheminMenu);
}


function start(){
    let étape =0;
    let limiteEtape = 4;
    let intervalDétail = setInterval(()=>{
        étape++;
        if(étape <= limiteEtape){
            détails.appendChild(ajoutDeLigne(étape));
        }else if(étape == limiteEtape+1){
            clearInterval(intervalDétail);
            if(memory.classement && memory.classement.length >= 10 && calculScore(memory.partie)<= memory.classement[9].score){
                document.getElementById("retourMenu").style.visibility = "Visible";
            }
            else{
                demandePseudo();
            }
        }
    },1000);
}


let memory = JSON.parse(localStorage.getItem("memory"));
start();
