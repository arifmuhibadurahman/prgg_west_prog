import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return NextResponse.json(
      { error: "MongoDB URI not found" },
      { status: 500 }
    );
  }

  let client;

  try {
    // Create a new MongoDB client
    client = new MongoClient(uri);

    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB");

    // Access the database with the correct name
    const database = client.db("woi");

    // Access the collection with the correct name
    const collection = database.collection("fasum25k");

    // Fetch the first document in the collection
    const fasumData = await collection.findOne({});

    if (fasumData) {
      console.log("Found data in the collection");
      return NextResponse.json(fasumData);
    } else {
      // List collections for debugging
      const collections = await database.listCollections().toArray();
      console.log(
        "Available collections:",
        collections.map((c) => c.name)
      );

      return NextResponse.json(
        {
          error: "No data found in fasum25k collection",
          collections: collections.map((c) => c.name),
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch data",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
      console.log("MongoDB connection closed");
    }
  }
}
