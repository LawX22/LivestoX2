# LivestoX_v2.1

## Overview
LivestoX_v2.1 is a livestock management and online marketplace system built with **Vue.js** and **TypeScript**. This system is designed to facilitate the sale of livestock products, improve transparency between farmers and buyers, and empower communities economically. It includes features such as:

- User authentication with Firebase
- Livestock listing and management
- Buyer-seller chat functionality
- Inventory tracking and notifications
- Role-based access control (RBAC)
- Smart monitoring of perishable goods

## Prerequisites
Before setting up the project, ensure you have the following installed:
- **Node.js** (latest LTS version recommended)
- **Vue CLI** (if not installed, use `npm install -g @vue/cli`)
- **Vite** (for fast build performance)
- **TypeScript** (`npm install -g typescript`)
- **Firebase SDK** (for authentication and database management)

## Installation

```sh
# Clone the repository
git clone https://github.com/your-repo/LivestoX_v2.1.git
cd LivestoX_v2.1

# Install dependencies
npm install
```

Create an `.env` file and configure Firebase settings:

```sh
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Start the development server:

```sh
npm run dev
```

## Setting Up PrimeVue with TypeScript and Tailwind CSS

### 1. Install Vue 3 with TypeScript
```sh
npm create vite@latest LivestoX_v2.1 --template vue-ts
cd LivestoX_v2.1
npm install
```

### 2. Install PrimeVue and required dependencies
```sh
npm install primevue@3 primeicons
npm install @vuepic/vue-datepicker
```

### 3. Install Tailwind CSS
```sh
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 4. Configure Tailwind in `tailwind.config.js`
```js
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 5. Add Tailwind to `src/assets/main.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 6. Configure PrimeVue in `main.ts`
```ts
import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import "./assets/main.css";

const app = createApp(App);
app.use(PrimeVue);
app.mount("#app");
```

## Running the Project

### Start development server:
```sh
npm run dev
```

### Build for production:
```sh
npm run build
```

## Contributing
Contributions are welcome! Please follow these steps:
```sh
# Fork the repository
# Create a new branch
git checkout -b feature-branch

# Commit changes
git commit -m 'Add new feature'

# Push to the branch
git push origin feature-branch
```

Then, open a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
