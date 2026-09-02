-- GenoStock Supabase PostgreSQL Database Schema
-- Run this entire script in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Safe to re-run: tables, policies, and triggers are created or replaced.

-- Recommended for local/school testing:
-- Authentication → Providers → Email → disable "Confirm email"
-- so new users can log in immediately without a confirmation link.

-- 1. PROFILES TABLE (Linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    role TEXT CHECK (role IN ('rancher', 'trader')) DEFAULT 'rancher',
    ranch_name TEXT,
    location TEXT,
    cattle_count INTEGER DEFAULT 0,
    phone TEXT,
    rfc TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CATTLE / LIVESTOCK TABLE
CREATE TABLE IF NOT EXISTS public.cattle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    breed TEXT NOT NULL,
    category TEXT,
    age INTEGER,
    weight NUMERIC,
    price NUMERIC NOT NULL,
    location TEXT,
    image_url TEXT,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'unlisted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. AUCTIONS TABLE
CREATE TABLE IF NOT EXISTS public.auctions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    cattle_id UUID REFERENCES public.cattle(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    breed TEXT,
    starting_price NUMERIC NOT NULL,
    current_price NUMERIC NOT NULL,
    min_bid_increment NUMERIC DEFAULT 100,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'ended', 'cancelled')),
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    winner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.auctions ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.auctions ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.auctions ADD COLUMN IF NOT EXISTS seller_name TEXT;
ALTER TABLE public.auctions ADD COLUMN IF NOT EXISTS seller_username TEXT;
ALTER TABLE public.auctions ADD COLUMN IF NOT EXISTS winner_name TEXT;
ALTER TABLE public.auctions ADD COLUMN IF NOT EXISTS winning_bid NUMERIC;

-- 4. BIDS TABLE
CREATE TABLE IF NOT EXISTS public.bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auction_id UUID REFERENCES public.auctions(id) ON DELETE CASCADE,
    bidder_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    bidder_name TEXT,
    amount NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TRIGGER FOR AUTOMATIC PROFILE CREATION ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        username,
        full_name,
        role,
        ranch_name,
        location,
        cattle_count,
        phone,
        rfc,
        avatar_url
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'rancher'),
        NEW.raw_user_meta_data->>'ranch_name',
        NEW.raw_user_meta_data->>'location',
        COALESCE((NEW.raw_user_meta_data->>'cattle_count')::INTEGER, 0),
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'rfc',
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        ranch_name = EXCLUDED.ranch_name,
        location = EXCLUDED.location,
        cattle_count = EXCLUDED.cattle_count,
        phone = EXCLUDED.phone,
        rfc = EXCLUDED.rfc,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cattle ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Cattle listings are viewable by everyone" ON public.cattle;
DROP POLICY IF EXISTS "Authenticated users can insert cattle" ON public.cattle;
DROP POLICY IF EXISTS "Sellers can update their own cattle listings" ON public.cattle;
DROP POLICY IF EXISTS "Auctions are viewable by everyone" ON public.auctions;
DROP POLICY IF EXISTS "Authenticated users can create auctions" ON public.auctions;
DROP POLICY IF EXISTS "Sellers can update their own auctions" ON public.auctions;
DROP POLICY IF EXISTS "Bids are viewable by everyone" ON public.bids;
DROP POLICY IF EXISTS "Authenticated users can place bids" ON public.bids;

CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Cattle listings are viewable by everyone"
    ON public.cattle FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert cattle"
    ON public.cattle FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own cattle listings"
    ON public.cattle FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Auctions are viewable by everyone"
    ON public.auctions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create auctions"
    ON public.auctions FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own auctions"
    ON public.auctions FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Bids are viewable by everyone"
    ON public.bids FOR SELECT USING (true);

CREATE POLICY "Authenticated users can place bids"
    ON public.bids FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- Sellers cannot update current_price on someone else's auction, so a trigger
-- applies the new bid amount with definer rights after a successful insert.
CREATE OR REPLACE FUNCTION public.handle_new_bid()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.auctions
    SET current_price = NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.auction_id
      AND status = 'active'
      AND NEW.amount > current_price;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_bid_created ON public.bids;
CREATE TRIGGER on_bid_created
    AFTER INSERT ON public.bids
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_bid();

-- 7. ENABLE REALTIME FOR LIVE AUCTIONS AND BIDS
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.auctions;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
END $$;
