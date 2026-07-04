# STOCKER

A backend service for inventory and stock management providing secure RESTful APIs for product tracking, inventory updates, and warehouse operations.

## Live Demo

- Frontend: https://stocker-sigma.vercel.app


## Features

- 🔐 User authentication and role-based access control
- 📦 CRUD operations for inventory management
- 📊 Real-time stock monitoring
- ⚡ Scalable and performant architecture
- 🔄 RESTful API endpoints

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
git clone https://github.com/Mukuwul/STOCKER.git
cd STOCKER

2. **Install dependencies**
``` npm install ```

3. **Start the server**     
``` npm start ```


### API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Inventory
- `GET /api/inventory` - Get all items
- `POST /api/inventory` - Add new item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT secret key | Yes |

## Project Structure
``` STOCKER/
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
├── .env
├── .gitignore
├── package.json
└── server.js
```
## License

This project is licensed under the MIT License

## Contact

Mukul Negi - nmukul32@gmail.com
