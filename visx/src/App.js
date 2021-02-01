import "./App.css";
import Radar from "./Radar";
import { ParentSize } from "@visx/responsive";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Charts</h1>
      </header>
      <main className="App-charts">
        <ParentSize>
          {({ width, height }) => <Radar width={width} height={height} />}
        </ParentSize>
      </main>
    </div>
  );
}

export default App;
