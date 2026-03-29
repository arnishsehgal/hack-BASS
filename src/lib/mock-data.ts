export type Wall = {
  id: string;
  type: 'load_bearing' | 'partition';
  position: [number, number, number];
  dimensions: [number, number, number];
  rotation: [number, number, number];
  description: string;
};

export type FloorSlab = {
  width: number;
  depth: number;
};

export type ModelData = {
  floor_slab: FloorSlab;
  walls: Wall[];
};

export const modelData: ModelData = {
  floor_slab: {
    width: 100,
    depth: 80,
  },
  walls: [
    {
      id: "w1",
      type: "load_bearing",
      position: [0, 1.5, -40],
      dimensions: [100, 3, 2],
      rotation: [0, 0, 0],
      description: "A 100x3x2 meter load-bearing wall on the north side."
    },
    {
      id: "w2",
      type: "partition",
      position: [-20, 1.5, 0],
      dimensions: [80, 3, 1],
      rotation: [0, 1.5708, 0], // 90 degrees on Y
      description: "An 80x3x1 meter partition wall dividing the west section."
    },
    {
      id: "w3",
      type: "load_bearing",
      position: [0, 1.5, 40],
      dimensions: [100, 3, 2],
      rotation: [0, 0, 0],
      description: "A 100x3x2 meter load-bearing wall on the south side."
    },
    {
      id: "w4",
      type: "load_bearing",
      position: [50, 1.5, 0],
      dimensions: [80, 3, 2],
      rotation: [0, 1.5708, 0],
      description: "An 80x3x2 meter load-bearing wall on the east side."
    },
    {
      id: "w5",
      type: "load_bearing",
      position: [-50, 1.5, 0],
      dimensions: [80, 3, 2],
      rotation: [0, 1.5708, 0],
      description: "An 80x3x2 meter load-bearing wall on the west side."
    },
    {
      id: "w6",
      type: "partition",
      position: [15, 1.5, 0],
      dimensions: [40, 3, 1],
      rotation: [0, 0, 0],
      description: "A 40x3x1 meter partition wall creating a central room."
    }
  ],
};
