import React from "react";
import { ReactThreeFiber as R3F } from "react-three-fiber";
import { Sphere } from "drei";
import { Vector3 } from "three";
import Label from "components/three/Label";

type LabeledPointProps = {
  position?: Vector3 | [number, number, number];
  color: R3F.Color;
};

const LabeledPoint: React.FC<LabeledPointProps> = (props) => {
  const { position, color, children } = props;

  return (
    <Sphere position={position} args={[0.01]}>
      <meshBasicMaterial attach="material" color={color} />
      <Label anchorX={-0.01} anchorY="bottom" fontSize={0.05}>
        {children}
      </Label>
    </Sphere>
  );
};

export default LabeledPoint;
