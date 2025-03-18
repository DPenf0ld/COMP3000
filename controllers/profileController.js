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

export function cancelProfileFunction(){
    document.getElementById('edit-profile-btn').style.display = 'block';
    document.getElementById('save-profile-btn').style.display = 'none';

    document.getElementById('firstName').style.display = 'block';
    document.getElementById('edit-firstName').style.display = 'none';
    document.getElementById('edit-firstName').value = localStorage.getItem('firstName') || '';

    document.getElementById('lastName').style.display = 'block';
    document.getElementById('edit-lastName').style.display = 'none';
    document.getElementById('edit-lastName').value = localStorage.getItem('lastName') || '';

    document.getElementById('cancel-profile-btn').style.display = 'none'; //disable
}

export function closeProfileFunction(){
    profileContainer.style.display = 'none' //hides profile
    cancelProfileFunction()
}

export function editProfileFunction(){
    document.getElementById('cancel-profile-btn').style.display = 'block';

    document.getElementById('edit-profile-btn').style.display = 'none';
    document.getElementById('save-profile-btn').style.display = 'block';

    document.getElementById('firstName').style.display = 'none';
    document.getElementById('edit-firstName').style.display = 'block';
    document.getElementById('edit-firstName').value = localStorage.getItem('firstName') || '';

    document.getElementById('lastName').style.display = 'none';
    document.getElementById('edit-lastName').style.display = 'block';
    document.getElementById('edit-lastName').value = localStorage.getItem('lastName') || '';
}

export async function saveProfileFunction(){
    const updatedFirstName = document.getElementById('edit-firstName').value.trim();
    const updatedLastName = document.getElementById('edit-lastName').value.trim();
    const userEmail = localStorage.getItem('userEmail');

    if (!updatedFirstName || !updatedLastName) {
        alert('All fields must be filled out.');
        return;
    }

    try {
        const response = await fetch('/update-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail, firstName: updatedFirstName, lastName: updatedLastName}),
        });

        if (!response.ok) { //error handling
            throw new Error(await response.text());
        }

        localStorage.setItem('firstName', updatedFirstName);
        localStorage.setItem('lastName', updatedLastName);

        document.getElementById('firstName').innerText = updatedFirstName;
        document.getElementById('lastName').innerText = updatedLastName;

        document.getElementById('firstName').style.display = 'block';
        document.getElementById('edit-firstName').style.display = 'none';

        document.getElementById('lastName').style.display = 'block';
        document.getElementById('edit-lastName').style.display = 'none';

        document.getElementById('edit-profile-btn').style.display = 'block';
        document.getElementById('save-profile-btn').style.display = 'none';

        alert('Profile updated successfully!');
    } catch (error) {
        alert(error.message || 'Failed to update profile.');
    }
}


        