# Notes

- https://gitlab.com/joaommpalmeiro/template-react-vite
- https://mui.com/x/react-charts/sankey/
- https://www.telerik.com/kendo-react-ui/components/charts/sankey/keyboard-navigation
- https://github.com/VIMLab-hfut/NeatSankey
- https://www.react-graph-gallery.com/sankey-diagram
- https://github.com/d3/d3-sankey
- https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone
- https://www.npmjs.com/package/@visx/sankey
- https://github.com/airbnb/visx/tree/v4.0.0/packages/visx-sankey
- https://nivo.rocks/sankey/
- https://github.com/plouc/nivo/tree/v0.99.0/packages/sankey
- https://observablehq.com/@d3/sankey/2: "Applies it to the data. We make a copy of the nodes and links objects so as to avoid mutating the original."
- https://github.com/plouc/nivo/blob/v0.99.0/packages/sankey/src/hooks.ts#L63: "deep clone is required as the sankey diagram mutates data we need a different identity for correct updates"

## Commands

```bash
rm -rf node_modules/ && npm install
```

```bash
npm config ls -l
```

### Clean slate

```bash
rm -rf dist/ node_modules/
```
