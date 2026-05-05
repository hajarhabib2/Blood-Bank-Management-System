# Blood Bank Management System

A comprehensive Angular-based web application for managing blood donations, inventory, requests, and deliveries. Built with modern web technologies to connect donors, recipients, and blood banks.

## Project Overview

**Developed by:** Mahmoud Gamal, Omar Adel, and Hagar Habib (DEPI Team)

**Year:** 2025

## Technology Stack

- **Framework:** Angular 20.3.0
- **Styling:** Tailwind CSS 4.1.16
- **HTTP Client:** Axios
- **Mock API:** JSON Server
- **Package Manager:** npm

## Features

### Public Features

- **Home Page** - Hero section, statistics, how it works, testimonials, latest blog posts
- **Register as Donor** - Blood donor registration with eligibility tracking
- **Register as Recipient** - Patient blood request registration
- **Register Organization** - Blood bank/organization registration
- **Find Blood** - Search and locate blood banks
- **About Us** - Information about the platform
- **Blog** - Latest articles about blood donation
- **Login/Register** - User authentication
- **Blood Request** - Request blood for patients

### Dashboard Features

- **Organization Dashboard**
  - Overview with statistics
  - Donor management
  - Blood inventory management
  - Blood requests handling
  - Deliveries tracking
  - Reports generation

- **Admin Dashboard**
  - User management
  - Organization management
  - Blood bank oversight
  - System-wide analytics

## Data Models

The system manages the following data entities:

- **Inventory** - Blood units with type, status, expiry tracking
- **Donors** - Donor information, donation history, eligibility
- **Recipients** - Patient registration and blood requests
- **Requests** - Blood requests from hospitals
- **Deliveries** - Delivery tracking to hospitals
- **Organizations** - Blood bank organizations
- **Users** - System users with roles (admin, lab, coordinator, viewer, organization)
- **Alerts** - System notifications (low stock, expiring units, etc.)
- **Reports** - Daily statistics and analytics
- **Donations** - Donation records
- **Blogs** - Educational content

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
npm install
```

### Running the Application

Start both the Angular development server and JSON API:

```bash
npm start
```

This will:

- Start the Angular app at `http://localhost:4200`
- Start the mock API at `http://localhost:3000`

### Running Services Separately

**Angular Development Server:**

```bash
ng serve
```

**JSON Server (Mock API):**

```bash
npm run json-server
```

### Building

```bash
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── api/           # API configuration
│   │   └── models/        # TypeScript interfaces
│   ├── features/
│   │   ├── home/          # Home page components
│   │   ├── admin/         # Admin dashboard
│   │   ├── organization-dashboard/  # Organization management
│   │   ├── register-donor/
│   │   ├── register-recipient/
│   │   ├── register-org/
│   │   ├── find-blood/
│   │   ├── login/
│   │   ├── forget-password/
│   │   ├── blood-request/
│   │   ├── latest-blog/
│   │   └── about/
│   └── shared/
│       ├── components/     # Navbar, Footer
│       └── form/           # Reusable form components
├── mock-api/
│   └── db.json            # Mock database
└── index.html
```

## User Roles

- **Admin** - Full system access
- **Lab Technician** - Laboratory operations
- **Coordinator** - Donation coordination
- **Viewer** - Read-only access
- **Organization** - Organization-level access
- **Recipient** - Patient access

## Blood Types Supported

A+, A-, B+, B-, AB+, AB-, O+, O-

## License

This project is developed for educational purposes as part of the DEPI program.
