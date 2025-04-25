# Costify 2.0

A modern web application for catering businesses to manage ingredients, recipes, packets, and generate quotes.

## Features

- ✅ Ingredient management with prices
- ✅ Recipe creation with cost calculation
- ✅ Packet bundling of recipes
- ✅ Quote generation with customizable markups
- ✅ PDF export for quotes
- ✅ Dark mode by default

## Tech Stack

- **Frontend**: Next.js 14 (App Router) with TypeScript
- **UI**: Tailwind CSS + shadcn/ui + Framer Motion
- **State Management**: TanStack Query + Zustand
- **Backend**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deployment**: Hostinger VPS with PM2

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- Supabase account and project

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/costify.git
cd costify
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Development

### Database Schema

The application uses the following database schema:

- `categories`: Groups for recipes
- `ingredients`: Individual ingredients with prices
- `recipes`: Combinations of ingredients
- `recipe_ingredients`: Junction table for recipes and ingredients
- `packets`: Groups of recipes
- `packet_recipes`: Junction table for packets and recipes

### Testing

Run the tests with:

```bash
npm test
```

To view the test UI:

```bash
npm run test:ui
```

## Deployment

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

With PM2:

```bash
pm2 start ecosystem.config.cjs
```

## License

MIT 