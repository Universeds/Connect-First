# Connect First - Non-Profit Needs Management System

A full-stack web application for managing non-profit needs and donations with role-based access control, built with React and Node.js/Express with MariaDB.

## Features

### Core Functionality
- **Simple Login System**: Trust-based authentication with role differentiation
- **Role-Based Access**: 
  - **U-fund Manager** (admin): Full CRUD operations on needs
  - **Helper** (any other username): Browse, search, and fund needs
- **Funding Basket**: Helpers can add needs to basket and checkout
- **Real-time Data Persistence**: All changes saved to MariaDB database
- **Search & Filter**: Search needs by keyword, filter by category and priority

### 10% Feature Enhancement: Priority & Time-Sensitive Needs Management

This feature implements an advanced needs management system that helps prioritize and organize urgent items to ensure critical community needs are addressed promptly.

**Key Components:**
1. **Priority Levels** (High/Medium/Low): Visual badges indicate urgency
2. **Time-Sensitive Flag**: Marks items with deadlines or seasonal relevance
3. **Category Management**: Organize needs (Food, Clothing, Toiletries, Medical, Education, Other)
4. **Frequency Tracking**: Automatically tracks how often each need is funded
5. **Smart Sorting**: Needs are automatically sorted by priority, time-sensitivity, and frequency
6. **Visual Indicators**: Color-coded badges and icons for quick identification

**How It Fits the Non-Profit Workflow:**
- Ensures urgent needs (medical supplies, perishable food) are funded first
- Helps identify seasonal items (winter coats, school supplies) requiring immediate attention
- Tracks high-demand items for bulk procurement planning
- Enables volunteers to make informed decisions about donation priorities
- Streamlines the donation process by highlighting critical needs

## Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Axios
- CSS3

**Backend:**
- Node.js
- Express.js
- MySQL2 (MariaDB driver)
- Express Session
- CORS

**Database:**
- MariaDB

## Prerequisites

- Node.js (v16 or higher)
- MariaDB (v10.6 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone and Navigate
```bash
cd Connect-First
```

### 2. Database Setup

**Install MariaDB** (if not already installed)

**Create Database:**
```sql
CREATE DATABASE connect_first;
CREATE USER 'cfuser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON connect_first.* TO 'cfuser'@'localhost';
FLUSH PRIVILEGES;
USE connect_first;
```

**Run Schema:**
```bash
# Connect to MariaDB and run:
source database/schema.sql
```

### 3. Backend Setup

```bash
cd backend
npm install
npm start
```
Backend runs on: `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend
npm install
npm start
```
Frontend runs on: `http://localhost:3000`

## Usage

### Login
- Navigate to `http://localhost:3000`
- Enter username:
  - Use `admin` for Manager access
  - Use any other username for Helper access

### Helper Workflow
1. Browse available needs on dashboard
2. Search for specific items using the search bar
3. Filter by category (Food, Clothing, etc.) or priority (High/Medium/Low)
4. Click "Add to Basket" on desired items
5. Navigate to Basket (🛒 icon in navbar)
6. Review items and adjust quantities
7. Click "Checkout & Fund" to complete donation
8. Items are removed from inventory and transaction is recorded

### Manager Workflow
1. Login as `admin`
2. View all needs in the cupboard
3. Click "Add New Need" to create an item:
   - Enter name, description, cost, quantity
   - Select category and priority level
   - Mark as time-sensitive if applicable
4. Edit existing needs by clicking "Edit"
5. Delete needs with "Delete" button
6. Monitor needs automatically sorted by priority

## Project Structure

```
Connect-First/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication middleware
│   ├── routes/          # API routes
│   └── server.js        # Express server
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # React components
│       ├── context/     # Auth context
│       ├── pages/       # Page components
│       ├── services/    # API services
│       └── App.js       # Main app component
├── database/
│   └── schema.sql       # Database schema
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/current` - Get current user

### Needs
- `GET /api/needs` - Get all needs
- `GET /api/needs/priority` - Get needs sorted by priority
- `GET /api/needs/search?q=keyword` - Search needs
- `GET /api/needs/category/:category` - Filter by category
- `POST /api/needs` - Create need (Manager only)
- `PUT /api/needs/:id` - Update need (Manager only)
- `DELETE /api/needs/:id` - Delete need (Manager only)

### Basket (Helper only)
- `GET /api/basket` - Get user's basket
- `POST /api/basket` - Add item to basket
- `PUT /api/basket/:id` - Update basket item quantity
- `DELETE /api/basket/:id` - Remove from basket
- `POST /api/basket/checkout` - Checkout and fund items

## Database Schema

### needs
- id, name, description, cost, quantity
- category, priority, is_time_sensitive, frequency_count
- created_at, updated_at

### baskets
- id, username, need_id, quantity, created_at

### users
- username, role, last_login

### transactions
- id, username, need_id, quantity, total_cost, transaction_date

## Security Features

- Session-based authentication
- Role-based access control
- Manager routes protected from Helper access
- Basket privacy (Managers cannot view Helper baskets)
- Input validation on all endpoints
- SQL injection protection via parameterized queries

## Development

**Backend Development:**
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

**Frontend Development:**
```bash
cd frontend
npm start  # Hot reload enabled
```

## Future Enhancements

- Email notifications for urgent needs
- Donation history and reports
- Statistical dashboard with charts
- PDF receipt generation
- Mobile app version
- Multi-language support
- Volunteer scheduling integration
- Impact metrics visualization

## Troubleshooting

**Database Connection Error:**
- Verify MariaDB is running: `sudo systemctl status mariadb`
- Check credentials in `backend/config/database.js`
- Ensure database and user exist

**Port Already in Use:**
- Backend: Change PORT in `backend/server.js`
- Frontend: Set PORT in `.env` file or use different port when prompted

**CORS Errors:**
- Verify backend is running on port 5000
- Check CORS configuration in `backend/server.js`

## License

MIT

## Contributors

Connect First Development Team
