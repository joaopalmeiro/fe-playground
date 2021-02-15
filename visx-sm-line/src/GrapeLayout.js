import LineChart from './LineChart';

function GrapeLayout({ data, xvar, yvar, breakdown }) {
  const colorAccessor = (d) => d[breakdown];
  const uniqueValues = [...new Set(data.map(colorAccessor))];

  return (
    <div className="flex flex-column">
      <div className="outline w-100 flex justify-center">
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[0]}
        />
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[1]}
        />
      </div>
      <div className="outline w-100 mt2 flex justify-center">
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[2]}
        />
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[3]}
        />
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[4]}
        />
      </div>
      <div className="outline w-100 mt2 flex justify-center">
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[5]}
        />
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[6]}
        />
      </div>
      <div className="outline w-100 mt2 flex justify-center">
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[7]}
        />
      </div>
    </div>
  );
}

export default GrapeLayout;
