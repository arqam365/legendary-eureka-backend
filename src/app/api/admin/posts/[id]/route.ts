import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requirePermission } from '@/lib/auth'
import { getPostByIdAdmin } from '@/lib/queries'
import { updatePost, deletePost, permanentDeletePost } from '@/lib/mutations'

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth(request)
        await requirePermission(user, 'post:edit')

        const { id } = await context.params
        const post = await getPostByIdAdmin(id)

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        return NextResponse.json(post)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 403 })
    }
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth(request)
        await requirePermission(user, 'post:edit')

        const { id } = await context.params
        const body = await request.json()
        const post = await updatePost(user, id, body)

        return NextResponse.json(post)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth(request)

        const { id } = await context.params
        const url = new URL(request.url)
        const permanent = url.searchParams.get('permanent') === 'true'

        if (permanent) {
            await requirePermission(user, 'post:delete-permanent')
            await permanentDeletePost(user, id)
        } else {
            await requirePermission(user, 'post:delete')
            await deletePost(user, id)
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 403 })
    }
}