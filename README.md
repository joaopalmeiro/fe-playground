# fe-playground

Some Front-End experiments with JavaScript-based technologies.

## Notes

- [Emmet cheat sheet](https://docs.emmet.io/cheat-sheet/):
  - `!` (HTML boilerplate).
  - `link:css` (add CSS stylesheet).
- [Flowbase](https://www.flowbase.co/) for Webflow. [Blog component](https://www.flowbase.co/component/blog-24).
- [Pattern Monster](https://pattern.monster/). [Cross Section](https://pattern.monster/cross-section/) pattern.
- https://github.com/vercel/next.js/tree/canary/examples/blog-starter.
- https://github.com/vercel/next.js/tree/canary/examples/blog-starter-typescript.
- https://github.com/wutali/nextjs-netlify-blog-template.
- https://mdxjs.com/.
- https://github.com/matsuyoshi30/harbor/.
- https://github.com/athul/archie.
- https://react.dev/learn/referencing-values-with-refs#differences-between-refs-and-state
  - refs:
    - "Doesn't trigger re-render when you change it."
  - state:
    - "Triggers re-render when you change it."
- https://react.dev/learn/you-might-not-need-an-effect
  - "When something can be calculated from the existing props or state, don't put it in state. Instead, calculate it during rendering. This makes your code faster (you avoid the extra "cascading" updates), simpler (you remove some code), and less error-prone (you avoid bugs caused by different state variables getting out of sync with each other).
- https://www.bstefanski.com/blog/can-svg-symbols-affect-web-performance
  - https://news.ycombinator.com/item?id=15024190: "SVG has the opposite performance profile of Canvas. SVG hits a performance ceiling as number of elements increases. Canvas, since it's rasterized image can handle a rasterized representation of millions of SVG elements."
  - https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/symbol
  - https://www.react-graph-gallery.com/example/scatterplot-basic-canvas
  - https://www.react-graph-gallery.com/scatter-plot

## Gradients

- `background: radial-gradient(81.58% 81.58% at 50.39% 18.42%,#a8ecff 0,#4bd8ff 100%)` by [SendStack](https://getsendstack.com/).
  - Hover: `background: radial-gradient(81.58% 81.58% at 50.39% 18.42%,#cff5ff 0,#70e0ff 100%)`
- `background-image: linear-gradient(25deg, #FA3CF9 1.7%, #FC587E 50.85%, #FC3239 99.99%)` by [Pedro Duarte](https://ped.ro/).
- `background: linear-gradient(rgb(59, 149, 255) 0%, rgb(81, 65, 255) 100%)` by [FoundationOS](https://os.foundation.app/) (Twitter button background).
- `background: linear-gradient(rgb(118, 0, 173) 0%, rgb(50, 0, 101) 100%)` by [FoundationOS](https://os.foundation.app/) (GitHub button background).

## Snippets

### .vscode/extensions.json

```json
{
  "recommendations": ["ritwickdey.liveserver"]
}
```

### .vscode/settings.json

```json
{
  "css.customData": [".vscode/tailwind.css-data.json"],
  "emmet.includeLanguages": {
    "nunjucks": "html"
  },
  "files.associations": {
    "*.njk": "html"
  },
  "colorize.colorized_variables": ["SASS", "LESS"],
  "editor.colorDecorators": false
}
```

### .vscode/tailwind.css-data.json

```json
{
  "version": 1.1,
  "atDirectives": [
    {
      "name": "@tailwind",
      "description": "Use the `@tailwind` directive to insert Tailwind's `base`, `components`, `utilities` and `screens` styles into your CSS.",
      "status": "standard",
      "references": [
        {
          "name": "Tailwind CSS Documentation",
          "url": "https://tailwindcss.com/docs/functions-and-directives#tailwind"
        }
      ]
    },
    {
      "name": "@layer",
      "description": "Use the `@layer` directive to tell Tailwind which \"bucket\" a set of custom styles belong in. Valid layers are a `base`, `components`, and `utilities`.",
      "status": "standard",
      "references": [
        {
          "name": "Tailwind CSS Documentation",
          "url": "https://tailwindcss.com/docs/functions-and-directives#layer"
        }
      ]
    },
    {
      "name": "@variants",
      "description": "You can generate `responsive`, `hover`, `focus`, `active`, and other variants of your own utilities by wrapping their definitions in the `@variants` directive.",
      "status": "standard",
      "references": [
        {
          "name": "Tailwind CSS Documentation",
          "url": "https://tailwindcss.com/docs/functions-and-directives#variants"
        },
        {
          "name": "Other Variants",
          "url": "https://tailwindcss.com/docs/pseudo-class-variants"
        }
      ]
    },
    {
      "name": "@responsive",
      "description": "You can generate responsive variants of your own classes by wrapping their definitions in the `@responsive` directive.",
      "status": "standard",
      "references": [
        {
          "name": "Tailwind CSS Documentation",
          "url": "https://tailwindcss.com/docs/functions-and-directives#responsive"
        }
      ]
    },
    {
      "name": "@screen",
      "description": "The `@screen` directive allows you to create media queries that reference your breakpoints by name instead of duplicating their values in your own CSS.",
      "status": "standard",
      "references": [
        {
          "name": "Tailwind CSS Documentation",
          "url": "https://tailwindcss.com/docs/functions-and-directives#screen"
        }
      ]
    }
  ]
}
```
