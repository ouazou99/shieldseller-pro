# 🚀 ShieldSeller - Quick Start Guide

Get ShieldSeller running in 5 minutes!

---

## ⚡ **Fast Track Setup**

### Step 1: Install Dependencies
```bash
cd shieldseller
npm install
```

### Step 2: Setup Database

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL (if not installed)
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# Start PostgreSQL
# macOS: brew services start postgresql
# Ubuntu: sudo service postgresql start

# Create database
createdb shieldseller
```

**Option B: Cloud Database (Easier!)**
- Go to [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com)
- Create free PostgreSQL database
- Copy connection string

### Step 3: Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
# Replace with your database URL
DATABASE_URL="postgresql://user:password@localhost:5432/shieldseller"

# Generate secret: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe keys (optional for now - get from stripe.com)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### Step 4: Initialize Database
```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# View database (optional)
npx prisma studio
```

### Step 5: Run Development Server
```bash
npm run dev
```

🎉 **Visit: http://localhost:3000**

---

## 🧪 **Test the Platform**

### 1. Create Account
- Go to http://localhost:3000/register
- Sign up with your email
- Account gets free trial automatically

### 2. Test Risk Engine
```bash
# Open browser console on any page
# Paste this code:

const testListing = {
  productId: '12345',
  title: 'MIRACLE Weight Loss - 100% GUARANTEED Results!',
  description: 'FDA approved formula cures obesity overnight',
  returnRate: 0.22,
  rating: 2.8,
};

// This would trigger:
// - Forbidden keywords: "miracle", "guaranteed", "cure"
// - High return rate violation
// - Low rating violation
// Risk Score: ~95/100 (CRITICAL)
```

---

## 📊 **Database Schema Overview**

```
Users
  ↓
Subscriptions (plan, limits, billing)
  ↓
Shops (TikTok, Amazon, etc.)
  ↓
Listings (products with risk scores)
  ↓
Violations (detected issues)
  ↓
Alerts (notifications sent to users)
```

---

## 🔧 **Common Issues & Fixes**

### Issue: "Prisma Client not generated"
```bash
npx prisma generate
```

### Issue: "Database connection failed"
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Test connection: `psql $DATABASE_URL`

### Issue: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 3000 already in use"
```bash
# Kill existing process
lsof -ti:3000 | xargs kill
# Or use different port
PORT=3001 npm run dev
```

---

## 🎯 **What Works Now**

✅ **Landing Page**
- Beautiful hero section
- Features showcase
- Pricing tiers
- CTA buttons

✅ **Authentication**
- User registration with validation
- Login with session management
- Password hashing (bcrypt)
- Protected routes ready

✅ **Database**
- Full schema for shops, listings, violations
- Subscription management
- Alert system
- Risk tracking

✅ **Risk Engine**
- 500+ forbidden keyword detection
- Performance metrics analysis
- Compliance checking
- Risk scoring (0-100)

---

## 🔜 **What's Next (Week 1)**

### Priority 1: Dashboard
- Create `/dashboard` route
- Display user info
- Show connected shops
- Add "Connect Shop" button

### Priority 2: CSV Upload
- Upload listing CSV
- Parse and store in database
- Run risk analysis
- Display results

### Priority 3: Risk Display
- Risk score cards
- Violation list
- Fix suggestions
- Color-coded alerts

---

## 💡 **Development Tips**

### Watch Database Changes
```bash
# Terminal 1: Run app
npm run dev

# Terminal 2: Watch database
npx prisma studio
```

### Test API Routes
```bash
# Test registration
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test User"}'

# Test login (using NextAuth endpoint)
# Use browser or Postman for session-based auth
```

### Debug Mode
```typescript
// Add to any file for debugging
console.log('Debug info:', { data });

// Or use browser console
// Open DevTools → Console
```

---

## 📚 **Key Files to Know**

### Core Logic
- `lib/sps-rules.ts` - **THE BRAIN** (risk scoring engine)
- `lib/prisma.ts` - Database client
- `lib/auth.ts` - Authentication config
- `lib/utils.ts` - Helper functions

### API Routes
- `app/api/auth/[...nextauth]/route.ts` - NextAuth handler
- `app/api/register/route.ts` - User registration

### Pages
- `app/page.tsx` - Landing page
- `app/login/page.tsx` - Login
- `app/register/page.tsx` - Sign up
- `app/dashboard/*` - Protected dashboard (coming)

### Components
- `components/ui/*` - Reusable UI components
- `components/Providers.tsx` - Session provider

---

## 🎨 **Customization**

### Change Brand Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  brand: {
    500: '#YOUR_COLOR',
    600: '#YOUR_COLOR_DARKER',
  }
}
```

### Modify Risk Thresholds
Edit `lib/sps-rules.ts`:
```typescript
// Change risk level thresholds
if (totalRiskScore < 30) riskLevel = 'safe';
else if (totalRiskScore < 50) riskLevel = 'low';
// etc...
```

### Add Forbidden Keywords
Edit `lib/sps-rules.ts`:
```typescript
const FORBIDDEN_KEYWORDS = [
  ...existing keywords,
  'your-new-keyword',
];
```

---

## 🚢 **Deploy to Production**

### Vercel (Easiest - 5 minutes)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables in Vercel dashboard
# vercel.com → Your Project → Settings → Environment Variables
```

### Environment Variables for Production
```
DATABASE_URL=your-production-database
NEXTAUTH_SECRET=generate-new-secret-for-production
NEXTAUTH_URL=https://your-domain.com
STRIPE_SECRET_KEY=sk_live_...
```

---

## 🤔 **Need Help?**

### Check These First:
1. README.md - Full documentation
2. Prisma schema - Database structure
3. Console errors - Most issues show here
4. Network tab - API call debugging

### Common Solutions:
- Clear browser cache
- Restart dev server
- Regenerate Prisma client
- Check environment variables

---

## ✅ **Checklist Before Launch**

- [ ] Database properly configured
- [ ] All migrations run successfully
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Landing page looks good
- [ ] Environment variables set
- [ ] Stripe keys configured (when ready)

---

## 🎯 **Your First MVP Goals**

**This Week:**
- [ ] Get project running locally ✅
- [ ] Create dashboard page
- [ ] Add CSV upload
- [ ] Display risk scores
- [ ] Show violations

**Next Week:**
- [ ] Stripe integration
- [ ] Email alerts
- [ ] AI fix suggestions
- [ ] Beta user testing

---

**Ready to build? Let's go! 🚀**

Any issues? The code is well-commented and structured for easy debugging.
