-- GenoStock Supabase PostgreSQL Database Schema
-- Run this script in your Supabase SQL Editor to set up tables, RLS policies, and triggers.

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
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cattle ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Cattle Policies
CREATE POLICY "Cattle listings are viewable by everyone" 
    ON public.cattle FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert cattle" 
    ON public.cattle FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Sellers can update their own cattle listings" 
    ON public.cattle FOR UPDATE USING (auth.uid() = seller_id);

-- Auctions Policies
CREATE POLICY "Auctions are viewable by everyone" 
    ON public.auctions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create auctions" 
    ON public.auctions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Sellers can update their own auctions" 
    ON public.auctions FOR UPDATE USING (auth.uid() = seller_id);

-- Bids Policies
CREATE POLICY "Bids are viewable by everyone" 
    ON public.bids FOR SELECT USING (true);

CREATE POLICY "Authenticated users can place bids" 
    ON public.bids FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 7. ENABLE REALTIME FOR LIVE AUCTIONS AND BIDS
ALTER PUBLICATION supabase_realtime ADD TABLE public.auctions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;
