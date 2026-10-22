import type { JSX } from "react";

import SankeyChart from "./SankeyChart.tsx";

const series = {
  data: {
    links: [
      { source: "A", target: "B", value: 10 },
      { source: "A", target: "C", value: 5 },
      { source: "B", target: "D", value: 8 },
      { source: "C", target: "D", value: 3 },
    ],
  },
};

function App(): JSX.Element {
  return (
    <main className="p-8">
      <SankeyChart height={250} series={series} width={600} />
    </main>
  );
}

export default App;
