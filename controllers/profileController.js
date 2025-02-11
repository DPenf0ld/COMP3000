console.log('profileController.js loaded');
const profileContainer = document.getElementById('profile-container');
const desktopArea = document.getElementById('desktop-area');

export function profileInfo(){
    console.log("Loaded profile Info!")
    if (profileContainer.style.display === 'block') { //closes profile if open
        closeProfileFunction()
    } else if (desktopArea.style.display != 'none') { //opens inbox only on desktop
        desktopArea.style.display = 'none'; //hides desktop
        profileContainer.style.display = 'block' //shows profile
    }
}

export function closeProfileFunction(){
    desktopArea.style.display = 'block'; //shows desktop
    profileContainer.style.display = 'none' //hides profile
}
