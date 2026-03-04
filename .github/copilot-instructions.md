# Visual - Next.js Web Application

## Project Overview
This is a modern Next.js web application built with:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- ESLint
- Git initialized for version control

## Running the Project

### Development Server
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Project Structure
- `src/app/` - Main application directory with pages and components
- `public/` - Static files (images, fonts, etc.)
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment to Vercel

### Prerequisites
1. GitHub account
2. Vercel account
3. Git repository initialized (already done)

### Steps to Deploy

#### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

#### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up or login
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings
6. Click "Deploy"
7. Your site will be live at a Vercel URL (e.g., `yourproject.vercel.app`)

#### 3. Connect Custom Domain (Optional)
1. In Vercel dashboard, go to Project Settings
2. Go to Domains
3. Add your custom domain
4. Update DNS settings as instructed

## Editing Content
To modify the website content:
1. Edit files in `src/app/` directory
2. Changes are automatically reflected on the development server
3. Rebuild and redeploy to Vercel when ready

## More Information
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
