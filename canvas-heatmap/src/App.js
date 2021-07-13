import { genSquareMatrixData } from './utils';
import Heatmap from './Heatmap';

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
