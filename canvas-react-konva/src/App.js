import Heatmap from './Heatmap';
import { genSquareMatrixData } from './utils';

function App() {
  const data = genSquareMatrixData(150);

  // console.log(process.env);
  // console.log(process.env.PUBLIC_URL);

  return <Heatmap data={data} />;
}

export default App;
