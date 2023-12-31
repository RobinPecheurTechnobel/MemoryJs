// CHECK IF IMAGE EXISTS
function checkIfImageExists(url, callback) {
    const img = new Image();
    img.src = url;
    
    if (img.complete) {
      callback(true);
    } else {
      img.onload = () => {
        callback(true);
      };
      
      img.onerror = () => {
        callback(false);
      };
    }
  }
function createMemory(){
    //localstorage -> memory
    let memory = JSON.parse(localStorage.getItem("memory"));
    //memory?
    if(!memory){
        memory={}
    }
    //memory!
    //memory.partie
    if(!memory.partie){
        let partie = {"difficulté": 0};
        memory["partie"] = partie;
    }
    //memory.préférence
    memory["préférence"] = createMemoryPreference();

    //memory -> localstorage
    localStorage.setItem("memory",JSON.stringify(memory));
    return memory;
}
function createMemoryPreference(){
    let imageDos = document.getElementById("dosDeCarte");
    let urlDos = imageDos.src.substring(imageDos.src.indexOf("/asset"),imageDos.src.length);

    let imageForme = document.getElementById("formeCarte");
    let forme = "forme" + imageForme.src.split("/formes/forme")[1].split(".png")[0][0];
    let préférence = {
        "dos" : ".."+urlDos, 
        "face" : ".."+urlDos.replace("dos","face").replace("gif","png"),
        "forme" : forme,
        "font" : document.getElementById("aperçuFont").style.fontFamily.replaceAll('"','')
    };
    return préférence;
}

function  goGame(difficulté){

    let memory = createMemory();

    memory.partie.difficulté =difficulté;
    if(memory.partie.timer){
        delete memory.partie.timer
    }

    localStorage.setItem("memory",JSON.stringify(memory));

    clearInterval(intervalAperçu);

    window.location.href = "/memory.html";
}
function dosCartePreference(){

    let memory = createMemory();

    let image = document.getElementById("dosDeCarte");

    let url = image.src.substring(image.src.indexOf("/asset"),image.src.length);

    let indexDansUrl = url.split("-chartreuse-")[1].split(".")[0];
    indexDansUrl = Number(indexDansUrl)+1;
    
    url = image.src.substring(image.src.indexOf("/asset"),image.src.length).replace("-"+(Number(indexDansUrl)-1)+".","-"+indexDansUrl+".");
    url = url.replace(".gif",".png");

    checkIfImageExists(url,(exists)=>{
        if(!exists){
            url = url.replace(".png",".gif");
            checkIfImageExists(url,(exists)=>{
                if(!exists){
                    
                    url = image.src.substring(image.src.indexOf("/asset"),image.src.length).replace("-"+(Number(indexDansUrl)-1)+".","-"+1+".");
                    url = url.replace(".gif",".png");
                    image.src = url;

                    memory["préférence"] = createMemoryPreference();
            
                    localStorage.setItem("memory",JSON.stringify(memory));
                }
                else{
                    image.src = url;

                    memory["préférence"] = createMemoryPreference();
            
                    localStorage.setItem("memory",JSON.stringify(memory));
                }//todo trnasfert préférence de gif
            });
        }
        else{

            image.src = url;

            memory["préférence"] = createMemoryPreference();
    
            localStorage.setItem("memory",JSON.stringify(memory));
        }
    });
}
function policePreference(){
    let value = document.getElementById("aperçuFont").style.fontFamily.replaceAll('"','');

    let indexPolice = value === '0'? 0 : parseInt(value); 
    indexPolice++;
    if(indexPolice > 3){
        indexPolice = 0;
    }
    document.getElementById("aperçuFont").style = "font-Family : '" + indexPolice + "'";

    createMemory();
}
function formePreference(){
    
    let imageForme = document.getElementById("formeCarte");
    let indexForme = imageForme.src.split("/formes/")[1].split("forme")[1].split(".png")[0];
    let url = imageForme.src.replace("forme"+indexForme[0],"forme"+(Number(indexForme[0])+1));

    checkIfImageExists(url,(exists)=>{
        if(exists){
            imageForme.src = imageForme.src.replace("forme"+indexForme[0],"forme"+(Number(indexForme[0])+1));
            createMemory();
        }
        else{
            url = imageForme.src.replace("forme"+indexForme[0],"forme1");
            imageForme.src = url;
            createMemory();
        }
    });
}

function replissageClassement(){
    
    let memory = createMemory();
    
    let tableauClassement = document.getElementById("classement");
    if(!memory.classement || classement.length == 0){
        let zoneClassement = document.getElementById("zoneClassement");
        zoneClassement.removeChild(tableauClassement);
        
        let p = document.createElement("p");
        zoneClassement.appendChild(p)
        p.innerHTML = "Il n'y a pas encore de score enregistré.";
    }
    else{
        tbody = tableauClassement.getElementsByTagName("tbody")[0];
        let classement = memory.classement;

        for (const valeur of classement) {
            let tr = document.createElement("tr");
            tableauClassement.appendChild(tr);
            
            let td1 = document.createElement("td");
            tr.appendChild(td1);
            td1.innerHTML = valeur.pseudo;
            
            let td2 = document.createElement("td");
            tr.appendChild(td2);
            td2.innerHTML = valeur.score;
        }
    }
}
function start(){
    let memory = JSON.parse(localStorage.getItem("memory"));
    if(!memory){
        memory = createMemory();
    }
    //check si une préférence pour la font existe déjà
    let pAperçu = document.getElementById("aperçuFont");
    if(!memory.préférence || !memory.préférence.font){
        pAperçu.style = "font-Family : '0'";
    }
    else{
        pAperçu.style = "font-Family : '" + memory.préférence.font + "'";
    }

    //check si une préférence pour le dos de carte existe déjà
    if(memory && memory.préférence){
        document.getElementById("dosDeCarte").src = memory.préférence.dos;
    }
    
    //check si une préférence pour le dos de carte existe déjà
    let imageForme = document.getElementById("formeCarte");
    let forme = "forme1";
    if(memory && memory.préférence){
        forme = memory.préférence.forme;
    }
    imageForme.src = "./assets/formes/" + forme + "0.png";

    //interval pour les aperçu
    let compteur = 0;
    let indexForme = 0;
    intervalAperçu = setInterval(()=>{
        indexForme++;
        compteur++;

        if(compteur > 9){
            compteur = 0;
        }
        if(indexForme > 3){
            indexForme = 0;
        }
        let valueForme= imageForme.src.split("formes/forme")[1].split(".png")[0];
        imageForme.src = "./assets/formes/forme" + valueForme[0] + indexForme  + ".png";
        pAperçu.innerHTML = compteur;
    },750);

    replissageClassement();
}


let intervalAperçu;
start();
