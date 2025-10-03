# Deployment Guide - Moody App

This guide will help you deploy the Moody mood tracking application to production.

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Netlify Account**: Create a free account at [netlify.com](https://netlify.com)
3. **GitHub Repository**: Push your code to a GitHub repository

## Step 1: Set Up Supabase Database

1. **Create a New Project**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Click "New Project"
   - Choose your organization and enter project details
   - Wait for the database to be ready (2-3 minutes)

2. **Run Database Schema**
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-schema.sql`
   - Click "Run" to execute the schema

3. **Get API Keys**
   - Go to Settings > API
   - Copy the "Project URL" and "anon public" key
   - Keep these safe - you'll need them for deployment

4. **Configure Authentication**
   - Go to Authentication > Settings
   - Configure your site URL (will be your Netlify URL)
   - Enable email confirmations if desired

## Step 2: Deploy to Netlify

### Option A: Deploy via GitHub (Recommended)

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and authorize Netlify
   - Select your repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

3. **Set Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add the following variables:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete
   - Your app will be available at the generated Netlify URL

### Option B: Manual Deploy

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder to deploy
   - Configure environment variables as above

## Step 3: Configure Custom Domain (Optional)

1. **Add Domain**
   - Go to Site Settings > Domain Management
   - Click "Add custom domain"
   - Follow the DNS configuration instructions

2. **Enable HTTPS**
   - Netlify automatically provisions SSL certificates
   - Ensure "Force HTTPS" is enabled

## Step 4: Update Supabase Settings

1. **Update Site URL**
   - Go to Authentication > Settings in Supabase
   - Add your Netlify URL to "Site URL"
   - Add your domain to "Additional Redirect URLs"

2. **Configure RLS Policies**
   - All policies are already set up in the schema
   - Users can only access their own data

## Step 5: Test Your Deployment

1. **Visit Your Site**
   - Go to your Netlify URL
   - Test user registration and login
   - Try logging a mood entry
   - Check that all features work

2. **Test Responsive Design**
   - Test on mobile devices
   - Verify all components are responsive
   - Check that navigation works on mobile

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

## Troubleshooting

### Build Errors

- **Dependency Issues**: Run `npm ci` to install exact dependency versions
- **TypeScript Errors**: Check that all types are properly imported
- **Environment Variables**: Ensure all required variables are set

### Runtime Errors

- **Supabase Connection**: Verify URL and API key are correct
- **Authentication Issues**: Check Supabase auth settings and redirect URLs
- **CORS Errors**: Ensure your domain is added to Supabase settings

### Performance Issues

- **Large Bundle Size**: Consider code splitting for Chart.js
- **Slow Loading**: Enable Netlify's asset optimization
- **Database Performance**: Add indexes for frequently queried data

## Security Considerations

1. **Environment Variables**: Never commit API keys to version control
2. **RLS Policies**: All database policies are configured for user isolation
3. **HTTPS**: Always use HTTPS in production
4. **Content Security Policy**: Consider adding CSP headers

## Monitoring and Analytics

1. **Netlify Analytics**: Enable in Site Settings
2. **Supabase Logs**: Monitor database usage and errors
3. **Error Tracking**: Consider adding Sentry or similar service

## Backup and Maintenance

1. **Database Backups**: Supabase handles automatic backups
2. **Code Backups**: Keep code in version control
3. **Regular Updates**: Keep dependencies updated
4. **Monitor Usage**: Watch Supabase and Netlify usage limits

## Support

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Project Issues**: Create issues in your GitHub repository

Your Moody app is now live and ready to help users track their emotional well-being!
