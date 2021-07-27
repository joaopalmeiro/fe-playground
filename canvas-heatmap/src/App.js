// import Heatmap from './Heatmap';
import HeatmapWithAxis from './HeatmapWithAxis';
import { genSquareMatrixData } from './utils';

function App() {
  const data = genSquareMatrixData(150);
  // console.table(data);

  const marginValue = 50;
  const sizeValue = 1000;

  return (
    <div>
      {/* <Heatmap data={data} /> */}
      <HeatmapWithAxis
        data={data}
        fullWidth={sizeValue}
        fullHeight={sizeValue}
        partialMargin={{
          top: marginValue,
          left: marginValue
        }}
      />
    </div>
  );
}

export default App;
