import * as aq from 'arquero';
import { useEffect, useState } from 'react';
import GrapeLayout from './GrapeLayout';
import useToggle from './useToggle';

const getFirstCol = (text) => text.slice(0, text.indexOf(','));

function App() {
  const [table, setTable] = useState(aq.table());
  const [isOn, toggleIsOn] = useToggle();

  // For reference only
  // const getTable = () => {
  //   fetch('producao_uvas_total_regiao.csv')
  //     .then(function (response) {
  //       return response.text();
  //     })
  //     .then(function (csvString) {
  //       // Fold: pivot longer
  //       // Pivot: pivot wider

  //       const rawTable = aq.fromCSV(csvString, { autoType: false });

  //       setTable(
  //         rawTable
  //           .slice(0, -3)
  //           .select(aq.matches(/^201\d$/), {
  //             'Total por região (milhões Kg)': 'Região',
  //           })
  //           .fold(aq.not('Região'), {
  //             as: ['Ano', 'Total'],
  //           })
  //       );
  //     });
  // };

  useEffect(() => {
    // getTable();

    // More info: https://stackoverflow.com/a/55854902
    const getTables = () => {
      Promise.all([
        fetch('producao_uvas_total_regiao.csv').then((res) => res.text()),
        fetch('producao_uvas_brancas_regiao.csv').then((res) => res.text()),
        fetch('producao_uvas_tintas_rose_regiao.csv').then((res) => res.text()),
      ]).then(([totalData, brancasData, tintasData]) => {
        const totalCol = getFirstCol(totalData);
        const brancasCol = getFirstCol(brancasData);
        const tintasCol = getFirstCol(tintasData);

        const totalTable = aq
          .fromCSV(totalData, { autoType: false })
          .slice(0, -3)
          .select(aq.matches(/^201\d$/), {
            [totalCol]: 'Região',
          })
          .derive({ Categoria: (d) => 'Total' })
          .fold(aq.not('Região', 'Categoria'), {
            as: ['Ano', 'Quantidade'],
          });

        const brancasTable = aq
          .fromCSV(brancasData, { autoType: false })
          .slice(0, -3)
          .select(aq.matches(/^201\d$/), {
            [brancasCol]: 'Região',
          })
          .derive({ Categoria: (d) => 'Brancas' })
          .fold(aq.not('Região', 'Categoria'), {
            as: ['Ano', 'Quantidade'],
          });
        const tintasTable = aq
          .fromCSV(tintasData, { autoType: false })
          .slice(0, -3)
          .select(aq.matches(/^201\d$/), {
            [tintasCol]: 'Região',
          })
          .derive({ Categoria: (d) => 'Tintas' })
          .fold(aq.not('Região', 'Categoria'), {
            as: ['Ano', 'Quantidade'],
          });

        const fullTable = totalTable.concat(brancasTable, tintasTable);
        // fullTable.print();

        setTable(fullTable);
      });
    };
    getTables();
  }, []);

  return (
    <>
      <header className="mh6 bb b--black-10">
        <h1 className="f1">Produção de uvas</h1>
        <div>
          <button
            className={`btn-xs btn-toggle${isOn ? ' active' : ''}`}
            onClick={toggleIsOn}
          >
            <div className="handle"></div>
          </button>
        </div>
      </header>
      <div className="App ma3">
        {Object.entries(table.data()).length > 0 &&
          table.data().constructor === Object && (
            <GrapeLayout
              data={table.objects()}
              xvar={'Ano'}
              yvar={'Quantidade'}
              breakdown={'Região'}
              cvar={'Categoria'}
              mainCategory={'Total'}
            />
          )}
      </div>
    </>
  );
}

export default App;
