/*zone header*/
function chrono(tempDeFin){
    let zoneDeTemps = document.getElementById("chrono");
    if(tempDeFin){
        clearInterval(refreshTimer);
        zoneDeTemps.innerHTML = tempPassé(tempDeFin);
    }else{
        zoneDeTemps.innerHTML = tempPassé(new Date());
    }
}
function tempPassé(final){
    //temps entre la valeur "final" et le startTimer (depuis l'arrivée sur cette page) en seconde
    return Math.round((final - startTimer) / 1000);
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
    //Affichage
    document.getElementById("paires").innerHTML = paireTrouvée + " / " + paquet.length;

    //Condition de fin de partie
    if(paireTrouvée == paquet.length){
        let stopTimer = new Date();
        chrono(stopTimer);
        if(!memory){
            memory = {};
        }
        memory["partie"]["paire"] = paireTrouvée
        memory["partie"]["coups"] = nombreCoup;
        memory["partie"]["timer"] = tempPassé(stopTimer);
        memory["partie"]["score"] = 0;
        localStorage.setItem("memory", JSON.stringify(memory));
        setTimeout(()=>{
            window.location.href = "/finDePartie.html";
        },1000);
    }
}

/* zone fonctionnalité du memory */
function vérifierNombreRetournée(checkVictoire){
    let retournée = document.getElementsByClassName("carteRetournée");
    if(retournée.length == 2){
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
/*procédures concernant le retournement des cartes*/
function retournerCarteRevélerDisposition(carte,img,forme,carteValeur){
    

    let faceIntérieure = carte.getElementsByClassName("faceIntérieure")[0];
    let zoneTexte = faceIntérieure.getElementsByClassName("carteZoneTexte")[0];
    let p = zoneTexte.getElementsByTagName("p")[0];

    let padding = 20;
    let maxHeigth = (100 - padding * 1.5 )/2;
    zoneTexte.style.height = (100 - padding * 1.5 )/2 + "%";
    padding = faceIntérieure.clientHeight/6.5 + "px"; 

    switch(carteValeur.couleur){
        case 0 :
            if(carteValeur.valeur % 2 == 0){
                faceIntérieure.appendChild(img);
                zoneTexte.style.paddingTop = padding;
                p.style.marginTop = "auto";
                p.style.paddingTop = "auto";
                p.style.marginBottom = "0px";

                img.style.marginBottom = "0px";
                img.style.marginTop = "auto";
            }
            else{
                faceIntérieure.insertBefore(img, zoneTexte);

                if(forme !== "forme3"){
                    img.style.transform = "scale(-1)";
                    img.style.paddingBottom = padding;
                }
                else{
                    img.style.paddingTop = padding;
                }
                img.style.marginBottom = "0px";
                img.style.marginTop = "auto";
            }
            break;
        case 1 :
            if(carteValeur.valeur % 2 == 0){
                faceIntérieure.appendChild(img);
                zoneTexte.style.paddingTop = padding;

                p.style.marginTop = "auto";
                p.style.paddingTop = "auto";
                p.style.marginBottom = "0px";

                img.style.marginBottom = "0px";
                img.style.marginTop = "auto";
                
                if(forme!=="forme3"){
                    img.style.transform = "scale(-1)";
                }
            }
            else{
                faceIntérieure.insertBefore(img, zoneTexte);

                img.style.paddingTop = padding;
                img.style.marginBottom = "0px";
                img.style.marginTop = "auto";
            }
            break;
        case 2 :
            if(carteValeur.valeur % 2 == 1){
                faceIntérieure.appendChild(img);
                zoneTexte.style.paddingTop = padding;

                p.style.marginTop = "auto";
                p.style.paddingTop = "auto";
                p.style.marginBottom = "0px";

                img.style.marginBottom = "0px";
                img.style.marginTop = "auto";

                if(forme !== "forme3"){
                    img.style.transform = "scale(-1)";
                }
            }
            else{
                faceIntérieure.insertBefore(img, zoneTexte);

                img.style.paddingTop = padding;
                img.style.marginBottom = "0px";
                img.style.marginTop = "auto";
            }
            break;
        case 3 :
            if(carteValeur.valeur % 2 == 1){
                faceIntérieure.appendChild(img);
                zoneTexte.style.paddingTop = padding;
                p.style.marginTop = "auto";
                p.style.paddingTop = "auto";
                p.style.marginBottom = "0px";

                img.style.marginBottom = "0px";
                img.style.marginTop = "auto";

                if(forme !== "forme3"){
                    img.style.transform = "scale(-1)";
                }
            }
            else{
                faceIntérieure.insertBefore(img, zoneTexte);

                img.style.paddingTop = padding;
                img.style.marginBottom = "0px";
                img.style.marginTop = "auto";
            }
            break;
    }
    //source image
    img.src = "../assets/formes/" + forme + carteValeur.couleur + ".png";
    //gestion de la taille
    let maxWidth = (img.width) / (img.height / maxHeigth);
    img.style.height = maxHeigth + "%"; 
    img.style.width = maxWidth;     
}
function retournerCarteRevéler(carte){
    let memoryPréférence = memory.préférence;
    let imageDosSrc = memoryPréférence.dos;

    //pour l'image en fond (dos ou face de carte)
    
    let image = new Image();
    image.src = imageDosSrc;
    
    carte.setAttribute("class",carte.getAttribute("class").replace("carteCachée","carteRetournée"));
            
    let carteValeur = cartePosée[carte.id.replace("carte","")];

    let faceIntérieure = carte.getElementsByClassName("faceIntérieure")[0];
    let zoneTexte = faceIntérieure.getElementsByClassName("carteZoneTexte")[0];
    let p = zoneTexte.getElementsByTagName("p")[0];
    p.innerHTML = carteValeur.valeur; 

    p.setAttribute("class","fontClasse"+memoryPréférence.font);

    let img = document.createElement("img");
    img.setAttribute("class","couleur");

    let forme = "forme1";
    if(memoryPréférence.forme){
        forme = memoryPréférence.forme;
    }

    retournerCarteRevélerDisposition(carte,img,forme,carteValeur);

    
}
function retournerCarteCacher(carte){
    let memoryPréférence = memory.préférence;
    let imageDosSrc = memoryPréférence.dos;

    //pour l'image en fond (dos ou face de carte)
    let image = new Image();
    image.src = imageDosSrc;

    carte.setAttribute("class",carte.getAttribute("class").replace("carteRetournée","carteCachée"));
    
    let faceIntérieure = carte.getElementsByClassName("faceIntérieure")[0];
    let img = faceIntérieure.querySelector('img');
    //cacher valeur de la carte
    faceIntérieure.querySelector('p').innerHTML = "";
    faceIntérieure.removeChild(carte.querySelector('img'));
}
function retournerCarte(carte){

    if(carte.getAttribute("class").includes("carteCachée")){
        retournerCarteRevéler(carte);
    }
    else if (carte.getAttribute("class").includes("carteRetournée")){
        retournerCarteCacher(carte);
    }
}
/*procédure déclencheur d'action depuis un clique sur une carte*/
function choisirCarte(carte){
    vérifierNombreRetournée();
    if(!carte.getAttribute("class").includes("paireTrouvée")){
        majNbCoup();
    }
    retournerCarte(carte);
    vérifierNombreRetournée(true);
}
/*première gestion paquet*/
function affichageCarte(){
    
    let memoryPréférence = memory.préférence;

    let imageDosSrc = memoryPréférence.dos;
    let imageFaceSrc = memoryPréférence.face;

    let zoneDeJeu = document.getElementById("jeu");
    let limiteParRangée = 4;

    if(cartePosée.length >= 32){
        limiteParRangée = 8;
    }
    for(let i = 0 ; i < cartePosée.length ; i++){
        let rangée;
        if(i % limiteParRangée == 0){
            rangée = document.createElement("section");
            rangée.setAttribute("class","rangéeCartes flex-horizontal-espace");
            zoneDeJeu.appendChild(rangée);
        }
        else{
            let divs = zoneDeJeu.getElementsByClassName("rangéeCartes");
            rangée = divs[divs.length - 1];
        }
        let carte = document.createElement("div");
        carte.id = "carte" + i;
        carte.setAttribute("class","carte carteCachée");

        let contenu = document.createElement("div");
        contenu.setAttribute("class", "contenuCarte");
        carte.appendChild(contenu);


        let intérieure = document.createElement("div");
        intérieure.setAttribute("class", "faceIntérieure");
        intérieure.style.backgroundImage = "url('" + imageFaceSrc + "')";
        contenu.appendChild(intérieure);
        
        let extérieure = document.createElement("div");
        extérieure.setAttribute("class", "faceExtérieure");
        extérieure.style.backgroundImage = "url('" + imageDosSrc + "')";
        contenu.appendChild(extérieure);

        let zoneTexte = document.createElement("div");
        zoneTexte.setAttribute("class", "carteZoneTexte");
        intérieure.appendChild(zoneTexte);

        let p = document.createElement("p");
        zoneTexte.appendChild(p);

        carte.setAttribute("onclick", "choisirCarte(" + carte.id + ")");
        rangée.appendChild(carte);
    }

    //chargement rapide des images
    //!important pour les effets
    let forme = "forme1";
    if(memoryPréférence.forme){
        forme = memoryPréférence.forme;
    }
    for(let i = 0 ; i < 4 ; i++){
        let image = new Image();
        image.src = "../assets/formes/" + forme + i + ".png";
        image.onload = () => {}
    }
}
function mélangerCarte(){
    let listeCarteRestantePaquet =[];
    let indiceDisponible = [];
    for(let i = 0 ; i < paquet.length ; i++){
        listeCarteRestantePaquet.push(2);
        indiceDisponible.push(i);
    }
    while (listeCarteRestantePaquet.filter(value => value > 0).length > 0){
        let random = indiceDisponible[Math.floor(Math.random() * indiceDisponible.length)];

        listeCarteRestantePaquet[random] = listeCarteRestantePaquet[random] - 1;
        if(listeCarteRestantePaquet[random] <= 0){
            indiceDisponible = indiceDisponible.filter(value => value != random);
        }
        cartePosée.push(paquet[random]);
    }
}
function préparerPaquet(){
    let maxCouleur = 0;
    let maxValeur = 4;
    switch(memory.partie.difficulté){
        case 0: 
            maxCouleur = 1;
            break;
        case 1: 
            maxCouleur = 2;
            break;
        case 2: 
            maxCouleur = 4;
            break;

    }
    for(let valeur = 0 ; valeur < maxValeur ; valeur++){
        for(let couleur = 0 ; couleur < maxCouleur ; couleur++){
            let carte = { "couleur" : "0"};
            carte.valeur = valeur + 1;
            carte.couleur = couleur;
            paquet.push(carte);
        }
    }
}

/*départ*/
function start(){
    préparerPaquet();
    mélangerCarte();
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

//todo check pour transition sur le texte