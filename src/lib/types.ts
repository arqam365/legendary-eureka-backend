import { BlogPost, PostStatus, User } from '@prisma/client'

export type { BlogPost, PostStatus, User }

// For creating posts
export type CreatePostInput = {
    title: string
    description: string
    contentHtml: string
    contentJson?: never
    coverImage?: string
    category: string
    tags?: string[]
    metaTitle?: string
    metaDescription?: string
}

// For updating posts
export type UpdatePostInput = Partial<CreatePostInput>

// Public-safe post (never includes drafts)
export type PublicPost = BlogPost & {
    status: 'PUBLISHED'
    publishedAt: Date
}