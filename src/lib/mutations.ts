import { prisma } from './prisma'
import { PostStatus, PostVisibility, User, PostCategory } from '@prisma/client'
import { generateSlug, ensureUniqueSlug } from './queries'
import { CreatePostInput, UpdatePostInput } from './types'

// ==========================================
// AUDIT LOGGING
// ==========================================

async function logAction(
    actorId: string,
    action: string,
    targetType: string,
    targetId: string,
    metadata?: any
) {
    await prisma.auditLog.create({
        data: {
            actorId,
            action,
            targetType,
            targetId,
            metadata,
        }
    })
}

// ==========================================
// POST MUTATIONS
// ==========================================

export async function createPost(actor: User, data: CreatePostInput) {
    const baseSlug = generateSlug(data.title)
    const slug = await ensureUniqueSlug(baseSlug)

    const post = await prisma.blogPost.create({
        data: {
            ...data,
            slug,
            authorId: actor.id,
            category: data.category as PostCategory,
            status: PostStatus.DRAFT,
            visibility: PostVisibility.PUBLIC,
            tags: data.tags || [],
        }
    })

    await logAction(actor.id, 'post:create', 'post', post.id, { title: data.title })

    return post
}

export async function updatePost(actor: User, id: string, data: UpdatePostInput) {
    const updates: any = { ...data }

    // Regenerate slug if title changed
    if (data.title) {
        const baseSlug = generateSlug(data.title)
        updates.slug = await ensureUniqueSlug(baseSlug, id)
    }

    // Convert category if provided
    if (data.category) {
        updates.category = data.category as PostCategory
    }

    const post = await prisma.blogPost.update({
        where: { id },
        data: updates,
    })

    await logAction(actor.id, 'post:update', 'post', id)

    return post
}

export async function publishPost(actor: User, id: string) {
    const post = await prisma.blogPost.findUnique({ where: { id } })

    if (!post) {
        throw new Error('Post not found')
    }

    // Validation
    if (!post.title || !post.description || !post.contentHtml || !post.category) {
        throw new Error('Cannot publish incomplete post. Required: title, description, contentHtml, category')
    }

    const updated = await prisma.blogPost.update({
        where: { id },
        data: {
            status: PostStatus.PUBLISHED,
            publishedAt: post.publishedAt || new Date(),
        }
    })

    await logAction(actor.id, 'post:publish', 'post', id, { title: post.title })

    return updated
}

export async function unpublishPost(actor: User, id: string) {
    const post = await prisma.blogPost.update({
        where: { id },
        data: {
            status: PostStatus.DRAFT,
        }
    })

    await logAction(actor.id, 'post:unpublish', 'post', id)

    return post
}

export async function hidePost(actor: User, id: string) {
    const post = await prisma.blogPost.update({
        where: { id },
        data: {
            visibility: PostVisibility.HIDDEN,
        }
    })

    await logAction(actor.id, 'post:hide', 'post', id)

    return post
}

export async function unhidePost(actor: User, id: string) {
    const post = await prisma.blogPost.update({
        where: { id },
        data: {
            visibility: PostVisibility.PUBLIC,
        }
    })

    await logAction(actor.id, 'post:unhide', 'post', id)

    return post
}

export async function deletePost(actor: User, id: string) {
    const post = await prisma.blogPost.update({
        where: { id },
        data: {
            deletedAt: new Date(),
        }
    })

    await logAction(actor.id, 'post:delete', 'post', id)

    return post
}

export async function restorePost(actor: User, id: string) {
    const post = await prisma.blogPost.update({
        where: { id },
        data: {
            deletedAt: null,
        }
    })

    await logAction(actor.id, 'post:restore', 'post', id)

    return post
}

export async function permanentDeletePost(actor: User, id: string) {
    await logAction(actor.id, 'post:delete-permanent', 'post', id)

    return prisma.blogPost.delete({
        where: { id }
    })
}