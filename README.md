# StableJSON

<div align="center">
  <h3>Clean, compare, and understand JSON — entirely in your browser.</h3>
  <p>A fast, private, frontend-only utility for cleaning, formatting, diffing, and inspecting JSON.</p>
  
  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

---

## 🌟 Features

### Core JSON Processing
- **Validate & Format** — Instantly validate JSON syntax and format with proper indentation
- **Minify** — Compress JSON by removing whitespace and formatting
- **Sort Keys** — Alphabetically sort object keys for consistent structure
- **Clean Data** — Remove null, undefined, and empty values to clean up your data
- **Canonical Output** — Generate deterministic JSON for consistent hashing and comparison

### Advanced Analysis
- **JSON Diff** — Side-by-side comparison with highlighted differences (structural and value-based)
- **Path Inspector** — Navigate JSON structure and extract specific data paths
- **JSONPath Queries** — Query JSON data using JSONPath expressions (`$.users[0].name`, `$..email`)
- **Structure Analysis** — Get insights into JSON structure, size, depth, and data type distribution
- **Tree View** — Interactive foldable JSON viewer for large documents

### Code Generation
- **TypeScript Interfaces** — Auto-generate TypeScript type definitions
- **Zod Schemas** — Generate Zod validation schemas
- **JSON Schema** — Infer and generate JSON Schema from data

### Data Transformation
- **Table View** — Convert JSON arrays to tabular format
- **CSV Export** — Export JSON arrays as CSV files
- **Data Transformation** — Transform keys, flatten nested objects, merge JSONs
- **Hash Generation** — Generate SHA-256 hashes for JSON comparison

### Developer Experience
- **Command Palette** — Quick access to all features (⌘K / Ctrl+K)
- **Keyboard Shortcuts** — Efficient workflow with keyboard navigation
- **Dark/Light Mode** — Comfortable viewing in any environment
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile
- **Offline Support** — Works completely offline after first load

---

## 🚀 Quick Start

### Online Usage

