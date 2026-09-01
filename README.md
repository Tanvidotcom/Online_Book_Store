# Online Book Store

## 📋 Project Overview

**Online Book Store** is a full-stack web application that enables users to browse an online book catalogue, manage a shopping cart, and place orders securely. The application features user authentication, session management, and order processing with transaction support.

---

## 🎯 Aim & Objectives

### Aim
To create a secure and user-friendly online platform for buying books with essential e-commerce functionalities.

### Objectives
- Enable users to create accounts with secure password storage
- Display a dynamic book catalogue with filtering capabilities
- Provide a functional shopping cart system
- Allow authenticated users to place orders
- Implement session-based user authentication
- Ensure data security and validation
- Provide order history tracking

---

## 📁 Folder Structure

```
OnlineBookStore/
├── public/                          # Frontend assets (static files)
│   ├── index.html                   # Home/Landing page
│   ├── register.html                # User registration page
│   ├── register.js                  # Registration logic
│   ├── register.css                 # Registration styling
│   ├── login.html                   # User login page
│   ├── login.js                     # Login logic
│   ├── login.css                    # Login styling
│   ├── catalogue.html               # Book catalogue page
│   ├── catalogue.js                 # Catalogue & filtering logic
│   ├── catalogue.css                # Catalogue styling
│   ├── cart.html                    # Shopping cart page
│   ├── cart.js                      # Cart logic
│   ├── cart.css                     # Cart styling
│   ├── script.js                    # Shared utility functions
│   └── style.css                    # Global styles
├── server.js                        # Express.js server & API endpoints
├── database.sql                     # Database schema (can be populated)
├── package.json                     # Node.js dependencies & scripts
└── README.md                        # Project documentation
```

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | (Latest LTS) | Runtime environment |
| **Express.js** | ^5.2.1 | Web framework & routing |
| **MySQL** | 8.0+ | Relational database |
| **mysql2** | ^3.24.2 | MySQL driver for Node.js |
| **Bcrypt** | ^6.0.0 | Password hashing |
| **Bcryptjs** | ^3.0.3 | Lightweight password hashing |
| **Express-Session** | ^1.19.0 | Session management |
| **Helmet** | ^8.3.0 | HTTP security headers |
| **CORS** | ^2.8.6 | Cross-Origin Resource Sharing |
| **Express-Validator** | ^7.3.2 | Input validation |
| **Express-Rate-Limit** | ^8.7.0 | Rate limiting for API endpoints |
| **Dotenv** | ^17.4.2 | Environment variables management |
| **Nodemon** | ^3.1.14 | Development auto-reload (Dev only) |
| **HTML5** | - | Frontend markup |
| **CSS3** | - | Styling |
| **JavaScript (ES6)** | - | Frontend logic |

---

## 🏗 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
│  (HTML/CSS/JavaScript - Static Files from /public)          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Register   │  │    Login     │  │  Catalogue   │      │
│  │   Page       │  │    Page      │  │    Page      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐                                           │
│  │    Cart      │                                           │
│  │    Page      │                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
                          ↕ (HTTP/AJAX)
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                        │
│              (Express.js Server - server.js)                │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Middleware Stack:                                    │  │
│  │  • Helmet (Security Headers)                          │  │
│  │  • CORS (Cross-Origin Requests)                       │  │
│  │  • Express Session (User Sessions)                    │  │
│  │  • Express Validator (Input Validation)               │  │
│  │  • Rate Limiter (Authentication Endpoints)            │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  API Endpoints:                                       │  │
│  │  • GET    /api/books          - Fetch all books       │  │
│  │  • GET    /api/session         - Check login status   │  │
│  │  • POST   /api/register        - User registration    │  │
│  │  • POST   /api/login           - User login           │  │
│  │  • POST   /api/logout          - User logout          │  │
│  │  • POST   /api/orders          - Place order          │  │
│  │  • GET    /api/orders          - Fetch user orders    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↕ (SQL Queries)
┌─────────────────────────────────────────────────────────────┐
│                   DATA LAYER                                │
│            (MySQL Database with Connection Pool)           │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    users     │  │    books     │  │    orders    │      │
│  │   Table      │  │    Table     │  │    Table     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  ┌──────────────┐                                           │
│  │  order_items │                                           │
│  │    Table     │                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 How to Run Locally

