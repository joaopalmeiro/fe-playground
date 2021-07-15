import Heatmap from './Heatmap';
import { genSquareMatrixData } from './utils';

function App() {
  const data = genSquareMatrixData(150);
  // console.table(data);

  return (
    <div>
      <Heatmap data={data} />
    </div>
  );
}

export default App;
