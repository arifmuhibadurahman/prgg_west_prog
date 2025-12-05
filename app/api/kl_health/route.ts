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
    client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");
    const database = client.db("woi");
    const collection = database.collection("kl_health");
    const healthData = await collection.find({}).toArray();

    if (healthData.length > 0) {
      const geoJson: FeatureCollection = {
        type: "FeatureCollection",
        features: healthData.map(item => ({
          type: "Feature",
          geometry: item.geometry,
          properties: item.properties || {},
        })),
      };
      console.log("Fetched kl_health data:", geoJson.features.length, "features");
      return NextResponse.json(geoJson);
    } else {
      const collections = await database.listCollections().toArray();
      console.log(
        "Available collections:",
        collections.map((c) => c.name)
      );
      return NextResponse.json(
        {
          error: "No data found in kl_health collection",
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