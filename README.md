# Rebost

Rebost is a powerful tool to manage your shopping lists and cooking ingredients, designed to be your best companion in the supermarket and the kitchen.

With Rebost, you can:

- Generate and organize collaborative shopping lists.
- Track purchased items and their expiration dates.
- Maintain an inventory of your kitchen ingredients.
- Receive recipe suggestions based on your available ingredients.
- Automatically update your inventory after cooking.
---
## Installation

1. Make sure you have **Node.js** installed.  
2. Clone the repository (SSH):  
   ```bash
   git clone <git@github.com:alejandro-albiol/rebost.git>
   cd <repository-folder>
   ```
3. Install dependecies:
   ```bash
    npm install
   ```
4. Configure the .env file with your PostgreSQL database credentials.
---
## Database Setup

This app is configured to run in PostgreSQL. Use the following SQL commands to initialize the database:

### 1. Ingredients Table:
```SQL
CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    format VARCHAR(50) NOT NULL,
    UNIQUE (name, format)
);
```
### 2. Users Table:
```SQL
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);
```
### 3. User Inventory Table:
```SQL
CREATE TABLE user_inventory (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 2) NOT NULL,
    expiry_date DATE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    UNIQUE (user_id, ingredient_id, expiry_date)
);
```
### 4. Shopping List:
```SQL
CREATE TABLE shopping_lists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by INT REFERENCES users(id)
);
```
### 5. Shopping List Items:
```SQL
CREATE TABLE shopping_list_items (
    id SERIAL PRIMARY KEY,
    shopping_list_id INT REFERENCES shopping_lists(id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES ingredients(id),
    quantity DECIMAL(10, 2) NOT NULL,
    is_purchased BOOLEAN DEFAULT FALSE
);
```
---
## Features

- Collaborative Shopping Lists: Share lists with family or friends, and mark items as purchased in real time.
- Inventory Management: Keep track of what’s in your kitchen, including quantities and expiration dates.
- Smart Recipes: Get personalized recipe suggestions based on your inventory and dietary preferences.
---
## Future Plans

- Add notifications for expiring ingredients.
- Introduce barcode scanning for easier inventory management.
- Implement cost estimation for shopping lists.