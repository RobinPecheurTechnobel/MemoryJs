function  goGame(difficulté){

    let memory = JSON.parse(localStorage.getItem("memory"));
    if(!memory){
        let partie = {"difficulté":difficulté};
        memory = {"partie": partie};
    }else{
        memory.partie.difficulté =difficulté;
        if(memory.partie.timer){
            delete memory.partie.timer
        }
    }

    localStorage.setItem("memory",JSON.stringify(memory));

    window.location.href = "/memory.html";
}

function replissageClassment(){
    let tableauClassement = document.getElementById("classement").getElementsByTagName("tbody")[0];
    let classement = JSON.parse(localStorage.getItem("memory")).classement;
    
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

replissageClassment();
