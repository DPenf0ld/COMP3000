console.log('LogOutController.js loaded');
const instructionModel = document.getElementById('instructions-logout'); // Instruction model
const desktopContainer = document.getElementById('desktop-area');

export function LogOutFunction() {
        instructionModel.style.display = 'flex'; //working
        desktopContainer.classList.add('blurred'); // Apply the blur
}

export function BackLogOutFunction(){
    instructionModel.style.display = 'none'; 
    desktopContainer.classList.remove('blurred'); // remove the blur
}

export function ConfirmLogOut(){
        //Clears all history so that user can not navigate back into a logged in account
        sessionStorage.clear();
        localStorage.clear();
        window.location.replace("/index.html");
}