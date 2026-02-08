import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'

// 🔑 CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export async function OPTIONS() {
    return new NextResponse(null, { headers: corsHeaders })
}

export async function POST(request: NextRequest) {
    try {
        // Expect Bearer token from frontend
        const user = await verifyAuth(request)

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401, headers: corsHeaders }
            )
        }

        // You can also set cookies here if you want session-based auth

        return NextResponse.json(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            { headers: corsHeaders }
        )
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500, headers: corsHeaders }
        )
    }
}