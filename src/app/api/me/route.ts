import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const corsHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: corsHeaders,
    })
}

export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth(request)

        return NextResponse.json(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status,
            },
            { headers: corsHeaders }
        )
    } catch {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401, headers: corsHeaders }
        )
    }
}