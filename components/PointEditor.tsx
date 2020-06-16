import React from "react";
import tw from "twin.macro";
import { Draft } from "immer";
import { DataPoint } from "stores/chart";
import { nextHSL } from "utils/color";

const Wrapper = tw.div`
  p-2 mb-2
  bg-gray-200
  rounded
`;

const ColorIndicator = tw.span`
  inline-block
  h-4 w-4
  mb-2 mr-2
  align-bottom
  rounded-full
`;

const TextBox = tw.input`
  p-1
  bg-gray-300
  rounded
`;

const Slider = tw.input`
  block
  w-full
`;

const DeleteButton = tw.button`
  py-1 px-3 ml-2
  bg-red-200
  text-red-900
  rounded
  float-right
`;

const SLIDER_RESOLUTION = 1;
const SLIDER_STEP = 0.01;

type PointEditorProps = {
  pointId: number;
  usePoint: (id: number) => DataPoint;
  updater: (fn: (points: Draft<DataPoint>[]) => void) => void;
  onDelete: (i: number) => void;
};

const PointEditor: React.FC<PointEditorProps> = (props) => {
  const { pointId, usePoint, updater, onDelete } = props;
  const point = usePoint(pointId);

  return (
    <Wrapper>
      <ColorIndicator style={{ backgroundColor: nextHSL(pointId) }} />
      <TextBox
        type="text"
        value={point.name}
        onChange={(e) =>
          updater((points) => (points[pointId].name = e.target.value))
        }
      />
      <DeleteButton onClick={() => onDelete(pointId)}>Delete</DeleteButton>
      <Slider
        type="range"
        min={-SLIDER_RESOLUTION}
        max={SLIDER_RESOLUTION}
        step={SLIDER_STEP}
        value={point.position[0]}
        onChange={(e) => {
          updater(
            (points) => (points[pointId].position[0] = e.target.valueAsNumber)
          );
        }}
      />
      <Slider
        type="range"
        min={-SLIDER_RESOLUTION}
        max={SLIDER_RESOLUTION}
        step={SLIDER_STEP}
        value={point.position[1]}
        onChange={(e) => {
          updater(
            (points) => (points[pointId].position[1] = e.target.valueAsNumber)
          );
        }}
      />
      <Slider
        type="range"
        min={-SLIDER_RESOLUTION}
        max={SLIDER_RESOLUTION}
        step={SLIDER_STEP}
        value={point.position[2]}
        onChange={(e) => {
          updater(
            (points) => (points[pointId].position[2] = e.target.valueAsNumber)
          );
        }}
      />
    </Wrapper>
  );
};

export default PointEditor;
