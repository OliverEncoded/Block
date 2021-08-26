//this will run after runFile has so you can get global variables in here
// remember not to put var/let in front of variables so you can use them in the updateLogic function
function startKeycheckFile(){

    window.addEventListener('keydown' ,(event) => {
        if(keysDown.includes(event.key)) return;
        keysDown.push(event.key);
      });

      window.addEventListener('keyup' ,(event) => {
        keysDown.forEach((e, index) => {
            if(e === event.key){
                keysDown.splice(index, 1);
            }
        });
      });
}

var keysDown = [];