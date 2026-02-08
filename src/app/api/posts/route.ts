import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const corsHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    })
}

export async function POST(req: NextRequest) {
    try {
        const user = await requireAuth(req)
        const body = await req.json()

        const {
            title,
            slug,
            description,
            content,
            category,
            tags,
            status,
            visibility,
        } = body

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400, headers: corsHeaders }
            )
        }

        const post = await prisma.blogPost.create({
            data: {
                title,
                slug,
                description,
                contentHtml: content,
                category: category.toUpperCase(),
                tags,
                status: status.toUpperCase(),
                visibility: visibility.toUpperCase(),
                authorId: user.id,
                publishedAt: status === 'published' ? new Date() : null,
            },
        })

        return NextResponse.json(post, { headers: corsHeaders })
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500, headers: corsHeaders }
        )
    }
}