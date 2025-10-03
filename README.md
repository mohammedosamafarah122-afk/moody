# Moody - Mood Tracking Web Application

A full-stack mood tracking web application built with React, TypeScript, Tailwind CSS, and Supabase. Track your daily moods, emotions, activities, and journal entries with beautiful visualizations and analytics.

## Features

- 🔐 **Authentication**: Secure user registration and login with Supabase Auth
- 📊 **Mood Tracking**: Log daily moods on a 1-5 scale with emotions and activities
- 📝 **Journal Entries**: Optional journal entries for each mood log
- 📈 **Dashboard**: Beautiful charts showing mood trends and statistics
- 📅 **Calendar View**: Visual calendar showing historical mood data
- 🔧 **CRUD Operations**: Full create, read, update, delete functionality
- 📊 **Analytics**: Detailed insights into mood patterns and correlations
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- ☁️ **Cloud Hosted**: Deployed on Netlify with serverless architecture

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Chart.js** with React-ChartJS-2 for data visualization
- **React Router** for navigation
- **Lucide React** for icons
- **date-fns** for date manipulation

### Backend
- **Supabase** for PostgreSQL database and authentication
- **Row Level Security** for data protection
- **Real-time subscriptions** for live updates

### Deployment
- **Netlify** for hosting and CI/CD
- **Netlify Functions** for serverless API endpoints

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd moody
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase-schema.sql`
3. Get your project URL and anon key from Settings > API

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Building for Production

```bash
npm run build
```

### 6. Deploy to Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Database Schema

The application uses the following main tables:

### `profiles`
- User profile information
- Linked to Supabase Auth users

### `mood_entries`
- Daily mood entries with score (1-5)
- Optional emotions array
- Optional activities array
- Optional journal entry text
- Timestamps for creation and updates

## Features Overview

### Authentication
- Email/password registration and login
- Protected routes requiring authentication
- Automatic session management

### Mood Logging
- 1-5 mood scale with emoji indicators
- Predefined emotions selection
- Predefined activities selection
- Optional journal entry
- Date selection (defaults to today)

### Dashboard
- Mood statistics overview
- 30-day mood trend chart
- Mood distribution pie chart
- Recent entries list
- Weekly mood overview

### Calendar View
- Monthly calendar with mood indicators
- Click to view/edit entries
- Visual mood representation
- Navigation between months

### Analytics
- Configurable time ranges (7d, 30d, 90d, 1y)
- Mood trend analysis with moving averages
- Emotion frequency analysis
- Activity-mood correlation insights
- Trend indicators (improving/declining/stable)

## Component Structure

```
src/
├── components/
│   ├── Analytics/          # Analytics and insights
│   ├── Auth/              # Authentication forms
│   ├── Calendar/          # Calendar view and modal
│   ├── Dashboard/         # Main dashboard components
│   ├── Layout/            # Navigation and layout
│   └── MoodLogging/       # Mood entry forms
├── contexts/
│   └── AuthContext.tsx    # Authentication context
├── lib/
│   └── supabase.ts        # Supabase client configuration
├── services/
│   └── moodService.ts     # API service functions
└── App.tsx                # Main application component
```

## API Endpoints (Supabase)

All data operations go through Supabase's REST API:

- `GET /rest/v1/mood_entries` - Fetch mood entries
- `POST /rest/v1/mood_entries` - Create new mood entry
- `PATCH /rest/v1/mood_entries` - Update mood entry
- `DELETE /rest/v1/mood_entries` - Delete mood entry

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Authentication required for all operations
- Secure environment variable handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the GitHub repository.