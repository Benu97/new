const fs = require('fs');
const path = require('path');

// The content for the .env.local file
const envContent = `NEXT_PUBLIC_SUPABASE_URL=https://gugmyndgllbbymrypjpw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1Z215bmRnbGxiYnltcnlwanB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzk3NzAsImV4cCI6MjA1OTg1NTc3MH0.T9JVd_mEKi3zyCmc-2Zxl7hBN4jp74vwJj_o-JP8kLg
`;

// Write the file
fs.writeFileSync(path.join(__dirname, '.env.local'), envContent);

console.log('.env.local file created successfully!');
console.log('Please restart your development server if it\'s running.'); 