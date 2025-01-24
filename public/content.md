# React Slides 🎯

A modern, markdown-driven presentation tool built with React and Vite.

---

## What is React Slides?

This tool allows you to create beautiful presentations using simple markdown syntax.

Transform your markdown files into interactive slide decks!

---

## Key Features 🚀

- Create slides using Markdown syntax (with some limitations)
- Separate slides using delimiter
- Support for GitHub Flavored Markdown
- Responsive design
- Built with React and Vite

---

## Styling Features ✨

- Styled with Tailwind CSS
- Beautiful icons powered by Lucide React
- Interactive charts powered by Recharts
- Support for math equations (KaTeX)
- Syntax highlighting for code blocks

---

## Getting Started 💻

1. Clone the repository:

```bash
git clone https://github.com/your-username/react-slides.git
cd react-slides
```

---

## Installation 🛠

Install dependencies:

```bash
npm install
```

Start the development server:
```bash
npm run dev
```

---

## Creating Slides 📝

Create your slides in the `content.md` file using markdown syntax.
Separate each slide with `-\-\-`

Example:
```markdown
# First Example Slide
This is my first slide

---

## Second Example Slide
- Bullet point 1
- Bullet point 2
```

---

## Code Example 💻

```javascript
function createSlide(content) {
  return {
    title: 'My Slide',
    content: content,
    render: () => console.log('Rendering slide...')
  };
}
```

---

## Chart Example 📊

```jsx
<LineChart width={500} height={300} data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="value" stroke="#8884d8" />
</LineChart>
```

---

# Ready to Create? 🎉

Start building your own presentations with React Slides!
