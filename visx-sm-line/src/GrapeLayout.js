import LineChart from './LineChart';

function GrapeLayout({ data, xvar, yvar, breakdown, cvar, mainCategory }) {
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
        />
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[1]}
          cvar={cvar}
          mainCategory={mainCategory}
          showYAxis={false}
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
        />
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[3]}
          cvar={cvar}
          mainCategory={mainCategory}
          showYAxis={false}
        />
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[4]}
          cvar={cvar}
          mainCategory={mainCategory}
          mirrorYAxis={true}
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
        />
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[6]}
          cvar={cvar}
          mainCategory={mainCategory}
          showYAxis={false}
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
        />
      </div>
    </div>
  );
}

export default GrapeLayout;
