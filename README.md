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

Example Enhanced Markdown: 


🧠 **SAPIENS: A Brief History of Humankind** 🧠

*Understanding the three revolutions that transformed our species*

```animate
type: bounce
duration: 3s
```

---

📈 **The Great Human Acceleration** 📈

From insignificant apes to planetary dominance in just ~70,000 years.

```chart
type: bar
title: Human Population Growth Through History
data:
  - label: ~70,000 BCE
    value: 5000 # mid-range estimate (3,000–10,000)
  - label: 10,000 BCE
    value: 5000000
  - label: 1 CE
    value: 250000000 # midpoint scholarly estimate (170–300 million)
  - label: 1800 CE
    value: 1000000000
```

**Note:** Population figures align with scholarly consensus, not explicitly provided by Harari (*Sapiens*).

---

🌍 **The Cognitive Revolution** 🌍

How shared myths and stories enabled unprecedented cooperation among strangers.

```animate
type: spin
duration: 4s
```

**Clarification:** Harari emphasizes a genetic mutation around 70,000 years ago facilitating fiction-based language and cooperation. Scholarly consensus broadly agrees on timing but debates the genetic mutation claim. (Source: Harari, *Sapiens*; Scholarly consensus from current research)

---

🥧 **What Makes Humans Unique?** 🥧

The cognitive abilities that separated Homo sapiens from other species.

```chart
type: pie
title: Factors in Human Dominance
data:
  - label: Language & Storytelling
    value: 25
  - label: Cooperation at Scale
    value: 25
  - label: Tool Use & Innovation
    value: 25
  - label: Adaptability
    value: 25
```

---

🚜 **The Agricultural Revolution** 🚜

The biggest fraud in history? How wheat domesticated humans.

```chart
type: line
title: Global Population After Agriculture
data:
  - label: 10,000 BCE
    value: 5
  - label: 8,000 BCE
    value: 10
  - label: 6,000 BCE
    value: 50
  - label: 4,000 BCE
    value: 100
  - label: 2,000 BCE
    value: 200
  - label: 1 CE
    value: 300
```

**Note:** Harari describes agriculture as boosting populations but worsening individual conditions. Scholars generally agree, citing substantial population growth. (Source: Harari, *Sapiens*)

---

⚗️ **The Scientific Revolution** ⚗️

Admitting ignorance as the foundation of progress.

```animate
type: ping
duration: 2s
```

**Clarification:** Generally dated from the mid-1500s onwards, aligning with Harari’s view starting around 1543 (Copernicus). (Source: Harari, *Sapiens*; Scholarly consensus)

---

💰 **The Power of Shared Myths** 💰

Money, corporations, and nations exist only in our collective imagination.

```animate
type: pulse
```

---

🔮 **The Future of Homo Sapiens** 🔮

From biological evolution to intelligent design of ourselves.

```animate
type: spin
duration: 1s
```

*We began as insignificant animals with no more impact than gorillas or fireflies. Yet we now stand on the verge of becoming gods.* (Harari, *Sapiens*)

---

### ✅ Summary Table: Harari vs. Scholarly Consensus

| Topic                   | Harari’s Claim                                   | Scholarly Range                       | Discrepancy Notes                             |
|-------------------------|---------------------------------------------------|---------------------------------------|-------------------------------------------------|
| Cognitive Revolution    | Genetic mutation ~70k years ago                  | 70–30k years ago, debated genetic trigger | Genetic trigger claim debated by scholars       |
| Population ~70,000 BCE  | Small bands (implied)                            | 1–10k                                | Harari provides no specific numbers             |
| Population 10,000 BCE   | Agriculture ~12-10k BCE                          | 1–10M                                | Aligns well                                     |
| Population 1 CE         | Not explicit                                     | 170–300M                             | Your slide’s 250M is acceptable midpoint        |
| Population 1800 CE      | Not explicit                                     | ~1B                                  | Matches scholarly consensus                    |
| Scientific Revolution   | ~1543 CE (Copernicus)                            | Mid-1500s                            | Matches scholarly consensus                    |
````
## Known Issues 🐛

### React DevTools Console Errors
When developing with React DevTools enabled, you may see circular structure JSON errors in the console when interacting with charts. **This is a React DevTools visualization issue, not a functional problem.**

- ✅ **Does not affect:** App functionality, user experience, or production builds
- ⚠️ **Does affect:** Console cleanliness during development  
- 🔧 **Status:** Documented cosmetic issue - no fix planned

To verify it's DevTools-related: temporarily disable React DevTools extension → errors disappear.