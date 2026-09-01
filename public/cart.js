// ==========================================
// BOOKIFY CART
// ==========================================


let cart =
    JSON.parse(
        localStorage.getItem("bookifyCart")
    ) || [];


// ==========================================
// ELEMENTS
// ==========================================

const cartItems =
    document.getElementById("cartItems");

const emptyCart =
    document.getElementById("emptyCart");

const cartCount =
    document.getElementById("cartCount");

const summaryItems =
    document.getElementById("summaryItems");

const subtotal =
    document.getElementById("subtotal");

const total =
    document.getElementById("total");

const buyButton =
    document.getElementById("buyButton");

const clearCartButton =
    document.getElementById("clearCart");


// ==========================================
// SAVE CART
// ==========================================

function saveCart() {

    localStorage.setItem(
        "bookifyCart",
        JSON.stringify(cart)
    );

}


// ==========================================
// DISPLAY CART
// ==========================================

function displayCart() {

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        emptyCart.style.display =
            "block";

        buyButton.disabled = true;

        buyButton.style.opacity =
            "0.5";

        updateSummary();

        return;

    }


    emptyCart.style.display =
        "none";

    buyButton.disabled = false;

    buyButton.style.opacity =
        "1";


    cart.forEach(item => {

        const element =
            document.createElement("div");

        element.className =
            "cart-item";


        const image =
            item.image

                ? `<img src="${escapeHTML(item.image)}"
                        alt="${escapeHTML(item.title)}">`

                : `<span>📖</span>`;


        element.innerHTML = `

            <div class="cart-image">

                ${image}

            </div>


            <div class="cart-details">

                <h3>
                    ${escapeHTML(item.title)}
                </h3>

                <p>
                    by ${escapeHTML(item.author || "Unknown Author")}
                </p>

                <div class="cart-price">
                    ₹${Number(item.price).toFixed(2)}
                </div>


                <div class="quantity">

                    <button
                        onclick="changeQuantity(${item.id}, -1)">
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${item.id}, 1)">
                        +
                    </button>

                </div>

            </div>


            <div>

                <div class="item-total">

                    ₹${(
                        Number(item.price) *
                        item.quantity
                    ).toFixed(2)}

                </div>

                <button
                    class="remove-button"
                    onclick="removeItem(${item.id})">

                    Remove

                </button>

            </div>

        `;


        cartItems.appendChild(element);

    });


    updateSummary();

}


// ==========================================
// CHANGE QUANTITY
// ==========================================

function changeQuantity(
    id,
    change
) {

    const item =
        cart.find(
            book => book.id === id
        );


    if (!item) {
        return;
    }


    item.quantity += change;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                book => book.id !== id
            );

    }


    saveCart();

    displayCart();

}


// ==========================================
// REMOVE ITEM
// ==========================================

function removeItem(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );


    saveCart();

    displayCart();

}


// ==========================================
// CLEAR CART
// ==========================================

clearCartButton.addEventListener(
    "click",
    function () {

        if (cart.length === 0) {
            return;
        }


        const confirmed =
            confirm(
                "Are you sure you want to clear your cart?"
            );


        if (!confirmed) {
            return;
        }


        cart = [];

        saveCart();

        displayCart();

    }
);


// ==========================================
// UPDATE SUMMARY
// ==========================================

function updateSummary() {

    const itemCount =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    const subtotalValue =
        cart.reduce(
            (sum, item) =>
                sum +
                (
                    Number(item.price) *
                    item.quantity
                ),
            0
        );


    cartCount.textContent =
        itemCount;


    summaryItems.textContent =
        itemCount;


    subtotal.textContent =
        `₹${subtotalValue.toFixed(2)}`;


    total.textContent =
        `₹${subtotalValue.toFixed(2)}`;

}


// ==========================================
// BUY NOW
// ==========================================

buyButton.addEventListener(
    "click",
    function () {

        if (cart.length === 0) {
            return;
        }


        // In a real e-commerce application,
        // payment/order processing would happen
        // through a secure backend.


        const orderNumber =
            "BK" +
            Date.now()
                .toString()
                .slice(-8);


        document.getElementById(
            "orderNumber"
        ).textContent =
            `Order Number: ${orderNumber}`;


        document.getElementById(
            "checkoutModal"
        ).classList.add("show");


        // Clear cart after successful
        // simulated order
        cart = [];

        saveCart();

        updateSummary();

    }
);


// ==========================================
// MODAL
// ==========================================

document
    .getElementById("closeModal")
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById("continueButton")
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "catalogue.html";

        }
    );


function closeModal() {

    document
        .getElementById("checkoutModal")
        .classList.remove("show");

    displayCart();

}


// ==========================================
// ESCAPE HTML
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

displayCart();


// ==========================================
// BUY NOW FROM CATALOGUE
// ==========================================

const params =
    new URLSearchParams(
        window.location.search
    );


if (
    params.get("checkout") === "true" &&
    cart.length > 0
) {

    setTimeout(() => {

        buyButton.click();

    }, 400);

}