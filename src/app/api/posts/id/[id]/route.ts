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

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth(req)

        const { id } = await context.params

        await prisma.blogPost.update({
            where: { id },
            data: { deletedAt: new Date() },
        })

        return NextResponse.json(
            { success: true },
            { headers: corsHeaders }
        )
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: 'Failed to delete post' },
            { status: 500, headers: corsHeaders }
        )
    }
}