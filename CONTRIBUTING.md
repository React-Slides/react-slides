# Contributing to React Slides

First off, thanks for taking the time to contribute! 🎉

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1.  **Fork the repo** and clone it to your local machine:

    ```bash
    git clone https://github.com/YOUR-USERNAME/react-slides.git
    cd react-slides
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Start the development server**:

    ```bash
    npm run dev
    ```

    The app should now be running at `http://localhost:5173`.

## How to Contribute

1.  **Fork the Project**: Create your own fork of the repository.
2.  **Create your Feature Branch**: `git checkout -b feature/AmazingFeature`
3.  **Commit your Changes**: `git commit -m 'Add some AmazingFeature'`
4.  **Push to the Branch**: `git push origin feature/AmazingFeature`
5.  **Open a Pull Request**: Go to the original repository and open a Pull Request.

### Reporting Bugs

If you find a bug, please create an issue on GitHub. include as much detail as possible, such as:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

## AI Coding Agent Guidelines

When contributing to this project using an AI Coding Agent (such as Claude Code, Cursor, or similar tools), contributors **must** set up and use the following MCP (Model Context Protocol) Servers to ensure consistent, high-quality contributions.

### Required MCP Servers

#### 1. Playwright

Browser automation and testing server for validating UI changes and running end-to-end tests.

**Setup:**
```bash
npx @anthropic-ai/mcp-config add @anthropic-ai/mcp-server-playwright
```

Or manually add to your MCP configuration:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-server-playwright"]
    }
  }
}
```

**Documentation:** https://github.com/anthropics/mcp-server-playwright

#### 2. Context7

Enhanced context awareness server for accessing up-to-date library documentation and code examples.

**Setup:**
```bash
npx @anthropic-ai/mcp-config add @context7/mcp-server
```

Or manually add to your MCP configuration:
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

**Documentation:** https://context7.com/docs

#### 3. Chrome DevTools

Debugging and development tools integration for inspecting page elements, network requests, and console output.

**Setup:**
```bash
npx @anthropic-ai/mcp-config add @anthropic-ai/mcp-server-chrome-devtools
```

Or manually add to your MCP configuration:
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-server-chrome-devtools"]
    }
  }
}
```

**Documentation:** https://github.com/anthropics/mcp-server-chrome-devtools

### Why These Tools Are Required

These MCP servers enable AI coding agents to:

- **Playwright**: Interact with the browser to test slide rendering, navigation, animations, and export functionality
- **Context7**: Access current documentation for React, Recharts, and other dependencies to ensure best practices
- **Chrome DevTools**: Debug issues, inspect the DOM, monitor network requests, and view console output in real-time

Using these tools ensures that AI-assisted contributions meet the same quality standards as manual contributions and can be properly validated before submission.

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
