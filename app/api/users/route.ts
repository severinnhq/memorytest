import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("memento")  // Use your actual database name

    const users = await db.collection("users").find({}).toArray()

    return NextResponse.json({ users })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'An error occurred while fetching users' }, { status: 500 })
  }
}