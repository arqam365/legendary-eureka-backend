import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requirePermission } from '@/lib/auth'
import { hidePost, unhidePost } from '@/lib/mutations'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth(request)
        await requirePermission(user, 'post:hide')

        const post = await hidePost(user, params.id)
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
        await requirePermission(user, 'post:hide')

        const post = await unhidePost(user, params.id)
        return NextResponse.json(post)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}