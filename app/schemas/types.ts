import type { Mesh } from "three";

export interface CelestialBody {
  mesh: Mesh;
  orbitSpeed: number;
  distance: number;
}
