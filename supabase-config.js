// ==========================================
// تنظیمات Supabase - آکادمی شمعدون
// ==========================================

const SUPABASE_URL = 'https://jcwwilatvstjrohvhtss.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjd3dpbGF0dnN0anJvaHZodHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MDY4NTYsImV4cCI6MjEwNTI4Mjg1Nn0.eUC89RJy6-60nNGrSeYeDADzLxz-kWTGy4DbNGVi6MM';
const ADMIN_EMAIL = 'beat.market.office@gmail.com';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
