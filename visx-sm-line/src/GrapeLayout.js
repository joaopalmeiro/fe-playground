import LineChart from './LineChart';
import useWindowSize from './useWindowSize';

function GrapeLayout({
  data,
  xvar,
  yvar,
  breakdown,
  cvar,
  mainCategory,
  showHelp,
}) {
  const size = useWindowSize();

  const colorAccessor = (d) => d[breakdown];
  const uniqueValues = [...new Set(data.map(colorAccessor))];

  // Classes for debugging: `debug` and `outline`
  // <div className="smol-css-grid smol-centering outline debug">
  return (
    <div className="flex flex-column">
      <div className="smol-css-grid smol-centering">
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[0]}
          cvar={cvar}
          mainCategory={mainCategory}
          showHelp={showHelp}
        />
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[1]}
          cvar={cvar}
          mainCategory={mainCategory}
          // 300px + 300px + 1rem (16px) + 1rem (16px)
          showYAxis={size.width >= 600 + 16 * 2 ? false : true}
          showHelp={showHelp}
        />
      </div>
      <div className="smol-css-grid smol-centering">
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[2]}
          cvar={cvar}
          mainCategory={mainCategory}
          showHelp={showHelp}
        />
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[3]}
          cvar={cvar}
          mainCategory={mainCategory}
          showYAxis={size.width >= 600 + 16 * 2 ? false : true}
          showHelp={showHelp}
        />
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[4]}
          cvar={cvar}
          mainCategory={mainCategory}
          mirrorYAxis={size.width >= 900 + 16 * 2 ? true : false}
          showHelp={showHelp}
        />
      </div>
      <div className="smol-css-grid smol-centering">
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[5]}
          cvar={cvar}
          mainCategory={mainCategory}
          showHelp={showHelp}
        />
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[6]}
          cvar={cvar}
          mainCategory={mainCategory}
          showYAxis={size.width >= 600 + 16 * 2 ? false : true}
          showHelp={showHelp}
        />
      </div>
      <div className="smol-css-grid smol-centering">
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[7]}
          cvar={cvar}
          mainCategory={mainCategory}
          showHelp={showHelp}
        />
      </div>
    </div>
  );
}

export default GrapeLayout;
