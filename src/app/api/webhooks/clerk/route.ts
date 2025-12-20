import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import prisma from '@/lib/client'

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

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // --------------- 修复点 1：必须使用 text() 获取原始 Body ---------------
  const body = await req.text() 
  // ---------------------------------------------------------------------

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    // 传入原始的 body 字符串进行验证
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Get the ID and type
  const { id } = evt.data
  const eventType = evt.type
  
  console.log(`Webhook with an ID of ${id} and type of ${eventType}`)

  // --------------- 修复点 2：直接使用 evt.data，不需要再次 JSON.parse ---------------
  
  if (eventType === 'user.created') {
    try {
      const clerkUserId = evt.data.id as string
      const clerkData = evt.data as any

      // 更健壮的 username 获取逻辑
      const desiredUsername = clerkData.username?.trim() ||
                              clerkData.first_name?.trim() ||
                              clerkData.email_addresses?.[0]?.email_address?.split('@')[0] ||
                              `user_${clerkUserId}`

      const username = await resolveUniqueUsername(desiredUsername, clerkUserId)

      const userData = {
        id: clerkUserId,
        username,
        name: clerkData.first_name || null,
        surname: clerkData.last_name || null,
        avatar: clerkData.image_url || '/noAvatar.png',
        cover: '/noCover.png',
      }

      await prisma.user.upsert({
        where: { id: clerkUserId },
        create: userData,
        update: userData,
      })

      return new Response("用户创建成功", { status: 200 })

    } catch (error) {
      console.error('创建用户出错:', error)
      return new Response(JSON.stringify({
        error: "创建用户失败",
        message: error instanceof Error ? error.message : String(error)
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  if (eventType === 'user.updated') {
    try {
      const clerkUserId = evt.data.id as string
      const clerkData = evt.data as any

      // 更健壮的 username 获取逻辑
      const desiredUsername = clerkData.username?.trim() ||
                              clerkData.first_name?.trim() ||
                              clerkData.email_addresses?.[0]?.email_address?.split('@')[0] ||
                              `user_${clerkUserId}`

      const username = await resolveUniqueUsername(desiredUsername, clerkUserId)

      // create 时的完整数据（包含默认的 cover）
      const createData = {
        id: clerkUserId,
        username,
        name: clerkData.first_name || null,
        surname: clerkData.last_name || null,
        avatar: clerkData.image_url || '/noAvatar.png',
        cover: '/noCover.png',
      }

      // update 时只更新来自 Clerk 的字段，不覆盖用户自定义的 cover
      const updateData = {
        username,
        name: clerkData.first_name || null,
        surname: clerkData.last_name || null,
        avatar: clerkData.image_url || '/noAvatar.png',
        // 注意：不包含 cover，保留用户设置的封面图
      }

      await prisma.user.upsert({
        where: { id: clerkUserId },
        create: createData,
        update: updateData,
      })

      return new Response("用户更新成功", { status: 200 })

    } catch (error) {
      console.error('更新用户出错:', error)
      return new Response(JSON.stringify({
        error: "更新用户失败",
        message: error instanceof Error ? error.message : String(error)
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  return new Response('webhook received', { status: 200 })
}
