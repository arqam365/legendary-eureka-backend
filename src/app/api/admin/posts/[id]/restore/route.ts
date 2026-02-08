import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requirePermission } from '@/lib/auth'
import { restorePost } from '@/lib/mutations'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth(request)
        await requirePermission(user, 'post:restore')

        const post = await restorePost(user, params.id)
        return NextResponse.json(post)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}