const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection to the database
(async () => {
  try {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    if (error) {
      console.error('Database connection failed:', error.message);
    } else {
      console.log('Database connection successful');
    }
  } catch (err) {
    console.error('Error during database connection check:', err.message);
  }
})();

module.exports = supabase;











// const { createClient } = require('@supabase/supabase-js');

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// module.exports = supabase;
