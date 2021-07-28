# Canvas and React: A wedding (picture)

Requirements

- Draw an arbitrary number of elements/data instances (25k-30k)
- Fast chart rendering (< 5s)
- Provide a smooth user experience
- Support interactivity mechanisms

How to plot performant charts with many individual elements (think of dense scatterplots)?

**SVG** is like Lego, **Canvas** is like painting

---

## SVG

XML (HTML-like) syntax

Each shape (from points to axis labels) is a DOM element

It does not scale for plotting many elements

---

## Canvas I

JavaScript API

Just one `<canvas>` element (think of an image)

Resolution is the main difference for the user

Very performant for many _elements_, especially if there is interaction/animation

---

## Rule of thumb

**SVG** should be the default choice, **Canvas** the backup plan (SVG is easy)

If the number of elements is greater than 2k-3k or greater than 1k and they are animated, go to **Canvas**

<!-- By Shirley Wu -->

---

## Canvas II

_Vanilla_ Canvas (JavaScript built-in API) vs. Canvas-oriented libraries

There are many options, from generic ones to more tailored ones for game development and creative coding

---

## Konva and `react-konva`

It looks like "visx for Canvas (and React)"

Stage (`<div>`) > Layer(s) (2D `<canvas>`) > Groups and/or Shapes (_virtual nodes_)

Canvas can be faster since `react-konva` comes with two layers of abstractions (+ bundle size)
