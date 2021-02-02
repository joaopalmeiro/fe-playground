import './App.css';
import Radar from './Radar';
import Stellar from './Stellar';

function App({ width, height }) {
  return (
    <div className="App" style={{ width, height }}>
      <header className="App-header">
        <h1 className="title">
          Radar 🕸️ Chart v<span className="title-pun">i</span>s
          <span className="title-pun">x</span> Stellar ✨ Chart
        </h1>
      </header>
      <main className="App-charts">
        <Radar
          width={width < 600 ? width : width / 2}
          height={width < 600 ? height / 2 : height}
          showPoints={false}
        />
        <Stellar
          width={width < 600 ? width : width / 2}
          height={width < 600 ? height / 2 : height}
        />
      </main>
    </div>
  );
}

export default App;
