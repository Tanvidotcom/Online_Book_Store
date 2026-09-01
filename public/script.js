// ==========================================
// BOOKNEST FRONTEND JAVASCRIPT
// ==========================================


// ==========================================
// MOBILE MENU
// ==========================================

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("show");

    });

}


// ==========================================
// LOAD FEATURED BOOKS
// ==========================================

async function loadFeaturedBooks() {

    const container =
        document.getElementById("featuredBooks");

    if (!container) {
        return;
    }

    try {

        const response =
            await fetch("/api/books");

        const data =
            await response.json();

        if (!data.success) {

            showBookError(container);

            return;
        }


        // Show maximum 4 books on Home Page

        const books =
            data.books.slice(0, 4);


        if (books.length === 0) {

            container.innerHTML = `
                <div class="loading">
                    <p>No books available yet.</p>
                </div>
            `;

            return;
        }


        container.innerHTML = "";


        books.forEach((book, index) => {

            const card =
                document.createElement("div");

            card.className = "book-card";

            card.style.animationDelay =
                `${index * 0.12}s`;


            card.innerHTML = `

                <div class="book-cover">

                    📖

                </div>


                <div class="book-info">

                    <h3 title="${escapeHTML(book.title)}">
                        ${escapeHTML(book.title)}
                    </h3>


                    <p class="book-author">
                        By ${escapeHTML(book.author)}
                    </p>


                    <span class="book-category">
                        ${escapeHTML(book.category)}
                    </span>


                    <p class="book-price">
                        ₹${Number(book.price).toFixed(2)}
                    </p>

                </div>

            `;


            container.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Error loading books:",
            error
        );

        showBookError(container);

    }

}


// ==========================================
// ERROR MESSAGE
// ==========================================

function showBookError(container) {

    container.innerHTML = `

        <div class="loading">

            <p>
                Unable to load books.
                Please make sure the server is running.
            </p>

        </div>

    `;

}


// ==========================================
// BASIC HTML ESCAPING
// ==========================================

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// START APPLICATION
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadFeaturedBooks();

    }
);
// ==========================================
// CHECK LOGIN STATUS
// ==========================================

async function checkLoginStatus() {

    const guestLinks =
        document.getElementById("guestLinks");

    const userLinks =
        document.getElementById("userLinks");

    const navUserName =
        document.getElementById("navUserName");

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");


    // If this page does not contain
    // the navigation elements, stop.
    if (!guestLinks || !userLinks) {
        return;
    }


    try {

        const response =
            await fetch("/api/session", {
                method: "GET",
                credentials: "include"
            });


        const data =
            await response.json();


        console.log("Session:", data);


        if (data.loggedIn && data.user) {

            // Hide Login/Register
            guestLinks.style.display = "none";

            // Show user profile
            userLinks.style.display = "block";


            // Display user name
            if (navUserName) {
                navUserName.textContent =
                    data.user.name;
            }


            // Display profile name
            if (profileName) {
                profileName.textContent =
                    data.user.name;
            }


            // Display email
            if (profileEmail) {
                profileEmail.textContent =
                    data.user.email;
            }

        } else {

            // User is logged out

            guestLinks.style.display =
                "flex";

            userLinks.style.display =
                "none";
        }


    } catch (error) {

        console.error(
            "Unable to check login session:",
            error
        );

    }

}


// ==========================================
// PROFILE DROPDOWN
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const profileButton =
            document.getElementById(
                "profileButton"
            );

        const profileDropdown =
            document.getElementById(
                "profileDropdown"
            );


        if (
            !profileButton ||
            !profileDropdown
        ) {
            return;
        }


        if (
            profileButton.contains(
                event.target
            )
        ) {

            profileDropdown.classList.toggle(
                "show"
            );

        } else if (
            !profileDropdown.contains(
                event.target
            )
        ) {

            profileDropdown.classList.remove(
                "show"
            );

        }

    }
);


// ==========================================
// LOGOUT
// ==========================================

async function logoutUser() {

    try {

        const response =
            await fetch(
                "/api/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            );


        const data =
            await response.json();


        if (data.success) {

            // Remove old local user data
            localStorage.removeItem(
                "booknestUser"
            );

            localStorage.removeItem(
                "bookifyUser"
            );


            alert(
                "You have been logged out successfully."
            );


            window.location.href =
                "index.html";

        } else {

            alert(
                data.message ||
                "Logout failed."
            );

        }


    } catch (error) {

        console.error(
            "Logout error:",
            error
        );


        alert(
            "Unable to logout. Please try again."
        );

    }

}


// ==========================================
// INITIALIZE USER NAVIGATION
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logoutUser
            );

        }


        checkLoginStatus();

    }
);


// ==========================================
// PROFILE DROPDOWN
// ==========================================

document.addEventListener("click", function (event) {

    const profileButton =
        document.getElementById("profileButton");

    const profileDropdown =
        document.getElementById("profileDropdown");

    if (!profileButton || !profileDropdown) {
        return;
    }

    if (profileButton.contains(event.target)) {

        profileDropdown.classList.toggle("show");

    } else if (!profileDropdown.contains(event.target)) {

        profileDropdown.classList.remove("show");
    }
});


// ==========================================
// LOGOUT
// ==========================================

async function logoutUser() {

    try {

        const response = await fetch("/api/logout", {
            method: "POST"
        });

        const data = await response.json();

        if (data.success) {

            alert("You have been logged out successfully.");

            window.location.href = "index.html";

        } else {

            alert(data.message || "Logout failed.");
        }

    } catch (error) {

        console.error("Logout error:", error);

        alert("Unable to logout. Please try again.");
    }
}


// Attach logout button
document.addEventListener("DOMContentLoaded", function () {

    const logoutButton =
        document.getElementById("logoutButton");

    if (logoutButton) {

        logoutButton.addEventListener("click", logoutUser);
    }

    checkLoginStatus();
});