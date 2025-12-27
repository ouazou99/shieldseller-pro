# 🛡️ ShieldSeller - TikTok Shop Protection Platform

**Stop violations before they stop you.**

ShieldSeller is a professional-grade compliance and protection platform for TikTok Shop sellers (expanding to Amazon, Shopify, Walmart, and more). Automatically detect violations, monitor SPS scores, and protect your store from suspension.

---

## 🎯 **What We're Building**

A SaaS platform that:
- ✅ Scans TikTok Shop listings for violations
- ✅ Calculates real-time risk scores (0-100)
- ✅ Sends instant alerts when issues are detected
- ✅ Provides AI-powered fixes for violations
- ✅ Monitors performance metrics (returns, ratings, shipping)
- ✅ Generates daily health reports
- ✅ Prevents account suspensions BEFORE they happen

---

## 💰 **Business Model**

### Pricing Tiers:
- **Free Trial**: 7 days, full access, no credit card
- **Starter ($19/mo)**: 1 shop, daily scans, email alerts
- **Pro ($49/mo)**: 3 shops, real-time monitoring, AI fixes, SMS alerts
- **Agency ($149/mo)**: 10+ shops, team collaboration, API access

### Revenue Projections:
- **Year 1**: $380K ARR (500 users)
- **Year 2**: $1.5M ARR with Amazon/Shopify expansion
- **Year 3**: $8-10M ARR multi-platform dominance

---

## 🚀 **Current Status**

### ✅ **Phase B Complete** (Dashboard & Data Input)
- [x] Full dashboard with real-time metrics
- [x] Shop management system
- [x] CSV upload with batch processing
- [x] Automatic risk analysis engine
- [x] Violation detection and display
- [x] Fix suggestions for every issue
- [x] Listings table with filters
- [x] Detailed listing view
- [x] Complete authentication system

---

## 🛠️ **Tech Stack**

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Lucide Icons**

### Backend
- **Next.js API Routes**
- **Prisma ORM**
- **PostgreSQL**
- **NextAuth.js**

### Payments
- **Stripe** (Subscriptions + Webhooks)

### AI/ML
- Risk scoring engine (custom algorithm)
- AI-powered listing rewrites (ready for Claude API)

---

## 📦 **Installation & Setup**

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or use Neon/Supabase)
- npm or yarn

### 1. Clone and Install
```bash
cd shieldseller
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/shieldseller"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### 4. Run Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

---

## 📁 **Project Structure**

```
shieldseller/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # NextAuth endpoints
│   │   ├── register/        # User registration
│   │   ├── shops/           # Shop management
│   │   └── listings/        # Listing operations
│   ├── dashboard/           # Protected dashboard
│   │   ├── page.tsx         # Main overview ✅
│   │   ├── shops/           # Shop management ✅
│   │   ├── upload/          # CSV upload ✅
│   │   └── listings/        # Listings view ✅
│   ├── login/              # Login page ✅
│   ├── register/           # Register page ✅
│   ├── page.tsx            # Landing page ✅
│   ├── layout.tsx          # Root layout ✅
│   └── globals.css         # Global styles ✅
│
├── components/              # React components
│   ├── ui/                 # Reusable UI components ✅
│   ├── dashboard/          # Dashboard components ✅
│   └── Providers.tsx       # Session provider ✅
│
├── lib/                    # Core logic
│   ├── prisma.ts          # Database client ✅
│   ├── auth.ts            # Auth config ✅
│   ├── utils.ts           # Helper functions ✅
│   └── sps-rules.ts       # 🧠 RISK ENGINE ✅
│
├── prisma/
│   └── schema.prisma      # Database schema ✅
│
└── types/
    └── next-auth.d.ts     # TypeScript definitions ✅
```

---

## 🧠 **Core Risk Engine**

Located in: `lib/sps-rules.ts`

### How It Works:
```typescript
1. Analyze Content Risk (0-60 points)
   - Forbidden keywords
   - Misleading claims
   - Title/description quality
   - Category compliance

2. Analyze Performance Risk (0-40 points)
   - Return rate
   - Customer ratings
   - Shipping delays
   - Late shipment rate

3. Calculate Total Risk Score (0-100)
   - 0-30: Safe (green)
   - 31-50: Warning (yellow)  
   - 51-70: High Risk (orange)
   - 71-100: Critical (red)
```

---

## 🧪 **Testing the Platform**

### Create Sample CSV:
```csv
product_id,title,description,category,price,return_rate,rating
001,MIRACLE Weight Loss - 100% GUARANTEED!,Lose weight instantly!,Health,29.99,0.22,2.8
002,Premium Wireless Headphones,Quality Bluetooth headphones,Electronics,79.99,0.05,4.5
```

### Upload and Analyze:
1. Register account
2. Add shop
3. Upload CSV
4. View risk scores and violations
5. Check fix suggestions

---

## 🔑 **Key Features**

### ✅ **Completed:**
- User authentication (register/login)
- Shop management
- CSV upload and processing
- Risk analysis engine (500+ keywords)
- Violation detection
- Fix suggestions
- Dashboard with metrics
- Listings table
- Detail pages

### 🔜 **Coming Next:**
- Real-time alerts
- Email notifications
- AI-powered rewrites
- Stripe integration
- TikTok API connection
- Automated daily scans

---

## 🚀 **Deployment**

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Database
- **Recommended**: Neon, Supabase, or Railway
- **Scale**: Connection pooling for production

---

## 📊 **Success Metrics**

### Technical KPIs:
- Risk score accuracy: >90%
- False positive rate: <5%
- API response time: <200ms
- Uptime: 99.9%

### Business KPIs:
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Churn rate
- Net Promoter Score (NPS)

---

## 🎨 **Design System**

### Colors:
- **Brand**: Blue (#0ea5e9)
- **Success**: Green (#22c55e)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)

### Typography:
- **Font**: Inter
- **Headings**: Bold, 2xl-6xl
- **Body**: Regular, base-lg

---

## 📄 **License**

Proprietary - All Rights Reserved

---

## 🔥 **Let's Build This**

We're creating the **#1 seller protection platform** in the world. A tool that sellers can't live without.

**Next Steps:**
1. Complete Phase C (Alerts & AI Fixes)
2. Add Stripe billing
3. Launch beta with 10 users
4. Collect feedback
5. Launch publicly
6. Scale to $100K MRR

Let's go! 🚀
