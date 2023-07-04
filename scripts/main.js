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
    let image = document.getElementById("dosDeCarte");
    let urlDos = image.src.substring(image.src.indexOf("/asset"),image.src.length);

    let préférence = {
        "dos":".."+urlDos, 
        "face":".."+urlDos.replace("dos","face").replace("gif","png")
    };
    return préférence;
}

function  goGame(difficulté){

    let memory = createMemory();

    memory.partie.difficulté =difficulté;
    if(memory.partie.timer){
        delete memory.partie.timer
    }

    console.log(memory.préférence);

    localStorage.setItem("memory",JSON.stringify(memory));

    window.location.href = "/memory.html";
}

function replissageClassment(){
    
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

replissageClassment();
