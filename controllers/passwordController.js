console.log('passwordController.js loaded');






let passwordtask1 = false;
let passwordtask2 = false;
let passwordtask3 = false;

let passwordblur = true;


const instructionPasswordModel = document.getElementById('instructions-password'); // Instruction model
const confirmpasswordButton = document.getElementById('confirm-password-button');


const passwordContainer = document.getElementById('password-container');
const passwordContainerBlur = document.getElementById('password-interface');
const pwnedpasswordContainerBlur = document.getElementById('Pwned');

let passwordInput = document.getElementById('password');
let passwordStrengths = document.querySelectorAll('.password-strength')




export function togglePasswordInput() {
    const passwordInput = document.getElementById('passwordPWNED');
    if (passwordblur) {
        passwordInput.disabled = true; // Disable
    } else {
        passwordInput.disabled = false; // Enable
    }
}


// SHA-1 Hashing Function (to hash the password)
export function encrypt(str) {
    const utf8 = new TextEncoder().encode(str);
    return crypto.subtle.digest('SHA-1', utf8).then(hashBuffer => {
        return Array.from(new Uint8Array(hashBuffer))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    });
}