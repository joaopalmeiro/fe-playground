import { Pie } from '@visx/shape';
import { scaleOrdinal } from '@visx/scale';
import { Group } from '@visx/group';

export default function PieChart({
  data,
  valueAccessor,
  categoryAccessor,
  width = 50,
  height = 50,
  margin = { top: 10, right: 0, bottom: 0, left: 0 },
}) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const top = centerY + margin.top;
  const left = centerX + margin.left;

  const pieSortValues = (a, b) => b - a;

  const getColor = scaleOrdinal({
    domain: data.map(categoryAccessor),
    range: ['#DBDFAC', '#824670'],
  });

  return (
    <svg width={width} height={height}>
      <Group top={top} left={left}>
        <Pie
          data={data}
          pieValue={valueAccessor}
          pieSortValues={pieSortValues}
          outerRadius={radius}
        >
          {(pie) => {
            return pie.arcs.map((arc, index) => {
              const category = categoryAccessor(arc.data);

              const arcPath = pie.path(arc);
              const arcFill = getColor(category);

              return (
                <g key={`arc-${category}-${index}`}>
                  <path d={arcPath} fill={arcFill} />
                </g>
              );
            });
          }}
        </Pie>
      </Group>
    </svg>
  );
}
