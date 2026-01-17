# GitHub Connection Guide

## 🚀 Connecting Your Project to GitHub

### Step 1: Initialize Git Repository (if not already done)
```bash
cd your-project-directory
git init
```

### Step 2: Create .gitignore File (if not exists)
Create a `.gitignore` file in your project root:
```
# .gitignore
node_modules/
.next/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
*.tsbuildinfo
```

### Step 3: Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click the "+" icon in the top right
3. Select "New repository"
4. Name your repository (e.g., "mrmelo-sanctuary")
5. Choose visibility (Public or Private)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### Step 4: Connect Local Repository to GitHub
After creating the GitHub repository, run these commands:

```bash
# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: MrMelo Sanctuary platform"

# Add GitHub remote (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/mrmelo-sanctuary.git

# Rename default branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 5: Verify Connection
1. Refresh your GitHub repository page
2. You should see all your project files
3. The `.env` file should NOT be visible (it's in .gitignore for security)

### Step 6: Future Updates
After making changes to your code:
```bash
# Check status
git status

# Add changes
git add .

# Commit with meaningful message
git commit -m "Description of changes"

# Push to GitHub
git push
```

## 🔐 Important Security Notes

### Environment Variables
- The `.env` file is in `.gitignore` and will NOT be pushed to GitHub
- Your admin credentials are safe
- Never commit `.env` files to GitHub

### Setting Up Environment Variables on Deployment
When deploying your project, you'll need to add environment variables separately:
1. In Vercel/Netlify/your hosting platform
2. Add each variable from your `.env` file manually
3. Include the admin email and password hash

## 📝 Admin Credentials Configured

Your admin login is now set to:
- **Email**: melo@mrmelo.com
- **Password**: 98765WAJ

Login at: `/admin/login`

## 🎯 What's Next?

1. **Delete Pattern Explorer Files**: Follow instructions in `PATTERN_EXPLORER_REMOVED.md`
2. **Connect to GitHub**: Follow steps above
3. **Deploy Your Project**: Consider deploying to Vercel or Netlify
4. **Set Up Password Reset**: Test the password reset flow to change your admin password later

## 🐛 Troubleshooting

### "Remote already exists" error:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/repository-name.git
```

### Authentication Issues:
- GitHub now requires personal access tokens instead of passwords
- Create one at: Settings → Developer settings → Personal access tokens
- Use the token instead of your password when pushing

### Need to change repository name:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/new-repository-name.git
```