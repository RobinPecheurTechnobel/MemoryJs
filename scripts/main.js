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

