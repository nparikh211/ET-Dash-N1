# Exordiom Talent Dashboard - Technical Documentation

This document provides technical details about the implementation of the Exordiom Talent Dashboard application.

## Architecture

The application follows a modern React architecture using Next.js 14+ with the App Router pattern:

```
exordiom-talent-dashboard/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── crm/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── candidates/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── customers/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── MetricCard.tsx
│   │   ├── PeriodSelector.tsx
│   │   ├── TalentDistributionChart.tsx
│   │   └── ContractEndDates.tsx
│   ├── lib/
│   │   ├── api/
│   │   │   ├── crm.ts
│   │   │   ├── customers.ts
│   │   │   ├── dashboard.ts
│   │   │   ├── processors.ts
│   │   │   └── types.ts
│   │   ├── hooks/
│   │   │   ├── usePeriodFilter.ts
│   │   │   └── useDataProcessing.ts
│   │   ├── context.tsx
│   │   ├── database.types.ts
│   │   ├── supabase.ts
│   │   └── utils.ts
│   └── styles/
│       └── globals.css
├── supabase/
│   └── migrations/
│       └── 20250403_initial_schema.sql
├── public/
├── .env.local.example
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Technology Stack

### Frontend
- **Next.js**: React framework for server-side rendering and static site generation
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For utility-first styling
- **React Context API**: For global state management
- **React Hooks**: For component logic and state management
- **Recharts**: For data visualization

### Backend
- **Supabase**: For database, authentication, and storage
- **PostgreSQL**: The underlying database used by Supabase
- **Row Level Security (RLS)**: For data access control

## Database Schema

### CRM Entries Table
```sql
CREATE TABLE crm_entries (
  id SERIAL PRIMARY KEY,
  status VARCHAR(20) NOT NULL CHECK (status IN ('Contracted', 'Hired In-Seat', 'Terminated')),
  company_name VARCHAR(100) NOT NULL,
  personnel_name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  hiring_manager VARCHAR(100) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  exordiom_rate DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Customers Table
```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(100) NOT NULL UNIQUE,
  contact VARCHAR(100) NOT NULL,
  is_churned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  table_name VARCHAR(50) NOT NULL,
  record_id INTEGER NOT NULL,
  operation VARCHAR(10) NOT NULL,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID
);
```

## Key Calculations

### Active Net Revenue Calculation

The Active Net Revenue is calculated based on working days (excluding weekends) between the start date and either the end date (for terminated personnel) or the current date (for active personnel).

```typescript
export function calculateActiveNetRevenue(
  startDate: string, 
  endDate: string | null, 
  exordiomRate: number, 
  cost: number
): number {
  if (!startDate) return 0;
  
  const start = parseISO(startDate);
  const end = endDate ? parseISO(endDate) : new Date();
  
  // Calculate the difference in days (inclusive of both start and end dates)
  const totalDays = differenceInDays(end, start) + 1;
  
  // Count working days (excluding weekends)
  let workingDays = 0;
  let currentDate = new Date(start);
  
  for (let i = 0; i < totalDays; i++) {
    if (!isWeekend(currentDate)) {
      workingDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Calculate net revenue: working days * 8 hours * (exordiom rate - cost)
  const hourlyProfit = exordiomRate - cost;
  return workingDays * 8 * hourlyProfit;
}
```

### Period Filtering

The application supports filtering data by different time periods using the `getPeriodDateRange` function:

```typescript
export function getPeriodDateRange(
  period: string, 
  customStartDate: string | null, 
  customEndDate: string | null
): { startDate: Date | null, endDate: Date | null } {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  switch (period) {
    case 'all':
      return { startDate: null, endDate: null };
      
    case 'current_year':
      return {
        startDate: new Date(currentYear, 0, 1),
        endDate: new Date(currentYear, 11, 31)
      };
      
    case 'current_quarter':
      const currentQuarter = Math.floor(currentMonth / 3);
      return {
        startDate: new Date(currentYear, currentQuarter * 3, 1),
        endDate: new Date(currentYear, (currentQuarter + 1) * 3, 0)
      };
      
    // Additional cases for other period options...
      
    case 'custom':
      if (customStartDate && customEndDate) {
        return {
          startDate: new Date(customStartDate),
          endDate: new Date(customEndDate)
        };
      }
      return { startDate: null, endDate: null };
      
    default:
      return { startDate: null, endDate: null };
  }
}
```

## Authentication and Authorization

The application uses Supabase Authentication for user management. Row Level Security (RLS) policies are implemented to ensure users can only access data they are authorized to see.

## State Management

The application uses React Context API for global state management, particularly for:

- Current period selection
- Authentication state
- Data refresh triggers

## Mobile Responsiveness

The application is fully responsive and works on mobile devices through:

- Tailwind CSS responsive classes
- Flexible layouts that adapt to screen size
- Mobile-optimized navigation
- Responsive data tables

## Performance Optimizations

- Server-side rendering for initial page load
- Client-side data fetching for dynamic updates
- Memoization of expensive calculations
- Debounced inputs for live editing
- Optimized re-renders using React.memo and useMemo

## Future Enhancements

Potential areas for future development:

1. Advanced reporting and analytics
2. Email notifications for upcoming contract end dates
3. Integration with external HR systems
4. Document management for contracts and agreements
5. Multi-user role-based access control
6. Advanced filtering and search capabilities
