# Sherbiny Kitchen Frontend

A modern React frontend for the Sherbiny Kitchen Recipe Generator API. This application provides a user-friendly interface for generating AI-powered recipes based on available ingredients.

## Features

- 🍳 **AI-Powered Recipe Generation** - Create unique recipes using available ingredients
- 👤 **User Authentication** - Register, login, and manage your account
- 📚 **Recipe Collection** - Save and organize your favorite recipes
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile-Friendly** - Optimized for all device sizes
- ⚡ **Real-time Feedback** - Toast notifications and loading states

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or pnpm
- The backend API running on `http://localhost:3000`

### Installation

1. Navigate to the client directory:
   ```bash
   cd packages/client
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
pnpm build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation
│   └── ProtectedRoute.tsx # Route protection component
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Login.tsx       # Login form
│   ├── Register.tsx    # Registration form
│   ├── RecipeGenerator.tsx # Recipe generation interface
│   └── MyRecipes.tsx   # Saved recipes display
├── services/           # API services
│   └── api.ts          # HTTP client and API endpoints
├── types/              # TypeScript type definitions
│   └── index.ts        # Application types
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Key Features Implementation

### Recipe Generation Flow

The recipe generation follows the exact requirements from the instructions:

1. **Ingredient Selection**: Users can select from a dropdown of available ingredients
2. **Quantity & Units**: Each ingredient has a number input for quantity and a dropdown for measurement units
3. **Preferences**: Users can specify cuisine style, dish type, and additional options
4. **Recipe Display**: Generated recipes show ingredients, instructions, and cooking time
5. **Save/Ignore Options**: Users can save recipes to their collection or ignore them

### Authentication

- JWT-based authentication with automatic token refresh
- Protected routes for authenticated users
- Form validation with React Hook Form
- Error handling with user-friendly messages

### API Integration

- RESTful API calls using Axios
- Automatic token management
- Error handling and loading states
- Type-safe API responses

## Environment Variables

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:3000
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling

## API Endpoints Used

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/logout` - User logout
- `GET /api/v1/ingredient` - Get available ingredients
- `POST /api/v1/recipe/generate` - Generate recipe
- `POST /api/v1/recipe/save/{recipeKey}` - Save recipe
- `GET /api/v1/recipe` - Get user's saved recipes

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Test your changes thoroughly
4. Update documentation as needed

## License

This project is part of the Sherbiny Kitchen application. 