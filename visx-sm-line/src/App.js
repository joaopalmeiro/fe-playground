import * as aq from 'arquero';
import { useEffect, useState } from 'react';
import GrapeLayout from './GrapeLayout';

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
      {Object.entries(table.data()).length > 0 &&
        table.data().constructor === Object && (
          <GrapeLayout
            data={table.objects()}
            xvar={'Ano'}
            yvar={'Total'}
            breakdown={'Região'}
          />
        )}
    </div>
  );
}

export default App;
