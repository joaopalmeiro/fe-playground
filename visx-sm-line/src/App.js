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
      <header className="space fossheim-purple mh6 mh4-m mt4 bb b--custom-light-gray flex flex-column items-center">
        <h1 className="tc f1 mb3 mt0">
          Produção de uvas <span className="icon f2">🍇</span>
        </h1>
        <p className="sans-serif f5 mb3 tc">
          na área geográfica correspondente à Denominação de Origem Controlada
          (DOP) "Alentejo"
        </p>
        <p className="sans-serif f6 mt0 mb4 tc toogle-gray">
          Fonte: Comissão Vitivinícola Regional Alentejana • Relatório Anual
          2019
        </p>
        <div className="flex mb1">
          <p className="mh1 mv0 f6 toogle-gray">Ajuda?</p>
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
              showHelp={isOn}
            />
          )}
      </div>
    </>
  );
}

export default App;
