function  goGame(difficulté){


    let memory = JSON.parse(localStorage.getItem("memory"));
    if(!memory){
        let partieEnCours = {"difficulté":difficulté};
        memory = {"partieEnCours": partieEnCours};
    }else{
        memory.partieEnCours.difficulté =difficulté;
        if(memory.partieEnCours.timer){
            delete memory.partieEnCours.timer
        }
    }

    localStorage.setItem("memory",JSON.stringify(memory));

    window.location.href = "/memory.html";
}

