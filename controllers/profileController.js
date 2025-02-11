console.log('profileController.js loaded');
const profileContainer = document.getElementById('profile-container');
const desktopArea = document.getElementById('desktop-area');

export function profileInfo(){
    console.log("Loaded profile Info!")
    if (profileContainer.style.display === 'block') { //closes profile if open
        closeProfileFunction()
    } else {
        profileContainer.style.display = 'block' //shows profile
    }
}

export function closeProfileFunction(){
    profileContainer.style.display = 'none' //hides profile
}



        