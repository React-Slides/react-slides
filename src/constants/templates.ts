export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'technical' | 'educational' | 'general';
  content: string;
}

export const TEMPLATES: Template[] = [
  {
    id: 'business-pitch',
    name: 'Business Pitch',
    description: 'Perfect for investor presentations and startup pitches',
    category: 'business',
    content: `# [Company Name]

**Revolutionizing [Industry] with [Solution]**

*Pitch Deck - [Month Year]*

<!--notes
Welcome everyone. Thank you for taking the time to hear our pitch.
-->

---

## The Problem

**[X]% of [target audience] struggle with [specific problem]**

- Pain point 1: Describe the first major challenge
- Pain point 2: Describe the second challenge
- Pain point 3: Describe the third challenge

*Current solutions are [expensive/slow/complicated/ineffective]*

<!--notes
Emphasize the size of the problem and why current solutions fail.
-->

---

## Our Solution

**[Product Name]: [One-line value proposition]**

- Key feature 1 and its benefit
- Key feature 2 and its benefit
- Key feature 3 and its benefit

*[Product] makes it [easy/fast/affordable] to [solve the problem]*

---

## Market Opportunity

\`\`\`chart
type: bar
title: Total Addressable Market
data:
  - label: TAM
    value: 50
  - label: SAM
    value: 15
  - label: SOM
    value: 3
\`\`\`

**$[X]B market growing at [Y]% annually**

---

## Traction

\`\`\`chart
type: line
title: Monthly Revenue Growth
data:
  - label: Jan
    value: 10
  - label: Feb
    value: 25
  - label: Mar
    value: 45
  - label: Apr
    value: 80
  - label: May
    value: 120
  - label: Jun
    value: 180
\`\`\`

- [X] active users/customers
- [Y]% month-over-month growth
- [Z] key partnerships

---

## Business Model

**How we make money:**

| Revenue Stream | Price Point | Target |
|---------------|-------------|--------|
| Subscription  | $XX/month   | SMBs   |
| Enterprise    | $XXX/month  | Large  |
| API Access    | Usage-based | Devs   |

*Projected ARR: $[X]M by [Year]*

---

## The Team

**Experienced founders with domain expertise**

- **[Founder 1]** - CEO, [Previous experience]
- **[Founder 2]** - CTO, [Previous experience]
- **[Founder 3]** - COO, [Previous experience]

*Combined [X] years of experience in [industry]*

---

## The Ask

**Raising $[X]M [Seed/Series A] to:**

- Expand engineering team
- Scale go-to-market efforts
- Enter new markets

**Use of funds:**

\`\`\`chart
type: pie
title: Fund Allocation
data:
  - label: Product
    value: 40
  - label: Sales
    value: 30
  - label: Marketing
    value: 20
  - label: Operations
    value: 10
\`\`\`

---

# Thank You

**[Founder Name]**
[email@company.com]

*Let's build the future of [industry] together*
`
  },
  {
    id: 'tech-talk',
    name: 'Tech Talk',
    description: 'Ideal for conference presentations and technical deep-dives',
    category: 'technical',
    content: `# [Technology/Topic Name]

**A Deep Dive into [Specific Aspect]**

*[Your Name] - [Conference/Meetup] [Year]*

<!--notes
Introduce yourself and establish credibility.
Set expectations for what the audience will learn.
-->

---

## Agenda

1. **Introduction** - What and why
2. **Core Concepts** - The fundamentals
3. **Architecture** - How it works
4. **Demo** - See it in action
5. **Best Practices** - Lessons learned
6. **Q&A** - Your questions

---

## The Problem We're Solving

**Before [Technology]:**

- Challenge 1: Description of pain point
- Challenge 2: Description of limitation
- Challenge 3: Description of complexity

**After [Technology]:**

- Benefit 1: How it solves the problem
- Benefit 2: What improvements it brings

---

## Core Concepts

### Key Term 1
Definition and explanation

### Key Term 2
Definition and explanation

### Key Term 3
Definition and explanation

<!--notes
Make sure to explain each concept clearly.
Use analogies if helpful.
-->

---

## Architecture Overview

\`\`\`chart
type: bar
title: Component Responsibilities
data:
  - label: Frontend
    value: 30
  - label: API Layer
    value: 25
  - label: Business Logic
    value: 25
  - label: Data Layer
    value: 20
\`\`\`

**Key Components:**
- Component A: Handles [responsibility]
- Component B: Manages [responsibility]
- Component C: Processes [responsibility]

---

## Code Example

\`\`\`javascript
// Example implementation
function demonstrateConcept(input) {
  // Step 1: Process input
  const processed = transform(input);

  // Step 2: Apply logic
  const result = applyLogic(processed);

  // Step 3: Return output
  return result;
}
\`\`\`

*Key insight: [Explain what this demonstrates]*

---

## Performance Comparison

\`\`\`chart
type: bar
title: Performance Benchmarks (lower is better)
data:
  - label: Old Approach
    value: 100
  - label: New Approach
    value: 25
  - label: Optimized
    value: 10
\`\`\`

**Key Improvements:**
- [X]x faster processing
- [Y]% reduction in memory usage
- [Z]% improvement in throughput

---

## Best Practices

1. **Do This** - Explanation of recommended approach
2. **Avoid That** - Common anti-pattern to avoid
3. **Consider This** - Trade-offs to be aware of
4. **Monitor This** - Key metrics to track

<!--notes
Share real-world lessons learned.
Be honest about trade-offs.
-->

---

## Common Pitfalls

| Pitfall | Symptom | Solution |
|---------|---------|----------|
| Issue 1 | What you see | How to fix |
| Issue 2 | What you see | How to fix |
| Issue 3 | What you see | How to fix |

---

## Resources

- **Documentation:** [link]
- **GitHub Repo:** [link]
- **Community:** [link]
- **My Blog Post:** [link]

---

# Questions?

**[Your Name]**
@[TwitterHandle] | [email]

*Slides available at: [url]*
`
  },
  {
    id: 'educational',
    name: 'Educational Lesson',
    description: 'Great for classroom lessons and training sessions',
    category: 'educational',
    content: `# [Topic Name]

**Learning Objectives:**
- Understand [concept 1]
- Apply [concept 2]
- Analyze [concept 3]

<!--notes
Start by reviewing prerequisites.
Set clear expectations for the lesson.
-->

---

## What We'll Learn Today

1. **Foundation** - Core concepts
2. **Application** - How to use them
3. **Practice** - Hands-on exercises
4. **Assessment** - Check understanding

*Duration: ~[X] minutes*

---

## Warm-Up Question

**Think about this:**

> [Thought-provoking question related to the topic]

*Take 30 seconds to consider your answer...*

<!--notes
Give students time to think.
This activates prior knowledge.
-->

---

## Key Concept #1

**[Concept Name]**

Definition: [Clear, concise explanation]

**Example:**
[Concrete example that illustrates the concept]

**Why it matters:**
[Real-world relevance]

---

## Key Concept #2

**[Concept Name]**

\`\`\`chart
type: pie
title: Components of [Concept]
data:
  - label: Element A
    value: 40
  - label: Element B
    value: 35
  - label: Element C
    value: 25
\`\`\`

*Notice how [observation about the data]*

---

## Key Concept #3

**[Concept Name]**

| Term | Definition | Example |
|------|------------|---------|
| Term 1 | What it means | Illustration |
| Term 2 | What it means | Illustration |
| Term 3 | What it means | Illustration |

---

## Let's Practice!

**Exercise 1:**
[Clear instructions for a hands-on activity]

**Steps:**
1. First, [action]
2. Then, [action]
3. Finally, [action]

*You have [X] minutes*

<!--notes
Walk around and help students who are stuck.
Look for common misconceptions.
-->

---

## Common Misconceptions

**Myth:** [Common incorrect belief]
**Reality:** [Correct understanding]

**Myth:** [Common incorrect belief]
**Reality:** [Correct understanding]

---

## Real-World Application

**Case Study: [Example Name]**

How [person/company] used [concept] to [achieve result]:

1. The challenge they faced
2. How they applied what we learned
3. The outcome they achieved

---

## Check Your Understanding

**Quick Quiz:**

1. [Question 1]
2. [Question 2]
3. [Question 3]

*Discuss with a partner for 2 minutes*

---

## Summary

**Today we learned:**

- [Key takeaway 1]
- [Key takeaway 2]
- [Key takeaway 3]

**Next time:** [Preview of next lesson]

---

## Homework/Practice

**Assignment:** [Description of task]

**Due:** [Date]

**Resources:**
- Textbook Chapter [X]
- Online resource: [link]
- Practice problems: [location]

---

# Questions?

**Office Hours:** [Days/Times]
**Email:** [contact]

*Remember: There are no bad questions!*
`
  },
  {
    id: 'quarterly-review',
    name: 'Quarterly Review',
    description: 'For business reviews and performance updates',
    category: 'business',
    content: `# Q[X] [Year] Review

**[Company/Team Name]**

*Business Review Presentation*

---

## Executive Summary

**Key Highlights:**

- Revenue: $[X]M ([+/-Y]% vs. target)
- Users: [X]K ([+/-Y]% growth)
- NPS: [X] ([+/-Y] points)

**Status:** [On Track / Needs Attention / Critical]

---

## Revenue Performance

\`\`\`chart
type: bar
title: Quarterly Revenue ($M)
data:
  - label: Q1
    value: 2.1
  - label: Q2
    value: 2.8
  - label: Q3
    value: 3.5
  - label: Q4 Target
    value: 4.2
\`\`\`

**vs. Plan:** [X]% [above/below] target
**vs. Last Year:** [X]% growth

---

## Key Metrics Dashboard

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Revenue | $[X]M | $[Y]M | [status] |
| New Customers | [X] | [Y] | [status] |
| Churn Rate | [X]% | [Y]% | [status] |
| NPS Score | [X] | [Y] | [status] |

---

## Customer Growth

\`\`\`chart
type: line
title: Monthly Active Users (K)
data:
  - label: Jan
    value: 45
  - label: Feb
    value: 52
  - label: Mar
    value: 61
  - label: Apr
    value: 68
  - label: May
    value: 79
  - label: Jun
    value: 95
\`\`\`

**Key Driver:** [Primary reason for growth/decline]

---

## Revenue Breakdown

\`\`\`chart
type: pie
title: Revenue by Segment
data:
  - label: Enterprise
    value: 45
  - label: Mid-Market
    value: 30
  - label: SMB
    value: 20
  - label: Other
    value: 5
\`\`\`

**Fastest Growing:** [Segment] at [X]% QoQ

---

## What Went Well

1. **[Achievement 1]**
   - Impact: [Quantified result]
   - Key driver: [What made it successful]

2. **[Achievement 2]**
   - Impact: [Quantified result]
   - Key driver: [What made it successful]

3. **[Achievement 3]**
   - Impact: [Quantified result]
   - Key driver: [What made it successful]

---

## Challenges & Learnings

| Challenge | Impact | Action Taken | Learning |
|-----------|--------|--------------|----------|
| [Issue 1] | [Impact] | [Response] | [Lesson] |
| [Issue 2] | [Impact] | [Response] | [Lesson] |
| [Issue 3] | [Impact] | [Response] | [Lesson] |

---

## Next Quarter Priorities

**Q[X+1] Focus Areas:**

1. **[Priority 1]**
   - Goal: [Specific target]
   - Owner: [Team/Person]

2. **[Priority 2]**
   - Goal: [Specific target]
   - Owner: [Team/Person]

3. **[Priority 3]**
   - Goal: [Specific target]
   - Owner: [Team/Person]

---

## Q[X+1] Targets

\`\`\`chart
type: bar
title: Next Quarter Goals
data:
  - label: Revenue
    value: 4.5
  - label: New Users
    value: 25
  - label: Retention
    value: 92
  - label: NPS
    value: 55
\`\`\`

**Stretch Goal:** [Ambitious target if everything goes well]

---

## Resource Requests

**To achieve Q[X+1] goals, we need:**

| Resource | Investment | Expected ROI |
|----------|------------|--------------|
| [Resource 1] | $[X] | [Expected return] |
| [Resource 2] | $[X] | [Expected return] |
| [Resource 3] | $[X] | [Expected return] |

---

## Key Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [Risk 1] | [H/M/L] | [H/M/L] | [Plan] |
| [Risk 2] | [H/M/L] | [H/M/L] | [Plan] |
| [Risk 3] | [H/M/L] | [H/M/L] | [Plan] |

---

# Questions?

**[Presenter Name]**
[Contact Information]

*Appendix slides available for deep-dives*
`
  },
  {
    id: 'math-showcase',
    name: 'Math & Science',
    description: 'Demonstrate mathematical notation and formulas with KaTeX',
    category: 'educational',
    content: `---
theme: light
---
# Mathematics with KaTeX

**Beautiful Equations in Your Presentations**

*Powered by KaTeX - The fastest math typesetting library*

<!--notes
This template demonstrates the math rendering capabilities using KaTeX.
You can use both inline and display math notation.
-->

---

## Inline Equations

Math can appear inline with your text:

Einstein's famous equation $E = mc^2$ relates energy and mass.

The quadratic formula gives us $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$ for any quadratic equation.

Euler's identity $e^{i\\pi} + 1 = 0$ is often called the most beautiful equation in mathematics.

The golden ratio is $\\phi = \\frac{1 + \\sqrt{5}}{2} \\approx 1.618$

---

## Display Equations

Centered equations for emphasis:

The Gaussian integral:

$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

The Pythagorean theorem:

$$a^2 + b^2 = c^2$$

Maxwell's first equation (Gauss's law):

$$\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}$$

---

## Calculus

**Derivatives:**

$$\\frac{d}{dx}[x^n] = nx^{n-1}$$

$$\\frac{d}{dx}[\\sin x] = \\cos x$$

**Integrals:**

$$\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C$$

**Limits:**

$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$$

---

## Matrices & Linear Algebra

A 2x2 matrix:

$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$

Matrix determinant:

$$\\det(A) = \\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc$$

Matrix multiplication example:

$$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} \\begin{pmatrix} 5 \\\\ 6 \\end{pmatrix} = \\begin{pmatrix} 17 \\\\ 39 \\end{pmatrix}$$

---

## Interactive Matrix Visualization

*Click the equation to see its visual representation!*

\`\`\`math-visual
type: matrix-2x2
interactive: true
values: [[1, 2], [3, 4]]
equation: |
  $$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$$
\`\`\`

---

## Determinant Visualization

*See how the determinant is calculated step by step:*

\`\`\`math-visual
type: determinant
interactive: true
values: [[1, 2], [3, 4]]
equation: |
  $$\\det(A) = ad - bc = (1)(4) - (2)(3) = -2$$
\`\`\`

---

## Matrix Multiplication Visual

*Watch the row-by-column multiplication:*

\`\`\`math-visual
type: matrix-multiplication
interactive: true
values: [[[1, 2], [3, 4]], [5, 6]]
equation: |
  $$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} \\begin{pmatrix} 5 \\\\ 6 \\end{pmatrix} = \\begin{pmatrix} 17 \\\\ 39 \\end{pmatrix}$$
\`\`\`

---

## Geometric Transformation

*See how a matrix transforms the unit square:*

\`\`\`math-visual
type: transformation
interactive: true
values: [[1, 0.5], [0.5, 1]]
equation: |
  $$T(\\vec{v}) = A\\vec{v} = \\begin{pmatrix} 1 & 0.5 \\\\ 0.5 & 1 \\end{pmatrix} \\vec{v}$$
\`\`\`

---

## Function Plotting

*Visualize any mathematical function:*

\`\`\`math-visual
type: function-plot
interactive: true
func: sin(x)
domain: [-6.28, 6.28]
equation: |
  $$f(x) = \\sin(x)$$
\`\`\`

---

## Integral Area Visualization

*See the area under a curve:*

\`\`\`math-visual
type: integral-area
interactive: true
func: x^2
bounds: [0, 2]
domain: [-1, 3]
equation: |
  $$\\int_0^2 x^2 \\, dx = \\frac{x^3}{3} \\Big|_0^2 = \\frac{8}{3}$$
\`\`\`

---

## Summations & Products

Summation notation:

$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$

Product notation:

$$\\prod_{i=1}^{n} i = n!$$

Series:

$$e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots$$

---

## Statistics & Probability

Normal distribution (Gaussian):

$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}$$

Bayes' theorem:

$$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$$

Expected value:

$$E[X] = \\sum_{i} x_i \\cdot P(x_i)$$

---

## Greek Letters & Symbols

| Symbol | Code | Symbol | Code |
|--------|------|--------|------|
| $\\alpha$ | \\\\alpha | $\\beta$ | \\\\beta |
| $\\gamma$ | \\\\gamma | $\\delta$ | \\\\delta |
| $\\theta$ | \\\\theta | $\\lambda$ | \\\\lambda |
| $\\pi$ | \\\\pi | $\\sigma$ | \\\\sigma |
| $\\phi$ | \\\\phi | $\\omega$ | \\\\omega |
| $\\infty$ | \\\\infty | $\\partial$ | \\\\partial |
| $\\nabla$ | \\\\nabla | $\\sum$ | \\\\sum |

---

## Physics Equations

**Newton's Second Law:**
$$\\vec{F} = m\\vec{a}$$

**Schrödinger Equation:**
$$i\\hbar\\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi$$

**Wave Equation:**
$$\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u$$

**Einstein's Field Equations:**
$$R_{\\mu\\nu} - \\frac{1}{2}Rg_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}$$

---

# Thank You!

*Beautiful math made simple*

$$\\mathcal{Q.E.D.}$$

**KaTeX Syntax Guide:** [katex.org/docs/supported.html](https://katex.org/docs/supported.html)
`
  },
  {
    id: 'blank-starter',
    name: 'Blank Starter',
    description: 'A minimal template to start from scratch',
    category: 'general',
    content: `# Presentation Title

**Subtitle or tagline**

*Your Name - Date*

---

## Slide 2

Your content here.

---

## Slide 3

More content here.

- Bullet point 1
- Bullet point 2
- Bullet point 3

---

## Slide 4

Add charts, animations, or more text as needed.

---

# Thank You

**Contact Information**
`
  }
];

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByCategory(category: Template['category']): Template[] {
  return TEMPLATES.filter(t => t.category === category);
}
