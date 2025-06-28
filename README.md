# Jaculus viz

Web visualization tool for Jaculus.

## Deployment

This project is automatically deployed to [viz.jaculus.org](https://viz.jaculus.org) via GitHub Actions when changes are pushed to the main branch.

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate routes - Tensack Router requires route generation
npm run routes:generate
```

### Manual Deployment

The deployment happens automatically via GitHub Actions, but you can also build and preview locally using the commands above.
