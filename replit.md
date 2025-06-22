# Bill Bana - GST Bill Generator

## Overview

Bill Bana is a GST bill generator application designed for Indian small shops. It's a full-stack web application that allows users to create professional invoices with automatic GST calculations and multiple template options. The application is built with React on the frontend and Express.js on the backend, with PostgreSQL database support.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom theme variables for multiple color schemes
- **UI Components**: Radix UI components via shadcn/ui design system
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: PostgreSQL-based session storage (connect-pg-simple)
- **Development**: In-memory storage fallback for development
- **API**: RESTful API structure with /api prefix

### Database Schema
- **Users Table**: Basic user authentication with username/password
- **ORM**: Drizzle ORM with Zod schema validation
- **Migrations**: Automatic schema management via drizzle-kit

## Key Components

### Invoice Management
- **Multiple Templates**: Classic, Modern, Simple, and Itemized layouts
- **Theme Support**: Blue, Green, Orange, and Purple color schemes
- **GST Calculations**: Automatic tax calculations for Indian GST compliance
- **PDF Generation**: Client-side PDF export using jsPDF library

### Form Components
- **Shop Details Form**: Business information input
- **Customer Details Form**: Client information management
- **Items Manager**: Dynamic item addition with real-time calculations
- **Template Selector**: Visual template preview and selection

### UI/UX Features
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Real-time Preview**: Live invoice preview as users input data
- **Accessibility**: Comprehensive screen reader support via Radix UI
- **Toast Notifications**: User feedback system for actions

## Data Flow

1. **User Input**: Forms collect shop, customer, and item details
2. **Real-time Calculation**: GST and totals calculated automatically
3. **Live Preview**: Invoice preview updates in real-time
4. **Template Selection**: Users can switch between different invoice layouts
5. **PDF Export**: Client-side PDF generation for download/print

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React with shadcn/ui component library
- **Styling**: Tailwind CSS with PostCSS processing
- **PDF Generation**: jsPDF for client-side PDF creation
- **Date Handling**: date-fns for date formatting
- **Form Management**: React Hook Form with Zod validation

### Backend Dependencies
- **Database**: Neon Database serverless PostgreSQL
- **ORM**: Drizzle ORM with PostgreSQL adapter
- **Session Storage**: connect-pg-simple for PostgreSQL sessions
- **Development Tools**: tsx for TypeScript execution

### Development Tools
- **Build System**: Vite with React plugin
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Backend bundling for production deployment

## Deployment Strategy

### Development Environment
- **Database**: Replit PostgreSQL 16 module
- **Runtime**: Node.js 20 with automatic restarts
- **Hot Reload**: Vite HMR for frontend, tsx watch for backend
- **Port Configuration**: Backend on port 5000, frontend proxy

### Production Build
- **Frontend**: Vite build with optimized assets
- **Backend**: ESBuild bundling for Node.js deployment
- **Static Assets**: Served from dist/public directory
- **Environment**: Production NODE_ENV with optimizations

### Replit Configuration
- **Autoscale Deployment**: Configured for automatic scaling
- **Build Commands**: npm run build for production assets
- **Start Command**: npm run start for production server
- **Port Mapping**: Internal 5000 to external 80

## Changelog
```
Changelog:
- June 22, 2025. Initial setup with basic GST bill generator functionality
- June 22, 2025. Professional UI/UX enhancement - Added glassmorphism effects, enhanced shadows, professional gradients, improved typography, step indicators, real-time preview indicators, enhanced form interactions with hover effects, comprehensive footer with feature highlights, and improved mobile responsiveness
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```