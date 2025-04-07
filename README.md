# Exordiom Talent Dashboard

A comprehensive dashboard application for Exordiom Talent staffing company to track candidates, customers, and revenue metrics.

## Features

- **Dashboard**: Overview of key metrics including Hired In-Seat, Contracted Headcount, Revenue, and Profit Margins
- **CRM**: Manage personnel data with live editing, status tracking, and automatic calculations
- **Candidates**: View filtered personnel information with sorting and filtering capabilities
- **Customers**: Track company relationships, revenue metrics, and churned accounts

## Technology Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Compatible with Vercel, Netlify, or any Next.js hosting platform

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/exordiom-talent-dashboard.git
cd exordiom-talent-dashboard
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.local.example .env.local
```

4. Update the `.env.local` file with your Supabase credentials
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

1. Create a new Supabase project
2. Run the SQL migrations in the `supabase/migrations` directory
3. Set up the following tables:
   - `crm_entries`: For tracking personnel data
   - `customers`: For tracking company information
   - `audit_logs`: For tracking changes and enabling undo functionality

## Deployment

### Vercel Deployment

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Set the environment variables in the Vercel dashboard
4. Deploy

### Netlify Deployment

1. Push your code to a GitHub repository
2. Import the project in Netlify
3. Set the environment variables in the Netlify dashboard
4. Deploy

## Mobile Responsiveness

The application is fully responsive and works on mobile devices. The navigation bar collapses into a mobile menu on smaller screens.

## Color Palette

The application uses a color palette based on #ea6565 (primary color) with complementary pastel colors for the dashboard metrics and charts.

## Period Filtering

The application supports filtering data by different time periods:
- All Time (default)
- Current Year
- Current Quarter
- Last Quarter
- Last 2 Quarters
- Last Calendar Year
- Custom date range

## Calculations

### Active Net Revenue

Active Net Revenue is calculated based on working days (excluding weekends) between the start date and either the end date (for terminated personnel) or the current date (for active personnel).

```
Active Net Revenue = Working Days × 8 hours × (Exordiom Rate - Cost)
```

### Margin Percentage

Margin Percentage is calculated as:

```
Margin % = ((Exordiom Rate - Cost) / Exordiom Rate) × 100
```

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For support or inquiries, please contact Exordiom Talent.
