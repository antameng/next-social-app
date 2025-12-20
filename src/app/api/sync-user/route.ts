import { auth, clerkClient } from '@clerk/nextjs/server'
import prisma from '@/lib/client'
import { NextResponse } from 'next/server'

async function resolveUniqueUsername(desiredUsername: string, userId: string) {
  const base = (desiredUsername || `user_${userId}`)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '_')

  let candidate = base || `user_${userId}`

  for (let attempt = 0; attempt < 10; attempt++) {
    const existing = await prisma.user.findUnique({
      where: { username: candidate },
      select: { id: true },
    })

    if (!existing || existing.id === userId) return candidate

    candidate = `${base}_${attempt + 1}`
  }

  candidate = `${base}_${Math.random().toString(36).slice(2, 8)}`
  return candidate
}

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    console.log('🔍 开始同步用户:', userId)

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (existingUser) {
      console.log('✅ 用户已存在于数据库:', existingUser)
      return NextResponse.json({
        message: '用户已存在',
        user: existingUser,
      })
    }

    // 从 Clerk 获取用户信息
    const client = await clerkClient()
    const clerkUser = await client.users.getUser(userId)

    console.log('📥 从 Clerk 获取用户信息:', {
      id: clerkUser.id,
      username: clerkUser.username,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      imageUrl: clerkUser.imageUrl,
    })

    // 生成 username
    const desiredUsername = clerkUser.username ||
                            clerkUser.firstName ||
                            clerkUser.emailAddresses[0]?.emailAddress?.split('@')[0] ||
                            `user_${userId}`

    const username = await resolveUniqueUsername(desiredUsername, userId)

    console.log('🔄 解析 username:', username)

    // 创建用户
    const userData = {
      id: userId,
      username,
      name: clerkUser.firstName || null,
      surname: clerkUser.lastName || null,
      email: clerkUser.emailAddresses[0]?.emailAddress || null,
      avatar: clerkUser.imageUrl || '/noAvatar.png',
      cover: '/noCover.png',
    }

    console.log('💾 创建用户数据:', userData)

    const newUser = await prisma.user.create({
      data: userData,
    })

    console.log('✅ 用户创建成功:', newUser)

    return NextResponse.json({
      message: '用户同步成功',
      user: newUser,
    })

  } catch (error) {
    console.error('❌ 同步用户出错:', error)
    return NextResponse.json({
      error: '同步失败',
      message: error instanceof Error ? error.message : String(error),
      details: error,
    }, { status: 500 })
  }
}
