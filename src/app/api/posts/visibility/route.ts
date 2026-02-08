import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { corsHeaders } from '@/lib/cors'
import { PostVisibility } from '@prisma/client'

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    })
}

export async function PATCH(req: NextRequest) {
    try {
        await requireAuth(req)

        const { id, visibility } = await req.json()

        if (!id || !visibility) {
            return NextResponse.json(
                { error: 'Missing id or visibility' },
                { status: 400, headers: corsHeaders }
            )
        }

        const post = await prisma.blogPost.update({
            where: { id },
            data: {
                visibility: visibility as PostVisibility,
            },
        })

        return NextResponse.json(post, { headers: corsHeaders })
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: 'Failed to update visibility' },
            { status: 500, headers: corsHeaders }
        )
    }
}