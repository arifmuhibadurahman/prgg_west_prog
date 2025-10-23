import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { FeatureCollection } from "geojson";

export async function GET() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return NextResponse.json(
      { error: "MongoDB URI not found" },
      { status: 500 }
    );
  }

  let client: MongoClient | undefined;

  try {
    // Create a new MongoDB client
    client = new MongoClient(uri);

    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB");

    // Access the database
    const database = client.db("woi");

    // Access the jawa collection
    const collection = database.collection("jawa");

    // Fetch all documents in the collection
    const jawaData = await collection.find({}).toArray();

    if (jawaData.length > 0) {
      // Format as GeoJSON FeatureCollection
      const geoJson: FeatureCollection = {
        type: "FeatureCollection",
        features: jawaData.map(item => ({
          type: "Feature",
          geometry: item.geometry,
          properties: item.properties || {},
        })),
      };
      console.log("Fetched jawa data:", geoJson.features.length, "features");
      return NextResponse.json(geoJson);
    } else {
      // List collections for debugging
      const collections = await database.listCollections().toArray();
      console.log(
        "Available collections:",
        collections.map((c) => c.name)
      );

      return NextResponse.json(
        {
          error: "No data found in jawa collection",
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
};
