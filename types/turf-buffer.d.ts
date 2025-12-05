declare module "@turf/buffer" {
  import { AllGeoJSON } from "@turf/helpers";
  export interface TurfBufferOptions {
    units?: "meters" | "kilometers" | "miles" | "feet";
  }

  export default function buffer(
    geojson: AllGeoJSON,
    radius: number,
    options?: TurfBufferOptions
  ): any;
}
