# Backend Implementation Rules

## Core Principles

### 1. Database Schema Management
- Create Prisma models separately for each module
- Run migrations independently per module
- **NEVER use Prisma `enum` types** - always use `String` type with validation
- Follow snake_case for database column names using `@map()`
- Use PascalCase for model names (singular)

### 2. Module Architecture

#### 2.1 Module Structure
Every module must follow this structure:
```
modules/
  └── [module-name]/
      ├── types/
      │   └── I[ModuleName].ts
      ├── [module-name].repository.ts
      ├── [module-name].service.ts
      ├── [module-name].controller.ts
      └── [module-name].route.ts
```

#### 2.2 Related Modules Grouping
When modules are related (e.g., provider profile ecosystem), group them under a parent directory:
```
modules/
  └── provider/
      ├── profile/
      ├── experience/
      ├── education/
      ├── language/
      ├── skill/
      └── provider-service/
```

### 3. Type System Rules

#### 3.1 No Prisma Type Dependencies
**CRITICAL**: Never use Prisma-generated types in module interfaces
```typescript
// ❌ WRONG - Prisma type dependency
import { Prisma } from "@prisma/client";
experiences?: Prisma.ProviderExperienceCreateWithoutProviderProfileInput[];

// ✅ CORRECT - Custom types
import { ICreateExperienceData } from "../../experience/types/IExperience";
experiences?: ICreateExperienceData[];
```

#### 3.2 Type Location
- All types MUST be in `(module)/types/` directory
- Use interface naming: `I[EntityName]`, `ICreate[EntityName]Data`, `IUpdate[EntityName]Data`
- Never define types inline in repository or service files

#### 3.3 Type Composition
Import types from sibling modules for composition:
```typescript
// In profile/types/IProfile.ts
import { IExperience } from "../../experience/types/IExperience";
import { IEducation } from "../../education/types/IEducation";

export interface IProfileResponse {
    experiences?: IExperience[];
    education?: IEducation[];
}
```

### 4. Layer Responsibilities

#### 4.1 Repository Layer
- **Pure database operations only**
- Receives clean, pre-processed data
- Uses typed interfaces (e.g., `ICreateProfileRepositoryData`)
- NO business logic
- NO data transformation (dates, mapping, etc.)

```typescript
// ✅ CORRECT - Repository receives typed data
async createProfile(userId: string, data: ICreateProfileRepositoryData) {
    return await this.prisma.providerProfile.create({
        data: {
            userId,
            ...data.title,
            experiences: data.experiences ? { create: data.experiences } : undefined
        }
    });
}
```

#### 4.2 Service Layer
- Handles ALL business logic
- Performs data transformation before calling repository
- Converts dates from strings to Date objects
- Maps arrays to repository-expected format
- Validates business rules

```typescript
// ✅ CORRECT - Service transforms data
static async createProfile(userId: string, data: ICreateProfileData, next: NextFunction) {
    // Transform experiences
    const experiences = data.experiences?.map(exp => ({
        ...exp,
        startDate: new Date(exp.startDate),
        endDate: exp.endDate ? new Date(exp.endDate) : undefined,
    }));

    // Prepare repository data
    const repositoryData: ICreateProfileRepositoryData = {
        experiences,
        // ... other transformed data
    };

    return await this.repository.create(userId, repositoryData);
}
```

#### 4.3 Controller Layer
- Thin layer for HTTP handling
- Extracts data from request
- Calls service methods
- Formats responses

#### 4.4 Route Layer
- Defines endpoints
- Applies middleware (protect, checkPermissions)
- Groups related routes

### 5. Module Independence

#### 5.1 Separate Modules for Related Entities
Each related entity should be its own complete module:
- ✅ `modules/provider/experience/` (full module)
- ✅ `modules/provider/education/` (full module)
- ❌ Experience types in profile module (coupled)

#### 5.2 Each Module is Self-Contained
Every module must have:
- Own types in `types/` directory
- Own repository with CRUD operations
- Own service with business logic
- Own controller with HTTP handlers
- Own route definitions

### 6. Code Reuse and Modification
- **Prioritize modifying existing code** over creating duplicates
- Follow established patterns in the codebase
- Maintain consistency with existing modules

### 7. Data Type Conventions

#### 7.1 String-based Enums
Use string types with TypeScript union types:
```typescript
// ✅ CORRECT
export type ServiceType = "ENGINEERING" | "WRITING" | "TUTORING";
export interface IProviderService {
    serviceType: string; // Stored as string in DB
}
```

#### 7.2 Date Handling
- **Frontend → Service**: Receive as string or Date
- **Service → Repository**: Always convert to Date objects
- **Repository → Database**: Prisma handles Date to database conversion

### 8. Import Path Conventions
- Use relative imports for same module: `"./types/IProfile"`
- Use relative imports for sibling modules: `"../../experience/types/IExperience"`
- Use absolute imports for shared utilities: `"../../../utils/app-error"`

### 9. Error Handling
- Repository throws AppError on failures
- Service catches and passes to next() middleware
- Use descriptive error messages
- Always include try-catch in service/repository methods

### 10. Migration Strategy
- One migration per module implementation
- Name migrations descriptively: `001_module_name`, `002_provider_profile`
- Run migrations separately: `npx prisma migrate dev --name [migration_name]`
- Regenerate Prisma client after schema changes: `npx prisma generate`

## Module 2 Implementation Example

This example demonstrates all rules:

**Directory Structure:**
```
modules/provider/
  ├── profile/
  │   ├── types/IProfile.ts (imports from siblings)
  │   ├── profile.repository.ts
  │   ├── profile.service.ts (transforms data)
  │   ├── profile.controller.ts
  │   └── profile.route.ts
  ├── experience/
  │   ├── types/IExperience.ts (independent types)
  │   ├── experience.repository.ts
  │   ├── experience.service.ts
  │   ├── experience.controller.ts
  │   └── experience.route.ts
  └── [other related modules...]
```

**Key Points:**
1. Profile imports types from Experience, NOT Prisma types
2. Each entity (experience, education) is own module
3. Service layer transforms dates before passing to repository
4. Repository receives clean ICreateProfileRepositoryData
5. No coupling between modules except through type imports

### 11. File Handling & Attachments
- **NEVER use polymorphic relations** (e.g., `FileContext`) for linking files to entities.
- **ALWAYS create explicit join tables** for each entity that requires file attachments.
- Naming convention: `[EntityName]File` (e.g., `RequestFile`, `ProposalFile`).
- The join table must link `[entityId]` and `fileId`.
- Use the `File` model for storing metadata and nested writes for transactional creation.

## Checklist for New Module Implementation

- [ ] Create module directory with proper structure
- [ ] Define all types in `types/` directory (no Prisma types)
- [ ] Implement repository with pure DB operations
- [ ] Implement service with data transformation logic
- [ ] Implement controller for HTTP handling
- [ ] Define routes with proper middleware
- [ ] Create Prisma models (no enums, use strings)
- [ ] Run migration separately
- [ ] Update app.ts with route imports
- [ ] Verify no Prisma type dependencies in interfaces
- [ ] Test with TypeScript compilation (`npx tsc --noEmit`)