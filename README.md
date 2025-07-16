# 🧳 Smart Travel Booking Platform

A full-stack travel booking web application that allows users to explore destinations, make bookings, and manage their travel plans seamlessly. Built with modern technologies for an intuitive and responsive user experience.

## 🚀 Live Demo

👉 [View Live](https://smart-travel-booking-platform.vercel.app)

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Next.js
- Tailwind CSS
- TypeScript

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- REST API

**Others:**
- JWT Authentication
- Cloudinary (Image Upload)
- Vercel (Deployment)

## ✨ Features

- 🌍 Browse and search for travel destinations
- 🛫 Book trips with travel details and preferences
- 🔐 User authentication and authorization (JWT)
- 🧑‍💼 Admin dashboard to manage bookings and destinations
- 📸 Upload and manage images with Cloudinary
- 📱 Fully responsive design for all devices

## 📂 Project Structure

```bash
smartTravelBookingPlatform/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── api/                # API integration layer
│   │   │   ├── axios.js        # Axios instance configuration
│   │   │   ├── flightApi.js    # Flight-related API calls
│   │   │   └── index.js        # API exports
│   │   ├── assets/            # Static assets (images, icons)
│   │   ├── components/        # Reusable React components
│   │   │   ├── Flights.jsx    # Flight listing component
│   │   │   ├── Hero.jsx       # Hero section component
│   │   │   ├── Hotels.jsx     # Hotel listing component
│   │   │   ├── Navbar.jsx     # Navigation component
│   │   │   └── PaymentForm.jsx # Payment form component
│   │   ├── context/           # React Context providers
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── pages/             # Page components
│   │   │   ├── Flight.jsx     # Flight listing page
│   │   │   ├── FlightDetail.jsx # Flight details page
│   │   │   ├── Hotels.jsx     # Hotel listing page
│   │   │   ├── Login.jsx      # Login page
│   │   │   ├── Myprofile.jsx  # User profile page
│   │   │   ├── PaymentSuccess.jsx # Payment success page
│   │   │   └── Signup.jsx     # Signup page
│   │   ├── App.jsx            # Main application component
│   │   ├── main.jsx           # Application entry point
│   │   └── index.css          # Global styles
│   ├── public/                # Public static files
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
│
├── server/                     # Backend Node.js application
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   └── db.js          # Database configuration
│   │   ├── controllers/       # Route controllers
│   │   │   ├── auth.controller.js    # Authentication logic
│   │   │   ├── booking.controller.js # Booking logic
│   │   │   └── flight.controller.js  # Flight logic
│   │   ├── middleware/        # Custom middleware
│   │   │   └── auth.js        # Authentication middleware
│   │   ├── models/            # Database models
│   │   │   ├── booking.model.js      # Booking schema
│   │   │   └── user.model.js         # User schema
│   │   ├── routes/            # API routes
│   │   │   ├── auth.routes.js        # Authentication routes
│   │   │   ├── booking.routes.js     # Booking routes
│   │   │   └── flight.routes.js      # Flight routes
│   │   ├── utils/             # Utility functions
│   │   ├── index.js           # Express app setup
│   │   └── server.js          # Server entry point
│   ├── package.json           # Backend dependencies
│   └── .env                   # Environment variables
│
└── README.md                  # Project documentation

Key Features:
1. Frontend (client/):
   - React with Vite for fast development
   - Component-based architecture
   - Context API for state management
   - Axios for API communication
   - Responsive design with Tailwind CSS

2. Backend (server/):
   - Node.js with Express
   - MongoDB database
   - JWT authentication
   - MVC architecture
   - Integration with Aviation Stack API

3. Main Functionality:
   - User authentication (login/signup)
   - Flight search and booking
   - Hotel booking
   - Payment processing
   - User profile management
   - Real-time flight status

4. API Endpoints:
   - /api/auth/* - Authentication routes
   - /api/flights/* - Flight-related routes
   - /api/bookings/* - Booking management
   - /api/hotels/* - Hotel-related routes

5. Security Features:
   - JWT-based authentication
   - Protected routes
   - Environment variable configuration
   - Secure password handling


```

```Bash
git clone https://github.com/nyirurugoomar/smartTravelBookingPlatform.git
cd smartTravelBookingPlatform
```
```Bash
# For client
cd client
npm install

# For server
cd ../server
npm install
```
```Bash
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

```

```Bash
# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm run dev
```
