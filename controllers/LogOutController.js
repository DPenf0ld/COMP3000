console.log('LogOutController.js loaded');
export function LogOutFunction() {
    //Clears all history so that user can not navigate back into a logged in account
    sessionStorage.clear();
    localStorage.clear();
    window.location.replace("/index.html");
}