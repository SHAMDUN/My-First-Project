// ==========================================
// تنظیمات Supabase - آکادمی شمعدون
// ==========================================

const SUPABASE_URL = 'https://jcwwilatvstjrohvhtss.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_R7tCe030dGeJ0IRWfcgxww_MgEfh95O';
const ADMIN_EMAIL = 'beat.market.office@gmail.com';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
