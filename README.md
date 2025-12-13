# Uniform Room Backend API

Backend API for Uniform Room E-commerce Platform built with Node.js, Express, and MongoDB.

## Features

- 🔐 JWT Authentication
- 📦 Product Management (CRUD)
- 🎨 Product Variants (Colors & Sizes)
- 📂 Category Management
- 💬 Inquiry Management
- 📏 Size Chart Management
- ⭐ Recommended Products
- 🏷️ Offers & Banners
- 📸 Image Upload (Cloudinary)
- 🛡️ Security Middleware
- ✅ Input Validation
- 📊 RESTful API Design

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update environment variables in `.env` file

4. Start development server:
```bash
npm run dev
```

5. Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Variants
- `GET /api/variants/colors` - Get all colors
- `POST /api/variants/colors` - Create color (Admin)
- `GET /api/variants/sizes` - Get all sizes
- `POST /api/variants/sizes` - Create size (Admin)

### Inquiries
- `GET /api/inquiries` - Get all inquiries (Admin)
- `POST /api/inquiries` - Submit inquiry
- `PUT /api/inquiries/:id` - Update inquiry status (Admin)
- `DELETE /api/inquiries/:id` - Delete inquiry (Admin)

### Size Charts
- `GET /api/size-charts` - Get all size charts
- `POST /api/size-charts` - Create size chart (Admin)
- `PUT /api/size-charts/:id` - Update size chart (Admin)

### Offers
- `GET /api/offers/banners` - Get all banners
- `POST /api/offers/banners` - Create banner (Admin)
- `GET /api/offers/discounts` - Get all discount codes
- `POST /api/offers/discounts` - Create discount (Admin)

### Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images

## Database Schema

See `/src/models` directory for all Mongoose schemas.

## Security

- Helmet for HTTP headers security
- Rate limiting
- JWT authentication
- Password hashing with bcrypt
- Input validation
- CORS protection

## License

ISC
