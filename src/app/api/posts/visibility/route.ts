import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { corsHeaders } from '@/lib/cors'

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    })
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth(req)
        const { visibility } = await req.json()

        if (!['PUBLIC', 'HIDDEN'].includes(visibility)) {
            return NextResponse.json(
                { error: 'Invalid visibility' },
                { status: 400, headers: corsHeaders }
            )
        }

        const post = await prisma.blogPost.update({
            where: { id: params.id },
            data: { visibility },
        })

        return NextResponse.json(post, {
            headers: corsHeaders,
        })
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401, headers: corsHeaders }
        )
    }
}