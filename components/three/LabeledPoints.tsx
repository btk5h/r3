import React from "react";
import { DataPoint } from "stores/chart";
import LabeledPoint from "components/three/LabeledPoint";
import { nextHSL } from "utils/color";

type LabeledPointsProps = {
  usePoints: () => DataPoint[];
};

const LabeledPoints: React.FC<LabeledPointsProps> = (props) => {
  const { usePoints } = props;
  const points = usePoints();

  return (
    <>
      {points.map((point, i) => (
        <LabeledPoint key={i} position={point.position} color={nextHSL(i)}>
          {point.name}
        </LabeledPoint>
      ))}
    </>
  );
};

export default LabeledPoints;
