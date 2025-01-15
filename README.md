# CareLink - Healthcare Management System

CareLink is a modern healthcare management platform that connects patients with healthcare providers through an intuitive and secure interface. Our system facilitates seamless communication between patients and doctors while providing comprehensive medical record management.

## 🌟 Features

### For Patients
- **Home Dashboard**
  - View upcoming appointments
  - Access quick health tips and medical news
  - Get personalized health recommendations
  - Interact with AI-powered medical chatbot for instant assistance

- **Find Doctor**
  - Search and browse available doctors
  - View doctor profiles and specialties
  - Schedule appointments with preferred doctors
  - Choose convenient appointment slots

- **Medical Records**
  - Access complete medical history
  - View and download medical reports
  - Track treatment progress
  - Manage prescriptions and medications

- **Profile Management**
  - Update personal information
  - Manage contact details
  - View appointment history
  - Set communication preferences

### For Doctors
- **Home Dashboard**
  - View daily schedule
  - Access patient appointments
  - Get medical news updates
  - Quick access to patient records

- **Appointment Management**
  - View detailed appointment information
  - Manage appointment schedule
  - Access patient medical history
  - Add appointment notes and prescriptions

- **Profile Settings**
  - Manage professional information
  - Update availability schedule
  - Set consultation hours
  - Manage specialization details

### For Administrators
- **Dashboard Overview**
  - Monitor system activities
  - Track appointment statistics
  - View user registrations
  - System health monitoring

- **User Management**
  - Manage doctor accounts
  - Handle patient registrations
  - Edit user information
  - Control user access and permissions

- **Appointment Administration**
  - Override appointment settings
  - Manage scheduling conflicts
  - Handle cancellations and reschedules
  - Monitor appointment analytics

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
php artisan serve --port 8000
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
ng serve --port 4200
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
