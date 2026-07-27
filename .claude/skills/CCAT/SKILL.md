```markdown
# CCAT Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the core development patterns and conventions used in the CCAT TypeScript codebase. You'll learn the repository's file naming, import/export styles, commit message conventions, and testing patterns. This guide is designed to help you contribute code that matches the project's established standards.

## Coding Conventions

### File Naming
- **Style:** kebab-case
- **Example:**  
  `user-profile.ts`  
  `data-fetcher.test.ts`

### Import Style
- **Style:** Relative imports
- **Example:**
  ```typescript
  import { fetchData } from './data-fetcher';
  ```

### Export Style
- **Style:** Named exports
- **Example:**
  ```typescript
  // In user-profile.ts
  export function getUserProfile(id: string) { ... }
  ```

### Commit Messages
- **Style:** Conventional commits
- **Prefix:** `docs`
- **Example:**
  ```
  docs: update README with installation steps
  ```

## Workflows

### Adding a New Module
**Trigger:** When you need to add a new feature or utility to the codebase  
**Command:** `/add-module`

1. Create a new file using kebab-case, e.g., `feature-name.ts`.
2. Write your TypeScript code using named exports.
3. Use relative imports for any dependencies.
4. If applicable, create a corresponding test file: `feature-name.test.ts`.
5. Commit your changes using a conventional commit message, e.g., `docs: add feature-name module`.

### Writing Documentation
**Trigger:** When you need to update or add documentation  
**Command:** `/write-docs`

1. Edit or create documentation files as needed.
2. Use clear, concise language.
3. Commit with a `docs:` prefix, e.g., `docs: update usage instructions`.

## Testing Patterns

- **Test File Pattern:** Files end with `.test.*` (e.g., `user-profile.test.ts`)
- **Testing Framework:** Not explicitly detected; follow typical TypeScript testing practices.
- **Example:**
  ```typescript
  // user-profile.test.ts
  import { getUserProfile } from './user-profile';

  describe('getUserProfile', () => {
    it('returns user data for a valid ID', () => {
      // test implementation
    });
  });
  ```

## Commands
| Command        | Purpose                                   |
|----------------|-------------------------------------------|
| /add-module    | Scaffold and add a new module             |
| /write-docs    | Update or add documentation               |
```
