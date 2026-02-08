import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'

const corsHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// 🔴 THIS IS REQUIRED FOR PREFLIGHT
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: corsHeaders,
    })
}

export async function POST(request: NextRequest) {
    try {
        const user = await verifyAuth(request)

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401, headers: corsHeaders }
            )
        }

        return NextResponse.json(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            { headers: corsHeaders }
        )
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: 'Auth failed' },
            { status: 500, headers: corsHeaders }
        )
    }
}