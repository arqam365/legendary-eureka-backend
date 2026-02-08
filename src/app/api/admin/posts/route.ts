import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requirePermission } from '@/lib/auth'
import { getAllPostsAdmin } from '@/lib/queries'
import { createPost } from '@/lib/mutations'

export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth(request)
        await requirePermission(user, 'post:edit')

        const posts = await getAllPostsAdmin()
        return NextResponse.json(posts)
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: error.message === 'Unauthorized' ? 401 : 403 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth(request)
        await requirePermission(user, 'post:create')

        const body = await request.json()
        const post = await createPost(user, body)

        return NextResponse.json(post, { status: 201 })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        )
    }
}