### Prerequisites
- **Node.js** (v14 or higher)
- **MySQL Server** (v8.0 or higher)
- **npm** (comes with Node.js)

### Installation Steps

#### 1. Clone or Download the Project
```bash
cd OnlineBookStore
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Set Up Environment Variables
Create a `.env` file in the project root directory:

```bash
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bookstore
DB_PORT=3306

# Server Configuration
PORT=3000

# Session Configuration
SESSION_SECRET=your_secret_key_here
```

#### 4. Set Up the Database

Create a MySQL database and tables. Connect to your MySQL server and execute:

```sql
CREATE DATABASE IF NOT EXISTS bookstore;
USE bookstore;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books Table
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Placed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items Table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Sample Books Data
INSERT INTO books (title, author, price, category, image) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 12.99, 'Fiction', 'gatsby.jpg'),
('To Kill a Mockingbird', 'Harper Lee', 14.99, 'Fiction', 'mockingbird.jpg'),
('1984', 'George Orwell', 13.99, 'Fiction', '1984.jpg'),
('Sapiens', 'Yuval Noah Harari', 18.99, 'Non-Fiction', 'sapiens.jpg'),
('Educated', 'Tara Westover', 17.99, 'Biography', 'educated.jpg');
```

#### 5. Start the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

#### 6. Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🔄 Project Flow

### User Journey Flow

```
┌─────────────┐
│   START     │
└──────┬──────┘
       │
       ↓
┌─────────────────────────┐
│  Land on Home Page      │
│  (index.html)           │
└──────┬──────────────────┘
       │
       ├─────────────────────────────────────┐
       │                                     │
       ↓                                     ↓
┌─────────────────────┐          ┌──────────────────────┐
│  Not Registered?    │          │  Already Registered? │
│  Go to Register     │          │  Go to Login         │
│  (register.html)    │          │  (login.html)        │
└──────┬──────────────┘          └──────┬───────────────┘
       │                                │
       ├─ Validate Input                ├─ Validate Email & Password
       ├─ Hash Password                 ├─ Query Database
       ├─ Check Email Exists            ├─ Compare Password Hash
       ├─ Store in Database             ├─ Create Session
       ├─ Redirect to Login             └──────┬───────────────┘
       │                                       │
       └───────────────────────────────────────┘
                     │
                     ↓
       ┌─────────────────────────────┐
       │  User Authenticated         │
       │  Redirect to Catalogue      │
       │  (catalogue.html)           │
       └────────────┬────────────────┘
                    │
                    ├─ Load all books from /api/books
                    ├─ Display books in grid
                    ├─ Show filter options by category
                    │
                    ↓
       ┌─────────────────────────────┐
       │  Browse Books & Filter      │
       │  - View book details        │
       │  - Filter by category       │
       │  - Add to cart              │
       └────────────┬────────────────┘
                    │
                    ↓
       ┌─────────────────────────────┐
       │  View Shopping Cart         │
       │  (cart.html)                │
       │  - Review items             │
       │  - Adjust quantities        │
       │  - Calculate total          │
       └────────────┬────────────────┘
                    │
                    ↓
       ┌─────────────────────────────┐
       │  Place Order                │
       │  - POST /api/orders         │
       │  - Validate cart items      │
       │  - Create transaction       │
       │  - Insert order & items     │
       │  - Commit to database       │
       └────────────┬────────────────┘
                    │
                    ↓
       ┌─────────────────────────────┐
       │  Order Confirmation         │
       │  - Display order ID         │
       │  - Show total amount        │
       │  - Clear cart               │
       └────────────┬────────────────┘
                    │
                    ↓
       ┌─────────────────────────────┐
       │  View Order History         │
       │  - GET /api/orders          │
       │  - Display all past orders  │
       │  - Check order status       │
       └────────────┬────────────────┘
                    │
                    ↓
       ┌─────────────────────────────┐
       │  Logout                     │
       │  - POST /api/logout         │
       │  - Destroy session          │
       │  - Redirect to login        │
       └────────────┬────────────────┘
                    │
                    ↓
                  END
