# AI Jobs - LocalStorage Version

This is a simplified version of the AI Jobs project that uses browser localStorage instead of a database. This makes it easy to run and test the application without setting up any external dependencies.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

This version uses browser localStorage to store:
- User accounts
- Job listings
- Resumes
- Authentication state

### Pre-seeded Data

The application comes with pre-seeded data:

**Users:**
- Jobseeker: `jobseeker@example.com` / `password123`
- Employer: `employer@example.com` / `password123`

**Jobs:**
- Several job listings from the employer account

### Important Files

- `src/utils/localStorage.ts` - Contains all the utility functions for interacting with localStorage
- `src/components/LocalStorageInitializer.tsx` - Initializes localStorage on app startup

## Features

All the main features of the application work with localStorage:
- User registration & login
- Resume upload (files are stored as URLs)
- Job listing and browsing
- Job creation (for employers)

## Limitations

Since this is a simplified version that uses localStorage instead of a real database:

1. Data is only stored in the browser and will be lost if localStorage is cleared
2. Files uploaded are not actually processed or stored (only simulated)
3. No real backend processing or AI functionality
4. Data is not shared between browsers or devices

## Switching to a Real Database

When you're ready to use a real database:

1. Set up a PostgreSQL database
2. Configure the Prisma connection in `.env`
3. Remove the localStorage initialization from `src/app/layout.tsx`
4. Restore the original API implementations that use Prisma

## Additional Notes

This localStorage implementation is designed for development and testing purposes only and should not be used in production. In a production environment, you should use proper database storage, user authentication, and security measures. 