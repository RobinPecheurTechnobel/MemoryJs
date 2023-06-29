
function comparaisonNombrePourTri(a, b) {
    return  b.score - a.score;
}
function calculScore(partie){
    let valeurFinal = partie.paire * partie.paire * partie.paire;
    console.log(valeurFinal);
    valeurFinal /= ( partie.coups / 20 );
    console.log(valeurFinal);
    valeurFinal /= (1+ (partie.timer / 50));
    console.log(valeurFinal);
    return Math.floor(valeurFinal);
}
function checkPartie(){

    let memory = JSON.parse(localStorage.getItem("memory"));
    if(memory.partie.score == 0){
        
        memory.partie.score = calculScore(memory.partie);
        let pseudo = "Alan Smithee"+memory.classement.length;

        let scoreActuelle = {
            "pseudo" : pseudo,
            "score" : memory.partie.score
        }

        if (!memory.classement || memory.classement.length==0){
            memory["classement"] =[];
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

    //to-do faire de vrai ligne
    td1.innerHTML = étape
    return ligne
}
function enregistrerPseudo(){
    //to-do
    //localstorage
    //redirection
    window.location.href = "/index.html";
}
function demandePseudo(){
    document.getElementById("demandePseudo").style.visibility ="visible";
}
function start(){
    let détail =document.getElementById("détails");
    let étape =0;
    let limiteEtape = 3;
    let intervalDétail = setInterval(()=>{
        étape++;
        if(étape<=limiteEtape){
            détails.appendChild(ajoutDeLigne(étape));
        }else if(étape<=limiteEtape+1){
            clearInterval(intervalDétail);
            demandePseudo();
        }

    },1000);

    entréePseudo();
}
checkPartie();
start();
