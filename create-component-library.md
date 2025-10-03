# Creating a Reusable Component Library

## Option 1: NPM Private Package (Recommended)

### 1. Create a new directory for your library
```bash
mkdir espframework-ui-components
cd espframework-ui-components
npm init -y
```

### 2. Create directory structure
```bash
mkdir -p src/components
mkdir -p src/fragments
```

Copy your components and fragments:
- Components: `BsCard.vue`, `BsDropdown.vue`, `BsInputText.vue`, etc. → `src/components/`
- Fragments: `AdvancedFilesFragment.vue`, `EnableCorsFragment.vue`, `ListFilesFragment.vue`, `VoltageFragment.vue` → `src/fragments/`

### 2. Setup the package.json (with GitHub Packages)
```json
{
  "name": "@mp-se/espframework-ui-components",
  "version": "1.0.0",
  "description": "Reusable Vue components for ESP Framework UI",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "files": ["dist"],
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/mp-se/espframework-ui-components.git"
  },
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "test": "echo \"No tests yet\" && exit 0",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "vue": "^3.0.0"
  },
  "devDependencies": {
    "@rollup/plugin-node-resolve": "^15.0.0",
    "@rollup/plugin-commonjs": "^24.0.0",
    "@vitejs/plugin-vue": "^4.0.0",
    "rollup": "^3.0.0",
    "rollup-plugin-vue": "^6.0.0"
  }
}
```

### 3. Create .npmrc for GitHub Packages
```
@mp-se:registry=https://npm.pkg.github.com
```

### 3. Create rollup.config.js
```javascript
import { defineConfig } from 'rollup'
import vue from 'rollup-plugin-vue'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default defineConfig({
  input: 'src/index.js',
  external: ['vue'],
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named'
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm'
    }
  ],
  plugins: [
    vue(),
    nodeResolve(),
    commonjs()
  ]
})
```

### 4. Copy components and create index.js
```javascript
// src/index.js

// Basic UI Components
export { default as BsCard } from './components/BsCard.vue'
export { default as BsDropdown } from './components/BsDropdown.vue'
export { default as BsInputText } from './components/BsInputText.vue'
export { default as BsInputNumber } from './components/BsInputNumber.vue'
export { default as BsInputSwitch } from './components/BsInputSwitch.vue'
export { default as BsInputTextArea } from './components/BsInputTextArea.vue'
export { default as BsInputTextAreaFormat } from './components/BsInputTextAreaFormat.vue'
export { default as BsInputReadonly } from './components/BsInputReadonly.vue'
export { default as BsInputRadio } from './components/BsInputRadio.vue'
export { default as BsSelect } from './components/BsSelect.vue'
export { default as BsMessage } from './components/BsMessage.vue'
export { default as BsModal } from './components/BsModal.vue'
export { default as BsModalConfirm } from './components/BsModalConfirm.vue'
export { default as BsProgress } from './components/BsProgress.vue'
export { default as BsFileUpload } from './components/BsFileUpload.vue'
export { default as BsMenuBar } from './components/BsMenuBar.vue'
export { default as BsFooter } from './components/BsFooter.vue'
export { default as BsInputBase } from './components/BsInputBase.vue'

// Icon Components
export { default as IconEye } from './components/IconEye.vue'
export { default as IconEyeSlash } from './components/IconEyeSlash.vue'
export { default as IconCheckCircle } from './components/IconCheckCircle.vue'
export { default as IconXCircle } from './components/IconXCircle.vue'
export { default as IconInfoCircle } from './components/IconInfoCircle.vue'
export { default as IconExclamationTriangle } from './components/IconExclamationTriangle.vue'
export { default as IconWifi } from './components/IconWifi.vue'
export { default as IconHome } from './components/IconHome.vue'
export { default as IconTools } from './components/IconTools.vue'
export { default as IconCpu } from './components/IconCpu.vue'
export { default as IconUpArrow } from './components/IconUpArrow.vue'
export { default as IconGraphUpArrow } from './components/IconGraphUpArrow.vue'
export { default as IconCloudUpArrow } from './components/IconCloudUpArrow.vue'

// Fragment Components (ESP Framework specific)
export { default as AdvancedFilesFragment } from './fragments/AdvancedFilesFragment.vue'
export { default as EnableCorsFragment } from './fragments/EnableCorsFragment.vue'
export { default as ListFilesFragment } from './fragments/ListFilesFragment.vue'
export { default as VoltageFragment } from './fragments/VoltageFragment.vue'
```

