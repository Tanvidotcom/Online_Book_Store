// ==========================================
// BOOKNEST REGISTRATION
// ==========================================

const registerForm =
    document.getElementById("registerForm");

const nameInput =
    document.getElementById("name");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const termsInput =
    document.getElementById("terms");

const message =
    document.getElementById("message");

const registerButton =
    document.getElementById("registerButton");


// ==========================================
// SHOW / HIDE PASSWORD
// ==========================================

document
    .getElementById("togglePassword")
    .addEventListener("click", () => {

        togglePasswordVisibility(
            passwordInput,
            "togglePassword"
        );

    });


document
    .getElementById("toggleConfirmPassword")
    .addEventListener("click", () => {

        togglePasswordVisibility(
            confirmPasswordInput,
            "toggleConfirmPassword"
        );

    });


function togglePasswordVisibility(
    input,
    buttonId
) {

    const button =
        document.getElementById(buttonId);

    if (input.type === "password") {

        input.type = "text";

        button.textContent = "🙈";

    } else {

        input.type = "password";

        button.textContent = "👁";

    }

}


// ==========================================
// PASSWORD STRENGTH
// ==========================================

passwordInput.addEventListener(
    "input",
    updatePasswordStrength
);


function updatePasswordStrength() {

    const password =
        passwordInput.value;

    const strengthBar =
        document.getElementById("strengthBar");

    let strength = 0;


    if (password.length >= 8) {
        strength++;
    }

    if (/[A-Z]/.test(password)) {
        strength++;
    }

    if (/[a-z]/.test(password)) {
        strength++;
    }

    if (/[0-9]/.test(password)) {
        strength++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        strength++;
    }


    const percentage =
        (strength / 5) * 100;


    strengthBar.style.width =
        `${percentage}%`;

}


// ==========================================
// VALIDATION
// ==========================================

function validateForm() {

    clearErrors();

    let valid = true;


    // -----------------------------
    // NAME
    // -----------------------------

    const name =
        nameInput.value.trim();

    if (name.length < 2) {

        showError(
            "nameError",
            "Name must contain at least 2 characters."
        );

        valid = false;

    } else if (!/^[A-Za-z ]+$/.test(name)) {

        showError(
            "nameError",
            "Name should contain only letters and spaces."
        );

        valid = false;
    }


    // -----------------------------
    // EMAIL
    // -----------------------------

    const email =
        emailInput.value.trim();

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        showError(
            "emailError",
            "Please enter a valid email address."
        );

        valid = false;

    }


    // -----------------------------
    // PASSWORD
    // -----------------------------

    const password =
        passwordInput.value;

    if (password.length < 8) {

        showError(
            "passwordError",
            "Password must contain at least 8 characters."
        );

        valid = false;

    } else if (!/[A-Z]/.test(password)) {

        showError(
            "passwordError",
            "Password must contain an uppercase letter."
        );

        valid = false;

    } else if (!/[a-z]/.test(password)) {

        showError(
            "passwordError",
            "Password must contain a lowercase letter."
        );

        valid = false;

    } else if (!/[0-9]/.test(password)) {

        showError(
            "passwordError",
            "Password must contain a number."
        );

        valid = false;

    }


    // -----------------------------
    // CONFIRM PASSWORD
    // -----------------------------

    const confirmPassword =
        confirmPasswordInput.value;

    if (password !== confirmPassword) {

        showError(
            "confirmError",
            "Passwords do not match."
        );

        valid = false;

    }


    // -----------------------------
    // TERMS
    // -----------------------------

    if (!termsInput.checked) {

        showError(
            "termsError",
            "Please accept the terms and conditions."
        );

        valid = false;

    }


    return valid;

}


// ==========================================
// SHOW ERROR
// ==========================================

function showError(
    elementId,
    text
) {

    const element =
        document.getElementById(elementId);

    element.textContent = text;

}


// ==========================================
// CLEAR ERRORS
// ==========================================

function clearErrors() {

    document
        .querySelectorAll(".form-group small")
        .forEach(element => {

            element.textContent = "";

        });


    document.getElementById(
        "termsError"
    ).textContent = "";

}


// ==========================================
// FORM SUBMISSION
// ==========================================

registerForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!validateForm()) {

            return;

        }


        const name =
            nameInput.value.trim();

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        registerButton.disabled = true;

        registerButton.textContent =
            "Creating Account...";


        try {

            const response =
                await fetch(
                    "/api/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            email,
                            password
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                showMessage(
                    data.message ||
                    "Registration failed.",
                    "error"
                );

                return;

            }


            showMessage(
                "Registration successful! You can now login.",
                "success"
            );


            registerForm.reset();


            document.getElementById(
                "strengthBar"
            ).style.width = "0%";


            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1800);


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            showMessage(
                "Unable to connect to the server.",
                "error"
            );

        } finally {

            registerButton.disabled = false;

            registerButton.textContent =
                "Create Account";

        }

    }
);


// ==========================================
// MESSAGE
// ==========================================

function showMessage(
    text,
    type
) {

    message.textContent = text;

    message.className =
        `message ${type}`;

}