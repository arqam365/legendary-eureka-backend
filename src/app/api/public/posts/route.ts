import { NextResponse } from 'next/server'
import { getPublishedPosts } from '@/lib/queries'

const publicCors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: publicCors })
}

export async function GET() {
    try {
        const posts = await getPublishedPosts()
        return NextResponse.json(posts, { headers: publicCors })
    } catch {
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500, headers: publicCors }
        )
    }
}

export const revalidate = 60
