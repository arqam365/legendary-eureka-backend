import { NextRequest } from 'next/server'
import { auth } from './firebase-admin'
import { prisma } from './prisma'
import { User, UserRole } from '@prisma/client'

export async function verifyAuth(request: NextRequest): Promise<User | null> {
    const authHeader = request.headers.get('authorization')

    if (!authHeader?.startsWith('Bearer ')) {
        return null
    }

    const token = authHeader.substring(7)

    try {
        const decodedToken = await auth.verifyIdToken(token)

        // Get or create user
        let user = await prisma.user.findUnique({
            where: { authUid: decodedToken.uid }
        })

        if (!user) {
            // Auto-create user on first login
            user = await prisma.user.create({
                data: {
                    authUid: decodedToken.uid,
                    email: decodedToken.email!,
                    name: decodedToken.name || decodedToken.email!.split('@')[0],
                    role: UserRole.EDITOR, // Default role
                }
            })
        }

        return user
    } catch (error) {
        console.error('Auth error:', error)
        return null
    }
}

export async function requireAuth(request: NextRequest): Promise<User> {
    const user = await verifyAuth(request)

    if (!user) {
        throw new Error('Unauthorized')
    }

    if (user.status !== 'ACTIVE') {
        throw new Error('User account is disabled')
    }

    return user
}

export async function requirePermission(
    user: User,
    permission: string
): Promise<void> {
    const hasPermission = await prisma.rolePermission.findFirst({
        where: {
            role: user.role,
            permission,
        }
    })

    if (!hasPermission) {
        throw new Error(`Permission denied: ${permission}`)
    }
}