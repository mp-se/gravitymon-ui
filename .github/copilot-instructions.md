# GitHub Copilot Instructions

You are an expert Vue 3 developer. Follow these core requirements for every code change or feature implementation.

- Always quality check code before finalizing, use 'npm run format', 'npm run lint', 'npm test', 'npm run test:coverage', and 'npm run build' to verify code quality, functionality, and coverage.
- For bug fixes, always create tests that reproduce the issue before the fix, verify the fix resolves the issue, and cover edge cases to prevent regressions.
- Follow the project architecture and coding patterns outlined in this document to ensure consistency and maintainability.
- Use GitHub Copilot to assist with code generation, but always review and test the generated code to ensure it meets the project's standards and requirements.
- Review generated code for security vulnerabilities and performance issues before committing.
- If uncertain always ask for clarification before proceeding with code changes, dont make changes based on assumptions.
- When making changes that affect multiple files, consider breaking them down into smaller, more manageable tasks to ensure quality and reduce the risk of introducing bugs.
- Always make a plan for all the steps needed to complete a change, including testing and verification, before starting to write code. This will help ensure that all necessary steps are completed and that the change is thoroughly tested before being finalized.


## 1. Workflow & Process

- Before writing any code, ensure you have a clear understanding of the requirements and design. If questions arise, ask for clarification before proceeding.
- If the requirements are ambiguous, ask for clarification before proceeding.
- When completing a code change ensure that there are test cases that cover the new functionality and also the edge cases.
- **Bug Fix Testing**: When fixing a bug, always create tests that:
  1. Reproduce the issue before the fix is implemented
  2. Pass after the fix is applied
  3. Verify the root cause is addressed
  4. Cover edge cases that could trigger the same issue
  - This prevents regressions and ensures the bug is properly understood and fixed.
- If a change requires changes to more than 3 files, consider breaking it down into smaller tasks first.
- When there is an issue, start with creating the test that reproduces the issue, then implement the fix and verify that the test passes. This will ensure that the issue is properly addressed and prevent regressions in the future.

## 2. Quality Standards & Verification

- **Unit Tests**: All changes must have unit tests covering the functionality. Aim for **minimum 80% coverage** for files under `src/`.
  - Views: Aim for 50%+ function coverage (some views are data-heavy with limited testable functions)
  - Modules: Aim for 80%+ coverage
  - Fragments: Aim for 70%+ coverage
  - Test files are located in the `__tests__` directory relative to the file being edited.
- **Test Framework**: Use Vitest with `@vue/test-utils` for Vue components.
- **Coverage Tool**: Use `npm run test:coverage` to generate coverage reports.
- **Linting**: All code must pass `npm run lint` without errors.
- **Code Formatting**: All code must comply with formatting standards via `npm run format` (Prettier).
- **Build**: All changes must build successfully (`npm run build`) without errors or warnings.

## 3. Project Architecture & Patterns

- **Directory Structure**:
  - `src/fragments/`: Vue components that are reusable across the application and other similar projects.
  - `src/modules/`: Shared logic and pinia stores (configStore, globalStore, statusStore, badge, formula, router, utils).
  - `src/views/`: Page-level Vue components for different sections of the application.
  - `src/tests/`: Test utilities and setup files (testUtils.js, setup.js).
  - `src/__tests__/`: Unit tests for app-level functionality.

- **Store Architecture** (Pinia):
  - `configStore.js`: Device configuration state
  - `globalStore.js`: Global UI state (disabled, messages, platform info)
  - `statusStore.js`: Current device status and readings
  
- **Test Organization**:
  - Place test files in `__tests__` subdirectories next to the files being tested.
  - Example: `src/views/DeviceWifiView.vue` → `src/views/__tests__/DeviceWifiView.test.js`

## 4. Vue 3 Component Patterns

- **Script Setup Syntax**: All components should use `<script setup>` for cleaner, more concise code.
- **Imports**: Place all imports at the top of the component.
  ```javascript
  import { ref, computed, watch, onMounted } from 'vue'
  import { global, config } from '@/modules/pinia'
  import { validateCurrentForm } from '@mp-se/espframework-ui-components'
  ```
- **Reactive State**: Use `ref()` for primitive values, `reactive()` for objects.
- **Computed Properties**: Use `computed()` for derived state.
- **Props & Emits**: Define props and emits using `defineProps()` and `defineEmits()`.
- **Watchers**: Use `watch()` for side effects when state changes.
- **Lifecycle**: Use `onMounted()`, `onUnmounted()`, etc. from Vue.
- **Template**: Avoid complex logic in templates; keep them simple and readable.

## 5. Testing Patterns

