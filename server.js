const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const { body, validationResult } = require("express-validator");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

// ==========================================
// SECURITY MIDDLEWARE
// ==========================================

app.use(helmet({
    contentSecurityPolicy: false
}));

// ==========================================
// GENERAL MIDDLEWARE
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// SESSION
// ==========================================

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}));

// ==========================================
// SERVE FRONTEND
// ==========================================

app.use(express.static(path.join(__dirname, "public")));

// ==========================================
// MYSQL CONNECTION POOL
// ==========================================

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    connectionLimit: 10
});

// Test database connection
db.getConnection((err, connection) => {

    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }

    console.log("MySQL connected successfully!");

    connection.release();
});

// ==========================================
// RATE LIMITING
// ==========================================

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many attempts. Please try again later."
    }
});

// ==========================================
// HOME PAGE
// ==========================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ==========================================
// GET BOOKS
// ==========================================

app.get("/api/books", (req, res) => {

    const sql = `
        SELECT id, title, author, price, category, image
        FROM books
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Book fetch error:", err.message);

            return res.status(500).json({
                success: false,
                message: "Unable to load books."
            });
        }

        res.json({
            success: true,
            books: results
        });
    });
});

// ==========================================
// REGISTER
// ==========================================

app.post(
    "/api/register",

    authLimiter,

    [
        body("name")
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage("Name must contain 2 to 100 characters.")
            .matches(/^[A-Za-z ]+$/)
            .withMessage("Name can contain only letters and spaces."),

        body("email")
            .trim()
            .isEmail()
            .withMessage("Please enter a valid email address.")
            .normalizeEmail(),

        body("password")
            .isLength({ min: 6, max: 50 })
            .withMessage("Password must contain 6 to 50 characters.")
    ],

    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        const { name, email, password } = req.body;

        try {

            // Check existing email
            const checkSql =
                "SELECT id FROM users WHERE email = ?";

            db.query(checkSql, [email], async (err, results) => {

                if (err) {

                    console.error(err);

                    return res.status(500).json({
                        success: false,
                        message: "Database error."
                    });
                }

                if (results.length > 0) {

                    return res.status(409).json({
                        success: false,
                        message: "Email is already registered."
                    });
                }

                // Hash password
                const hashedPassword =
                    await bcrypt.hash(password, 12);

                const insertSql = `
                    INSERT INTO users
                    (name, email, password)
                    VALUES (?, ?, ?)
                `;

                db.query(
                    insertSql,
                    [name, email, hashedPassword],
                    (err) => {

                        if (err) {

                            console.error(err);

                            return res.status(500).json({
                                success: false,
                                message: "Registration failed."
                            });
                        }

                        res.status(201).json({
                            success: true,
                            message: "Registration successful!"
                        });
                    }
                );
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                success: false,
                message: "Server error."
            });
        }
    }
);

// ==========================================
// LOGIN
// ==========================================

app.post(
    "/api/login",

    authLimiter,

    [
        body("email")
            .trim()
            .isEmail()
            .withMessage("Please enter a valid email address.")
            .normalizeEmail(),

        body("password")
            .notEmpty()
            .withMessage("Password is required.")
    ],

    (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        const { email, password } = req.body;

        const sql =
            "SELECT id, name, email, password FROM users WHERE email = ?";

        db.query(sql, [email], async (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database error."
                });
            }

            if (results.length === 0) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password."
                });
            }

            const user = results[0];

            const passwordMatch =
                await bcrypt.compare(password, user.password);

            if (!passwordMatch) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password."
                });
            }

            // Store user in session
            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            res.json({
                success: true,
                message: "Login successful!",
                user: req.session.user
            });
        });
    }
);

// ==========================================
// CHECK LOGIN STATUS
// ==========================================

app.get("/api/session", (req, res) => {

    if (!req.session.user) {

        return res.json({
            loggedIn: false
        });
    }

    res.json({
        loggedIn: true,
        user: req.session.user
    });
});

// ==========================================
// LOGOUT
// ==========================================

app.post("/api/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Logout failed."
            });
        }

        res.clearCookie("connect.sid");

        res.json({
            success: true,
            message: "Logged out successfully."
        });
    });
});
// ==========================================
// PLACE ORDER
// ==========================================

app.post("/api/orders", async (req, res) => {

    // Check login
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Please login before placing an order."
        });
    }

    const userId = req.session.user.id;
    const { items } = req.body;

    // Basic validation
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Your cart is empty."
        });
    }

    const connection = await db.promise().getConnection();

    try {

        await connection.beginTransaction();

        let totalAmount = 0;
        const orderItems = [];

        // ==========================================
        // VERIFY BOOKS AND CALCULATE TOTAL
        // ==========================================

        for (const item of items) {

            const bookId = Number(item.bookId);
            const quantity = Number(item.quantity);

            if (
                !Number.isInteger(bookId) ||
                !Number.isInteger(quantity) ||
                quantity < 1 ||
                quantity > 20
            ) {
                throw new Error("Invalid book or quantity.");
            }

            // IMPORTANT:
            // Get price from MySQL instead of trusting frontend
            const [books] = await connection.execute(
                "SELECT id, title, price FROM books WHERE id = ?",
                [bookId]
            );

            if (books.length === 0) {
                throw new Error("One of the selected books does not exist.");
            }

            const book = books[0];

            const itemTotal =
                Number(book.price) * quantity;

            totalAmount += itemTotal;

            orderItems.push({
                bookId: book.id,
                quantity: quantity,
                price: Number(book.price)
            });
        }

        // ==========================================
        // CREATE ORDER
        // ==========================================

        const [orderResult] = await connection.execute(
            `
            INSERT INTO orders
            (user_id, total_amount, status)
            VALUES (?, ?, ?)
            `,
            [
                userId,
                totalAmount,
                "Placed"
            ]
        );

        const orderId = orderResult.insertId;

        // ==========================================
        // CREATE ORDER ITEMS
        // ==========================================

        for (const item of orderItems) {

            await connection.execute(
                `
                INSERT INTO order_items
                (order_id, book_id, quantity, price)
                VALUES (?, ?, ?, ?)
                `,
                [
                    orderId,
                    item.bookId,
                    item.quantity,
                    item.price
                ]
            );
        }

        // ==========================================
        // COMMIT TRANSACTION
        // ==========================================

        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            orderId: orderId,
            totalAmount: totalAmount
        });

    } catch (error) {

        await connection.rollback();

        console.error("Order error:", error);

        res.status(400).json({
            success: false,
            message: error.message || "Unable to place order."
        });

    } finally {

        connection.release();
    }
});
// ==========================================
// GET MY ORDERS
// ==========================================

app.get("/api/orders", async (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Please login first."
        });
    }

    try {

        const [orders] = await db.promise().execute(
            `
            SELECT
                id,
                total_amount,
                status,
                created_at
            FROM orders
            WHERE user_id = ?
            ORDER BY created_at DESC
            `,
            [req.session.user.id]
        );

        res.json({
            success: true,
            orders: orders
        });

    } catch (error) {

        console.error("Orders fetch error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load orders."
        });
    }
});

// ==========================================
// TEST DATABASE
// ==========================================

app.get("/api/test-db", (req, res) => {

    db.query("SELECT * FROM books", (err, results) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Database query failed."
            });
        }

        res.json(results);
    });
});

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Page or API endpoint not found."
    });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log(
        `Online Book Store server running at http://localhost:${PORT}`
    );

});