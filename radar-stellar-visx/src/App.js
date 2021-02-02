import { ParentSize } from '@visx/responsive';
import './App.css';
import Radar from './Radar';
import Stellar from './Stellar';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="title">
          Radar 🕸️ Chart v<span className="title-pun">i</span>s
          <span className="title-pun">x</span> Stellar ✨ Chart
        </h1>
      </header>
      <main className="App-charts">
        <ParentSize>
          {({ width, height }) => (
            <Radar width={width} height={height} showPoints={false} />
          )}
        </ParentSize>
        <ParentSize>
          {({ width, height }) => <Stellar width={width} height={height} />}
        </ParentSize>
      </main>
    </div>
  );
}

export default App;
