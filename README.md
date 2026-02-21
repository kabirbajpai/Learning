# Airbnb web application – MERN Stack Project

A full-stack Airbnb-style web application built using the **MERN stack**, featuring user authentication, property listings, reviews, sessions, and role-based authorization.

🌐 **Live Demo**  
https://airbnbproject-mern-stack-g97r.onrender.com/listings

---

## 🚀 Features

- User authentication (Sign up / Login / Logout)
- Session-based authentication using Passport.js
- Create, edit, and delete property listings
- Image support via image URLs
- Review and rating system
- Authorization (only owners can edit/delete listings)
- Flash messages for user feedback
- Secure sessions stored in MongoDB
- Server-side validation
- Custom error handling
- Responsive UI using EJS templates

---

## 🛠 Tech Stack

### Frontend
- EJS (Embedded JavaScript Templates)
- HTML5
- CSS3
- Bootstrap

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js
- Express-Session
- Connect-Mongo
- Method-Override
- Dotenv

---

## 📁 Project Structure


.
├── models/
│ ├── listing.js
│ ├── review.js
│ └── user.js
├── views/
│ ├── listings/
│ ├── users/
│ └── layouts/
├── public/
│ ├── css/
│ └── js/
├── utils/
│ └── expressError.js
├── app.js
├── package.json
└── README.md


---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add:


ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret


⚠️ **Do not commit `.env` files to GitHub**

---

## 🧑‍💻 Installation & Setup

1. Clone the repository

git clone https://github.com/your-username/airbnb-clone.git


2. Navigate to the project folder

cd airbnb-clone


3. Install dependencies

npm install


4. Start the server

node app.js


5. Open in browser

http://localhost:8080/listings


---

## 🔐 Authentication & Authorization

- Passport Local Strategy for authentication
- Password hashing and secure session handling
- Only listing owners can edit or delete listings
- Only review authors can delete their reviews

---

## 🧪 Validation & Error Handling

- Server-side validation for all forms
- Custom error handling using `expressError`
- Centralized error middleware
- User-friendly error pages

---

## 🔮 Future Improvements

- Image uploads using Cloudinary
- Map integration for property locations
- Search and filter functionality
- Pagination for listings
- React frontend implementation
- Admin role support

---

## 📄 License

MIT License

---

## 👤 Author

**Kabir Bajpai**  
MERN Stack Developer

---

⭐ If you like this project, don’t forget to star the repository!
