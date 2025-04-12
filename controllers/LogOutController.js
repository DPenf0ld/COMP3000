console.log('LogOutController.js loaded');
const instructionModel = document.getElementById('instructions-logout'); // Instruction model
const desktopContainer = document.getElementById('desktop-area');
const deleteModel = document.getElementById('delete-warning'); // Instruction model

const desktopArea = document.getElementById('desktop-area');
const profileArea = document.getElementById('profile-container');
const taskbar = document.getElementById('taskbar');

export function LogOutFunction() {
        instructionModel.style.display = 'flex'; //working
        desktopContainer.classList.add('blurred'); // Apply the blur

        //disable all buttons 
        desktopArea.classList.add("disabled");
        profileArea.classList.add("disabled");
        taskbar.classList.add("disabled");
}

export function BackLogOutFunction(){
    instructionModel.style.display = 'none'; 
    desktopContainer.classList.remove('blurred'); // remove the blur

        //enable all buttons 
        desktopArea.classList.remove("disabled");
        profileArea.classList.remove("disabled");
        taskbar.classList.remove("disabled");
}

export function ConfirmLogOut(){
        //Clears all history so that user can not navigate back into a logged in account
        sessionStorage.clear();
        localStorage.clear();
        window.location.replace("/index.html");
}

export function deleteProfileFunction(){
        deleteModel.style.display = 'flex'; //working
        desktopContainer.classList.add('blurred'); // Apply the blur

        //disable all buttons 
        desktopArea.classList.add("disabled");
        profileArea.classList.add("disabled");
        taskbar.classList.add("disabled");
}

export function BackdeleteProfileFunction(){
        deleteModel.style.display = 'none'; 
        desktopContainer.classList.remove('blurred'); // remove the blur

        //enable all buttons 
        desktopArea.classList.remove("disabled");
        profileArea.classList.remove("disabled");
        taskbar.classList.remove("disabled");
}

export async function confirmDeleteFunction() {
        //delete profile here
        const email = localStorage.getItem('userEmail');
        try {
          const response = await fetch('/delete-user', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });
      
          const result = await response.json();
      
          if (response.ok) {
            console.log('Profile deleted successfully.');
            localStorage.clear();
            ConfirmLogOut(); // log out
          } else {
                console.log(`Error: ${result.message}`);
          }
        } catch (error) {
          console.error('Deletion error:', error);
          console.log('An error occurred while trying to delete your profile.');
        }

        ConfirmLogOut()
}

