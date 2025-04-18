console.log('profileController.js loaded');
const profileContainer = document.getElementById('profile-container');
const desktopArea = document.getElementById('desktop-area');
const feedback = document.getElementById('profile-feedback');




export function profileInfo() {
    console.log("Loaded profile Info!")
    if (profileContainer.style.display === 'block') { //closes profile if open
        closeProfileFunction()
    } else {
        profileContainer.style.display = 'block' //shows profile
    }
}

export function cancelProfileFunction() {
    //hide feedback
    feedback.style.display = 'none'

    document.getElementById('edit-profile-btn').style.display = 'block';
    document.getElementById('save-profile-btn').style.display = 'none';

    document.getElementById('firstName').style.display = 'block';
    document.getElementById('edit-firstName').style.display = 'none';
    document.getElementById('edit-firstName').value = localStorage.getItem('firstName') || '';

    document.getElementById('lastName').style.display = 'block';
    document.getElementById('edit-lastName').style.display = 'none';
    document.getElementById('edit-lastName').value = localStorage.getItem('lastName') || '';

    document.getElementById('organisation').style.display = 'block';
    document.getElementById('edit-organisation').style.display = 'none';
    document.getElementById('edit-organisation').value = localStorage.getItem('organisation') || '';

    document.getElementById('current-password').style.display = 'none';
    document.getElementById('new-password').style.display = 'none';
    document.getElementById('confirm-password').style.display = 'none';

    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';


    document.getElementById('cancel-profile-btn').style.display = 'none'; //disable

    //show reset buttons
    document.getElementById('reset-items').style.display = 'block';
}

export function closeProfileFunction() {
    profileContainer.style.display = 'none' //hides profile
    cancelProfileFunction()
}

export function editProfileFunction() {
    document.getElementById('cancel-profile-btn').style.display = 'block';

    document.getElementById('edit-profile-btn').style.display = 'none';
    document.getElementById('save-profile-btn').style.display = 'block';

    document.getElementById('firstName').style.display = 'none';
    document.getElementById('edit-firstName').style.display = 'block';
    document.getElementById('edit-firstName').value = localStorage.getItem('firstName') || '';

    document.getElementById('lastName').style.display = 'none';
    document.getElementById('edit-lastName').style.display = 'block';
    document.getElementById('edit-lastName').value = localStorage.getItem('lastName') || '';

    document.getElementById('organisation').style.display = 'none';
    document.getElementById('edit-organisation').style.display = 'block';
    document.getElementById('edit-organisation').value = localStorage.getItem('organisation') || '';

    document.getElementById('current-password').style.display = 'block';
    document.getElementById('new-password').style.display = 'block';
    document.getElementById('confirm-password').style.display = 'block';

    //hide reset buttons
    document.getElementById('reset-items').style.display = 'none';
}

export async function saveProfileFunction() {
    const updatedFirstName = document.getElementById('edit-firstName').value.trim();
    const updatedLastName = document.getElementById('edit-lastName').value.trim();
    const updatedOrganisation = document.getElementById('edit-organisation').value.trim();
    const userEmail = localStorage.getItem('userEmail');
    if (updatedFirstName || updatedLastName || organisation) {
        if (!updatedFirstName || !updatedLastName || !organisation) {
            feedback.style.display = 'block' //shows feedback
            feedback.innerHTML = 'All fields must be filled out.';
            feedback.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail, firstName: updatedFirstName, lastName: updatedLastName, organisation: updatedOrganisation }),
            });

            if (!response.ok) { //error handling
                throw new Error(await response.text());
            }

            localStorage.setItem('firstName', updatedFirstName);
            localStorage.setItem('lastName', updatedLastName);
            localStorage.setItem('organisation', updatedOrganisation);

            document.getElementById('firstName').innerText = updatedFirstName;
            document.getElementById('lastName').innerText = updatedLastName;
            document.getElementById('organisation').innerText = updatedOrganisation;

            document.getElementById('firstName').style.display = 'block';
            document.getElementById('edit-firstName').style.display = 'none';

            document.getElementById('lastName').style.display = 'block';
            document.getElementById('edit-lastName').style.display = 'none';

            document.getElementById('organisation').style.display = 'block';
            document.getElementById('edit-organisation').style.display = 'none';

            document.getElementById('edit-profile-btn').style.display = 'block';
            document.getElementById('save-profile-btn').style.display = 'none';
            document.getElementById('cancel-profile-btn').style.display = 'none';
            //show reset buttons
            document.getElementById('reset-items').style.display = 'block';

            feedback.style.display = 'block' //shows feedback
            feedback.innerHTML = 'Profile updated successfully!';
            feedback.style.color = 'green';

            //add pause
            setTimeout(() => {
                cancelProfileFunction()
            }, 500);
        } catch (error) {
            feedback.style.display = 'block' //shows feedback
            feedback.innerHTML = 'Failed to update profile.';
            feedback.style.color = 'red';
        }
    }

    //change password code
    const currentPassword = document.getElementById('current-password').value.trim();
    const newPassword = document.getElementById('new-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    if (newPassword || confirmPassword || currentPassword) {
        if (!currentPassword || !newPassword || !confirmPassword) {
            feedback.style.display = 'block';
            feedback.innerHTML = 'Please fill all password fields.';
            feedback.style.color = 'red';
            return;
        }

        if (newPassword !== confirmPassword) {
            feedback.style.display = 'block';
            feedback.innerHTML = 'New passwords do not match.';
            feedback.style.color = 'red';
            return;
        }

        try {
            const pwResponse = await fetch('/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail, currentPassword, newPassword }),
            });

            const pwData = await pwResponse.json();

            if (!pwResponse.ok) {
                throw new Error(pwData.message || 'Password update failed');
            }

            feedback.style.display = 'block';
            feedback.innerHTML = 'Password updated successfully!';
            feedback.style.color = 'green';
            //add pause
            setTimeout(() => {
                cancelProfileFunction()
            }, 500);
        } catch (error) {
            feedback.style.display = 'block';
            feedback.innerHTML = error.message;
            feedback.style.color = 'red';
            return;
        }
    }

}


