import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

export async function GET() {
  const users = await redis.keys('online:user:*')
  const guests = await redis.keys('online:guest:*')

  return NextResponse.json({
    logged: users.length,
    guests: guests.length,
    total: users.length + guests.length
  })
}
