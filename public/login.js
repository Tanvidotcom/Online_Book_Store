// ==========================================
// BOOKNEST LOGIN
// ==========================================


// Get elements
const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const buttonText =
    document.getElementById("buttonText");

const loader =
    document.getElementById("loader");

const message =
    document.getElementById("message");


// ==========================================
// SHOW / HIDE PASSWORD
// ==========================================

const togglePassword =
    document.getElementById("togglePassword");


togglePassword.addEventListener(
    "click",
    function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePassword.textContent = "🙈";

            togglePassword.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            passwordInput.type = "password";

            togglePassword.textContent = "👁";

            togglePassword.setAttribute(
                "aria-label",
                "Show password"
            );

        }

    }
);


// ==========================================
// FORM SUBMISSION
// ==========================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // Clear old errors
        clearErrors();

        hideMessage();


        // Get values
        const email =
            emailInput.value
                .trim()
                .toLowerCase();

        const password =
            passwordInput.value;


        // ==================================
        // FRONTEND VALIDATION
        // ==================================

        let valid = true;


        // Email validation
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!email) {

            showError(
                "emailError",
                "Email address is required."
            );

            valid = false;

        } else if (!emailPattern.test(email)) {

            showError(
                "emailError",
                "Please enter a valid email address."
            );

            valid = false;

        }


        // Password validation
        if (!password) {

            showError(
                "passwordError",
                "Password is required."
            );

            valid = false;

        }


        if (!valid) {
            return;
        }


        // ==================================
        // LOADING STATE
        // ==================================

        setLoading(true);


        try {

            // ==================================
            // SEND LOGIN REQUEST
            // ==================================

            const response =
                await fetch(
                    "/api/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );


            const data =
                await response.json();


            // ==================================
            // LOGIN FAILED
            // ==================================

            if (!response.ok) {

                showMessage(
                    data.message ||
                    "Invalid email or password.",
                    "error"
                );

                return;
            }


            // ==================================
            // LOGIN SUCCESS
            // ==================================

            showMessage(
                `Welcome back, ${data.user.name}!`,
                "success"
            );


            // Save basic user information locally
            // Do NOT store the password.
            localStorage.setItem(
                "booknestUser",
                JSON.stringify({
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email
                })
            );


            // Redirect after short delay
            setTimeout(
                function () {

                    window.location.href =
                        "index.html";

                },
                1200
            );


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            showMessage(
                "Unable to connect to the server. Please try again.",
                "error"
            );


        } finally {

            setLoading(false);

        }

    }
);


// ==========================================
// VALIDATION HELPERS
// ==========================================

function showError(
    elementId,
    text
) {

    const element =
        document.getElementById(elementId);

    element.textContent = text;

}


function clearErrors() {

    document
        .querySelectorAll(".form-group small")
        .forEach(
            function (element) {

                element.textContent = "";

            }
        );

}


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


function hideMessage() {

    message.textContent = "";

    message.className = "message";

}


// ==========================================
// LOADING
// ==========================================

function setLoading(isLoading) {

    loginButton.disabled =
        isLoading;


    if (isLoading) {

        buttonText.style.display =
            "none";

        loader.style.display =
            "block";

    } else {

        buttonText.style.display =
            "inline";

        loader.style.display =
            "none";

    }

}


// ==========================================
// FORGOT PASSWORD
// ==========================================

document
    .getElementById("forgotPassword")
    .addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showMessage(
                "Password recovery will be added in a later step.",
                "error"
            );

        }
    );