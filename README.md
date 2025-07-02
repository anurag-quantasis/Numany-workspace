# NumanyWorkspace

Welcome to the Numany multi-tenant workspace! This project is structured to support a main application, tenant-specific applications, and a shared UI library for reusable components.

## Project Structure

The workspace contains three main folders under the `projects/` directory:

- **main-numany**:  
  The primary application for administrators or main users.  
  _Folder:_ `projects/main-numany`

- **tenant-numany**:  
  The application for tenant users (e.g., hospitals, organizations).  
  _Folder:_ `projects/tenant-numany`

- **shared-ui**:  
  An Angular library for UI components shared between `main-numany` and `tenant-numany`.  
  _Folder:_ `projects/shared-ui`

## Naming Conventions

To maintain consistency and readability across the codebase, please follow these naming conventions:

- **Functions:**  
  Use `camelCase`. Function names should clearly describe their purpose.  
  _Example:_ `getUserDetails()`, `updateTenantInfo()`

- **Properties and Variables:**  
  Use `camelCase` for all variable and property names.  
  _Example:_ `userList`, `tenantId`, `isActive`

- **Classes and Components:**  
  Use `PascalCase` (each word capitalized, no underscores).  
  _Example:_ `UserProfileComponent`, `TenantService`

- **Constants:**  
  Use `UPPER_CASE_WITH_UNDERSCORES` for constant values.  
  _Example:_ `MAX_LOGIN_ATTEMPTS`, `DEFAULT_LANGUAGE`

- **Shared Components:**  
  Place all shared components in the `shared-ui` project and use generic names that do not reference main or tenant-specific logic.

## Getting Started

### 1. Install Dependencies

Install all required packages:

```bash
npm install
```

### 2. Build the Shared UI Library

Before running either application, build the shared UI library so it can be used by both projects:

```bash
ng build shared-ui
```

### 3. Run the Main or Tenant Application

To start the main application:

```bash
ng serve --project=main-numany
```

To start the tenant application:

```bash
ng serve --project=tenant-numany
```

Open your browser at [http://localhost:4200/](http://localhost:4200/) (or the port shown in your terminal).

## Code Scaffolding

To generate a new component, service, or module, use Angular CLI:

```bash
ng generate component component-name --project=main-numany
ng generate component component-name --project=tenant-numany
ng generate component component-name --project=shared-ui
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the entire workspace:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running Unit Tests

To run unit tests for a specific project:

```bash
ng test --project=main-numany
ng test --project=tenant-numany
ng test --project=shared-ui
```

## Running End-to-End Tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [PrimeNG Documentation](https://primeng.org/)

---

**Tip:**  
Always rebuild the `shared-ui` library after making changes to shared components before running the main or tenant.
 

## AI Considerations

For better response make sure to mention the angular version as the AI tools prefer to give outdated methods

Recommended AI models in order Chat GPT > Gemini 2.5 (Web version)

If making complicated components Make sure to give css later in steps and not in one go