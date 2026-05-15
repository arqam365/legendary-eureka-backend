import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requirePermission } from '@/lib/auth'
import { getTrashPosts } from '@/lib/queries'
import { corsHeaders } from '@/lib/cors'

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth(request)
        await requirePermission(user, 'post:delete')

        const posts = await getTrashPosts()
        return NextResponse.json(posts)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 403 })
    }
}