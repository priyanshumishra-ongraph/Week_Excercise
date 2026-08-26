# 🖥️ TaskMaster Frontend

The client application for TaskMaster, built with Angular 18 and Angular Material.

## 📸 Screenshots
| Kanban Board | Dashboard Overview |
| :---: | :---: |
| ![Dashboard](../assets/dashboard.png) | ![User Dashboard](../assets/user-dashboard.png) |

## 🛠️ Tech Stack
- **Angular 18**: Standalone components, Signals, Control Flow (`@if`, `@for`).
- **Angular Material & CDK**: Drag and Drop Kanban board, Dialog modals, Menus.
- **State Management**: Reactive signals inside `TodoService` and `AuthService`.
- **Styling**: Slack-inspired aubergine (`#611f69`) & emerald green (`#007a5a`) theme.

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in this directory:
```env
API_URL=http://localhost:3000/api
```

### 3. Run Development Server
```bash
npm start
```
Navigate to `http://localhost:4200/`.

### 4. Build for Production
```bash
npm run build
```
The build artifacts will be stored in the `dist/` directory.
