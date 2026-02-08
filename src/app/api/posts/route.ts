import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { corsHeaders } from '@/lib/cors'

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET(req: NextRequest) {
    try {
        await requireAuth(req)

        const posts = await prisma.blogPost.findMany({
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                title: true,
                status: true,
                visibility: true,
                updatedAt: true,
            },
        })

        return NextResponse.json(posts, { headers: corsHeaders })
    } catch {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401, headers: corsHeaders }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await requireAuth(req)
        const body = await req.json()

        const post = await prisma.blogPost.create({
            data: {
                title: body.title,
                slug: body.slug,
                description: body.description,
                contentHtml: body.content,
                category: body.category.toUpperCase(),
                tags: body.tags,
                status: body.status.toUpperCase(),
                visibility: body.visibility.toUpperCase(),
                authorId: user.id,
                publishedAt:
                    body.status === 'published' ? new Date() : null,
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