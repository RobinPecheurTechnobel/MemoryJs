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
        setTimeout(()=>{
            window.location.href = "/finDePartie.html";
        },1000);
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
            carte.couleur = couleur;
            paquet.push(carte);
        }
    }
}
function mélangerCarte(){
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
    
    let memoryPréférence = memory.préférence;
    let zoneDeJeu = document.getElementById("jeu");
    let limiteParRangée = 4;

    if(cartePosée.length>=32){
        limiteParRangée =8;
    }
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
        
        let imageDosSrc = memoryPréférence.dos;

        carte.style.backgroundImage = "url('"+imageDosSrc+"')"; 
        carte.setAttribute("onclick", "choisirCarte("+carte.id+")");
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
        image.src = "../assets/formes/"+forme+i+".png";
        image.onload = () => {}
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
function retournerCarteRevéler(carte, tempsAnimation, interinterval ,memoryPréférence){

    let imageDosSrc = memoryPréférence.dos;
    let imageFaceSrc = memoryPréférence.face;

    //pour l'image en fond (dos ou face de carte)
    let image = new Image();
    image.src = imageDosSrc;

    let pourcentReel = image.width/image.height*100;
    let vitesse = pourcentReel / (tempsAnimation/interinterval);
    let pourcent = pourcentReel;
    
    carte.setAttribute("class",carte.getAttribute("class").replace("carteCachée","carteRetournée"));
    let intervalAnimation = setInterval(()=>{
        pourcent -=  vitesse;
        carte.style.backgroundSize = pourcent+"% 100%";
        if(pourcent <=0){
            clearInterval(intervalAnimation);
            
            let carteValeur = cartePosée[carte.id.replace("carte","")];
    
            //img.src = "../assets/face-carte-chartreuse-1.png";
    
            let p = document.createElement("p");
            p.innerHTML = carteValeur.valeur;
            p.style.color = "rgb(255,255,255)";
            
            let img2 = document.createElement("img");
            carte.appendChild(img2);
            img2.setAttribute("class","couleur");
            img2.style.width = "0%";
            
            
            let forme = "forme1";
            if(memoryPréférence.forme){
                forme = memoryPréférence.forme;
            }

            let src;
            image = new Image();

            switch(carteValeur.couleur){
                case 0 :
                    if(carteValeur.valeur % 2 ==0){
                        carte.insertBefore(p, carte.firstChild);

                        p.style.marginBottom = "0px";
                        p.style.marginTop = "auto";

                        img2.style.marginBottom = "auto";
                        img2.style.marginTop = "0px";
                    }
                    else{
                        carte.appendChild(p);

                        p.style.marginBottom = "auto";
                        p.style.marginTop = "0px";

                        if(forme!=="forme3"){
                            img2.style.transform = "scale(-1)";
                        }
                        img2.style.marginBottom = "0px";
                        img2.style.marginTop = "auto";
                    }
                    src = "../assets/formes/"+forme+carteValeur.couleur+".png";
                    img2.src = src;
                    image.src = src;
                    break;
                case 1 :
                    if(carteValeur.valeur % 2 ==0){
                        carte.insertBefore(p, carte.firstChild);

                        p.style.marginBottom = "0px";
                        p.style.marginTop = "auto";
                        
                        if(forme!=="forme3"){
                            img2.style.transform = "scale(-1)";
                        }
                        img2.style.marginBottom = "auto";
                        img2.style.marginTop = "0px";
                    }
                    else{
                        carte.appendChild(p);

                        p.style.marginBottom = "auto";
                        p.style.marginTop = "0px";

                        img2.style.marginBottom = "0px";
                        img2.style.marginTop = "auto";
                    }
                    src = "../assets/formes/"+forme+carteValeur.couleur+".png";
                    img2.src = src;
                    image.src = src;
                    break;
                case 2 :
                    if(carteValeur.valeur % 2 ==1){
                        carte.insertBefore(p, carte.firstChild);

                        p.style.marginBottom = "0px";
                        p.style.marginTop = "auto";

                        if(forme!=="forme3"){
                            img2.style.transform = "scale(-1)";
                        }
                        img2.style.marginBottom = "auto";
                        img2.style.marginTop = "0px";
                    }
                    else{
                        carte.appendChild(p);

                        p.style.marginBottom = "auto";
                        p.style.marginTop = "0px";

                        img2.style.marginBottom = "0px";
                        img2.style.marginTop = "auto";
                    }
                    src = "../assets/formes/"+forme+carteValeur.couleur+".png";
                    img2.src = src;
                    image.src = src;
                    break;
                case 3 :
                    if(carteValeur.valeur%2 ==1){
                        carte.insertBefore(p, carte.firstChild);

                        p.style.marginBottom = "0px";
                        p.style.marginTop = "auto";

                        if(forme!=="forme3"){
                            img2.style.transform = "scale(-1)";
                        }
                        img2.style.marginBottom = "auto";
                        img2.style.marginTop = "0px";
                    }
                    else{
                        carte.appendChild(p);

                        p.style.marginBottom = "auto";
                        p.style.marginTop = "0px";

                        img2.style.marginBottom = "0px";
                        img2.style.marginTop = "auto";
                    }
                    src = "../assets/formes/"+forme+carteValeur.couleur+".png";
                    img2.src = src;
                    image.src = src;
                    break;
            }
            
            //couleur pour la font de la valeur
            let green = 255;
            let vertActuelle=green;

            let maxWidth = (image.width)/(image.height/45);

            /**/
            carte.style.backgroundImage = "url('"+imageFaceSrc+"')"; 
            intervalAnimation = setInterval(()=>{
                pourcent += vitesse;
                carte.style.backgroundSize = pourcent+"% 100%";
                vertActuelle -= green/(tempsAnimation/interinterval);
                p.style.color = "rgb("+vertActuelle+","+vertActuelle+","+vertActuelle+")";

                img2.style.width =  Math.round(Number(img2.style.width.replace("%","")) + Number(maxWidth/(tempsAnimation/interinterval)))+"%";
                img2.style.height = "45%";   
                if(pourcent >= pourcentReel){
                    clearInterval(intervalAnimation);
                    img2.style.width = maxWidth+"%";
                    p.style.color = "rgb(0,0,0)";
                }
            },interinterval);
            //img.style.left = ((window.innerWidth-450)/52.70+0.6)+"px";
        }
    },interinterval);        
}
function retournerCarteCacher(carte, tempsAnimation, interinterval ,memoryPréférence){
    
    let imageDosSrc = memoryPréférence.dos;

    //pour l'image en fond (dos ou face de carte)
    let image = new Image();
    image.src = imageDosSrc;

    let pourcentReel = image.width/image.height*100;
    let vitesse = pourcentReel / (tempsAnimation/interinterval);
    let pourcent = pourcentReel;

    carte.setAttribute("class",carte.getAttribute("class").replace("carteRetournée","carteCachée"));
        //tentative de faire changer la taille du texte
        let p = carte.getElementsByTagName("p")[0];
        let psize = 50;
        p.style.fontSize = psize;

        let img = carte.querySelector('img');
        let tailleImage = 45;

        //couleur pour la font de la valeur
        let green = 255;
        let vertActuelle=0;
        //forme
        image = new Image();
        image.src = img.src;
        let maxWidth = (image.width)/(image.height/45);

        let intervalAnimation = setInterval(()=>{
            pourcent -=  vitesse;
            carte.style.backgroundSize = pourcent+"% 100%";
            //tentative de faire changer la taille du texte
            vertActuelle = vertActuelle + green/(tempsAnimation/interinterval);
            p.style.color = "rgb("+Math.round(vertActuelle)+","+Math.round(vertActuelle)+","+Math.round(vertActuelle)+")";

            img.style.width =  Math.round(Number(img.style.width.replace("%","")) - Number(maxWidth/(tempsAnimation/interinterval)))+"%";
            img.style.height = "45%";
            if(pourcent <=10){
                clearInterval(intervalAnimation);
                carte.removeChild(carte.querySelector('img'));
                carte.removeChild(p);
                
                carte.style.backgroundImage = "url('"+imageDosSrc+"')"; 
                intervalAnimation = setInterval(()=>{
                    pourcent += vitesse;
                    carte.style.backgroundSize = pourcent+"% 100%";
                    if(pourcent >= pourcentReel){
                        clearInterval(intervalAnimation);
                    }
                },interinterval);
            }
        },interinterval);
}
function retournerCarte(carte){

    let interinterval = 25;
    let tempsAnimation = 175;
    let memoryPréférence = memory.préférence;

    if(carte.getAttribute("class").includes("carteCachée")){
        retournerCarteRevéler(carte, tempsAnimation, interinterval, memoryPréférence);
    }
    else if (carte.getAttribute("class").includes("carteRetournée")){
        retournerCarteCacher(carte, tempsAnimation, interinterval, memoryPréférence);
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