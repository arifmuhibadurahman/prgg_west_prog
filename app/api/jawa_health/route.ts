
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

    // Access the jw_health collection
    const collection = database.collection("jw_health");

    // Fetch all documents in the collection
    const healthData = await collection.find({}).toArray();

    if (healthData.length > 0) {
      // Format as GeoJSON FeatureCollection
      const geoJson: FeatureCollection = {
        type: "FeatureCollection",
        features: healthData.map(item => ({
          type: "Feature",
          geometry: item.geometry,
          properties: item.properties || {},
        })),
      };
      console.log("Fetched jw_health data:", geoJson.features.length, "features");
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
          error: "No data found in jw_health collection",
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
