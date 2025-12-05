declare module "leaflet-control-geocoder";

import * as L from "leaflet";

declare module "leaflet" {
	namespace Control {
		// Minimal typing so you can call `L.Control.geocoder(options)` in TS.
		// Keep options `any` to avoid coupling to a specific plugin shape.
		function geocoder(options?: any): L.Control;
	}
}

export {};
