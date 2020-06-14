import React, { useMemo } from "react";
import { ArrowHelper, Vector3 } from "three";
import { vectorX, vectorZero } from "utils/three/constants";

type AxisProps = {
  direction?: Vector3;
  color?: number;
};

const Axis: React.FC<AxisProps> = (props) => {
  const { direction = vectorX, color = 0xff0000 } = props;

  type ArrowParams = ConstructorParameters<typeof ArrowHelper>;

  const args: [ArrowParams, ArrowParams] = useMemo(
    () => [
      [direction, vectorZero, 1, color, 0.1],
      [direction.clone().negate(), vectorZero, 1, color, 0.1],
    ],
    [direction, color]
  );
  return (
    <>
      <arrowHelper args={args[0]} />
      <arrowHelper args={args[1]} />
    </>
  );
};

export default Axis;
