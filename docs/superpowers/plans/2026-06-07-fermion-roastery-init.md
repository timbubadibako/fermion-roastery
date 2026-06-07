# Fermion Roastery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade B2B Roastery & Marketplace platform for Fermion Roastery with a modern-playful aesthetic, adopting the Evasion UI structure as a base for a multi-page routing architecture.

**Architecture:** Engine-Heavy Hybrid. Next.js 15 (App Router) for the multi-page frontend, Express.js v5 for secure B2B logic, and Supabase for Auth/DB.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, Express.js v5, Supabase, Lucide Icons.

---

### Task 1: Project Scaffolding & Directory Setup

**Files:**
- Modify: Move files from `evasion-e-commerce-template/` to `frontend/`
- Create: `backend/package.json`
- Create: `backend/.env`

- [ ] **Step 1: Move template files to frontend directory**
Run: `mv evasion-e-commerce-template/* frontend/ && mv evasion-e-commerce-template/.* frontend/` (ignore errors for hidden files if they don't exist)

- [ ] **Step 2: Initialize Backend package.json**
Create `backend/package.json`:
```json
{
  "name": "fermion-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^5.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "@supabase/supabase-js": "^2.48.1",
    "axios": "^1.7.9"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}
```

- [ ] **Step 3: Setup Backend .env template**
Create `backend/.env`:
```env
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_PLACES_API_KEY=your_google_api_key
```

- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "chore: setup project scaffolding for frontend and backend"
```

---

### Task 2: Supabase Schema - Profiles & Roles

**Files:**
- Create: `supabase/migrations/20260607000000_create_profiles.sql`

- [ ] **Step 1: Create Profiles table with RLS**
```sql
CREATE TYPE user_role AS ENUM ('ADMIN', 'STAFF', 'B2B_PARTNER', 'RETAIL_CUSTOMER');

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role user_role DEFAULT 'RETAIL_CUSTOMER',
  place_id TEXT,
  business_name TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'RETAIL_CUSTOMER');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

- [ ] **Step 2: Commit**
```bash
git add supabase/migrations/
git commit -m "feat: setup profiles table and rls"
```

---

### Task 3: Express Backend Initialization

**Files:**
- Create: `backend/index.js`
- Create: `backend/lib/supabase.js`

- [ ] **Step 1: Setup Supabase Admin Client**
Create `backend/lib/supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

- [ ] **Step 2: Create Express Server Entry**
Create `backend/index.js`:
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Fermion Engine running on port ${PORT}`);
});
```

- [ ] **Step 3: Commit**
```bash
git add backend/
git commit -m "feat: initialize express core engine"
```

---

### Task 4: B2B Verification Logic (Google Places)

**Files:**
- Create: `backend/routes/b2b.js`
- Modify: `backend/index.js`

- [ ] **Step 1: Implement B2B Verification Route**
Create `backend/routes/b2b.js`:
```javascript
import express from 'express';
import axios from 'axios';
import { supabase } from '../lib/supabase.js';

const router = express.Router();

router.post('/verify', async (req, res) => {
  const { userId, placeId } = req.body;
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,type&key=${process.env.GOOGLE_PLACES_API_KEY}`
    );
    const place = response.data.result;
    const allowedTypes = ['cafe', 'restaurant', 'bakery', 'bar'];
    const isCoffeeShop = place.types.some(type => allowedTypes.includes(type));

    if (!isCoffeeShop) return res.status(400).json({ error: 'Not eligible' });

    const { error } = await supabase
      .from('profiles')
      .update({ role: 'B2B_PARTNER', place_id: placeId, business_name: place.name })
      .eq('id', userId);

    if (error) throw error;
    res.json({ success: true, businessName: place.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
```

- [ ] **Step 2: Register route in index.js**
Modify `backend/index.js` to use `app.use('/api/v1/b2b', b2bRoutes);`.

- [ ] **Step 3: Commit**
```bash
git add backend/
git commit -m "feat: implement google places b2b verification"
```

---

### Task 5: Frontend - Modern Playful Theming (v4)

**Files:**
- Modify: `frontend/app/globals.css`

- [ ] **Step 1: Define Fermion Design Tokens**
Modify `frontend/app/globals.css` to include `@theme` variables for `--color-fermion-blue`, `--color-fermion-soft`, and `--radius-fermion`.

- [ ] **Step 2: Commit**
```bash
git add frontend/app/globals.css
git commit -m "feat: setup modern playful design tokens"
```

---

### Task 6: Evasion Landing Page Adaptation (Multi-page Routing)

**Files:**
- Modify: `frontend/app/page.tsx`
- Modify: `frontend/components/navbar.tsx`

- [ ] **Step 1: Reconstruct Landing Page Structure**
Adapt the landing page from the Evasion template in `frontend/app/page.tsx`, ensuring it uses all major sections (Hero, Features, Pricing/Product tiers) but customized with Fermion tokens.

- [ ] **Step 2: Remove Jump-to-Section Navigation**
Modify the Navbar and all buttons/links to use standard Next.js routing (e.g., `/wholesale`, `/retail`) instead of anchor links (`#features`).

- [ ] **Step 3: Commit**
```bash
git add frontend/
git commit -m "feat: adapt evasion ui structure for multi-page landing page"
```

---

### Task 7: Reusable Components & B2B Register Page

**Files:**
- Create: `frontend/components/products/spec-badge.tsx`
- Create: `frontend/app/b2b/register/page.tsx`

- [ ] **Step 1: Implement Spec Badge Component**
- [ ] **Step 2: Build B2B Register Page with Fermion Styling**
- [ ] **Step 3: Commit**
```bash
git add frontend/
git commit -m "feat: implement reusable spec badges and b2b register page"
```
