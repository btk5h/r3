import React from "react";
import { Text } from "drei";
import { useFrame, useResource } from "react-three-fiber";
import { Mesh } from "three";
import { PropsOf } from "types/helpers";

const Label: React.FC<PropsOf<typeof Text>> = (props) => {
  const [ref, text] = useResource<Mesh>();

  useFrame(({ camera }) => {
    text.lookAt(camera.position);
    text.rotation.copy(camera.rotation);
  });

  return <Text ref={ref} color="black" {...props} />;
};

export default Label;
