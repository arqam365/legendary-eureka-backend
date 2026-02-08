import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requirePermission } from '@/lib/auth'
import { getPostByIdAdmin } from '@/lib/queries'
import { updatePost, deletePost, permanentDeletePost } from '@/lib/mutations'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth(request)
        await requirePermission(user, 'post:edit')

        const post = await getPostByIdAdmin(params.id)

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
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth(request)
        await requirePermission(user, 'post:edit')

        const body = await request.json()
        const post = await updatePost(user, params.id, body)

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

        // Check if permanent delete
        const url = new URL(request.url)
        const permanent = url.searchParams.get('permanent') === 'true'

        if (permanent) {
            await requirePermission(user, 'post:delete-permanent')
            await permanentDeletePost(user, params.id)
        } else {
            await requirePermission(user, 'post:delete')
            await deletePost(user, params.id)
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 403 })
    }
}