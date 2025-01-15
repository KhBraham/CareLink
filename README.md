# CareLink - Healthcare Management System

CareLink is a comprehensive healthcare management system designed to streamline the interaction between patients and healthcare providers. Our platform offers a user-friendly interface for managing medical appointments, records, and communication between patients and doctors.

## 🌟 Features

- **Patient Portal**
  - Schedule and manage appointments
  - Access medical records
  - Chat with healthcare providers
  - View health-related news and updates
  - AI-powered chatbot for quick assistance

- **Doctor Dashboard**
  - Manage patient appointments
  - Access and update patient records
  - View daily schedule
  - Communicate with patients
  - Track patient history

- **Admin Panel**
  - Manage doctors and patients
  - Overview of system activities
  - Generate reports
  - System configuration

## 🚀 Getting Started

### Prerequisites

- PHP >= 8.1
- Composer
- Node.js >= 16.0
- npm or yarn
- MySQL/MariaDB
- Git

### Installation

#### Backend Setup (Laravel)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install PHP dependencies:
```bash
composer install
```

3. Create and configure your environment file:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Configure your database in `.env` file:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=carelink
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

6. Run migrations:
```bash
php artisan migrate
```

7. Start the backend server:
```bash
php artisan serve
```

#### Frontend Setup (Angular)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure the environment:
Update `src/environments/environment.ts` with your backend API URL if necessary.

4. Start the development server:
```bash
ng serve
```

The application will be available at `http://localhost:4200`

## 🔧 Technology Stack

### Backend
- Laravel 10
- MySQL
- PHP 8.1
- Laravel Sanctum for authentication
- OpenAI Integration for chatbot

### Frontend
- Angular 16
- TailwindCSS
- TypeScript
- RxJS
- Angular Material

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- Ibrahim Brahmi - Full Stack Developer

## 📞 Support

For support, email support@carelink.com or create an issue in the repository.
