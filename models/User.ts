import { ObjectId } from 'mongodb'

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  // Add any other fields your User model might have
}

export const UserCollection = 'users' // Name of the MongoDB collection for users