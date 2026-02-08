import { NextResponse } from 'next/server'
import { getPublishedPostBySlug } from '@/lib/queries'

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const post = await getPublishedPostBySlug(params.slug)

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        return NextResponse.json(post)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch post' },
            { status: 500 }
        )
    }
}

export const revalidate = 60