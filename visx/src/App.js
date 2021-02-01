import "./App.css";
import Radar from "./Radar";
import Stellar from "./Stellar";
import { ParentSize } from "@visx/responsive";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Radar 🕸️ Chart vs. Stellar ✨ Chart</h1>
      </header>
      <main className="App-charts">
        <ParentSize className="App-chart">
          {({ width, height }) => (
            <Radar width={width} height={height} showPoints={false} />
          )}
        </ParentSize>
        <ParentSize className="App-chart">
          {({ width, height }) => <Stellar width={width} height={height} />}
        </ParentSize>
      </main>
    </div>
  );
}

export default App;
