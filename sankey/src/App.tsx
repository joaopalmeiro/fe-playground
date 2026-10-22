import type { JSX } from "react";

import SankeyChart from "./SankeyChart.tsx";

const data = {
  links: [
    { source: "A", target: "B", value: 10 },
    { source: "A", target: "C", value: 5 },
    { source: "B", target: "D", value: 8 },
    { source: "C", target: "D", value: 3 },
    { source: "B", target: "E", value: 2 },
    { source: "C", target: "E", value: 2 },
  ],
};

function App(): JSX.Element {
  return (
    <main className="p-8">
      <SankeyChart data={data} height={300} width={600} />
    </main>
  );
}

export default App;
