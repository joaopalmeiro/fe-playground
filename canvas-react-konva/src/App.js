// import Konva from 'konva';
import { Profiler } from 'react';

// import Heatmap from './Heatmap';
import HeatmapBasic from './HeatmapBasic';
// import HeatmapWithAxis from './HeatmapWithAxis';
import { genSquareMatrixData } from './utils';
// import { chartDimensions } from './constants';

const onRenderCallback = (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
  const message = `${id}'s ${phase} phase:\n
Actual duration: ${actualDuration}
Base duration: ${baseDuration}
Start time: ${startTime}
Commit time: ${commitTime}
  `;

  console.log(message);
};

function App() {
  // const data = genSquareMatrixData(15);
  const data = genSquareMatrixData(150);

  // const marginValue = 50;
  // const marginValue = 0;

  // https://konvajs.org/docs/performance/All_Performance_Tips.html
  // console.log(Konva.pixelRatio);
  // Konva.pixelRatio = 1;
  // Konva.pixelRatio = 5;
  // console.log(Konva.pixelRatio);

  // console.log(process.env);
  // console.log(process.env.PUBLIC_URL);

  return (
    // <Heatmap data={data} />
    <Profiler id="Heatmap" onRender={onRenderCallback}>
      <HeatmapBasic data={data} />
    </Profiler>
    // <HeatmapWithAxis
    //   data={data}
    //   fullWidth={chartDimensions.width}
    //   fullHeight={chartDimensions.height}
    //   partialMargin={{
    //     top: marginValue,
    //     left: marginValue
    //   }}
    // />
  );
}

export default App;
