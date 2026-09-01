// ==========================================
// BOOKIFY CATALOGUE
// ==========================================

let allBooks = [];


// ==========================================
// LOAD BOOKS
// ==========================================

async function loadBooks() {

    const loading =
        document.getElementById("loading");

    const bookGrid =
        document.getElementById("bookGrid");

    try {

        const response =
            await fetch("/api/books");

        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                "Unable to load books"
            );

        }


        allBooks = data.books || [];

        populateCategories();

        displayBooks(allBooks);


    } catch (error) {

        console.error(error);

        bookGrid.innerHTML = `
            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:50px;
            ">
                <h3>Unable to load books.</h3>
                <p>Please check your server and database.</p>
            </div>
        `;

    } finally {

        loading.style.display = "none";

    }

}


// ==========================================
// CATEGORIES
// ==========================================

function populateCategories() {

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    const categories =
        [...new Set(
            allBooks
                .map(book => book.category)
                .filter(Boolean)
        )];


    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        categoryFilter.appendChild(option);

    });

}


// ==========================================
// DISPLAY BOOKS
// ==========================================

function displayBooks(books) {

    const grid =
        document.getElementById("bookGrid");

    const noResults =
        document.getElementById("noResults");

    const resultCount =
        document.getElementById("resultCount");


    grid.innerHTML = "";


    resultCount.textContent =
        `${books.length} book${books.length !== 1 ? "s" : ""} available`;


    if (books.length === 0) {

        noResults.style.display = "block";

        return;

    }


    noResults.style.display = "none";


    books.forEach(book => {

        const card =
            document.createElement("article");

        card.className = "book-card";


        const imageHTML =
            book.image
                ? `<img src="${escapeHTML(book.image)}"
                        alt="${escapeHTML(book.title)}"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">

                   <div class="book-placeholder"
                        style="display:none;">
                        📖
                   </div>`
                : `<div class="book-placeholder">
                        📖
                   </div>`;


        card.innerHTML = `

            <div class="book-image">

                ${imageHTML}

                <span class="book-category">
                    ${escapeHTML(book.category || "Book")}
                </span>

            </div>


            <div class="book-info">

                <h3 title="${escapeHTML(book.title)}">
                    ${escapeHTML(book.title)}
                </h3>

                <p class="author">
                    by ${escapeHTML(book.author || "Unknown Author")}
                </p>


                <div class="book-bottom">

                    <span class="price">
                        ₹${Number(book.price).toFixed(2)}
                    </span>

                    <span class="rating">
                        ⭐ 4.5
                    </span>

                </div>


                <div class="card-buttons">

                    <button
                        class="add-cart"
                        onclick="addToCart(${book.id})">

                        🛒 Add to Cart

                    </button>

                    <button
                        class="buy-now"
                        onclick="buyNow(${book.id})">

                        Buy Now

                    </button>

                </div>

            </div>

        `;


        grid.appendChild(card);

    });

}


// ==========================================
// SEARCH
// ==========================================

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        filterBooks
    );


document
    .getElementById("categoryFilter")
    .addEventListener(
        "change",
        filterBooks
    );


function filterBooks() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    const category =
        document
            .getElementById("categoryFilter")
            .value;


    const filtered =
        allBooks.filter(book => {

            const matchesSearch =

                String(book.title || "")
                    .toLowerCase()
                    .includes(search)

                ||

                String(book.author || "")
                    .toLowerCase()
                    .includes(search)

                ||

                String(book.category || "")
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =

                category === "all"

                ||

                book.category === category;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    displayBooks(filtered);

}


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(bookId) {

    const book =
        allBooks.find(
            item => item.id === bookId
        );


    if (!book) {
        return;
    }


    let cart =
        JSON.parse(
            localStorage.getItem("bookifyCart")
        ) || [];


    const existing =
        cart.find(
            item => item.id === book.id
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            id: book.id,

            title: book.title,

            author: book.author,

            price: Number(book.price),

            image: book.image,

            quantity: 1

        });

    }


    localStorage.setItem(
        "bookifyCart",
        JSON.stringify(cart)
    );


    updateCartCount();

    showNotification(
        `${book.title} added to cart!`
    );

}


// ==========================================
// BUY NOW
// ==========================================

function buyNow(bookId) {

    const book =
        allBooks.find(
            item => item.id === bookId
        );


    if (!book) {
        return;
    }


    let cart =
        JSON.parse(
            localStorage.getItem("bookifyCart")
        ) || [];


    const existing =
        cart.find(
            item => item.id === book.id
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            id: book.id,

            title: book.title,

            author: book.author,

            price: Number(book.price),

            image: book.image,

            quantity: 1

        });

    }


    localStorage.setItem(
        "bookifyCart",
        JSON.stringify(cart)
    );


    window.location.href =
        "cart.html?checkout=true";

}


// ==========================================
// CART COUNT
// ==========================================

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("bookifyCart")
        ) || [];


    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    document.getElementById(
        "cartCount"
    ).textContent = count;

}


// ==========================================
// NOTIFICATION
// ==========================================

function showNotification(text) {

    const notification =
        document.createElement("div");

    notification.textContent =
        `✓ ${text}`;


    notification.style.position =
        "fixed";

    notification.style.bottom =
        "25px";

    notification.style.right =
        "25px";

    notification.style.background =
        "#2c1e16";

    notification.style.color =
        "white";

    notification.style.padding =
        "14px 20px";

    notification.style.borderRadius =
        "10px";

    notification.style.zIndex =
        "9999";

    notification.style.boxShadow =
        "0 10px 30px rgba(0,0,0,0.2)";


    document.body.appendChild(
        notification
    );


    setTimeout(() => {

        notification.remove();

    }, 2200);

}


// ==========================================
// BASIC HTML ESCAPING
// ==========================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// INITIALIZE
// ==========================================

updateCartCount();

loadBooks();