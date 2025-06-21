# API Configuration

This project now uses a unified API configuration system that manages all API endpoints through environment variables.

## Files Created/Modified

### New Files:
- `.env` - Environment configuration file
- `.env.example` - Example environment file for reference
- `src/config/api.js` - Centralized API configuration module

### Modified Files:
All components and pages that make API calls have been updated to use the centralized configuration:

- `src/context/AuthContext.js`
- `src/pages/dashboard/Dashboard.jsx`
- `src/pages/bills/Bills.jsx`
- `src/pages/bills/Bill_Profile.jsx`
- `src/pages/customers/Customers.jsx`
- `src/pages/employees/Employees.jsx`
- `src/pages/cities/Cities.jsx`
- `src/pages/city/City.jsx`
- `src/pages/customerProfile/CustomerProfile.jsx`
- `src/pages/TankProfile/TankProfile.jsx`
- `src/pages/newTank/NewTank.jsx`
- `src/pages/updateTank/UpdateTank.jsx`
- `src/pages/newCity/NewCity.jsx`
- `src/pages/newCustomer/NewCustomer.jsx`
- `src/pages/newEmployee/NewEmployee.jsx`
- `src/pages/auth/Login.jsx`
- `src/pages/auth/ForgotPassword.jsx`
- `src/pages/adminProfile/AdminProfile.jsx`
- `src/pages/adminProfile/DataForm.jsx`
- `src/pages/adminProfile/PasswordForm.jsx`
- `src/components/navbar/Navbar.jsx`

## Configuration

### Environment Variables

The API base URL is configured through the `REACT_APP_API_BASE_URL` environment variable:

```bash
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

### Usage in Components

All components now import and use the centralized API configuration:

```javascript
import { API_BASE_URL } from "../../config/api";

// Usage
axios.get(`${API_BASE_URL}/endpoint`)
```

## Environment Setup

### Development
Copy `.env.example` to `.env` and configure for your local development environment:
```bash
cp .env.example .env
```

### Production
Set the environment variable to your production API URL:
```bash
REACT_APP_API_BASE_URL=https://your-production-api.com/api
```

### Staging
For staging environments:
```bash
REACT_APP_API_BASE_URL=https://staging-api.your-domain.com/api
```

## API Endpoints Standardized

All the following endpoints now use the unified configuration:

- `/dashboard`
- `/tank/main-tank/{id}`
- `/tank/{id}`
- `/tank/`
- `/tank/{id}/pump-water`
- `/tank/main-tank-value-ultrasonic/{id}`
- `/customer`
- `/customer/{id}`
- `/bill`
- `/bill/{id}`
- `/bill/{id}/pay-admin`
- `/bill/{id}/payment-success`
- `/admin`
- `/admin/{id}`
- `/admin/current-user`
- `/admin/login`
- `/admin/logout`
- `/admin/forgot-password`
- `/admin/update-profile`
- `/admin/update-password`
- `/city`
- `/city/{id}`
- `/search`

## Benefits

1. **Centralized Configuration**: All API URLs are managed in one place
2. **Environment Flexibility**: Easy switching between development, staging, and production
3. **Maintainability**: No more hardcoded URLs scattered throughout the codebase
4. **Consistency**: All API calls follow the same pattern
5. **Easy Deployment**: Simple environment variable changes for different environments
