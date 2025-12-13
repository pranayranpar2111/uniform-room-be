# Uniform Room Backend - Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for image uploads)

## Quick Start

### 1. Install Dependencies

```bash
cd uniform-room-be
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server
NODE_ENV=development
PORT=5000

# Database - Choose one:
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/uniform-room

# OR MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/uniform-room

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-use-long-random-string
JWT_EXPIRE=7d

# Cloudinary (Sign up at https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
```

### 3. Start MongoDB

**If using local MongoDB:**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**If using MongoDB Atlas:**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string
- Update MONGODB_URI in .env

### 4. Seed Database

Run the seed script to create initial data:

```bash
npm run seed
```

This will create:
- Admin user: `admin@uniformroom.com` / `admin123`
- Test user: `user@uniformroom.com` / `user123`
- Sample categories
- Colors and sizes

### 5. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:5000`

### 6. Verify Installation

Open your browser and visit:
```
http://localhost:5000/health
```

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-12-11T..."
}
```

## API Testing

### Using Postman or Thunder Client

1. **Register/Login to get token:**

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@uniformroom.com",
  "password": "admin123"
}
```

2. **Copy the token from response**

3. **Use token in subsequent requests:**

```http
GET http://localhost:5000/api/products
Authorization: Bearer YOUR_TOKEN_HERE
```

### Test Endpoints

```bash
# Health check
curl http://localhost:5000/health

# Get products
curl http://localhost:5000/api/products

# Get categories
curl http://localhost:5000/api/categories

# Get colors
curl http://localhost:5000/api/variants/colors

# Get sizes
curl http://localhost:5000/api/variants/sizes
```

## Cloudinary Setup (for Image Uploads)

1. Sign up at https://cloudinary.com
2. Go to Dashboard
3. Copy your:
   - Cloud name
   - API Key
   - API Secret
4. Add them to your `.env` file

**Test image upload:**

```bash
# Replace YOUR_TOKEN with admin token
curl -X POST http://localhost:5000/api/upload/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "folder=products"
```

## Project Structure

```
uniform-room-be/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js
│   │   └── cloudinary.js
│   ├── controllers/     # Request handlers
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   ├── variant.controller.js
│   │   ├── inquiry.controller.js
│   │   ├── sizeChart.controller.js
│   │   ├── offer.controller.js
│   │   ├── order.controller.js
│   │   ├── upload.controller.js
│   │   ├── recommended.controller.js
│   │   └── user.controller.js
│   ├── middleware/      # Custom middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   ├── upload.js
│   │   └── validator.js
│   ├── models/          # Mongoose models
│   │   ├── User.model.js
│   │   ├── Product.model.js
│   │   ├── Category.model.js
│   │   ├── Color.model.js
│   │   ├── Size.model.js
│   │   ├── Inquiry.model.js
│   │   ├── SizeChart.model.js
│   │   ├── Banner.model.js
│   │   ├── Discount.model.js
│   │   └── Order.model.js
│   ├── routes/          # API routes
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── category.routes.js
│   │   ├── variant.routes.js
│   │   ├── inquiry.routes.js
│   │   ├── sizeChart.routes.js
│   │   ├── offer.routes.js
│   │   ├── order.routes.js
│   │   ├── upload.routes.js
│   │   ├── recommended.routes.js
│   │   └── user.routes.js
│   ├── scripts/         # Utility scripts
│   │   └── seedData.js
│   └── server.js        # Entry point
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── API_DOCUMENTATION.md
└── SETUP_GUIDE.md
```

## Common Issues & Solutions

### MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
- Make sure MongoDB is running
- Check MONGODB_URI in .env file
- For Atlas, ensure IP is whitelisted

### JWT Token Error

**Error:** `JsonWebTokenError: jwt malformed`

**Solution:**
- Make sure JWT_SECRET is set in .env
- Check Authorization header format: `Bearer TOKEN`

### Cloudinary Upload Error

**Error:** `Invalid signature`

**Solution:**
- Verify CLOUDINARY credentials in .env
- Ensure no extra spaces in credentials

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
PORT=5001
```

## Production Deployment

### Environment Variables

Set these in production:

```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=long-random-production-secret
FRONTEND_URL=https://your-domain.com
```

### Security Checklist

- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Set secure CORS origins
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting
- [ ] Regular security updates
- [ ] Use MongoDB Atlas with IP whitelist
- [ ] Enable MongoDB authentication

### Deployment Platforms

**Recommended platforms:**
- Railway.app
- Render.com
- Heroku
- DigitalOcean App Platform
- AWS EC2 / Elastic Beanstalk

## Development Tips

### Auto-reload on changes

The dev script uses nodemon for auto-reload:
```bash
npm run dev
```

### MongoDB GUI Tools

- **MongoDB Compass** (Official)
- **Robo 3T**
- **Studio 3T**

### API Testing Tools

- **Postman**
- **Insomnia**
- **Thunder Client** (VS Code extension)
- **REST Client** (VS Code extension)

## Support

For issues or questions:
1. Check API_DOCUMENTATION.md
2. Review error logs
3. Check MongoDB connection
4. Verify environment variables

## Next Steps

1. Test all API endpoints
2. Connect frontend to backend
3. Implement additional features
4. Add payment gateway integration
5. Set up email service
6. Add analytics

Happy coding! 🚀
