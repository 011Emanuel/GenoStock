/**
 * GenoStock - Supabase Client Configuration & Helpers
 *
 * Credentials are read in this order:
 *   1. js/env.js (window.ENV_SUPABASE_URL / window.ENV_SUPABASE_ANON_KEY)
 *   2. Values saved from the on-page setup banner (localStorage)
 *   3. The placeholders below (not valid — demo mode)
 */

const PLACEHOLDER_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const PLACEHOLDER_KEY = 'YOUR_SUPABASE_ANON_KEY';
const LS_URL_KEY = 'GENOSTOCK_SUPABASE_URL';
const LS_ANON_KEY = 'GENOSTOCK_SUPABASE_ANON_KEY';

function readSupabaseCredentials() {
    const url = (
        window.ENV_SUPABASE_URL ||
        localStorage.getItem(LS_URL_KEY) ||
        PLACEHOLDER_URL
    ).trim();
    const anonKey = (
        window.ENV_SUPABASE_ANON_KEY ||
        localStorage.getItem(LS_ANON_KEY) ||
        PLACEHOLDER_KEY
    ).trim();
    return { SUPABASE_URL: url, SUPABASE_ANON_KEY: anonKey };
}

window.GENOSTOCK_SUPABASE_CONFIG = readSupabaseCredentials();

let _supabaseClient = null;

function looksLikePlaceholder(url, key) {
    return (
        !url ||
        !key ||
        url.includes('YOUR_PROJECT_ID') ||
        url.includes('YOUR_SUPABASE_PROJECT_ID') ||
        key.includes('YOUR_SUPABASE_ANON_KEY') ||
        key.length < 20
    );
}

function isSupabaseConfigured() {
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = readSupabaseCredentials();
    window.GENOSTOCK_SUPABASE_CONFIG = { SUPABASE_URL, SUPABASE_ANON_KEY };
    return !looksLikePlaceholder(SUPABASE_URL, SUPABASE_ANON_KEY);
}

function getSupabase() {
    if (_supabaseClient) return _supabaseClient;

    if (!isSupabaseConfigured()) {
        console.warn('GenoStock Supabase: credentials not configured.  auctions will not be saved to the database.');
        return null;
    }

    if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
        console.error('GenoStock Supabase: SDK is not loaded. Include @supabase/supabase-js before this file.');
        return null;
    }

    const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.GENOSTOCK_SUPABASE_CONFIG;

    try {
        _supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('GenoStock Supabase: client initialized.');
        return _supabaseClient;
    } catch (err) {
        console.error('GenoStock Supabase: failed to initialize client:', err);
        return null;
    }
}

async function getCurrentUser() {
    const supabase = getSupabase();
    if (supabase) {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (user && !error) return user;
        } catch (e) {
            console.error('GenoStock Supabase: error getting current user:', e);
        }
    }

    const username = localStorage.getItem('username');
    if (!username) return null;

    return {
        id: localStorage.getItem('userId') || null,
        email: localStorage.getItem('email') || `${username}@example.com`,
        user_metadata: {
            username: username,
            full_name: localStorage.getItem('name') || username,
            role: localStorage.getItem('role') || 'rancher',
            ranch_name: localStorage.getItem('ranchName') || '',
            location: localStorage.getItem('location') || ''
        }
    };
}

function syncLocalSessionWithSupabase(session) {
    if (!session || !session.user) {
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('userId');
        localStorage.removeItem('ranchName');
        localStorage.removeItem('location');
        localStorage.removeItem('phone');
        localStorage.removeItem('cattleCount');
        localStorage.removeItem('rfc');
        return;
    }

    const user = session.user;
    const meta = user.user_metadata || {};
    const username = meta.username || (user.email ? user.email.split('@')[0] : 'user');
    const role = meta.role || 'rancher';
    const fullName = meta.full_name || username;

    localStorage.setItem('userId', user.id);
    localStorage.setItem('username', username);
    localStorage.setItem('email', user.email || '');
    localStorage.setItem('role', role);
    localStorage.setItem('name', fullName);

    if (meta.ranch_name) localStorage.setItem('ranchName', meta.ranch_name);
    if (meta.location) localStorage.setItem('location', meta.location);
    if (meta.phone) localStorage.setItem('phone', meta.phone);
    if (meta.cattle_count != null && meta.cattle_count !== '') {
        localStorage.setItem('cattleCount', String(meta.cattle_count));
    }
}

/**
 * Upsert the public.profiles row for the signed-in user.
 * Complements the auth.users trigger so cattle/auction foreign keys succeed.
 */
