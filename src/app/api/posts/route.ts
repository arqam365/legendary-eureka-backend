import { NextResponse } from 'next/server'
import { getPublishedPosts } from '@/lib/queries'

export async function GET() {
    try {
        const posts = await getPublishedPosts()
        return NextResponse.json(posts)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        )
    }
}

export const revalidate = 60 // Revalidate every 60 seconds