import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// These environment variables are required for Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For server components (SSR)
export const createServerClient = () => {
  return createClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  )
}

// For client components (CSR)
export const createClientClient = () => {
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  )
}

// Helper function to validate environment variables
export function validateEnv() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }
} 