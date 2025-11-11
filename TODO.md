# IronLedger Development TODO

## ✅ Completed

### Infrastructure & Setup
- [x] Next.js 16 project initialized with TypeScript, Tailwind CSS, ESLint
- [x] All dependencies installed (Prisma, NextAuth, React Query, Zod, shadcn/ui, etc.)
- [x] Package.json scripts configured (db:generate, db:push, db:migrate, etc.)
- [x] .env.example created with all required environment variables
- [x] Comprehensive README.md with setup instructions
- [x] .gitignore configured

### Database & Backend
- [x] Prisma schema created with 9 core models:
  - User, Profile, Compound, DoseLog, LabPanel
  - Workout, Exercise, Set, FoodLog
- [x] Enums defined (Role, CompoundCategory, InjectionRoute, InjectionSite, MealType, BodyPart)
- [x] Proper indexing and relationships configured
- [x] lib/prisma.ts - Prisma client singleton
- [x] lib/auth.ts - NextAuth configuration with credentials provider
- [x] lib/validations.ts - Zod schemas for signup/signin
- [x] lib/utils.ts - Utility functions (cn, formatDate, formatDateTime, formatNumber)

## 🚧 In Progress / TODO

### Critical - MVP Completion

#### 1. UI Components (shadcn/ui style)
Create in `components/ui/`:
- [ ] button.tsx
- [ ] input.tsx
- [ ] label.tsx
- [ ] card.tsx
- [ ] select.tsx
- [ ] dialog.tsx
- [ ] dropdown-menu.tsx
- [ ] tabs.tsx
- [ ] separator.tsx
- [ ] switch.tsx
- [ ] avatar.tsx
- [ ] table.tsx

#### 2. App Layout & Providers
- [ ] app/layout.tsx - Root layout with Providers and Toaster
- [ ] components/providers.tsx - SessionProvider + QueryClientProvider
- [ ] app/page.tsx - Root redirect to /dashboard or /auth/signin
- [ ] app/globals.css - Update with theme CSS variables

#### 3. Authentication
- [ ] app/api/auth/[...nextauth]/route.ts - NextAuth API handler
- [ ] app/api/auth/signup/route.ts - Signup endpoint
- [ ] app/auth/signin/page.tsx - Sign in form
- [ ] app/auth/signup/page.tsx - Sign up form
- [ ] middleware.ts - Route protection

#### 4. Dashboard
- [ ] app/dashboard/layout.tsx - Dashboard layout with sidebar
- [ ] components/dashboard-nav.tsx - Sidebar navigation
- [ ] app/dashboard/page.tsx - Main dashboard with KPIs and charts

#### 5. Doses Module
- [ ] app/dashboard/doses/page.tsx - Dose logs table
- [ ] app/api/doses/route.ts - GET (list) and POST (create)
- [ ] app/api/doses/[id]/route.ts - GET, PATCH, DELETE
- [ ] Components: DoseForm, DoseTable

#### 6. Labs Module
- [ ] app/dashboard/labs/page.tsx - Lab panels list
- [ ] app/api/labs/route.ts - CRUD endpoints
- [ ] Components: LabForm, LabChart

#### 7. Workouts Module
- [ ] app/dashboard/workouts/page.tsx - Workouts list
- [ ] app/api/workouts/route.ts - CRUD endpoints
- [ ] Components: WorkoutForm, ExerciseBuilder

#### 8. Nutrition Module
- [ ] app/dashboard/nutrition/page.tsx - Food diary
- [ ] app/api/nutrition/route.ts - CRUD endpoints
- [ ] Components: FoodForm, MacroSummary

#### 9. Compounds Module
- [ ] app/dashboard/compounds/page.tsx - Compound library
- [ ] app/api/compounds/route.ts - CRUD endpoints

#### 10. Settings
- [ ] app/dashboard/settings/page.tsx - User settings
- [ ] app/api/settings/route.ts - Update endpoints

### Database Setup
- [ ] Create .env file with DATABASE_URL
- [ ] Run `npm run db:generate`
- [ ] Run `npm run db:push`
- [ ] Create prisma/seed.ts with demo data
- [ ] Run `npm run db:seed`

### Testing & Quality
- [ ] Create __tests__/api/ directory
- [ ] Write API validation tests
- [ ] Test authentication flow
- [ ] Test CRUD operations
- [ ] Run `npm test`

### Documentation
- [ ] SETUP.md - Detailed setup guide (deployment, troubleshooting)
- [ ] API.md - API documentation
- [ ] CONTRIBUTING.md - Contribution guidelines

## 🎯 Future Enhancements

### Phase 2 - Enhanced Features
- [ ] Command Palette (⌘K) for quick actions
- [ ] Data export (CSV, Excel, JSON)
- [ ] Charts and analytics (Recharts integration)
- [ ] Dark mode toggle
- [ ] Email notifications
- [ ] Password reset flow
- [ ] Profile photo upload
- [ ] Onboarding wizard for new users

### Phase 3 - Integrations
- [ ] Fitbit OAuth integration
- [ ] Apple Health integration
- [ ] Strava integration
- [ ] Strong app integration
- [ ] Garmin integration
- [ ] MyFitnessPal integration
- [ ] Cronometer integration
- [ ] Webhook support for custom integrations

### Phase 4 - Advanced Features
- [ ] Coach mode - invite athletes, view dashboards
- [ ] Admin panel - user management
- [ ] Goals and progress tracking
- [ ] Comparison windows (compare labs over time)
- [ ] Tagging system for doses/workouts
- [ ] Notes and journaling
- [ ] Reminders and notifications
- [ ] Mobile responsive optimization
- [ ] PWA support

## 📝 Notes

### Current State
- **Framework**: Next.js 16 initialized ✅
- **Dependencies**: All installed ✅
- **Database Schema**: Complete ✅
- **Core Libraries**: Created ✅
- **UI Components**: Need to create
- **Pages**: Need to create
- **API Routes**: Need to create

### Next Immediate Steps
1. Create all UI components (button, input, card, etc.)
2. Create app layout and providers
3. Create authentication pages and API routes
4. Create dashboard layout and navigation
5. Create module pages (doses, labs, workouts, nutrition)
6. Set up database and test end-to-end

### Development Workflow
```bash
# 1. Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# 2. Generate Prisma client
npm run db:generate

# 3. Push schema to database
npm run db:push

# 4. Start development server
npm run dev

# 5. Open Prisma Studio (optional)
npm run db:studio
```

### Deployment Checklist
- [ ] Set up production PostgreSQL database
- [ ] Configure environment variables in Vercel
- [ ] Push code to GitHub
- [ ] Import to Vercel
- [ ] Run database migrations
- [ ] Test production deployment
- [ ] Set up monitoring and analytics

---

**Last Updated**: 2025-11-11
**Status**: Infrastructure complete, UI and pages in progress
