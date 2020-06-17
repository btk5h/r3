import { ChartStoreState } from "stores/chart";

function encodeString(str: string): string {
  return str.replace("!", "!!").replace(".", "!.");
}

function decodeString(str: string): string {
  return str.replace("!.", ".").replace("!!", "!");
}

function encodePositionVector(num: [number, number, number]): string {
  const [x, y, z] = num;
  const value =
    (Math.floor((x + 1) * 100) << 16) +
    (Math.floor((y + 1) * 100) << 8) +
    Math.floor((z + 1) * 100);
  return value.toString(36);
}

function decodePositionVector(num: string): [number, number, number] {
  let value = parseInt(num, 36);
  const mask = 0xff;

  const z = Math.min((value & mask) / 100 - 1, 1);
  value >>>= 8;
  const y = Math.min((value & mask) / 100 - 1, 1);
  value >>>= 8;
  const x = Math.min((value & mask) / 100 - 1, 1);

  return [x, y, z];
}

function split(str: string): string[] {
  const parts = [];

  let workingString = "";
  let escape = false;
  for (const c of str) {
    if (escape) {
      workingString += c;
      escape = false;
    } else {
      if (c === "!") {
        escape = true;
      } else if (c === ".") {
        parts.push(workingString);
        workingString = "";
      } else {
        workingString += c;
      }
    }
  }

  parts.push(workingString);

  return parts;
}

export function encodeChart(chart: ChartStoreState) {
  const parts = [
    encodeString(chart.axisLabels.xPlus),
    encodeString(chart.axisLabels.xMinus),
    encodeString(chart.axisLabels.yPlus),
    encodeString(chart.axisLabels.yMinus),
    encodeString(chart.axisLabels.zPlus),
    encodeString(chart.axisLabels.zMinus),
  ];

  for (let point of chart.points) {
    parts.push(encodeString(point.name));
    parts.push(encodePositionVector(point.position));
  }

  return parts.join(".");
}

export function decodeChart(str: string): Partial<ChartStoreState> {
  try {
    const parts = split(str);
    const chart: ChartStoreState = {
      axisLabels: {
        xPlus: decodeString(parts[0]),
        xMinus: decodeString(parts[1]),
        yPlus: decodeString(parts[2]),
        yMinus: decodeString(parts[3]),
        zPlus: decodeString(parts[4]),
        zMinus: decodeString(parts[5]),
      },
      points: [],
    };

    for (let i = 6; i < parts.length; i += 2) {
      const name = decodeString(parts[i]);
      const position = decodePositionVector(parts[i + 1]);

      chart.points.push({ name, position });
    }

    return chart;
  } catch {
    return {};
  }
}
