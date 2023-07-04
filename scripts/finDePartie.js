
/* Zone calcul final*/
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

//fnction pour le tri dans le tableau du classement
function comparaisonNombrePourTri(a, b) {
    return  b.score - a.score;
}
function ajoutAuClassement(){
    let memory = JSON.parse(localStorage.getItem("memory"));

    //création classement (un tableau)
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

        //ajoute le score au classement
        memory.classement.push(scoreActuelle);
        //garde les 10 meilleurs
        memory.classement = memory.classement.sort(comparaisonNombrePourTri).slice(0, 10);
    }
    localStorage.setItem("memory",JSON.stringify(memory));
}
function ajoutDeLigne(étape){
    //max 3 étapes
    let ligne = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    ligne.appendChild(td1);
    ligne.appendChild(td2);

    let texte = obtenirEtapeCalculScore(étape).toString();
    let textePart1 = texte.split('*')[0];
    let textePart2 = texte.split('*')[1];
    let tailleTexte = Math.round(texte.length/2.5) <=1 ? Math.round(texte.length/2.5) : 1;

    if(texte.includes("Score final")){
        ligne.style.fontSize = "25px";
        ligne.style.fontWeight = "200";
    }

    let intervalTexte = setInterval(()=>{
        td1.innerHTML = textePart1.substring(0,td1.innerHTML.length + tailleTexte);
        if(td1.innerHTML == textePart1){
            td2.innerHTML = textePart2.substring(0,td2.innerHTML.length + tailleTexte);
            if(td2.innerHTML == textePart2){
                clearInterval(intervalTexte);
            }
        }
    },20);

    //to-do faire de vrai ligne
    td1.innerHTML = étape
    return ligne
}
function obtenirEtapeCalculScore(étape){
    
    let memory = JSON.parse(localStorage.getItem("memory"));
    let texte;

    switch(étape){
        case 1 :
            texte = "base selon la difficulté :* "+calsulScoreBase(memory.partie);
            break;
        case 2 :
            texte = "malus lié au nombre de coups :*     - "+calculScoreMalusCoup(memory.partie);
            break;
        case 3 : 
            texte = "malus lié au temps de partie :*     - "+calculScoreMalusTemps(memory.partie);
            break;
        case 4 :
             texte= "Score final :* "+calculScore(memory.partie);
             break;
    }
    return texte;
}
function demandePseudo(){
    document.getElementById("zoneDemandePseudo").style.visibility ="visible";
}
function validerPseudo(){
    let memory = JSON.parse(localStorage.getItem("memory"));

    let pseudo = document.forms["demandePseudo"]["inputPseudo"].value;
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
    let memory = JSON.parse(localStorage.getItem("memory"));

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

start();
