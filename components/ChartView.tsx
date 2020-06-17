import React, { useMemo, useState } from "react";
import tw, { styled } from "twin.macro";
import { Canvas } from "react-three-fiber";
import queryString from "query-string";
import { BoxBufferGeometry, BufferGeometry } from "three";
import { OrbitControls } from "drei";
import { Draft } from "immer";
import Axis from "components/three/Axis";
import { vectorY, vectorZ } from "utils/three/constants";
import Label from "components/three/Label";
import {
  ChartStoreHook,
  ChartStoreState,
  DataPoint,
  getChartStore,
} from "stores/chart";
import PointEditor from "components/PointEditor";
import LabeledPoints from "components/three/LabeledPoints";
import ChartStateObserver from "components/ChartStateObserver";
import { decodeChart } from "utils/chartEncoding";

const Layout = tw.div`
  flex flex-col
  md:flex-row
  min-h-screen
  max-w-full
`;

const EditorPane = tw.div`
  px-6 py-4
  max-h-screen
  md:max-w-md
  overflow-y-scroll
  flex-shrink-0
  bg-gray-100
  shadow z-20
`;

const CanvasWrapper = styled.div`
  ${tw`h-screen flex-grow`};

  // R3F's Canvas does not forward className to the canvas
  canvas {
    ${tw`
      absolute inset-0
      outline-none
    `};
  }
`;

type SceneProps = {
  useChartStore: ChartStoreHook;
};

const Scene: React.FC<SceneProps> = (props) => {
  const { useChartStore } = props;

  const { axisLabels, points } = useChartStore();
  const usePoints = () => useChartStore((state) => state.points);

  const geom: [BufferGeometry] = useMemo(
    () => [new BoxBufferGeometry(2, 2, 2)],
    []
  );

  return (
    <>
      <lineSegments>
        <edgesGeometry attach="geometry" args={geom} />
        <lineBasicMaterial color="black" opacity={0.5} attach="material" />
      </lineSegments>
      <line>
        <lineBasicMaterial color="blue" attach="material" />
      </line>
      <Axis />
      <Axis direction={vectorY} color={0x00ff00} />
      <Axis direction={vectorZ} color={0x0000ff} />
      <Label anchorFlipScheme="x" position={[1.1, 0, 0]}>
        {axisLabels.xPlus}
      </Label>
      <Label anchorFlipScheme="x" invertFlipScheme position={[-1.1, 0, 0]}>
        {axisLabels.xMinus}
      </Label>
      <Label position={[0, 1.1, 0]}>{axisLabels.yPlus}</Label>
      <Label position={[0, -1.1, 0]}>{axisLabels.yMinus}</Label>

      <Label anchorFlipScheme="z" position={[0, 0, 1.1]}>
        {axisLabels.zPlus}
      </Label>
      <Label anchorFlipScheme="z" invertFlipScheme position={[0, 0, -1.1]}>
        {axisLabels.zMinus}
      </Label>
      <LabeledPoints usePoints={usePoints} />

      <OrbitControls
        minDistance={0}
        maxDistance={4}
        autoRotate={false}
        autoRotateSpeed={5}
      />
    </>
  );
};

type AxisEditorProps = {
  axis: keyof ChartStoreState["axisLabels"];
  useAxisLabel: (label: keyof ChartStoreState["axisLabels"]) => string;
  onChange: (label: keyof ChartStoreState["axisLabels"], value: string) => void;
};

const AxisEditor: React.FC<AxisEditorProps> = (props) => {
  const { axis, useAxisLabel, onChange } = props;
  const axisLabel = useAxisLabel(axis);

  return (
    <input
      type="text"
      value={axisLabel}
      onChange={(e) => onChange(axis, e.target.value)}
    />
  );
};

const Editor: React.FC<SceneProps> = (props) => {
  const { useChartStore } = props;
  const { set, deletePoint, createPoint } = useChartStore();
  const useAxisLabel = (label: keyof ChartStoreState["axisLabels"]) =>
    useChartStore((state) => state.axisLabels[label]);
  const setAxisLabel = (
    label: keyof ChartStoreState["axisLabels"],
    value: string
  ) => {
    set((state) => {
      state.axisLabels[label] = value;
    });
  };
  const pointCount = useChartStore((state) => state.points.length);
  const usePoint = (i: number) => useChartStore((state) => state.points[i]);
  const pointsUpdater = (fn: (f: Draft<DataPoint>[]) => void) =>
    set((state) => {
      fn(state.points);
    });

  const editors = [];
  for (let i = 0; i < pointCount; i++) {
    editors.push(
      <PointEditor
        key={i}
        pointId={i}
        usePoint={usePoint}
        updater={pointsUpdater}
        onDelete={deletePoint}
      />
    );
  }

  return (
    <div>
      <AxisEditor
        axis="xPlus"
        useAxisLabel={useAxisLabel}
        onChange={setAxisLabel}
      />
      <AxisEditor
        axis="xMinus"
        useAxisLabel={useAxisLabel}
        onChange={setAxisLabel}
      />
      <AxisEditor
        axis="yPlus"
        useAxisLabel={useAxisLabel}
        onChange={setAxisLabel}
      />
      <AxisEditor
        axis="yMinus"
        useAxisLabel={useAxisLabel}
        onChange={setAxisLabel}
      />
      <AxisEditor
        axis="zPlus"
        useAxisLabel={useAxisLabel}
        onChange={setAxisLabel}
      />
      <AxisEditor
        axis="zMinus"
        useAxisLabel={useAxisLabel}
        onChange={setAxisLabel}
      />
      {editors}
      <button onClick={createPoint}>Create Point</button>
    </div>
  );
};

const ChartView: React.FC = () => {
  const [useStore] = getChartStore(() =>
    decodeChart(String(queryString.parse(location.search).c))
  );

  return (
    <Layout>
      <ChartStateObserver useChartStore={useStore} />
      <CanvasWrapper>
        <Canvas camera={{ position: [1.2, 1.2, 2.5], near: 0.01 }}>
          <Scene useChartStore={useStore} />
        </Canvas>
      </CanvasWrapper>
      <EditorPane>
        <Editor useChartStore={useStore} />
      </EditorPane>
    </Layout>
  );
};

export default ChartView;
