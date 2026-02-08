import { PrismaClient, UserRole } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Create connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// Create adapter
const adapter = new PrismaPg(pool)

// Initialize Prisma with adapter
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🌱 Seeding permissions...')

    // Define permissions per role
    const permissions = [
        // OWNER - Full access
        { role: UserRole.OWNER, permission: 'post:create' },
        { role: UserRole.OWNER, permission: 'post:edit' },
        { role: UserRole.OWNER, permission: 'post:publish' },
        { role: UserRole.OWNER, permission: 'post:hide' },
        { role: UserRole.OWNER, permission: 'post:delete' },
        { role: UserRole.OWNER, permission: 'post:restore' },
        { role: UserRole.OWNER, permission: 'post:delete-permanent' },
        { role: UserRole.OWNER, permission: 'user:invite' },
        { role: UserRole.OWNER, permission: 'user:manage' },
        { role: UserRole.OWNER, permission: 'user:transfer-ownership' },

        // ADMIN - Manage users and content
        { role: UserRole.ADMIN, permission: 'post:create' },
        { role: UserRole.ADMIN, permission: 'post:edit' },
        { role: UserRole.ADMIN, permission: 'post:publish' },
        { role: UserRole.ADMIN, permission: 'post:hide' },
        { role: UserRole.ADMIN, permission: 'post:delete' },
        { role: UserRole.ADMIN, permission: 'post:restore' },
        { role: UserRole.ADMIN, permission: 'user:invite' },
        { role: UserRole.ADMIN, permission: 'user:manage' },

        // EDITOR - Content only
        { role: UserRole.EDITOR, permission: 'post:create' },
        { role: UserRole.EDITOR, permission: 'post:edit' },
    ]

    let created = 0
    let skipped = 0

    for (const perm of permissions) {
        const existing = await prisma.rolePermission.findUnique({
            where: {
                role_permission: {
                    role: perm.role,
                    permission: perm.permission,
                },
            },
        })

        if (!existing) {
            await prisma.rolePermission.create({
                data: perm,
            })
            created++
        } else {
            skipped++
        }
    }

    console.log(`✅ Permissions seeded: ${created} created, ${skipped} skipped`)
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
        await pool.end()
    })