import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration: 7200, // 2 hours
    cookies: {
      secure: true, // Только HTTPS
      sameSite: 'Lax', // Разрешить cross-site при навигации
    },
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
} 
