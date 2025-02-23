Tablesprint
Description
Tablesprint is a web application designed for managing products, categories, and subcategories. It provides a robust interface for product management with features like user registration, authentication, and data storage through MySQL. This project delivers an intuitive and easy-to-use platform for managing a diverse range of items.

Features
✅ User Registration & Authentication: Secure login system with JWT authentication. ✅ CRUD Operations: Perform create, read, update, and delete operations on products, categories, and subcategories. ✅ Client-Side Rendering: The frontend is powered by React for a dynamic user experience. ✅ JWT-based Authentication: Ensures secure user sessions. ✅ MySQL Database: Relational database used for managing user and product data. ✅ Cloudinary Integration: For managing and storing images used for products.

Tech Stack
Frontend:
⚛️ React.js (for dynamic UI rendering)
📡 Axios (for HTTP requests)
🎨 Bootstrap (for responsive UI)
Backend:
🟢 Node.js (for server-side logic)
🚀 Express.js (Web framework for Node.js)
🔑 JWT (for authentication)
🗄️ MySQL (for database management)
☁️ Cloudinary (for image storage)
Other Tools:
📦 npm (Package manager for dependencies)
🔐 bcryptjs (for hashing passwords)
Prerequisites
Before you begin, ensure you have the following installed on your local machine:

📌 Node.js (v14 or higher)
📌 npm (v6 or higher)
📌 MySQL (v5.7 or higher)
Installation
Follow these steps to set up the project locally:

1️⃣ Clone the repository:
git clone https://github.com//sanskarmm/tablesprint.git
2️⃣ Navigate to the project directory:
cd tablesprint
3️⃣ Create a .env file with the necessary environment variables:
In the root of the project, create a .env file and add the following variables:

PORT=5000
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
JWT_SECRET=your-jwt-secret
MYSQL_HOST=localhost
MYSQL_USERNAME=your-mysql-username
MYSQL_PASSWORD=your-mysql-password
MYSQL_DATABASE_NAME=your-mysql-database-name
Note: Replace your-* placeholders with your actual values.

4️⃣ Install dependencies:
Run the following command to install the necessary packages for both frontend and backend:

npm install
5️⃣ Start the development server:
Open two terminals, one for the backend and one for the frontend.

Backend:
cd backend
npm run dev
Frontend:
cd frontend
npm run dev
Usage
Register a User
by create user 
or
To register a user, you can either use Postman or ThunderClient (VS Code Extension) to send a POST request to:

POST http://localhost:5000/api/v1/user/register
Example User JSON:
{
  "name": "john doe",
  "email": "johndoe@gmail.com",
  "password": "12345678",
  "confirmPassword": "12345678"
}
Alternatively, you can manually insert the user into the MySQL database. Here's how you can generate a hashed password using Node.js:

const bcrypt = require('bcryptjs');
const password = "12345678";
const hashedPassword = bcrypt.hashSync(password, 10);
console.log(hashedPassword);
Once you generate the hashed password, insert the user into your database:

INSERT INTO users (name, email, password)
VALUES ('john doe', 'johndoe@gmail.com', 'hashed_password_here');
Login
After successfully registering, navigate to http://localhost:5173/ in your browser.
Enter your registered email and password.
Click the Login button.
Dashboard
Once logged in, you will be redirected to the dashboard, where you can perform actions on products, categories, and subcategories:

➕ Add Items: Use the Add Category, Add Subcategory, and Add Product buttons in their respective sections.
✏️ Edit/Delete Items: Modify or remove items by clicking on the edit or delete icons in the action column.
Database Schema
Users Table 📌
Stores user information (name, email, password).
Categories Table 📌
Stores category data for organizing products.
Subcategories Table 📌
Stores subcategory data that belongs to categories.
Products Table 📌
Stores information about products, including their categories and subcategories.
📜 License
This project is open-source and available for modification or further development.

📞 Contact
For any queries or issues, feel free to reach out!

Happy Coding! 🚀
