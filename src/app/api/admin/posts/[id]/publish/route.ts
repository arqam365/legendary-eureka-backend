import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requirePermission } from '@/lib/auth'
import { publishPost, unpublishPost } from '@/lib/mutations'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth(request)
        await requirePermission(user, 'post:publish')

        const post = await publishPost(user, params.id)
        return NextResponse.json(post)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth(request)
        await requirePermission(user, 'post:publish')

        const post = await unpublishPost(user, params.id)
        return NextResponse.json(post)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}