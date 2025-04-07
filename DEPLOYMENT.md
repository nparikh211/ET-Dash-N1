# Exordiom Talent Dashboard - Deployment Guide

This guide provides detailed instructions for deploying the Exordiom Talent Dashboard to a production environment.

## Setting Up Supabase

1. Create a Supabase account at [https://supabase.com](https://supabase.com) if you don't have one already.

2. Create a new project in Supabase:
   - Go to your Supabase dashboard
   - Click "New Project"
   - Enter a name for your project (e.g., "Exordiom Talent Dashboard")
   - Set a secure database password
   - Choose a region closest to your users
   - Click "Create new project"

3. Once your project is created, navigate to the SQL Editor in your Supabase dashboard.

4. Run the SQL migration script from `supabase/migrations/20250403_initial_schema.sql` to create the necessary tables and functions.

5. Get your Supabase credentials:
   - Go to Project Settings > API
   - Copy the "Project URL" and "anon/public" key
   - These will be used in your environment variables

## Environment Configuration

1. Create a `.env.local` file in the root of your project (or use the provided `.env.local.example` as a template).

2. Add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Deploying to Vercel (Recommended)

1. Push your code to a GitHub repository.

2. Sign up for a Vercel account at [https://vercel.com](https://vercel.com) if you don't have one already.

3. Import your GitHub repository:
   - Click "Add New" > "Project"
   - Select your GitHub repository
   - Configure the project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: npm run build
     - Output Directory: .next
   - Add environment variables from your `.env.local` file
   - Click "Deploy"

4. Once deployment is complete, Vercel will provide you with a URL to access your application.

## Deploying to Netlify

1. Push your code to a GitHub repository.

2. Sign up for a Netlify account at [https://netlify.com](https://netlify.com) if you don't have one already.

3. Import your GitHub repository:
   - Click "New site from Git"
   - Select GitHub as your Git provider
   - Select your repository
   - Configure the build settings:
     - Build command: npm run build
     - Publish directory: .next
   - Add environment variables from your `.env.local` file
   - Click "Deploy site"

4. Once deployment is complete, Netlify will provide you with a URL to access your application.

## Custom Domain Setup

To use a custom domain with your deployed application:

### On Vercel:
1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Domains"
3. Add your custom domain and follow the instructions to configure DNS settings

### On Netlify:
1. Go to your site in the Netlify dashboard
2. Navigate to "Site settings" > "Domain management"
3. Click "Add custom domain" and follow the instructions to configure DNS settings

## Maintenance and Updates

To update your application:

1. Make changes to your codebase locally
2. Test the changes in your development environment
3. Commit and push the changes to your GitHub repository
4. Vercel or Netlify will automatically detect the changes and redeploy your application

## Backup and Recovery

It's recommended to set up regular backups of your Supabase database:

1. Go to your Supabase dashboard
2. Navigate to "Project Settings" > "Database"
3. Under "Backups", you can configure automatic backups or create manual backups

## Monitoring and Analytics

To monitor your application's performance and usage:

1. Set up Vercel Analytics or Netlify Analytics for basic usage metrics
2. Consider integrating Google Analytics or similar services for more detailed analytics
3. Use Supabase's built-in monitoring tools to track database performance

## Security Considerations

1. Ensure your Supabase RLS (Row Level Security) policies are properly configured
2. Regularly update dependencies to patch security vulnerabilities
3. Implement proper authentication and authorization checks
4. Consider setting up a staging environment for testing changes before deploying to production
