# Contributing to StableJSON

Thank you for your interest in contributing to StableJSON! We welcome contributions from the community and are excited to see what you'll bring to the project.

## 🚀 Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork:**
   ```bash
   git clone https://github.com/debjit450/stablejson.git
   cd stablejson
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start development server:**
   ```bash
   npm run dev
   ```

## 🛠️ Development Workflow

### Making Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes:**
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit with clear messages:**
   ```bash
   git commit -m "feat: add new JSON validation feature"
   ```

5. **Push and create a pull request:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add JSONPath query support
fix: resolve memory leak in large JSON processing
docs: update installation instructions
style: format code with prettier
refactor: simplify JSON validation logic
test: add unit tests for diff functionality
chore: update dependencies
```

## 📋 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Provide proper type definitions
- Avoid `any` types when possible
- Use interfaces for object shapes

### Code Style
- Follow the existing ESLint configuration
- Use Prettier for consistent formatting
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### Component Structure
```typescript
// Good component structure
interface ComponentProps {
  data: JsonData;
  onUpdate: (data: JsonData) => void;
}

export function Component({ data, onUpdate }: ComponentProps) {
  // Component logic
  return (
    <div className="component-container">
      {/* Component JSX */}
    </div>
  );
}
```

### File Organization
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── [Component].tsx # Feature components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
└── types/              # TypeScript type definitions
```

## 🎨 Design Guidelines

### UI/UX Principles
- **Simplicity First** - Keep interfaces clean and uncluttered
- **Accessibility** - Ensure all features are accessible (WCAG 2.1 AA)
- **Responsive Design** - Support desktop, tablet, and mobile
- **Performance** - Optimize for fast loading and smooth interactions

### Design System
- Use Tailwind CSS classes consistently
- Follow the established color palette
- Use Geist and Inter fonts
- Maintain consistent spacing (4px grid system)

### Component Guidelines
- Use shadcn/ui components as base
- Implement proper focus states
- Add loading states for async operations
- Include error handling and user feedback

## 🧪 Testing

### Manual Testing
- Test on different browsers (Chrome, Firefox, Safari, Edge)
- Verify responsive design on various screen sizes
- Test with large JSON files (>1MB)
- Validate accessibility with screen readers

### Automated Testing (Future)
We're planning to add:
- Unit tests with Jest
- Component tests with React Testing Library
- E2E tests with Playwright

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for public APIs
- Document complex algorithms
- Include usage examples
- Update README for new features

### User Documentation
- Update feature descriptions
- Add screenshots for new UI elements
- Create usage examples
- Update keyboard shortcuts

## 🐛 Bug Reports

### Before Reporting
1. Check existing issues to avoid duplicates
2. Test with the latest version
3. Try to reproduce the issue consistently

### Bug Report Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- Browser: [e.g. Chrome 91]
- OS: [e.g. macOS 12.0]
- Version: [e.g. 1.0.0]

**Sample JSON**
If applicable, provide the JSON that caused the issue.
```

## ✨ Feature Requests

### Before Requesting
1. Check if the feature already exists
2. Search existing feature requests
3. Consider if it fits the project's philosophy

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Use case**
Describe how this feature would be used.

**Additional context**
Add any other context or screenshots about the feature request.
```

## 🎯 Areas for Contribution

### High Priority
- 🐛 **Bug Fixes** - Help us squash bugs and improve stability
- 📱 **Mobile Experience** - Improve mobile usability
- ♿ **Accessibility** - Enhance accessibility features
- 🚀 **Performance** - Optimize for large JSON files

### Medium Priority
- ✨ **New Features** - Add new JSON processing capabilities
- 🎨 **UI/UX Improvements** - Enhance visual design and user experience
- 📚 **Documentation** - Improve docs, examples, and tutorials
- 🌐 **Internationalization** - Add support for more languages

### Low Priority
- 🧪 **Testing** - Add automated tests
- 🔧 **Developer Tools** - Improve development experience
- 📦 **Build Process** - Optimize build and deployment

## 🔍 Code Review Process

### Pull Request Guidelines
1. **Clear Description** - Explain what changes you made and why
2. **Small Changes** - Keep PRs focused and manageable
3. **Tests** - Include tests for new features (when testing is available)
4. **Documentation** - Update docs for user-facing changes

### Review Criteria
- Code quality and maintainability
- Adherence to coding standards
- Performance impact
- Accessibility compliance
- User experience considerations

### Review Process
1. Automated checks (linting, building)
2. Manual code review by maintainers
3. Testing on different browsers/devices
4. Feedback and iteration
5. Approval and merge

## 🏆 Recognition

### Contributors
All contributors will be:
- Listed in the project's contributors section
- Mentioned in release notes for significant contributions
- Invited to join the project's Discord community (when available)

### Maintainers
Active contributors may be invited to become maintainers with:
- Commit access to the repository
- Ability to review and merge pull requests
- Input on project direction and roadmap

## 📞 Getting Help

### Community Support
- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and community chat
- **Documentation** - Check the README and docs first

### Direct Contact
- **Email** - contribute@stablejson.com
- **Twitter** - @stablejson (when available)

## 📜 Code of Conduct

### Our Pledge
We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards
Examples of behavior that contributes to creating a positive environment include:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement
Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at conduct@stablejson.com.

---

Thank you for contributing to StableJSON! Together, we're building a tool that makes JSON processing simple, fast, and enjoyable for developers worldwide. 🚀