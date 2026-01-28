# Vue Admin Starter

A premium, enterprise-grade admin dashboard starter kit built with **Vue 3**, **Vite**, and **Tailwind CSS v4**. Designed for speed, scalability, and aesthetic excellence.

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Core Features

- 🎨 **Tailwind CSS v4 Integration**: Leveraging the latest CSS-first engine for high-performance styling.
- 🌓 **Advanced Theming**: Full support for Light, Dark, and System modes with smooth transitions.
- 🛠️ **TanStack Query (Vue Query)**: Powerful data fetching, caching, and state synchronization.
- 🔐 **Comprehensive Admin Suite**:
  - **Roles Management**: Full CRUD for system roles and permissions.
  - **Menus Management**: Dynamic navigation structure control.
  - **Advanced Settings**: Integrated 2FA setup, reCAPTCHA v2 configuration, and global site management.
- 📱 **Responsive Design**: Mobile-first architecture with a persistent sidebar and modern navigation.
- 🧪 **Mock Data Layer**: Built-in fallback mechanism for seamless development even when the API is offline.

## 🚀 Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API + Script Setup)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Data Fetching**: [@tanstack/vue-query](https://tanstack.com/query/latest)
- **Networking**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide Vue Next](https://lucide.dev/)
- **Auth Utils**: [js-cookie](https://github.com/js-cookie/js-cookie)
- **Router**: [Vue Router 4](https://router.vuejs.org/)

## 🛠️ Project Structure

```bash
src/
├── components/          # Reusable UI & Layout components
│   ├── layout/          # Navbar, Sidebar, ThemeToggle, etc.
│   └── ui/              # Atom-level components (Button, Card, etc.)
├── composables/         # Shared logic (Auth, Roles, Menus, Settings)
├── routes/              # Centralized route definitions & guards
├── services/            # API configuration (Axios interceptors)
├── views/               # Page components organized by feature
├── types/               # schemas, types, and mocks dtos
└── style.css            # Global CSS & Tailwind v4 tokens
```

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- npm / pnpm / yarn

### Installation

1. Clone the repository or Create Project
    ```bash
    npm create vite@7.1.7 vue-starter -- --template vue-ts
    ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server:

```bash
npm run dev
```

### Build & Preview

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```


## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using Vue + Vite + TanStack**