```

### API Endpoint Flow

```
Client Request
      ↓
   Express Middleware
   • Helmet (Security)
   • Session Management
   • Input Validation
   • Rate Limiting (Auth endpoints)
      ↓
   Route Handler
   • Process Request
   • Validate Input
   • Query Database
      ↓
   Database Operation
   • Execute SQL Query
   • Handle Transactions (Orders)
      ↓
   Response Preparation
   • Validate Results
   • Format JSON
      ↓
   Send Response to Client
```

### Data Flow in Order Placement

```
User clicks "Place Order"
       ↓
Cart.js sends POST /api/orders
       ↓
Server.js receives request
       ↓
Check if user is logged in (req.session.user)
       ↓
Validate cart items (non-empty, valid quantities)
       ↓
Get MySQL connection from pool
       ↓
BEGIN TRANSACTION
       ↓
For each item in cart:
  • Verify book exists in database
  • Get current price from DB (not from frontend)
  • Calculate item total
  • Add to order total
       ↓
INSERT new order into orders table
Get generated order ID
       ↓
INSERT each cart item into order_items table
       ↓
COMMIT TRANSACTION
       ↓
Release database connection
       ↓
Send success response with order ID
       ↓
Client receives confirmation
Display order number & total to user
```

---

## 🔐 Security Features

1. **Password Security**: Bcrypt hashing with salt rounds (12)
2. **HTTP Security**: Helmet.js for secure HTTP headers
3. **Session Management**: Secure session storage with httpOnly cookies
4. **Input Validation**: Express-validator with sanitization
5. **Rate Limiting**: 10 attempts per 15 minutes for auth endpoints
6. **SQL Queries**: Parameterized queries to prevent SQL injection
7. **Database Transactions**: ACID compliance for order placement
8. **Price Verification**: Server validates book prices from database (not trusting frontend)
9. **Authentication**: Session-based authentication for protected routes

---

## 📝 API Endpoints Reference

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/register` | Register new user | No |
| POST | `/api/login` | Login user | No |
| POST | `/api/logout` | Logout user | Yes |
| GET | `/api/session` | Check login status | No |

### Books
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/books` | Fetch all books | No |

### Orders
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/orders` | Place new order | Yes |
| GET | `/api/orders` | Get user's orders | Yes |

### Utility
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/test-db` | Test database connection | No |

---

## 🚀 Development Workflow

### Scripts Available

```bash
# Start production server
npm start

# Start development server with auto-reload
npm run dev
```

### Environment Variables

Required `.env` variables:
```
DB_HOST=localhost          # MySQL host
DB_USER=root               # MySQL user
DB_PASSWORD=password       # MySQL password
DB_NAME=bookstore          # Database name
DB_PORT=3306               # MySQL port
PORT=3000                  # Server port
SESSION_SECRET=secret123   # Session encryption secret
```

---

## 📦 Key Dependencies Explained

- **Express.js**: Core web framework for routing and middleware
- **MySQL2**: Database driver with promise support for async operations
- **Bcrypt**: Industry-standard password hashing algorithm
- **Express-Session**: Session middleware for user authentication
- **Helmet**: Secures Express app by setting various HTTP headers
- **Express-Validator**: Input validation and sanitization
- **Express-Rate-Limit**: Prevents brute force attacks on auth endpoints
- **Dotenv**: Loads environment variables from `.env` file

---

## 🔧 Troubleshooting

### Database Connection Issues
- Verify MySQL server is running
- Check `.env` credentials match your MySQL setup
- Ensure database and tables are created

### Port Already in Use
```bash
# Change PORT in .env or use:
PORT=3001 npm start
```

### Session Not Persisting
- Verify `SESSION_SECRET` is set in `.env`
- Check browser cookies are enabled
- Ensure cookies are not being cleared

### Books Not Loading
- Verify `books` table has data
- Check `/api/test-db` endpoint response
- Review browser console for errors

---

## 📌 Future Enhancement Ideas

- Payment gateway integration (Stripe, PayPal)
- Email notifications for orders
- Admin dashboard for book management
- Book reviews and ratings
- Advanced filtering and search
- User profile management
- Order tracking with real-time updates
- Wishlist functionality
- Promotional codes/coupons
- Multiple payment methods
- Inventory management

---

## 📄 License

ISC License

---

## 👤 Author

[Your Name/Organization]

---

## 📞 Support

For issues or questions, please create an issue or contact the development team.

---

**Last Updated**: 2024  
**Version**: 1.0.0
