import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import {corsHeaders} from "@/lib/cors";

// 🔴 THIS IS REQUIRED FOR PREFLIGHT
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: corsHeaders,
    })
}

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization')
        console.log('AUTH HEADER:', authHeader)

        const user = await verifyAuth(request)

        console.log('USER:', user)

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401, headers: corsHeaders }
            )
        }

        return NextResponse.json(
            { id: user.id, email: user.email, role: user.role },
            { headers: corsHeaders }
        )
    } catch (err) {
        console.error('AUTH FIREBASE ERROR:', err)
        return NextResponse.json(
            { error: 'Auth failed' },
            { status: 500, headers: corsHeaders }
        )
    }
}