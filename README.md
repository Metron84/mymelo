# Mr. Melo Sanctuary - Admin Portal

A Next.js application with NextAuth.js admin-only authentication.

## Authentication Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
NEXTAUTH_URL=http://localhost:4028
NEXTAUTH_SECRET=your-secret-key-here
ADMIN_EMAIL=admin@mrmelosanctuary.com
ADMIN_PASSWORD_HASH=your-bcrypt-hash-here
```

### 3. Generate Admin Password Hash

```bash
node src/scripts/generate-password-hash.js your-desired-password
```

Copy the generated hash to `ADMIN_PASSWORD_HASH` in your `.env` file.

### 4. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the generated secret to `NEXTAUTH_SECRET` in your `.env` file.

### 5. Run the Application

```bash
npm run dev
```

## Authentication Features

- ✅ Single admin user (expandable to multiple)
- ✅ Email + password login with bcrypt hashing
- ✅ Session-based authentication (JWT strategy)
- ✅ 24-hour session expiration
- ✅ Protected /admin/* routes
- ✅ Public routes accessible without authentication
- ✅ Automatic redirect to login for unauthorized access
- ✅ Callback URL support for seamless navigation

## Routes

- `/admin/login` - Admin login page (public)
- `/admin/dashboard` - Protected admin dashboard
- All other `/admin/*` routes - Protected by middleware

## Security

- Passwords hashed with bcryptjs (10 rounds)
- JWT session strategy with secure secret
- Middleware protection on all admin routes
- Session validation on each request
- Automatic session expiration after 24 hours

## Expanding to Multiple Admins

To add multiple admin users, replace the hardcoded admin credentials in `src/lib/auth.ts` with a database query. Example:

```typescript
async authorize(credentials) {
  const user = await db.query('SELECT * FROM admins WHERE email = ?', [credentials.email]);
  if (!user) return null;
  
  const isValid = await bcrypt.compare(credentials.password, user.password);
  if (!isValid) return null;
  
  return { id: user.id, email: user.email, role: user.role };
}
```