import React, { useRef } from "react";
import { Text } from "drei";
import { useFrame } from "react-three-fiber";
import { Mesh } from "three";
import { PropsOf } from "types/helpers";

const Label: React.FC<PropsOf<typeof Text>> = (props) => {
  // useRef is used instead of useResource due to useResource being unreliable when Text rerenders
  const ref = useRef<Mesh>();

  useFrame(({ camera }) => {
    ref.current?.lookAt(camera.position);
    ref.current?.rotation.copy(camera.rotation);
  });

  // The key workaround here ensures that the bounding box size is properly recomputed when the label contents
  return (
    <Text ref={ref} color="black" key={String(props.children)} {...props} />
  );
};

export default Label;