## Option 2: Git Submodule

### 1. Create a separate repository
```bash
git init espframework-ui-components
cd espframework-ui-components
# Copy your components here
git add .
git commit -m "Initial component library"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Add as submodule to your projects
```bash
git submodule add <repo-url> src/components-lib
```

## Option 3: Monorepo with Workspace

### 1. Create packages directory structure
```
espframework-workspace/
├── packages/
│   ├── components/
│   │   ├── package.json
│   │   └── src/
│   │       └── components/
│   └── ui-app/
│       ├── package.json
│       └── src/
└── package.json (workspace root)
```

### 2. Root package.json
```json
{
  "name": "espframework-workspace",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

## Option 4: Local File Linking (Simplest)

### 1. Create shared directory
```bash
mkdir shared-components
# Copy your components here
```

### 2. Use in multiple projects
```javascript
// In your projects
import BsCard from '../shared-components/BsCard.vue'
```

## Best Option for GitHub Actions: Option 1 (NPM Private Package)

For GitHub Actions integration, **Option 1 (NPM Private Package)** is the clear winner because:

### **CI/CD Benefits:**
1. **Automated Publishing**: GitHub Actions can automatically build and publish to GitHub Packages
2. **Version Management**: Semantic versioning with automated releases
3. **Build Artifacts**: Compiled, optimized bundles ready for consumption
4. **Dependency Caching**: npm packages work seamlessly with GitHub Actions caching
5. **Registry Integration**: GitHub Packages Registry is built-in to GitHub

### **Technical Benefits:**
1. **Version Control**: Proper versioning of your components
2. **Dependencies**: Clear peer dependency management  
3. **Build Optimization**: Can be optimized for your specific use case
4. **Reusability**: Easy to use across multiple projects
5. **Bundle Size**: Can be tree-shaken effectively

### **GitHub Actions Workflow Example:**

```yaml
# .github/workflows/publish.yml
name: Publish Package

on:
  push:
    tags:
      - 'v*'
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@mp-se'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build package
        run: npm run build
      
      - name: Run tests
        run: npm test
      
      - name: Publish to GitHub Packages
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### **Using in Other Projects:**

```yaml
# In consuming project's workflow
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    registry-url: 'https://npm.pkg.github.com'
    scope: '@mp-se'

- name: Install dependencies
  run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Implementation Steps with GitHub Actions

1. **Create Component Library Repository**
   ```bash
   # Create new repo on GitHub: espframework-ui-components
   git clone https://github.com/mp-se/espframework-ui-components.git
   cd espframework-ui-components
   # Setup package.json, rollup.config.js, and copy components
   ```

2. **Setup GitHub Actions Workflow** (in component library repo)
   - Create `.github/workflows/publish.yml` (see workflow above)
   - Automatically publishes on tag creation

3. **Consume in Projects**
   ```json
   // In your project's package.json
   {
     "dependencies": {
       "@mp-se/espframework-ui-components": "^1.0.0"
     }
   }
   ```

   ```javascript
   // In your Vue project
   import { BsCard, ListFilesFragment, IconWifi } from '@mp-se/espframework-ui-components'
   ```

4. **Project GitHub Actions** (consuming projects)
   ```yaml
   - name: Install dependencies
     run: npm ci
     env:
       NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
   ```

## Why Option 1 Wins for GitHub Actions:

- ✅ **Automated Publishing**: Tag → Build → Publish automatically
- ✅ **Version Management**: Semantic versioning with GitHub releases  
- ✅ **Dependency Resolution**: npm handles transitive dependencies
- ✅ **Caching**: GitHub Actions can cache node_modules effectively
- ✅ **Security**: GitHub Packages inherits repository permissions
- ✅ **No Submodule Complexity**: Simple npm install in CI/CD
- ✅ **Build Artifacts**: Pre-built, optimized bundles
- ✅ **Rollback**: Easy to pin or rollback versions

**Other options require manual steps or complex CI/CD setups, making Option 1 the clear choice for GitHub Actions integration.**