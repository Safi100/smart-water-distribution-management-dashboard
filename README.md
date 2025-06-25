# Smart Water Distribution Management Dashboard

A comprehensive React-based dashboard for managing smart water distribution systems, providing real-time monitoring, customer management, billing, and administrative controls.

> **Note**: This is the software component of a Computer Engineering graduation project, designed to provide a complete digital solution for smart water distribution management.

## 🌊 Features

### Core Functionality

- **Real-time Dashboard**: Monitor water distribution systems with live data visualization
- **Water Tank Management**: Track tank levels, status, and maintenance schedules
- **Customer Management**: Complete customer database with profiles and service history
- **Employee Management**: Staff administration and role-based access control
- **City Management**: Multi-city support with geographical organization
- **Billing System**: Automated billing generation and payment tracking
- **Hardware Monitoring**: Real-time hardware status and detailed diagnostics

### Technical Features

- **Responsive Design**: Mobile-first approach with Material-UI components
- **Interactive Maps**: Mapbox integration for geographical visualization
- **Data Visualization**: Charts and graphs using Chart.js
- **Authentication**: Secure login system with JWT token management
- **Real-time Updates**: Live data synchronization
- **Payment Integration**: Stripe payment processing support

## 🛠️ Technology Stack

### Frontend

- **React 19.0.0** - Modern React with latest features
- **Material-UI (MUI) 6.4.4** - Component library and design system
- **React Router DOM 7.1.5** - Client-side routing
- **Chart.js 4.4.9** - Data visualization
- **Mapbox GL 3.10.0** - Interactive maps
- **Framer Motion 12.4.7** - Smooth animations
- **Axios 1.7.9** - HTTP client for API communication

### UI/UX Libraries

- **Material React Table 3.2.0** - Advanced data tables
- **React Select 5.10.1** - Enhanced select components
- **React Toastify 11.0.3** - Toast notifications
- **Lottie React** - Animated illustrations

### Payment Processing

- **Stripe React** - Payment integration

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── navbar/          # Navigation component
│   ├── WaterTank/       # Water tank visualization
│   ├── HardwareInfo/    # Hardware monitoring components
│   └── loading/         # Loading states
├── pages/               # Application pages
│   ├── dashboard/       # Main dashboard
│   ├── auth/           # Authentication pages
│   ├── customers/      # Customer management
│   ├── employees/      # Employee management
│   ├── cities/         # City management
│   ├── bills/          # Billing system
│   └── TankProfile/    # Tank details
├── context/            # React Context providers
│   └── AuthContext.js  # Authentication state management
├── config/             # Configuration files
│   └── api.js          # API configuration and interceptors
└── App.js              # Main application component
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Backend API server running (default: http://localhost:8000/api)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd smart-water-distribution-management-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   REACT_APP_API_BASE_URL=http://localhost:8000/api
   REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_key_here
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

   The application will open at `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🔐 Authentication

The application uses JWT-based authentication with automatic token management:

- Tokens are stored in localStorage
- Automatic token refresh and validation
- Protected routes with authentication guards
- Automatic redirect to login on token expiration

## 🗺️ Key Pages and Routes

| Route           | Component       | Description                  |
| --------------- | --------------- | ---------------------------- |
| `/`             | Dashboard       | Main dashboard with overview |
| `/login`        | Login           | User authentication          |
| `/customers`    | Customers       | Customer management          |
| `/employees`    | Employees       | Staff management             |
| `/cities`       | Cities          | City administration          |
| `/bills`        | Bills           | Billing system               |
| `/add-customer` | NewCustomer     | Add new customer             |
| `/add-employee` | NewEmployee     | Add new employee             |
| `/add-city`     | NewCity         | Add new city                 |
| `/add-tank`     | NewTank         | Add new water tank           |
| `/tank/:id`     | TankProfile     | Tank details                 |
| `/customer/:id` | CustomerProfile | Customer details             |

## 🔧 Configuration

### API Configuration

The API configuration is centralized in `src/config/api.js`:

- Base URL configuration
- Request/response interceptors
- Automatic authorization header injection
- Token expiration handling

### Environment Variables

- `REACT_APP_API_BASE_URL`: Backend API endpoint
- `REACT_APP_MAPBOX_TOKEN`: Mapbox access token for maps
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key

## 🎨 Styling and Theming

- **Material-UI Theme**: Consistent design system
- **CSS Modules**: Component-scoped styling
- **Responsive Design**: Mobile-first approach
- **Custom Components**: Branded UI elements

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support and questions, please contact the development team.

---

**Built with ❤️ for efficient water distribution management**
