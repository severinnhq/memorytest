import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()

    const client = await clientPromise
    const db = client.db("memento")

    const result = await db.collection("users").insertOne({
      username,
      email,
      password, // Note: In a real application, you should hash the password before storing it
      createdAt: new Date()
    })

    console.log('User created:', { username, email, _id: result.insertedId })

    return NextResponse.json({ message: 'User created successfully', userId: result.insertedId })
  } catch (e) {
    console.error('Error creating user:', e)
    return NextResponse.json({ error: 'An error occurred while creating the user' }, { status: 500 })
  }
}