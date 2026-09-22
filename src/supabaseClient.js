import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gelxtxmdifukveyzixwn.supabase.co";
const supabaseKey = "sb_publishable_IeMI0yALQDgtDtrgkM7GMg_mNXfSdGI";

export const supabase = createClient(supabaseUrl, supabaseKey);
