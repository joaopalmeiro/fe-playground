import LineChart from './LineChart';

function GrapeLayout({ data, xvar, yvar, breakdown }) {
  const colorAccessor = (d) => d[breakdown];
  const uniqueValues = [...new Set(data.map(colorAccessor))];

  return (
    <div className="flex flex-column">
      <div className="w-100 flex justify-center">
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
          showYAxis={false}
        />
      </div>
      <div className="w-100 flex justify-center">
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
          showYAxis={false}
        />
        <LineChart
          data={data}
          xvar={xvar}
          yvar={yvar}
          breakdown={breakdown}
          lineToHighlight={uniqueValues[4]}
          mirrorYAxis={true}
        />
      </div>
      <div className="w-100 flex justify-center">
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
          showYAxis={false}
        />
      </div>
      <div className="w-100 flex justify-center">
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
