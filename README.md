# Viz. - Visual Content Curation Platform

Welcome to Viz., a visual content sharing platform that enables users to curate and repost specific selections from other users' content with a permission-based system.

## 🎨 Features

- **Visual Curation**: Select exactly what you want to share from any post
- **Permission-Based Sharing**: Respect creators with approval-required and open-to-repost systems
- **Viz.List**: Personal collections of your curated content
- **Viz.Let Marketplace**: Turn your Viz.Lists into products and monetize your creativity
- **Shield-Shaped Avatars**: Unique identity for every creator
- **Instagram-Style Feed**: Familiar and engaging content discovery experience

## 🚀 Publishing to GitHub Pages

This repository is configured for easy deployment to GitHub Pages:

1. Go to your repository **Settings** → **Pages**
2. Under "Build and deployment", select **Source: GitHub Actions**
3. Push to the `main` branch - the site will automatically deploy!
4. Your site will be available at: `https://yourusername.github.io/viz-app/`

The deployment workflow is already configured in `.github/workflows/deploy.yml`

### Manual Deployment

If you need to manually deploy:

```bash
npm run build
# The dist folder will contain your built application
```

## 💻 Development

### Prerequisites

- Node.js 20 or higher
- npm

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
src/
├── pages/          # Page components
│   └── Landing.tsx # Landing page
├── components/     # Reusable components
│   ├── landing/    # Landing page sections
│   └── ui/         # UI components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
└── styles/         # Global styles
```

## 🎨 Design System

- **Primary Font**: Plus Jakarta Sans
- **Primary Color**: Pastel Pink (`oklch(0.85 0.08 350)`)
- **Accent Color**: Deeper Pink (`oklch(0.70 0.15 340)`)
- **Supporting Colors**:
  - Soft Mint (`oklch(0.85 0.08 150)`) for "Open to Repost"
  - Soft Peach (`oklch(0.88 0.08 60)`) for "Approval Required"
  - Soft Coral (`oklch(0.75 0.15 25)`) for likes

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
