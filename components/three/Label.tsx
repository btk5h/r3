import React, { useRef } from "react";
import { Text } from "drei";
import { useFrame } from "react-three-fiber";
import { Mesh } from "three";
import { PropsOf } from "types/helpers";

type LabelProps = {
  anchorFlipScheme?: "x" | "z";
  invertFlipScheme?: boolean;
};

const Label: React.FC<PropsOf<typeof Text> & LabelProps> = (props) => {
  const { anchorFlipScheme, invertFlipScheme } = props;
  // useRef is used instead of useResource due to useResource being unreliable when Text rerenders
  const ref = useRef<Mesh>();

  useFrame(({ camera }) => {
    ref.current?.lookAt(camera.position);
    ref.current?.rotation.copy(camera.rotation);

    if (ref.current && anchorFlipScheme) {
      const angleCheck =
        anchorFlipScheme === "x"
          ? Math.abs(camera.rotation.z) > Math.PI / 2
          : camera.rotation.z > 0 !== camera.rotation.x > 0;

      if (angleCheck !== !!invertFlipScheme) {
        // @ts-ignore
        ref.current.anchorX = "right";
      } else {
        // @ts-ignore
        ref.current.anchorX = "left";
      }
    }
  });

  // The key workaround here ensures that the bounding box size is properly recomputed when the label contents
  return (
    <Text
      ref={ref}
      color="black"
      key={String(props.children)}
      // @ts-ignore
      anchorX={ref.current?.anchorX}
      {...props}
    />
  );
};

export default Label;
