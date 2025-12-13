const path = require('path');
const fs = require('fs');

// Mock Cloudinary for local development
const mockCloudinary = {
  uploader: {
    upload: async (filePath, options = {}) => {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const filename = path.basename(filePath);
      const publicId = `${Date.now()}-${filename}`;
      
      // Return mock response similar to Cloudinary
      return {
        public_id: publicId,
        secure_url: `http://localhost:5005/uploads/${filename}`,
        url: `http://localhost:5005/uploads/${filename}`,
        format: path.extname(filename).slice(1),
        resource_type: 'image',
        created_at: new Date().toISOString(),
      };
    },
    
    destroy: async (publicId) => {
      // Simulate deletion
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return {
        result: 'ok'
      };
    }
  }
};

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return process.env.CLOUDINARY_CLOUD_NAME && 
         process.env.CLOUDINARY_API_KEY && 
         process.env.CLOUDINARY_API_SECRET &&
         process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name' &&
         process.env.CLOUDINARY_API_KEY !== 'your-api-key';
};

let cloudinary;

if (isCloudinaryConfigured()) {
  // Use real Cloudinary
  cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✓ Using real Cloudinary configuration');
} else {
  // Use mock Cloudinary for local development
  cloudinary = mockCloudinary;
  console.log('⚠️  Using local file storage (Cloudinary not configured)');
  console.log('   Images will be stored in /uploads directory');
}

module.exports = cloudinary;
