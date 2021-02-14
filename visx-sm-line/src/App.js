import GrapeLayout from './GrapeLayout';
import { useState, useEffect } from 'react';
import * as aq from 'arquero';

function App() {
  const [table, setTable] = useState(aq.table());

  const getTable = () => {
    fetch('producao_uvas_total_regiao.csv')
      .then(function (response) {
        return response.text();
      })
      .then(function (csvString) {
        // Fold: pivot longer
        // Pivot: pivot wider

        const rawTable = aq.fromCSV(csvString, { autoType: false });

        setTable(
          rawTable
            .slice(0, -3)
            .select(aq.matches(/^201\d$/), {
              'Total por região (milhões Kg)': 'Região',
            })
            .fold(aq.not('Região'), {
              as: ['Ano', 'Total'],
            })
        );
      });
  };

  useEffect(() => {
    getTable();
  }, []);

  return (
    <div className="App ma3">
      <GrapeLayout />
      {Object.entries(table.data()).length > 0 &&
        table.data().constructor === Object &&
        table.print()}
    </div>
  );
}

export default App;
