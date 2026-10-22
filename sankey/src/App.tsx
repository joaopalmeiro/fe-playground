import type { JSX } from "react";

import SankeyChart from "./SankeyChart.tsx";
import SquishySankeyChart from "./SquishySankeyChart.tsx";

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
    <main className="flex justify-between gap-2 p-2">
      <SankeyChart data={data} height={300} width={600} />
      <SquishySankeyChart data={data} height={300} width={600} />
    </main>
  );
}

export default App;
