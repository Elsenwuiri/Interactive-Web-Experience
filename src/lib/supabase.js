import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url) => {
    if (!url || url === "..." || url.includes("...")) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

let client = null;

if (isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey !== "...") {
    try {
        client = createClient(supabaseUrl, supabaseAnonKey);
    } catch (err) {
        console.warn("Gagal menginisialisasi Supabase:", err);
    }
} else {
    console.warn("VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY di .env belum dikonfigurasi dengan URL yang valid.");
}

export const supabase = client;
