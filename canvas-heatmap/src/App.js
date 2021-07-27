import Heatmap from './Heatmap';
import HeatmapWithAxis from './HeatmapWithAxis';
import { genSquareMatrixData } from './utils';

function App() {
  const data = genSquareMatrixData(150);
  // console.table(data);

  return (
    <div>
      {/* <Heatmap data={data} /> */}
      <HeatmapWithAxis
        data={data}
        partialMargin={{
          top: 50,
          left: 50
        }}
      />
    </div>
  );
}

export default App;
