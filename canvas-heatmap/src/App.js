import Heatmap from './Heatmap';
import HeatmapWithAxis from './HeatmapWithAxis';
import { genSquareMatrixData } from './utils';

function App() {
  const data = genSquareMatrixData(150);
  // console.table(data);

  return (
    <div>
      {/* <Heatmap data={data} /> */}
      <HeatmapWithAxis data={data} />
    </div>
  );
}

export default App;
