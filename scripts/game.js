function chrono(){
    let zoneDeTemps = document.getElementById("chrono");
    zoneDeTemps.innerHTML = timer(new Date());
}
function timer(final){
    return Math.round((final - startTimer)/1000);
}
function retourMenu(){
    let stopTimer = new Date();
    if(!memory){
        memory = {};
        memory["partieEnCours"]["timer"] = timer(stopTimer);
        localStorage.setItem("memory", JSON.stringify(memory));
    }
    else{
        memory["partieEnCours"]["timer"] = timer(stopTimer);
        localStorage.setItem("memory", JSON.stringify(memory));
    }
    window.location.href = "/index.html";
}
function préparerPaquet(){
    let maxCouleur=0;
    let mexValeur=4;
    switch(memory.partieEnCours.difficulté){
        case 0: 
            maxCouleur =1;
            break;
        case 1: 
            maxCouleur =2;
            break;
        case 2: 
            maxCouleur =4;
            break;

    }
    for(let valeur = 0 ; valeur<mexValeur;valeur++){
        for(let couleur = 0; couleur<maxCouleur;couleur++){
            let carte = { "couleur" : "0"};
            carte.valeur = valeur+1;
            switch(couleur){
                case 0 :
                    carte.couleur = "coeur";
                    break;
                case 1 :
                    carte.couleur = "pique";
                    break;
                case 2 :
                    carte.couleur = "carreau";
                    break;
                case 3 :
                    carte.couleur = "trefle";
                    break;
            }
            paquet.push(carte);
        }
    }
}
function mélangéCarte(){
    let listeCarteRestantePaquet =[];
    let indiceDisponible = [];
    for(let i = 0; i < paquet.length; i++){
        listeCarteRestantePaquet.push(2);
        indiceDisponible.push(i);
    }
    while (listeCarteRestantePaquet.filter(value => value>0).length>0){
        let random = indiceDisponible[Math.floor(Math.random() * indiceDisponible.length)];

        listeCarteRestantePaquet[random] = listeCarteRestantePaquet[random]-1;
        if(listeCarteRestantePaquet[random]<=0){
            indiceDisponible = indiceDisponible.filter(value => value != random);
        }
        cartePosée.push(paquet[random]);
    }
}
function affichageCarte(){
    let zoneDeJeu = document.getElementById("jeu");
    let limiteParRangée = 4;
    for(let i = 0 ; i< cartePosée.length;i++){
        let div;
        if(i%limiteParRangée==0){
            div = document.createElement("div");
            div.setAttribute("class","flex-horizontal-espace");
            zoneDeJeu.appendChild(div);
        }
        else{
            let divs = zoneDeJeu.getElementsByTagName("div");
            div = divs[divs.length-1];
        }
        let p = document.createElement("p");
        div.appendChild(p);
        p.innerHTML = cartePosée[i].valeur+" "+cartePosée[i].couleur;
    }

}
function start(){
    préparerPaquet();
    mélangéCarte();
    affichageCarte();
    //temp
    //affichage stat
    document.getElementById("paires").innerHTML = paireTrouvé+" / "+paquet.length;
    document.getElementById("nbCoup").innerHTML = nombreCoup;
}
let paireTrouvé = 0;
let nombreCoup = 0;
let memory = JSON.parse(localStorage.getItem("memory"));
let startTimer = new Date();
let refreshTimer = setInterval(
    () =>{
        chrono()
    },1000);
let paquet = [];
let cartePosée = [];
start();
/*clubs, diamonds, hearts and spades*/