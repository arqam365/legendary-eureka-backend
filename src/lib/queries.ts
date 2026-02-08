import { prisma } from './prisma'
import { PostStatus, PostVisibility } from '@prisma/client'
import slugify from 'slugify'

// ==========================================
// PUBLIC QUERIES (Filtered)
// ==========================================

export async function getPublishedPosts() {
    return prisma.blogPost.findMany({
        where: {
            status: PostStatus.PUBLISHED,
            visibility: PostVisibility.PUBLIC,
            deletedAt: null,
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            }
        },
        orderBy: {
            publishedAt: 'desc',
        },
    })
}

export async function getPublishedPostBySlug(slug: string) {
    return prisma.blogPost.findFirst({
        where: {
            slug,
            status: PostStatus.PUBLISHED,
            visibility: PostVisibility.PUBLIC,
            deletedAt: null,
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            }
        },
    })
}

// ==========================================
// ADMIN QUERIES (All posts)
// ==========================================

export async function getAllPostsAdmin(includeDeleted = false) {
    return prisma.blogPost.findMany({
        where: includeDeleted ? {} : { deletedAt: null },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                }
            }
        },
        orderBy: [
            { status: 'desc' },
            { updatedAt: 'desc' }
        ],
    })
}

export async function getTrashPosts() {
    return prisma.blogPost.findMany({
        where: {
            deletedAt: { not: null },
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            }
        },
        orderBy: {
            deletedAt: 'desc',
        },
    })
}

export async function getPostByIdAdmin(id: string) {
    return prisma.blogPost.findUnique({
        where: { id },
        include: {
            author: true,
        }
    })
}

// ==========================================
// UTILITIES
// ==========================================

export function generateSlug(title: string): string {
    return slugify(title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
    })
}

export async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    let slug = baseSlug
    let counter = 1

    while (true) {
        const existing = await prisma.blogPost.findFirst({
            where: {
                slug,
                ...(excludeId && { id: { not: excludeId } })
            }
        })

        if (!existing) return slug

        slug = `${baseSlug}-${counter}`
        counter++
    }
}