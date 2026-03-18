import { emailSchema, userProfileSchema, userUpsertSchema } from '../../validator/validate'
import { supabaseAdmin } from '../../config/supabase'

// Ambil user berdasarkan email dari Supabase Auth
export const getUserByEmail = async (email: string) => {
  const emailValidation = emailSchema.safeParse(email)
  if (!emailValidation.success) {
    console.error('Invalid email format in getUserByEmail:', emailValidation.error.issues)
    return null
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', emailValidation.data)
    .maybeSingle()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return user
}

// Simpan atau perbarui user di database
export const upsertUser = async (userData: {
  email: string
  full_name: string
  avatar_url?: string | null
}) => {
  const validation = userUpsertSchema.safeParse(userData)
  if (!validation.success) {
    console.error('Invalid user payload in upsertUser:', validation.error.issues)
    return null
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .upsert([validation.data], { onConflict: 'email' })
    .select()
    .single()

  if (error) {
    console.error('Error upserting user:', error)
    return null
  }

  const userValidation = userProfileSchema.safeParse(data)
  if (!userValidation.success) {
    console.error('Invalid user row returned from DB:', userValidation.error.issues)
    return null
  }

  return userValidation.data
}