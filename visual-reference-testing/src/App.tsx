import type { JSX } from "react";

import ButtonA from "./components/ButtonA";
import ButtonB from "./components/ButtonB";

function App(): JSX.Element {
  return (
    <main className="mx-auto max-w-prose px-6 py-12 min-h-screen">
      <div className="flex gap-2">
        <ButtonA />
        <ButtonB />
      </div>
    </main>
  );
}

export default App;
