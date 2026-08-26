/**
 * GenoStock - Supabase Client Configuration & Helpers
 */

// Supabase Credentials Config
// Replace these with your actual Supabase Project URL and Anon API Key from https://app.supabase.com
window.GENOSTOCK_SUPABASE_CONFIG = {
    SUPABASE_URL: window.ENV_SUPABASE_URL || 'https://YOUR_SUPABASE_PROJECT_ID.supabase.co',
    SUPABASE_ANON_KEY: window.ENV_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'
};

let _supabaseClient = null;

/**
 * Initializes and returns the global Supabase client instance.
 * @returns {object|null} Supabase client instance
 */
function getSupabase() {
    if (_supabaseClient) return _supabaseClient;

    const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.GENOSTOCK_SUPABASE_CONFIG;

    if (!isSupabaseConfigured()) {
        console.warn('GenoStock Supabase: Credentials not configured. Operating in fallback mode. Please update js/supabase-config.js with your project URL & Anon Key.');
        return null;
    }

    if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
        console.error('GenoStock Supabase: Supabase JS SDK is not loaded. Include @supabase/supabase-js CDN script tag.');
        return null;
    }

    try {
        _supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('GenoStock Supabase: Client initialized successfully.');
        return _supabaseClient;
    } catch (err) {
        console.error('GenoStock Supabase: Error initializing Supabase client:', err);
        return null;
    }
}

/**
 * Checks whether valid Supabase credentials have been configured.
 * @returns {boolean}
 */
function isSupabaseConfigured() {
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.GENOSTOCK_SUPABASE_CONFIG;
    return (
        SUPABASE_URL &&
        SUPABASE_ANON_KEY &&
        !SUPABASE_URL.includes('YOUR_SUPABASE_PROJECT_ID') &&
        !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY')
    );
}

/**
 * Get current logged in user from Supabase session or localStorage fallback.
 */
async function getCurrentUser() {
    const supabase = getSupabase();
    if (supabase) {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (user && !error) return user;
        } catch (e) {
            console.error('GenoStock Supabase: Error getting current user:', e);
        }
    }
    
    // Fallback to localStorage user format
    const username = localStorage.getItem('username');
    if (!username) return null;

    return {
        id: localStorage.getItem('userId') || 'local-user-id',
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

/**
 * Sync Supabase user session data into localStorage for legacy component compatibility.
 */
function syncLocalSessionWithSupabase(session) {
    if (!session || !session.user) {
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('userId');
        return;
    }

    const user = session.user;
    const meta = user.user_metadata || {};
    const username = meta.username || user.email.split('@')[0];
    const role = meta.role || 'rancher';
    const fullName = meta.full_name || username;

    localStorage.setItem('userId', user.id);
    localStorage.setItem('username', username);
    localStorage.setItem('email', user.email);
    localStorage.setItem('role', role);
    localStorage.setItem('name', fullName);

    if (meta.ranch_name) localStorage.setItem('ranchName', meta.ranch_name);
    if (meta.location) localStorage.setItem('location', meta.location);
}

// Auto sync auth state when page loads if Supabase is configured
document.addEventListener('DOMContentLoaded', async () => {
    const supabase = getSupabase();
    if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            syncLocalSessionWithSupabase(session);
        }

        supabase.auth.onAuthStateChange((event, session) => {
            console.log('GenoStock Supabase Auth Event:', event);
            syncLocalSessionWithSupabase(session);
        });
    }
});

// Export functions to window
window.getSupabase = getSupabase;
window.isSupabaseConfigured = isSupabaseConfigured;
window.getCurrentUser = getCurrentUser;
window.syncLocalSessionWithSupabase = syncLocalSessionWithSupabase;
