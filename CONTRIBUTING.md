# Contributing to RiyaSaviya

Thank you for your interest in contributing to RiyaSaviya! This guide will help you understand how to contribute to this project.

## 🚀 Quick Start for Contributors

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- PNPM package manager
- MySQL 8.0+
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/web-manus-riyasaviya.git
cd web-manus-riyasaviya

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env

# Set up your database
# Create a MySQL database named 'riyasaviya'
# Update DATABASE_URL in .env

# Run database migrations
pnpm db:push

# Start development server
pnpm dev
```

## 📁 Code Organization

### Frontend Structure
```
client/src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── forms/          # Form components
│   ├── layout/         # Layout components
│   └── features/       # Feature-specific components
├── pages/              # Route-level components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── contexts/           # React contexts
└── _core/              # Core app configuration
```

### Backend Structure
```
server/
├── _core/              # Main server setup
├── routes/             # API routes
├── procedures/         # tRPC procedures
├── middleware/         # Express middleware
├── services/           # Business logic
└── utils/              # Server utilities
```

## 🎯 Coding Standards

### TypeScript
- Use strict TypeScript settings
- Provide explicit types for all functions
- Prefer interfaces over types for object shapes
- Use proper generics when needed

### React
- Use functional components with hooks
- Follow hooks rules strictly
- Use TypeScript for props
- Keep components small and focused

### CSS/Tailwind
- Use Tailwind utility classes
- Create reusable components for repeated styles
- Keep responsive design in mind
- Use semantic HTML

### Naming Conventions
- **Files**: kebab-case (e.g., `vehicle-card.tsx`)
- **Components**: PascalCase (e.g., `VehicleCard`)
- **Functions/Variables**: camelCase (e.g., `getVehiclePrice`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Database**: snake_case (e.g., `vehicle_listings`)

## 🔄 Git Workflow

### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/update-type` - Documentation updates
- `refactor/component-name` - Refactoring

### Commit Messages
Follow conventional commits:

```
type(scope): description

feat(auth): add JWT token refresh
fix(listing): correct price calculation bug
docs(readme): update installation guide
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

## 🧪 Testing

### Running Tests
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

### Writing Tests
- Test components with React Testing Library
- Test API endpoints with Vitest
- Mock external dependencies
- Aim for high test coverage

## 📝 Adding New Features

### 1. Backend API
1. Define database schema in `drizzle/schema.ts`
2. Create tRPC procedure in `server/procedures/`
3. Add types in `shared/types/`
4. Write tests for the procedure

### 2. Frontend Component
1. Create component in `client/src/components/`
2. Add TypeScript interfaces for props
3. Use Tailwind for styling
4. Make it responsive
5. Add tests if needed

### 3. New Page/Route
1. Create page component in `client/src/pages/`
2. Add route in `client/src/App.tsx`
3. Update navigation if needed
4. Add meta tags and SEO

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, Node version)
- Screenshots if applicable
- Error logs/console output

## 💡 Feature Requests

For feature requests:
- Describe the problem you're trying to solve
- Explain why this feature would be useful
- Provide use cases or examples
- Consider implementation complexity

## 📸 Pull Request Process

1. **Update Documentation**
   - Update README if needed
   - Add comments to complex code
   - Update API documentation

2. **Test Your Changes**
   - Run all tests
   - Test manually in browser
   - Check responsive design
   - Verify accessibility

3. **Submit PR**
   - Use clear title and description
   - Link related issues
   - Add screenshots for UI changes
   - Request review from maintainers

4. **Address Feedback**
   - Respond to review comments promptly
   - Make requested changes
   - Push updates to same branch

## 🎨 UI/UX Guidelines

### Design Principles
- Mobile-first responsive design
- Sinhala language support
- Accessibility (WCAG 2.1 AA)
- Consistent color scheme
- Smooth animations and transitions

### Component Guidelines
- Use Radix UI for accessibility
- Follow established patterns
- Maintain consistent spacing
- Add loading states
- Handle errors gracefully

## 🔒 Security Considerations

- Never commit API keys or secrets
- Validate all inputs
- Sanitize user data
- Use HTTPS in production
- Implement proper authentication
- Follow OWASP guidelines

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [tRPC Docs](https://trpc.io/docs)
- [Drizzle ORM](https://orm.drizzle.team/)

### Tools
- [VS Code](https://code.visualstudio.com/) with extensions:
  - TypeScript
  - Tailwind CSS IntelliSense
  - Prettier
  - ESLint

## 🤝 Community

- Be respectful and inclusive
- Help others learn
- Share knowledge
- Ask questions
- Provide constructive feedback

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to RiyaSaviya! 🎉
