// import Heatmap from './Heatmap';
import HeatmapWithAxis from './HeatmapWithAxis';
import { genSquareMatrixData } from './utils';
import { chartDimensions } from './constants';

function App() {
  // const data = genSquareMatrixData(15);
  const data = genSquareMatrixData(150);

  const marginValue = 50;
  // const marginValue = 0;

  // console.log(process.env);
  // console.log(process.env.PUBLIC_URL);

  return (
    // <Heatmap data={data} />
    <HeatmapWithAxis
      data={data}
      fullWidth={chartDimensions.width}
      fullHeight={chartDimensions.height}
      partialMargin={{
        top: marginValue,
        left: marginValue
      }}
    />
  );
}

export default App;
