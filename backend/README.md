# Qandil AI Backend

Fully functional MERN backend API for the Qandil AI application.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
The `.env` file is already set up with MongoDB URI. Update if needed:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Start the Server

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

## API Endpoints

### Profile Management

#### Create Profile
- **POST** `/api/profiles`
- **Body**:
```json
{
  "userId": "user123",
  "name": "Ahmed",
  "grade": 10,
  "level": "independent",
  "studySystem": "problem_solving",
  "preferredLanguage": "en",
  "goal": "high_grades"
}
```

#### Get All Profiles
- **GET** `/api/profiles`

#### Get Profile by ID
- **GET** `/api/profiles/:id`

#### Get Profile by User ID
- **GET** `/api/profiles/user/:userId`

#### Update Profile
- **PUT** `/api/profiles/:id`
- **Body**: Same as create profile

#### Delete Profile
- **DELETE** `/api/profiles/:id`

#### Health Check
- **GET** `/api/health`

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   └── Profile.js           # Profile schema and model
├── routes/
│   └── profileRoutes.js      # Profile API routes
├── middleware/
│   └── validation.js         # Input validation middleware
├── server.js                 # Main server file
├── package.json              # Dependencies
├── .env                       # Environment variables
└── README.md                  # This file
```

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **dotenv**: Environment variables
- **cors**: Cross-Origin Resource Sharing
- **express-validator**: Input validation
- **bcryptjs**: Password hashing (for future auth)
- **jsonwebtoken**: JWT tokens (for future auth)
- **nodemon**: Development auto-reload

## Status

✅ Backend fully set up and ready to use
✅ MongoDB connection configured
✅ Profile CRUD operations working
✅ Input validation implemented
✅ Error handling in place

## Next Steps

- Connect the Next.js frontend to these API endpoints
- Add authentication routes
- Add additional API features as needed
