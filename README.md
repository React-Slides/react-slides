# React Slides 🎯

A modern, markdown-driven slide deck presentation tool built with React and Vite. This tool allows you to create beautiful presentations using simple markdown syntax.

## Features

- Create slides using Markdown syntax
- Separate slides using `---` delimiter
- Support for GitHub Flavored Markdown
- Responsive design
- Built with React and Vite
- Styled with Tailwind CSS
- Beautiful icons powered by Lucide React
- Interactive charts powered by Recharts
- Support for math equations (KaTeX)
- Syntax highlighting for code blocks

## Using Emojis in Slides ✨

Enhance your slides with emojis! Simply add them to your markdown content. Here are some useful emojis for presentations:

### Common Use Cases
- 🎯 Section titles/targets
- 🚀 Features/launches
- 💡 Ideas/tips
- 📈 Trends/growth
- 💻 Code examples
- 📊 Charts/data
- 🛠️ Setup/installation
- 📝 Notes/documentation
- ⚡ Performance/speed
- 🔍 Details/search
- 🎨 Design/styling
- 🔧 Configuration
- �� Interactivity
- 🌟 Highlights
- 🎉 Celebrations/completion

### How to Use
Simply copy and paste emojis into your markdown:
```markdown
# Welcome to My Presentation 🎯

## Key Features 🚀

## Code Example 💻
```

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/your-username/react-slides.git
cd react-slides
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Creating Slides

Create your slides in the `content.md` file using markdown syntax. Separate each slide with `---`.

Example:
```markdown
# First Slide
This is my first slide

---

## Second Slide
- Bullet point 1
- Bullet point 2

---

### Code Example
```js
console.log('Hello, World!');
```
```

## Using Icons

This project uses [Lucide React](https://lucide.dev/) for beautiful, customizable icons. You can use any icon from the Lucide library in your components:

```jsx
import { Heart, Share, Twitter } from 'lucide-react';

// Use in your component
<Heart className="w-6 h-6" />
<Share size={24} />
<Twitter color="blue" />
```

## 📦 Enhanced Markdown Support

You can now add special code blocks in your markdown to render interactive charts or animations directly in slides.

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

```

You can include a chart or animation block alongside regular markdown in a single slide. Each slide supports **only one special block** for now (chart or animation) as part of the MVP.

These blocks are parsed and rendered automatically inside the React Slides app.

```


## Using Charts

This project uses [Recharts](https://recharts.org/) for creating beautiful, responsive charts. You can create various types of charts in your slides:

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
```

## Deployment

To build for production:
```