- **Component Testing**:
  - Import `mount` or `shallowMount` from `@vue/test-utils`.
  - Use `createTestingPinia()` from test utilities for Pinia store setup.
  - Mock complex child components with `stubs`.
  - Test user interactions (clicks, form submissions, watchers).
  - Example:
    ```javascript
    const wrapper = mount(MyComponent, { 
      global: { 
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsButton: true }
      }
    })
    await wrapper.vm.save()
    expect(config.saveAll).toHaveBeenCalled()
    ```

- **Mocking**:
  - Use `vi.fn()` for async methods and functions.
  - Use `vi.spyOn()` for module-level functions.
  - Use `vi.mock()` for entire modules.
  - Example: `vi.spyOn(module, 'validateCurrentForm').mockReturnValue(true)`

- **Store Testing**:
  - Test Pinia stores in isolation with fresh instances via `createTestingPinia()`.
  - Mock external dependencies (API calls, localStorage, etc.).
  - Test computed properties, actions, and state setters.

- **Coverage Focus**:
  - For Views: Test async functions (onMounted), form submission (save/restart), watchers, computed properties.
  - For Modules/Stores: Test all public functions, computed properties, state mutations.
  - For Fragments: Test props, events, computed display logic, user interactions.

## 6. Documentation & Metadata

- **JSDoc**: Include JSDoc comments for complex logic, parameters, and return types.
  ```javascript
  /**
   * Validates current form state
   * @returns {boolean} true if form is valid, false otherwise
   */
  const isFormValid = () => { ... }
  ```
- **File Headers**: All files should include the copyright header (GravityMon license).

## 7. State Management Rules

- **Store Modifications**: Always go through pinia stores (config, global, status).
- **Config Updates**: Use `config.saveAll()` to persist configuration changes.
- **Global Messages**: Use `global.messageError`, `global.messageSuccess`, `global.messageInfo`, `global.messageWarning`.
- **Global Flags**: Use `global.disabled` for async operations, `global.configChanged` for tracking unsaved changes.

## 8. Dependencies & Performance

- Always update packages to avoid security vulnerabilities, but test thoroughly after updates.
- Only add new dependencies if absolutely necessary; prefer using existing libraries (Bootstrap, Chart.js, etc.).
- Lazy load views via Vue Router when possible.
- Use shallowMount for tests when you don't need child components rendered.

## 9. Verification Steps (Instructions for AI)

Before finalizing any change, you must:

1. Ensure the code is free of syntax errors.
2. Verify that appropriate tests have been added or updated in the corresponding `__tests__` folder.
3. For bug fixes, verify that:
   - Tests exist that reproduce the original issue
   - Tests pass after the fix is applied
   - Tests cover edge cases and prevent regressions
   - The test suite provides meaningful coverage of the fixed functionality
4. Run verification commands (if available):
   - `npm test` - All tests must pass
   - `npm run lint` - No linting errors
   - `npm run test:coverage` - Check coverage metrics
   - `npm run build` - Build must succeed without warnings or errors

## 10. Architecture and Coding Principles

- The project should be designed with modularity in mind, allowing for easy maintenance and scalability.
- Ensure that all components are reusable and follow a consistent design pattern.
- Use GitHub Copilot to assist with code generation, but always review and test the generated code to ensure it meets the project's standards and requirements.
- Review generated code for security vulnerabilities and performance issues before committing.

## 11. Common Patterns & Anti-patterns

### DO:
- ✅ Use `createTestingPinia()` for fresh store instances in each test
- ✅ Mock BsMessage and other UI components with `{ template: '<div><slot /></div>' }` when testing content
- ✅ Test edge cases: empty strings, null values, false conditions
- ✅ Use `vi.clearAllMocks()` in beforeEach for test isolation
- ✅ Test both success and failure paths in async functions
- ✅ Stub complex child components (BsInputText, BsButton, etc.) in view tests

### DON'T:
- ❌ Don't test implementation details; test behavior and outcomes
- ❌ Don't forget to restore state after tests that modify global/config stores
- ❌ Don't use `watch.value` directly in onMounted watchers (causes build issues)
- ❌ Don't create dependencies between tests; each should be independent
- ❌ Don't mock too much; only mock what's necessary for the test

## 12. Workflow Tips

- **Before starting work**: Run `npm test` to ensure all tests pass
- **During development**: Use `npm run test:watch` for continuous testing
- **Before committing**: Run full verification:
  ```sh
  npm test && npm run lint && npm run test:coverage && npm run build
  ```
- **Coverage gaps**: Use `npm run test:coverage` to identify untested functions
- **Debugging tests**: Use `console.log()` or Node debugger with `--inspect` flag
