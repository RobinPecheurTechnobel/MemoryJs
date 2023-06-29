/*zone header*/
function chrono(value){
    let zoneDeTemps = document.getElementById("chrono");
    if(value){
        clearInterval(refreshTimer);
        zoneDeTemps.innerHTML = timer(value);
    }else{
        zoneDeTemps.innerHTML = timer(new Date());
    }
}
function timer(final){
    return Math.round((final - startTimer)/1000);
}
function majNbCoup(value){
    if(Number.isInteger(value)){
        nombreCoup = value;
    }
    else{
        nombreCoup++;
    }
    document.getElementById("nbCoup").innerHTML = nombreCoup;
}
function majPaireTrouvée(value){
    if(Number.isInteger(value)){
        paireTrouvée = value;
    }
    else{
        paireTrouvée++;
    }
    document.getElementById("paires").innerHTML = paireTrouvée+" / "+paquet.length;
    //Condition de fin de partie
    if(paireTrouvée == paquet.length){
        let stopTimer = new Date();
        chrono(stopTimer);
        if(!memory){
            memory = {};
        }
        memory["partie"]["paire"] = paireTrouvée
        memory["partie"]["coups"] = nombreCoup;
        memory["partie"]["timer"] = timer(stopTimer);
        memory["partie"]["score"] = 0;
        localStorage.setItem("memory", JSON.stringify(memory));
        window.location.href = "/index.html";
    }
}

/* zone fonctionnalité du memory */
function préparerPaquet(){
    let maxCouleur=0;
    let mexValeur=4;
    switch(memory.partie.difficulté){
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
        let rangée;
        if(i%limiteParRangée==0){
            rangée = document.createElement("section");
            rangée.setAttribute("class","rangéeCartes flex-horizontal-espace");
            zoneDeJeu.appendChild(rangée);
        }
        else{
            let divs = zoneDeJeu.getElementsByClassName("rangéeCartes");
            rangée = divs[divs.length-1];
        }
        let carte = document.createElement("div");
        carte.id = "carte"+i;
        carte.setAttribute("class","carte carteCachée");
        carte.setAttribute("onclick", "choisirCarte("+carte.id+")");
        rangée.appendChild(carte);

        let img = document.createElement("img");
        carte.appendChild(img);
        img.src = "../assets/dos-carte-chartreuse-1.png";


    }
}
function choisirCarte(carte){
    vérifierNombreRetournée();
    if(!carte.getAttribute("class").includes("paireTrouvée")){
        majNbCoup();
    }
    retournerCarte(carte);
    vérifierNombreRetournée(true);
}
function retournerCarte(carte){
    
    let img = carte.getElementsByTagName("img")[0];

    if(carte.getAttribute("class").includes("carteCachée")){
        
        let carteValeur = cartePosée[carte.id.replace("carte","")];

        let p = document.createElement("p");
        p.innerHTML = carteValeur.valeur;
        p.style.maxHeight = "50%";
        
        img.style.maxHeight = "50%";
        img.style.margin ="auto";
        
        switch(carteValeur.couleur){
            case "coeur" :
                if(carteValeur.valeur%2 ==0){
                    carte.insertBefore(p, carte.firstChild);
                }
                else{
                    carte.appendChild(p);
                    img.style.transform = "scale(-1)";
                }
                img.src = "../assets/coeur.png";
                break;
            case "pique" :
                if(carteValeur.valeur%2 ==0){
                    carte.insertBefore(p, carte.firstChild);
                    img.style.transform = "scale(-1)";
                }
                else{
                    carte.appendChild(p);
                }
                img.src = "../assets/pique.png";
                break;
            case "carreau" :
                if(carteValeur.valeur%2 ==1){
                    carte.insertBefore(p, carte.firstChild);
                }
                else{
                    carte.appendChild(p);
                }
                img.src = "../assets/carreau.png";
                break;
            case "trefle" :
                if(carteValeur.valeur%2 ==1){
                    carte.insertBefore(p, carte.firstChild);
                    img.style.transform = "scale(-1)";
                }
                else{
                    carte.appendChild(p);
                }
                img.src = "../assets/trefle.png";
                break;
        }
        
        carte.setAttribute("class",carte.getAttribute("class").replace("carteCachée","carteRetournée"));
    }
    else if (carte.getAttribute("class").includes("carteRetournée")){
        img.src = "../assets/dos-carte-chartreuse-1.png";
        img.style ="";

        let p = carte.getElementsByTagName("p")[0];
        p.parentElement.removeChild(p);
        
        carte.setAttribute("class",carte.getAttribute("class").replace("carteRetournée","carteCachée"));
    }

}
function vérifierNombreRetournée(checkVictoire){
    let retournée = document.getElementsByClassName("carteRetournée");
    if(retournée.length==2){
        id1 = retournée[0].id;
        id2 = retournée[1].id;  
        if(cartePosée[id1.replace("carte","")].valeur == cartePosée[id2.replace("carte","")].valeur &&
        cartePosée[id1.replace("carte","")].couleur == cartePosée[id2.replace("carte","")].couleur){
            majPaireTrouvée();
            changeClassCarte(retournée[1],"carteRetournée","paireTrouvée");
            changeClassCarte(retournée[0],"carteRetournée","paireTrouvée");
        }
        else{
            if(!checkVictoire){
                retournerCarte(retournée[1]);
                retournerCarte(retournée[0]);
            }
        }
    }
}
function changeClassCarte(carte,classeAvant,classeAprès){
    carte.setAttribute("class",carte.getAttribute("class").replace(classeAvant,classeAprès));

}
function start(){
    préparerPaquet();
    mélangéCarte();
    affichageCarte();
    majNbCoup(0);
    majPaireTrouvée(0);
}

/* Main */
let paireTrouvée;
let nombreCoup;
let memory = JSON.parse(localStorage.getItem("memory"));
let startTimer = new Date();
let refreshTimer = setInterval(
    () =>{
        chrono()
    },1000);
let paquet = [];
let cartePosée = [];
start();