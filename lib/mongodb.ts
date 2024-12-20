import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options)
  global._mongoClientPromise = client.connect()
}

const clientPromise = global._mongoClientPromise!

export async function connectToDatabase(): Promise<{ db: Db; client: MongoClient }> {
  const client = await clientPromise
  const db = client.db('memento') // Specify the 'memento' database
  return { db, client }
}

export default clientPromise