import type { JSX } from "react";

import BarChart from "./BarChart";
import { DATA } from "./constants";

function App(): JSX.Element {
  return (
    <main className="grid justify-items-center pt-12">
      <BarChart data={DATA} />
    </main>
  );
}

export default App;
