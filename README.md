# React Slides 🎯

[![GitHub Pages](https://github.com/STR-Ventures/react-slides/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/STR-Ventures/react-slides/actions/workflows/deploy-pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/github/package-json/v/STR-Ventures/react-slides?label=version)](https://github.com/STR-Ventures/react-slides/packages)

A modern, markdown-driven slide deck presentation tool built with React and Vite, allowing you to create beautiful presentations using simple markdown syntax.

## Features

* Markdown-based slide creation
* Slide separation using `---`
* GitHub Flavored Markdown support
* Responsive design
* React and Vite powered
* Tailwind CSS styling
* Beautiful icons powered by Lucide React
* Interactive charts powered by Recharts
* Math equations support (KaTeX)
* Syntax highlighting for code blocks
* PDF export functionality
* Emoji support in markdown

---

## Getting Started

### Install as a Library

```bash
npm install @str-ventures/react-slides
```

Most peer dependencies are likely already in your project. If not, install the required ones:

```bash
npm install react react-dom recharts react-markdown remark-gfm remark-math rehype-katex katex lucide-react js-yaml
```

**Optional:** For PDF/PPTX export features:

```bash
npm install html2canvas jspdf pptxgenjs
```

#### Setup

Import the CSS in your app entry point:

```tsx
import 'katex/dist/katex.min.css';
import '@str-ventures/react-slides/styles.css';
```

#### Basic Usage

```tsx
import { SlideDeck } from '@str-ventures/react-slides';

function App() {
  const markdown = `
# Welcome
Your first slide

---

## Second Slide
- Point 1
- Point 2
`;

  return <SlideDeck markdown={markdown} />;
}
```

### Development Setup

```bash
git clone https://github.com/STR-Ventures/react-slides.git
cd react-slides
npm install
npm run dev
```

---

## Creating Slides

Slides can be created directly using markdown syntax in the `MarkDownForm` component. Separate slides with `---`.

Example:

````markdown
# Slide Title 🎯
Slide content here.

---

## Another Slide 🚀
- Bullet 1
- Bullet 2

---

### Code Example 💻
```js
console.log('Hello, World!');
````

````

---

## Using Icons

This project uses [Lucide React](https://lucide.dev/) for beautiful, customizable icons. You can use any icon from the Lucide library in your components:

```jsx
import { Heart, Share, Twitter } from 'lucide-react';

// Use in your component
<Heart className="w-6 h-6" />
<Share size={24} />
<Twitter color="blue" />
````

---

## 📦 Enhanced Markdown Support

You can add special code blocks in markdown to render interactive charts or animations directly in slides.

### ✅ Supported Block Types

#### 📊 `chart` block

````markdown
```chart
type: bar
title: Quarterly Sales
data:
  - label: Q1
    value: 120
  - label: Q2
    value: 150
  - label: Q3
    value: 170
  - label: Q4
    value: 200
````

````

#### ✨ `animate` block

```markdown
```animate
type: fade-in
````

````

#### 🧮 `math-visual` block

Display mathematical equations with interactive visualizations:

````markdown
```math-visual
type: matrix-2x2
equation: |
  $$\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}$$
values: [[1, 2], [3, 4]]
layout: split
interactive: true
```
````

**Visualization Types:**
- `matrix-2x2` - Color-coded 2x2 matrix grid
- `determinant` - Matrix with ad-bc formula breakdown
- `matrix-multiplication` - Matrix × vector step-by-step
- `transformation` - Geometric transformation canvas
- `function-plot` - Interactive function graphing
- `integral-area` - Function curve with shaded area

**Layout Options:**
- `split` (default) - Equation and visualization side-by-side
- `flip` - Click to flip between equation and visualization

**Note:** Only one special block (`chart`, `animate`, or `math-visual`) per slide.

These blocks are parsed and rendered automatically inside the React Slides app.

---

## Using Charts

This project uses [Recharts](https://recharts.org/) for creating beautiful, responsive charts. You can create various types of charts in your slides.

Example:
```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
];

// Use in your component
<LineChart width={500} height={300} data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="value" stroke="#8884d8" />
</LineChart>
````

---

## Supported Chart Types

* **Bar Charts:** `type: bar`
* **Line Charts:** `type: line`
* **Pie Charts:** `type: pie`

---

## Supported Animations

Currently supports: `fade-in`, `slide-up`, `bounce`, `spin`, `ping`, `pulse`

---

## Using Emojis in Slides ✨

Enhance your slides with emojis! Simply add them to your markdown content.

### Common Use Cases

* 🎯 Section titles/targets
* 🚀 Features/launches
* 💡 Ideas/tips
* 📈 Trends/growth
* 💻 Code examples
* 📊 Charts/data
* 🛠️ Setup/installation
* 📝 Notes/documentation
* ⚡ Performance/speed
* 🔍 Details/search
* 🎨 Design/styling
* 🔧 Configuration
* 🌟 Highlights
* 🎉 Celebrations/completion

Example:

```markdown
# Welcome 🎯
## Features 🚀
```

---

## PDF Export

Click the "Export to PDF" button (next to "Edit Slides") to download your presentation.

* Optimized JPEG compression (quality: 0.8)
* Typical file sizes: 315KB-1.5MB depending on content
* Export time: \~2-5 seconds for standard presentations
* Ensures compatibility across browsers

**[📚 PDF Export Feature Design Documentation](https://docs.google.com/document/d/1QT3zSlPfKJpMs9uOn9FKl67sU8j7XEB8POLNgI-wV3A/edit?usp=sharing)**  
For detailed technical insights, design decisions, and future enhancements.

---

## Known Issues 🐛

### React DevTools Circular Structure

**Development-only** console errors when using React DevTools with chart components.

* ✅ **Does not affect:** App functionality, user experience, production builds
* 🔧 **Temporary fix:** Disable React DevTools extension

---

## Browser Compatibility

Verified functional in:

* Chrome
* Firefox
* Safari
* Edge
