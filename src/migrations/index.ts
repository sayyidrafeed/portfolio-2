import * as migration_20260718_014205_initial from "./20260718_014205_initial";

export const migrations = [
  {
    up: migration_20260718_014205_initial.up,
    down: migration_20260718_014205_initial.down,
    name: "20260718_014205_initial",
  },
];
