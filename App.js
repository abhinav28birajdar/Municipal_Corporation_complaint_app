import { initializeSupabase } from '@/lib/supabase';

// In your app initialization code:
useEffect(() => {
  initializeSupabase();
}, []);