async function ensureUserProfile(user, extra = {}) {
    const supabase = getSupabase();
    if (!supabase || !user) return { error: new Error('Not signed in') };

    const { data: existing } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    if (existing && Object.keys(extra).length === 0) {
        applyProfileToLocalStorage(existing, user.email);
        return { data: existing, error: null };
    }

    const meta = { ...(user.user_metadata || {}), ...extra };
    const profile = {
        id: user.id,
        username: meta.username || existing?.username || (user.email ? user.email.split('@')[0] : null),
        full_name: meta.full_name || existing?.full_name || meta.username || null,
        role: meta.role === 'trader' ? 'trader' : (existing?.role || 'rancher'),
        ranch_name: meta.ranch_name ?? existing?.ranch_name ?? null,
        location: meta.location ?? existing?.location ?? null,
        cattle_count: Number(meta.cattle_count ?? existing?.cattle_count ?? 0),
        phone: meta.phone ?? existing?.phone ?? null,
        rfc: meta.rfc ?? existing?.rfc ?? null,
        updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('profiles').upsert(profile, { onConflict: 'id' }).select().single();
    if (error) {
        console.error('GenoStock Supabase: could not save profile:', error);
    } else {
        applyProfileToLocalStorage(data, user.email);
    }
    return { data, error };
}

function applyProfileToLocalStorage(profile, email) {
    if (!profile) return;
    if (profile.id) localStorage.setItem('userId', profile.id);
    if (email) localStorage.setItem('email', email);
    if (profile.username) localStorage.setItem('username', profile.username);
    if (profile.full_name) localStorage.setItem('name', profile.full_name);
    if (profile.role) localStorage.setItem('role', profile.role);
    if (profile.ranch_name != null) localStorage.setItem('ranchName', profile.ranch_name || '');
    if (profile.location != null) localStorage.setItem('location', profile.location || '');
    if (profile.phone != null) localStorage.setItem('phone', profile.phone || '');
    if (profile.cattle_count != null) localStorage.setItem('cattleCount', String(profile.cattle_count));
    if (profile.rfc != null) localStorage.setItem('rfc', profile.rfc || '');
}

async function loadUserProfile() {
    const supabase = getSupabase();
    const user = await getCurrentUser();
    if (!supabase || !user || !user.id || String(user.id).startsWith('local')) {
        return { data: null, user: null, error: new Error('You must be signed in to load your profile.') };
    }

    let { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (error && error.code === 'PGRST116') {
        const created = await ensureUserProfile(user);
        data = created.data;
        error = created.error;
    }
    if (data) applyProfileToLocalStorage(data, user.email);
    return { data, user, error };
}

async function saveUserProfile(updates) {
    const supabase = getSupabase();
    const user = await getCurrentUser();
    if (!supabase || !user || !user.id || String(user.id).startsWith('local')) {
        return { data: null, error: new Error('You must be signed in to update your profile.') };
    }

    const payload = {
        id: user.id,
        username: (updates.username || '').trim() || (user.email ? user.email.split('@')[0] : null),
        full_name: (updates.full_name || '').trim() || null,
        ranch_name: (updates.ranch_name || '').trim() || null,
        location: (updates.location || '').trim() || null,
        phone: (updates.phone || '').trim() || null,
        cattle_count: Number(updates.cattle_count || 0),
        rfc: (updates.rfc || '').trim() || null,
        role: updates.role === 'trader' ? 'trader' : 'rancher',
        updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' }).select().single();
    if (error) return { data: null, error };

    const { error: authErr } = await supabase.auth.updateUser({
        data: {
            username: payload.username,
            full_name: payload.full_name,
            ranch_name: payload.ranch_name,
            location: payload.location,
            phone: payload.phone,
            cattle_count: payload.cattle_count,
            rfc: payload.rfc,
            role: payload.role
        }
    });
    if (authErr) console.warn('GenoStock: profile saved, but auth metadata was not updated:', authErr);

    applyProfileToLocalStorage(data, user.email);
    window.dispatchEvent(new CustomEvent('genostock-profile-updated', { detail: data }));
    return { data, error: null };
}

function saveSupabaseCredentials(url, anonKey) {
    localStorage.setItem(LS_URL_KEY, url.trim());
    localStorage.setItem(LS_ANON_KEY, anonKey.trim());
    _supabaseClient = null;
    window.GENOSTOCK_SUPABASE_CONFIG = readSupabaseCredentials();
}

document.addEventListener('DOMContentLoaded', async () => {
    const supabase = getSupabase();
    if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            syncLocalSessionWithSupabase(session);
            ensureUserProfile(session.user);
        }

        supabase.auth.onAuthStateChange((event, session) => {
            console.log('GenoStock Supabase Auth Event:', event);
            if (event === 'SIGNED_OUT') {
                syncLocalSessionWithSupabase(null);
                return;
            }
            if (session && session.user) {
                syncLocalSessionWithSupabase(session);
                ensureUserProfile(session.user);
            }
        });
    }
});

window.getSupabase = getSupabase;
window.isSupabaseConfigured = isSupabaseConfigured;
window.getCurrentUser = getCurrentUser;
window.syncLocalSessionWithSupabase = syncLocalSessionWithSupabase;
window.ensureUserProfile = ensureUserProfile;
window.saveSupabaseCredentials = saveSupabaseCredentials;
window.loadUserProfile = loadUserProfile;
window.saveUserProfile = saveUserProfile;
window.applyProfileToLocalStorage = applyProfileToLocalStorage;
