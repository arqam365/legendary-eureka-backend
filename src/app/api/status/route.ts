import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

export async function GET() {
    try {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL })
        const adapter = new PrismaPg(pool)
        const prisma = new PrismaClient({ adapter })

        const [totalPosts, publishedPosts, totalUsers] = await Promise.all([
            prisma.blogPost.count(),
            prisma.blogPost.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
            prisma.user.count(),
        ])

        await prisma.$disconnect()
        await pool.end()

        return NextResponse.json({
            status: 'operational',
            timestamp: new Date().toISOString(),
            database: 'connected',
            stats: {
                totalPosts,
                publishedPosts,
                totalUsers,
            },
        })
    } catch (error: any) {
        return NextResponse.json(
            {
                status: 'error',
                timestamp: new Date().toISOString(),
                database: 'disconnected',
                error: error.message,
            },
            { status: 500 }
        )
    }
}

export const revalidate = 0 // Always get fresh data