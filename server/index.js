import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';
import { Sequelize, DataTypes } from 'sequelize';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure upload directories exist
const uploadTemplatesDir = path.join(process.cwd(), 'uploads/templates');
const uploadCertificatesDir = path.join(process.cwd(), 'uploads/certificates');
fs.mkdirSync(uploadTemplatesDir, { recursive: true });
fs.mkdirSync(uploadCertificatesDir, { recursive: true });

// Serve static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 1. Database Initialization
const { Client } = pg;

async function ensureDatabaseExists() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres', // Connect to default postgres DB first
  });

  try {
    await client.connect();
    const dbName = process.env.DB_NAME || 'certificate_studio';
    
    // Check if db exists
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    if (res.rowCount === 0) {
      console.log(`Database "${dbName}" does not exist. Creating...`);
      // CREATE DATABASE query cannot run with parameters, but database name is sanitized/env controlled
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database "${dbName}" created successfully.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error('Error ensuring PostgreSQL database exists:', err.message);
  } finally {
    await client.end();
  }
}

// Ensure database exists before Sequelize connection
await ensureDatabaseExists();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'certificate_studio',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

// Models
const Template = sequelize.define('Template', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  placeholders: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
});

const Certificate = sequelize.define('Certificate', {
  templateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  recipientName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  details: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Sync database models
try {
  await sequelize.sync();
  console.log('PostgreSQL database synced successfully.');
} catch (error) {
  console.error('Unable to sync PostgreSQL database:', error);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/templates');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// API Routes

// 1. Get all templates
app.get('/api/templates', async (req, res) => {
  try {
    const templates = await Template.findAll({ order: [['id', 'DESC']] });
    res.json(templates);
  } catch (error) {
    console.error('Fetch templates error:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// 2. Upload template
app.post('/api/templates/upload', upload.single('image'), async (req, res) => {
  try {
    const { name, placeholders } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'No template image provided' });
    }

    const parsedPlaceholders = typeof placeholders === 'string' ? JSON.parse(placeholders) : placeholders;
    const imageUrl = `/uploads/templates/${req.file.filename}`;

    const template = await Template.create({
      name,
      image: imageUrl,
      placeholders: parsedPlaceholders
    });

    res.status(201).json(template);
  } catch (error) {
    console.error('Upload template error:', error);
    res.status(500).json({ error: 'Failed to upload template' });
  }
});

// 3. Delete template
app.delete('/api/templates/:id', async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Delete image file if exists
    const relativeImagePath = template.image.startsWith('/') ? template.image.substring(1) : template.image;
    const fullPath = path.join(process.cwd(), relativeImagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await template.destroy();
    res.json({ success: true, message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

// 4. Generate/Save Certificate
app.post('/api/certificates/generate', async (req, res) => {
  try {
    const { templateId, recipientName, details, imageBase64 } = req.body;

    let imageUrl = null;
    if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
      const filePath = path.join('uploads/certificates', filename);
      fs.writeFileSync(filePath, buffer);
      imageUrl = `/uploads/certificates/${filename}`;
    }

    const certificate = await Certificate.create({
      templateId: parseInt(templateId),
      recipientName,
      details,
      imageUrl
    });

    res.status(201).json(certificate);
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
