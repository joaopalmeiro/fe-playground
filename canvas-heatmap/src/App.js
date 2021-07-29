import { Profiler } from 'react';

import Heatmap from './Heatmap';
// import HeatmapWithAxis from './HeatmapWithAxis';
import { genSquareMatrixData } from './utils';

const onRenderCallback = (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
  // https://flaviocopes.com/how-to-create-multiline-string-javascript/
  const message = `${id}'s ${phase} phase:\n
Actual duration: ${actualDuration}
Base duration: ${baseDuration}
Start time: ${startTime}
Commit time: ${commitTime}
  `;

  console.log(message);
};

function App() {
  const data = genSquareMatrixData(150);
  // console.table(data);

  // const marginValue = 50;
  // const sizeValue = 1000;

  return (
    <div>
      {/* <Heatmap data={data} /> */}
      {/* More info: https://reactjs.org/docs/profiler.html */}
      <Profiler id="Heatmap" onRender={onRenderCallback}>
        <Heatmap data={data} />
      </Profiler>
      {/* <HeatmapWithAxis
        data={data}
        fullWidth={sizeValue}
        fullHeight={sizeValue}
        partialMargin={{
          top: marginValue,
          left: marginValue,
          right: marginValue,
          bottom: marginValue
        }}
      /> */}
    </div>
  );
}

export default App;
