import { NextResponse } from "next/server";
import { MongoClient, WithId, Document } from "mongodb"; // Import WithId and Document
import bcrypt from 'bcrypt';

// Define a more specific User type for database documents
interface UserDocument extends WithId<Document> {
  username: string;
  password?: string; // Make password optional as it might not exist or we might fetch projections
}

// Connect to MongoDB
const uri = process.env.MONGO_DB_URI || "";
const dbName = "todo-nextjs-app";
const collectionName = "users";

async function connectAndGetCollection() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  // Specify the document type for the collection
  return { client, collection: db.collection<UserDocument>(collectionName) };
}

export async function POST(request: Request) {
  let client: MongoClient | null = null;
  try {
    // Destructure username and password from the request body
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 },
      );
    }

    const { client: connectedClient, collection: usersCollection } = await connectAndGetCollection();
    client = connectedClient; // Assign client for the finally block

    // Find the user by username
    const user = await usersCollection.findOne({ username });

    // Validate user existence and if password hash exists
    if (!user || !user.password) {
      // Use a generic error message for security
      return NextResponse.json(
        { error: "Invalid credentials" }, // Changed error message
        { status: 401 }, // Use 401 for unauthorized
      );
    }

    // Compare the provided password with the stored hash
    // user.password is now guaranteed to be a string here
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" }, // Changed error message
        { status: 401 }, // Use 401 for unauthorized
      );
    }

    // Return success response, explicitly using user.username
    // Omit password hash from the response
    return NextResponse.json(
      { message: "Login successful", user: { id: user._id, username: user.username } }, // Corrected shorthand
      { status: 200 },
    );

  } catch (error) {
    console.error("API Login Error:", error); // Log specific error context
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  } finally {
    // Ensure the database connection is always closed
    if (client) {
      await client.close();
    }
  }
}
