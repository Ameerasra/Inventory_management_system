# Inventory-management-app.
This is a simple Inventory Management System developed as part of a PHP/Laravel Internship Assignment using Laravel, Inertia.js, React.js, and MySQL.  The application allows an authenticated user to manage inventory by adding and deducting items, tracking stock movement history, and searching items efficiently.

**Features**
User authentication (Laravel Starter Kit)
Add inventory items (single or multiple at once)
Deduct inventory items (single or multiple at once)
Support for multiple measurement units (Kg, m, cm, units, etc.)
Automatic tracking of inventory additions and deductions
View transaction history for each inventory item
Search inventory items by name
Validation and prevention of negative inventory values

**Tech Stack**
Backend: Laravel 12
Frontend: React.js (Inertia.js)
Database: MySQL
Authentication: Laravel Starter Kit (Inertia + React)

**Design Decisions & Best Practices**
MVC architecture using Laravel
Clear separation between business logic and UI
Database transactions for atomic inventory updates
Form request validation for secure data handling
Authenticated routes to protect inventory operations
Clean and minimal UI focused on usability

**Installation & Setup**
# Clone the repository
git clone <your-repository-url>

# Navigate to project directory
cd inventory-management-system

# Install backend dependencies
composer install

# Install frontend dependencies
npm install

# Environment setup
cp .env.example .env
php artisan key:generate

# Run database migrations
php artisan migrate

# Start development servers
php artisan serve
npm run dev
