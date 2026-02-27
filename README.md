# 🎈 Balloons Galore

A full-stack e-commerce platform for a balloon and gift delivery business based in Sri Lanka. Built as a portfolio project to demonstrate end-to-end web application development — from a responsive customer-facing storefront to a complete order management system for admins.


---

## ✨ Features

### Customer Side
- Browse products by category with detailed product pages
- Add to cart with custom variations (float type, inflation, wording, colors, etc.)
- Bank transfer payment with receipt upload
- Order confirmation page with full order summary
- Order tracking by order number

### Admin Panel
- Secure login with JWT authentication
- Dashboard with live statistics (total orders, revenue, pending, completed)
- Order management with search and status filters
- Order detail view with customer info, items, and payment proof
- Update order status and payment status in real time

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, Tailwind CSS, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Authentication | JSON Web Tokens (JWT) |
| Email | Nodemailer |
| File Uploads | Multer |

---

## 📁 Project Structure

```
balloons-galore/
├── frontend/
│   ├── index.html
│   ├── products.html
│   ├── helium-des.html        # Product detail page
│   ├── cart.html
│   ├── checkout.html
│   ├── order-confirmation.html
│   ├── order-tracking.html
│   ├── admin-login.html
│   ├── admin-dashboard.html
│   ├── admin-orders.html
│   ├── admin-order-detail.html
│   └── js/
│       ├── products.js        # Product data
│       └── cart.js            # Cart logic (localStorage)
└── backend/
    └── src/
        ├── server.js
        ├── config/
        ├── controllers/
        ├── routes/
        ├── middleware/
        └── utils/
```

---

## 🔌 API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/orders` | Public | Create new order |
| GET | `/api/orders/track/:orderNumber` | Public | Track order by number |
| POST | `/api/orders/:orderNumber/payment-proof` | Public | Upload payment receipt |
| GET | `/api/orders` | Admin | Get all orders (with filters) |
| GET | `/api/orders/:orderNumber/details` | Admin | Get order details |
| PATCH | `/api/orders/:orderNumber/status` | Admin | Update order status |
| POST | `/api/auth/login` | Public | Admin login |
| GET | `/api/health` | Public | Server health check |

---

## 🚀 Deployment


---

## 👤 Author

**Abdul Hakeem**

