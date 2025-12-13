# Uniform Room API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All authenticated requests require a Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Login
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /api/auth/me
```
*Requires Authentication*

### Update Profile
```http
PUT /api/auth/update-profile
```
*Requires Authentication*

**Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

### Change Password
```http
PUT /api/auth/change-password
```
*Requires Authentication*

**Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

---

## Products

### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `sort` (string): Sort field (default: -createdAt)
- `category` (ObjectId): Filter by category
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `search` (string): Search in name, description, tags
- `status` (string): active/draft/archived
- `featured` (boolean): Filter featured products

**Example:**
```http
GET /api/products?page=1&limit=12&category=66abc...&featured=true
```

### Get Single Product
```http
GET /api/products/:id
```

### Get Featured Products
```http
GET /api/products/featured/list
```

### Create Product (Admin)
```http
POST /api/products
```
*Requires Authentication & Admin Role*

**Body:**
```json
{
  "name": "Professional Shirt",
  "sku": "UNI-001",
  "description": "High-quality professional shirt",
  "shortDescription": "Premium quality",
  "category": "66abc...",
  "price": 69.99,
  "comparePrice": 89.99,
  "stock": 100,
  "colors": ["66def...", "66ghi..."],
  "sizes": ["66jkl...", "66mno..."],
  "images": [
    {
      "url": "https://...",
      "publicId": "...",
      "alt": "Product image"
    }
  ],
  "tags": ["professional", "uniform"],
  "featured": true,
  "status": "active"
}
```

### Update Product (Admin)
```http
PUT /api/products/:id
```
*Requires Authentication & Admin Role*

### Delete Product (Admin)
```http
DELETE /api/products/:id
```
*Requires Authentication & Admin Role*

---

## Categories

### Get All Categories
```http
GET /api/categories
```

**Query Parameters:**
- `status` (string): active/inactive
- `parent` (ObjectId): Filter by parent category

### Get Single Category
```http
GET /api/categories/:id
```

### Create Category (Admin)
```http
POST /api/categories
```
*Requires Authentication & Admin Role*

**Body:**
```json
{
  "name": "Men",
  "description": "Men's clothing",
  "image": {
    "url": "https://...",
    "publicId": "..."
  },
  "parent": null,
  "order": 1,
  "status": "active"
}
```

### Update Category (Admin)
```http
PUT /api/categories/:id
```

### Delete Category (Admin)
```http
DELETE /api/categories/:id
```

---

## Variants (Colors & Sizes)

### Get All Colors
```http
GET /api/variants/colors
```

### Create Color (Admin)
```http
POST /api/variants/colors
```

**Body:**
```json
{
  "name": "Sky Blue",
  "hex": "#82ACB6",
  "status": "active"
}
```

### Get All Sizes
```http
GET /api/variants/sizes
```

**Query Parameters:**
- `category` (string): General/Pants/Shoes/Kids/Other

### Create Size (Admin)
```http
POST /api/variants/sizes
```

**Body:**
```json
{
  "name": "L",
  "value": "Large",
  "category": "General",
  "order": 3,
  "status": "active"
}
```

---

## Inquiries

### Submit Inquiry (Public)
```http
POST /api/inquiries
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Product inquiry",
  "message": "I'd like to know more about...",
  "category": "Product Inquiry"
}
```

### Get All Inquiries (Admin)
```http
GET /api/inquiries
```

**Query Parameters:**
- `status` (string): new/in-progress/replied/archived
- `category` (string): Inquiry category
- `page` (number)
- `limit` (number)

### Update Inquiry (Admin)
```http
PUT /api/inquiries/:id
```

**Body:**
```json
{
  "status": "replied",
  "replyMessage": "Thank you for your inquiry..."
}
```

---

## Size Charts

### Get All Size Charts
```http
GET /api/size-charts
```

### Create Size Chart (Admin)
```http
POST /api/size-charts
```

**Body:**
```json
{
  "name": "Men's Shirts",
  "category": "66abc...",
  "measurements": [
    {
      "name": "Chest",
      "unit": "inches",
      "description": "Measure around fullest part"
    }
  ],
  "sizes": [
    {
      "size": "M",
      "measurements": {
        "chest": "38-40",
        "length": "29"
      }
    }
  ],
  "status": "active"
}
```

---

## Offers & Banners

### Get All Banners
```http
GET /api/offers/banners
```

### Create Banner (Admin)
```http
POST /api/offers/banners
```

**Body:**
```json
{
  "title": "Sale Upto 70% Off",
  "subtitle": "Special Offers",
  "description": "Limited time only",
  "image": {
    "url": "https://...",
    "publicId": "..."
  },
  "link": "/search",
  "buttonText": "Shop Now",
  "startDate": "2025-12-01",
  "endDate": "2025-12-31",
  "status": "active",
  "type": "hero"
}
```

### Get All Discounts
```http
GET /api/offers/discounts
```

### Verify Discount Code
```http
POST /api/offers/discounts/verify
```

**Body:**
```json
{
  "code": "SAVE20"
}
```

### Create Discount (Admin)
```http
POST /api/offers/discounts
```

**Body:**
```json
{
  "code": "SAVE20",
  "title": "20% Off",
  "description": "Get 20% off storewide",
  "type": "percentage",
  "value": 20,
  "minPurchase": 50,
  "maxDiscount": 100,
  "usageLimit": 1000,
  "startDate": "2025-12-01",
  "endDate": "2025-12-31",
  "status": "active"
}
```

---

## Orders

### Create Order
```http
POST /api/orders
```
*Requires Authentication*

**Body:**
```json
{
  "items": [
    {
      "product": "66abc...",
      "quantity": 2,
      "color": "66def...",
      "size": "66ghi..."
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "+1234567890",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "cod",
  "discount": {
    "code": "SAVE20",
    "amount": 20
  }
}
```

### Get My Orders
```http
GET /api/orders/my-orders
```
*Requires Authentication*

### Get All Orders (Admin)
```http
GET /api/orders
```

**Query Parameters:**
- `status` (string): Order status
- `paymentStatus` (string): Payment status
- `search` (string): Search order number
- `page` (number)
- `limit` (number)

### Update Order Status (Admin)
```http
PUT /api/orders/:id/status
```

**Body:**
```json
{
  "status": "shipped",
  "note": "Order shipped via FedEx",
  "trackingNumber": "TRACK123456"
}
```

---

## Image Upload

### Upload Single Image (Admin)
```http
POST /api/upload/image
```
*Requires Authentication & Admin Role*

**Form Data:**
- `image`: File
- `folder`: String (optional, default: "uniform-room")

### Upload Multiple Images (Admin)
```http
POST /api/upload/images
```
*Requires Authentication & Admin Role*

**Form Data:**
- `images`: Files (max 10)
- `folder`: String (optional)

### Delete Image (Admin)
```http
DELETE /api/upload/image/:publicId
```

---

## Recommended Products

### Get All Recommended Sections
```http
GET /api/recommended
```

**Response:**
```json
{
  "success": true,
  "data": {
    "homepage": [...],
    "most-popular": [...],
    "new-releases": [...],
    "trending": [...],
    "best-sellers": [...]
  }
}
```

### Get Recommended by Section
```http
GET /api/recommended/:section
```

**Sections:**
- homepage
- most-popular
- new-releases
- trending
- best-sellers

---

## Users (Admin Only)

### Get All Users
```http
GET /api/users
```

### Get Single User
```http
GET /api/users/:id
```

### Update User
```http
PUT /api/users/:id
```

### Delete User
```http
DELETE /api/users/:id
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [] // Validation errors if applicable
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error