Visit [stablejson.vercel.app](https://stablejson.vercel.app) and start processing JSON immediately — no signup required!

### Local Development

```bash
# Clone the repository
git clone https://github.com/debjit450/stablejson.git
cd stablejson

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🏗️ Building for Production

```bash
# Build the project
npm run build

# Preview the build locally
npm run preview
```

The production build will be in the `dist` folder, ready for deployment.

---

## 🌐 Deployment

### Vercel (Recommended)

1. **Import your repository** to Vercel
2. **Auto-detection:** Vercel will automatically detect Vite configuration
3. **Deploy** with zero configuration

### Netlify

1. **Connect your repository** to Netlify
2. **Set build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Deploy automatically** on every push

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run with Docker
docker build -t stablejson .
docker run -p 8080:80 stablejson
```

---

## 🛠️ Technology Stack

- **Frontend Framework:** [React 18](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/) for fast development and optimized builds
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with custom design system
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) for consistent, accessible components
- **State Management:** React hooks with local storage persistence
- **Routing:** [React Router](https://reactrouter.com/) for client-side navigation
- **Icons:** [Lucide React](https://lucide.dev/) for beautiful, consistent icons
- **Fonts:** [Geist](https://vercel.com/font) and [Inter](https://rsms.me/inter/) for premium typography

---

## 🔒 Privacy & Security

### Privacy-First Design
- **No Data Collection** — We don't collect, store, or transmit any of your JSON data
- **No Analytics** — No tracking pixels, cookies, or analytics scripts
- **No Accounts** — Use the tool without creating accounts or providing personal information
- **Local Processing** — All JSON processing happens entirely in your browser

### Security Features
- **Client-Side Only** — No server-side processing means no data exposure risks
- **HTTPS Everywhere** — Secure connections for all web traffic
- **Content Security Policy** — Protection against XSS and injection attacks
- **No External Dependencies** — Self-contained application with minimal attack surface

### Data Handling
- **Local Storage Only** — Your data is stored locally in your browser's storage
- **No Network Requests** — JSON processing doesn't require internet connectivity
- **Clear Data** — Easy one-click data clearing and browser storage management

---

## 🎯 Use Cases

### Development & Debugging
- **API Response Analysis** — Quickly format and analyze API responses
- **Configuration Management** — Validate and clean configuration files
- **Data Migration** — Transform data between different JSON structures
- **Schema Generation** — Generate TypeScript types from JSON samples

### Data Analysis
- **JSON Exploration** — Navigate complex nested JSON structures
- **Data Comparison** — Compare JSON files to identify differences
- **Structure Analysis** — Understand data patterns and distributions
- **Data Cleaning** — Remove unwanted null and empty values

### Integration & Automation
- **CI/CD Pipelines** — Validate JSON in automated workflows
- **Data Validation** — Ensure JSON conforms to expected schemas
- **Canonical Formatting** — Generate consistent JSON for version control
- **Hash Generation** — Create checksums for data integrity verification

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Setup

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

### Making Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Commit with clear messages:**
   ```bash
   git commit -m "feat: add new JSON validation feature"
   ```
5. **Push and create a pull request**

### Coding Standards

- **TypeScript** — Use TypeScript for all new code
- **ESLint** — Follow the existing ESLint configuration
- **Prettier** — Format code consistently
- **Component Structure** — Follow the established component patterns
- **Accessibility** — Ensure all features are accessible

### Areas for Contribution

- 🐛 **Bug Fixes** — Help us squash bugs and improve stability
- ✨ **New Features** — Add new JSON processing capabilities
- 📚 **Documentation** — Improve docs, examples, and tutorials
- 🎨 **Design** — Enhance UI/UX and visual design
- 🔧 **Performance** — Optimize processing speed and memory usage
- 🌐 **Internationalization** — Add support for more languages

---

## 📋 Roadmap

### Version 2.0 (Planned)
- [ ] **Plugin System** — Extensible architecture for custom processors
- [ ] **Batch Processing** — Handle multiple JSON files simultaneously
- [ ] **Advanced Schemas** — Support for OpenAPI and AsyncAPI schemas
- [ ] **Export Formats** — Additional export formats (YAML, TOML, XML)
- [ ] **Collaboration** — Share JSON snippets with secure links

### Version 1.5 (In Progress)
- [ ] **Performance Optimization** — Faster processing for large JSON files
- [ ] **Enhanced Diff** — More granular diff options and visualizations
- [ ] **Custom Validators** — User-defined validation rules
- [ ] **Keyboard Navigation** — Full keyboard accessibility

### Version 1.0 (Current)
- [x] **Core JSON Processing** — Format, validate, clean, sort
- [x] **Advanced Analysis** — Diff, query, analyze, transform
- [x] **Code Generation** — TypeScript, Zod, JSON Schema
- [x] **Developer Experience** — Command palette, shortcuts, themes

---

## 🐛 Bug Reports & Feature Requests

### Reporting Bugs

Found a bug? Help us fix it!

1. **Check existing issues** to avoid duplicates
2. **Create a new issue** with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS information
   - Sample JSON data (if applicable)

### Feature Requests

Have an idea for improvement?

1. **Search existing requests** to see if it's already suggested
2. **Create a feature request** with:
   - Clear description of the feature
   - Use case and benefits
   - Proposed implementation (if you have ideas)
   - Examples or mockups (if applicable)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ **Commercial use** — Use in commercial projects
- ✅ **Modification** — Modify and adapt the code
- ✅ **Distribution** — Distribute original or modified versions
- ✅ **Private use** — Use for personal projects
- ❌ **Liability** — No warranty or liability
- ❌ **Trademark use** — No trademark rights included

---

## 🙏 Acknowledgments

### Open Source Libraries
- [React](https://reactjs.org/) — UI library
- [Vite](https://vitejs.dev/) — Build tool
- [Tailwind CSS](https://tailwindcss.com/) — Styling framework
- [shadcn/ui](https://ui.shadcn.com/) — UI components
- [Lucide](https://lucide.dev/) — Icon library

### Inspiration
- [JSONLint](https://jsonlint.com/) — JSON validation inspiration
- [jq](https://stedolan.github.io/jq/) — JSON processing concepts
- [Prettier](https://prettier.io/) — Code formatting principles

---

## 📞 Support

### Community Support
- **GitHub Issues** — For bugs and feature requests
- **GitHub Discussions** — For questions and community chat
- **Documentation** — Comprehensive guides and examples

### Professional Support
For enterprise support, custom features, or consulting:
- 📧 **Email:** support@stablejson.com
- 💼 **Enterprise:** enterprise@stablejson.com

---

<div align="center">
  <p><strong>Simple tools last longer than complex ones.</strong></p>
  <p>Made with ❤️ for the developer community</p>
</div>
