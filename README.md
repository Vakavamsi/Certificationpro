# CertificationPro (Certificate Studio) 🎓

A full-stack web application that allows users to seamlessly design, generate, and manage custom certificates. 

## 🚀 Features

- **Template Management:** Upload and manage base certificate templates.
- **Dynamic Text Overlay:** Add dynamic participant names, course details, and dates on top of templates.
- **Instant Preview:** Real-time canvas preview of how the certificate will look.
- **Export & Download:** Generate high-quality certificate images and download them directly to your device.
- **Modern UI:** Built with a beautiful, responsive, and premium React interface.

## 🛠️ Technology Stack

### Frontend (`/certificate-generator`)
- **React.js** with **Vite** for lightning-fast development.
- **TypeScript** for static typing and robust code.
- **HTML5 Canvas** for rendering text over image templates.
- **CSS3** with modern design principles (gradients, glassmorphism, responsive grids).

### Backend (`/server`)
- **Node.js & Express** for the REST API.
- **PostgreSQL** as the relational database.
- **Sequelize ORM** for database models and queries.
- **Multer** for handling multipart/form-data (image template uploads).

---

## 💻 Getting Started (Local Development)

### Prerequisites
- Node.js (v16+)
- PostgreSQL (running locally or in the cloud)

### 1. Database Setup
Ensure PostgreSQL is running and create a database for the project:
```sql
CREATE DATABASE certificate_studio;
```

### 2. Backend Setup
Navigate to the server directory, install dependencies, and start the API:
```bash
cd server
npm install

# Create a .env file based on your local database credentials
# Example:
# PORT=5000
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=certificate_studio
# DB_USER=postgres
# DB_PASSWORD=your_password

# Start the server (runs on port 5000 by default)
npm run dev
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, install dependencies, and start the Vite dev server:
```bash
cd certificate-generator
npm install

# Start the frontend app (runs on port 5173 by default)
npm run dev
```

### 4. View App
Open your browser and navigate to `http://localhost:5173` to view the application!

---

## 📜 License
This project is licensed under the MIT License.
