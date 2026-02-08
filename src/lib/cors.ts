const allowedOrigins = [
    'http://localhost:3000',
    'https://revzion.com',
    'https://revzion-cms.vercel.app',
    'https://legendary-eureka-admin.vercel.app',
]

export const corsHeaders = (origin?: string) => ({
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin ?? '')
        ? origin!
        : 'https://revzion.com',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
})