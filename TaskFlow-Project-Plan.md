# Project Plan: TaskFlow - Minimal Ticket Management System

## 📋 Executive Summary

**Project Name:** TaskFlow  
**Timeline:** 14 days (2 weeks)  
**Daily Commitment:** 4-6 hours  
**Target:** Fully functional MVP deployed online  
**Tech Stack:** Angular 21 + Tailwind CSS 4 | Spring Boot 3.x + Java 17 | MongoDB  
**Hosting:** Vercel (Frontend) + Railway (Backend) + MongoDB Atlas (Database)

**Core Value Proposition:** Ultra-minimal ticket management system for customer support specialists and software developers, focusing on simplicity over complexity.

---

## 🎯 Project Objectives

### Primary Goals
1. ✅ Deploy a fully functional ticket management system online
2. ✅ Support dual use cases: customer support tickets + development tasks
3. ✅ Demonstrate clean, minimal UI inspired by Linear
4. ✅ Showcase full-stack development skills for portfolio

### Success Metrics for MVP
- [x] Users can create, read, update, delete tickets
- [x] Kanban board and List views functional
- [x] User authentication working (email/password)
- [x] File attachments supported (with Base64 fallback when Cloudinary is not configured)
- [x] Markdown rendering in descriptions and comments
- [x] Daily standup report generation
- [x] Fully responsive (mobile-friendly)
- [ ] Deployed and accessible via public URL
- [x] Dark/Light theme toggle working (including on login page for unauthenticated users)

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  Angular SPA    │────────▶│  Spring Boot    │────────▶│   MongoDB       │
│  (Vercel)       │  REST   │  API (Railway)  │  CRUD   │   (Atlas)       │
│                 │◀────────│                 │◀────────│                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                            │                            │
        │                            │                            │
        └───────────────────┬────────┴────────────────────────────┘
                            │
                   ┌────────▼─────────┐
                   │   Cloudinary     │
                   │ (File Storage)   │
                   └──────────────────┘
```

### Technology Stack Details

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | Angular | 17+ | UI Framework |
| | Vite | 5.x | Build Tool |
| | Tailwind CSS | 3.x | Styling |
| | Angular Material | 17+ | UI Components (optional) |
| | Marked.js | 12.x | Markdown Rendering |
| **Backend** | Java | 17+ | Programming Language |
| | Spring Boot | 3.2+ | Application Framework |
| | Spring Security | 6.x | Authentication |
| | Spring Data MongoDB | 4.x | Database Access |
| | JWT | Latest | Token-based Auth |
| **Database** | MongoDB | 7.x | NoSQL Database |
| **Hosting** | Vercel | - | Frontend Hosting |
| | Railway | - | Backend Hosting |
| | MongoDB Atlas | - | Database Hosting |
| | Cloudinary | - | File Storage |

---

## 📊 Database Schema Design

### Collections Overview

```
TaskFlow Database
├── users
├── tickets
├── comments
└── attachments
```

### Collection Schemas

#### 1. Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  avatar: String (URL, optional),
  role: String (enum: ['ADMIN', 'USER'], default: 'USER'),
  theme: String (enum: ['light', 'dark'], default: 'light'),
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}

// Indexes:
// - email (unique)
// - createdAt (descending)
```

#### 2. Tickets Collection
```javascript
{
  _id: ObjectId,
  ticketNumber: String (unique, auto-generated, e.g., "TK-0001"),
  title: String (required, max 200 chars),
  description: String (markdown, required),
  type: String (enum: ['BUG', 'FEATURE_REQUEST', 'SUPPORT_TICKET', 'TASK'], required),
  priority: String (enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], required),
  status: String (enum: ['BACKLOG', 'TO_DO', 'ACKNOWLEDGED', 'IN_PROGRESS', 
                         'FOR_CONFIRMATION', 'COMPLETED', 'DELETED'], required),
  assigneeId: ObjectId (ref: users, optional),
  reporterId: ObjectId (ref: users, required),
  dueDate: Date (optional),
  tags: Array<String> (optional),
  attachments: Array<ObjectId> (ref: attachments),
  completedAt: Date (optional),
  deletedAt: Date (optional, soft delete),
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// - ticketNumber (unique)
// - assigneeId
// - reporterId
// - status
// - type
// - priority
// - createdAt (descending)
// - dueDate (ascending)
// Compound: (status, priority, createdAt)
```

#### 3. Comments Collection
```javascript
{
  _id: ObjectId,
  ticketId: ObjectId (ref: tickets, required),
  userId: ObjectId (ref: users, required),
  content: String (markdown, required),
  attachments: Array<ObjectId> (ref: attachments),
  isEdited: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// - ticketId
// - userId
// - createdAt (descending)
```

#### 4. Attachments Collection
```javascript
{
  _id: ObjectId,
  filename: String (required),
  originalName: String (required),
  mimeType: String (required),
  size: Number (bytes, required),
  url: String (Cloudinary URL, required),
  publicId: String (Cloudinary public ID, required),
  uploadedBy: ObjectId (ref: users, required),
  ticketId: ObjectId (ref: tickets, optional),
  commentId: ObjectId (ref: comments, optional),
  createdAt: Date
}

// Indexes:
// - ticketId
// - commentId
// - uploadedBy
// - createdAt (descending)
```

---

## 🔌 API Endpoints Design

### Base URL
- **Development:** `http://localhost:8080/api/v1`
- **Production:** `https://taskflow-api.railway.app/api/v1`

### Authentication Endpoints

```
POST   /auth/register          - Register new user
POST   /auth/login             - Login user (returns JWT)
POST   /auth/logout            - Logout user
GET    /auth/me                - Get current user info
PUT    /auth/profile           - Update user profile
PUT    /auth/password          - Change password
```

#### Request/Response Examples

**POST /auth/register**
```json
// Request
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

// Response (201 Created)
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "theme": "light"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**POST /auth/login**
```json
// Request
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

// Response (200 OK)
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "theme": "light",
      "lastLogin": "2026-01-30T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Ticket Endpoints

```
GET    /tickets                - Get all tickets (with filters)
GET    /tickets/:id            - Get single ticket
POST   /tickets                - Create new ticket
PUT    /tickets/:id            - Update ticket
DELETE /tickets/:id            - Soft delete ticket
GET    /tickets/my             - Get tickets assigned to me
GET    /tickets/reported       - Get tickets reported by me
```

#### Query Parameters for GET /tickets

```
?status=TO_DO,IN_PROGRESS      - Filter by status (comma-separated)
?type=BUG,FEATURE_REQUEST      - Filter by type
?priority=CRITICAL,HIGH        - Filter by priority
?assignee=userId               - Filter by assignee
?reporter=userId               - Filter by reporter
?search=keyword                - Search in title/description
?sortBy=createdAt              - Sort field
?sortOrder=desc                - Sort order (asc/desc)
?page=1                        - Page number
?limit=20                      - Items per page
```

#### Request/Response Examples

**POST /tickets**
```json
// Request
{
  "title": "Login button not responding on mobile",
  "description": "## Issue Description\n\nWhen clicking the login button on iOS Safari...",
  "type": "BUG",
  "priority": "HIGH",
  "status": "TO_DO",
  "assigneeId": "507f1f77bcf86cd799439012",
  "dueDate": "2026-02-15T23:59:59Z",
  "tags": ["mobile", "ios", "authentication"]
}

// Response (201 Created)
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "ticketNumber": "TK-0001",
    "title": "Login button not responding on mobile",
    "description": "## Issue Description\n\nWhen clicking...",
    "type": "BUG",
    "priority": "HIGH",
    "status": "TO_DO",
    "assignee": {
      "id": "507f1f77bcf86cd799439012",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com"
    },
    "reporter": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "dueDate": "2026-02-15T23:59:59Z",
    "tags": ["mobile", "ios", "authentication"],
    "attachments": [],
    "createdAt": "2026-01-30T10:30:00Z",
    "updatedAt": "2026-01-30T10:30:00Z"
  }
}
```

**GET /tickets**
```json
// Response (200 OK)
{
  "success": true,
  "data": {
    "tickets": [
      {
        "id": "507f1f77bcf86cd799439013",
        "ticketNumber": "TK-0001",
        "title": "Login button not responding on mobile",
        "type": "BUG",
        "priority": "HIGH",
        "status": "TO_DO",
        "assignee": { /* user object */ },
        "reporter": { /* user object */ },
        "dueDate": "2026-02-15T23:59:59Z",
        "tags": ["mobile", "ios"],
        "attachmentCount": 2,
        "commentCount": 5,
        "createdAt": "2026-01-30T10:30:00Z",
        "updatedAt": "2026-01-30T15:45:00Z"
      }
      // ... more tickets
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

### Comment Endpoints

```
GET    /tickets/:ticketId/comments     - Get all comments for a ticket
POST   /tickets/:ticketId/comments     - Add comment to ticket
PUT    /comments/:id                   - Update comment
DELETE /comments/:id                   - Delete comment
```

#### Request/Response Examples

**POST /tickets/:ticketId/comments**
```json
// Request
{
  "content": "I've reproduced this issue. It seems to be related to the touch event handler..."
}

// Response (201 Created)
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "ticketId": "507f1f77bcf86cd799439013",
    "user": {
      "id": "507f1f77bcf86cd799439012",
      "firstName": "Jane",
      "lastName": "Smith",
      "avatar": "https://..."
    },
    "content": "I've reproduced this issue...",
    "attachments": [],
    "isEdited": false,
    "createdAt": "2026-01-30T11:00:00Z",
    "updatedAt": "2026-01-30T11:00:00Z"
  }
}
```

### Attachment Endpoints

```
POST   /attachments/upload             - Upload file
DELETE /attachments/:id                - Delete attachment
GET    /attachments/:id                - Get attachment info
```

#### Request/Response Examples

**POST /attachments/upload**
```json
// Request: multipart/form-data
{
  "file": <binary>,
  "ticketId": "507f1f77bcf86cd799439013" (optional),
  "commentId": "507f1f77bcf86cd799439014" (optional)
}

// Response (201 Created)
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439015",
    "filename": "screenshot_bug_20260130.png",
    "originalName": "screenshot.png",
    "mimeType": "image/png",
    "size": 245632,
    "url": "https://res.cloudinary.com/taskflow/image/upload/v1738234800/...",
    "publicId": "taskflow/attachments/abc123",
    "createdAt": "2026-01-30T11:00:00Z"
  }
}
```

### Standup Report Endpoint

```
GET    /reports/standup                - Generate daily standup report
```

#### Request/Response Example

**GET /reports/standup**
```
Query params:
?date=2026-01-30          - Date for report (default: today)
?userId=507f...           - User ID (default: current user)
```

```json
// Response (200 OK)
{
  "success": true,
  "data": {
    "date": "2026-01-30",
    "user": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "markdown": "# Daily Standup - January 30, 2026\n\n## ✅ Completed Yesterday\n- TK-0005: Fix login validation\n- TK-0012: Update API documentation\n\n## 🔄 Working On Today\n- TK-0001: Login button not responding on mobile\n- TK-0008: Implement dark mode toggle\n\n## 🚧 Blocked/Issues\n_No blockers_",
    "stats": {
      "completedYesterday": 2,
      "inProgressToday": 2,
      "blocked": 0
    }
  }
}
```

### User Management Endpoints

```
GET    /users                  - Get all users (admin only)
GET    /users/:id              - Get user by ID
PUT    /users/:id/theme        - Update user theme preference
```

---

## 🎨 UI/UX Design Specifications

### Design Principles
1. **Minimal & Clean** - Linear-inspired interface
2. **Keyboard-first** - Support power users with shortcuts
3. **Fast & Responsive** - Instant feedback, no loading spinners unless necessary
4. **Mobile-friendly** - Responsive design, touch-optimized
5. **Accessible** - WCAG 2.1 AA compliant

### Color Palette

#### Light Theme
```css
--background: #ffffff
--surface: #f8f9fa
--surface-hover: #e9ecef
--border: #dee2e6
--text-primary: #212529
--text-secondary: #6c757d
--text-tertiary: #adb5bd

--primary: #3b82f6        /* Blue */
--primary-hover: #2563eb
--success: #10b981        /* Green */
--warning: #f59e0b        /* Amber */
--danger: #ef4444         /* Red */
--info: #06b6d4           /* Cyan */
```

#### Dark Theme
```css
--background: #0d1117
--surface: #161b22
--surface-hover: #21262d
--border: #30363d
--text-primary: #e6edf3
--text-secondary: #8b949e
--text-tertiary: #6e7681

--primary: #58a6ff        /* Blue */
--primary-hover: #1f6feb
--success: #3fb950        /* Green */
--warning: #d29922        /* Amber */
--danger: #f85149         /* Red */
--info: #56d4dd           /* Cyan */
```

### Key UI Components

#### 1. Ticket Card (List View)
```
┌─────────────────────────────────────────────────────────────┐
│ TK-0001 🔴 CRITICAL                                [•••]     │
│ Login button not responding on mobile                       │
│                                                              │
│ [BUG] [mobile] [ios]                                        │
│ 👤 Jane Smith    📅 Feb 15    💬 5    📎 2                  │
└─────────────────────────────────────────────────────────────┘
```

#### 2. Ticket Card (Kanban View)
```
┌──────────────────────────┐
│ TK-0001        [•••]     │
│ 🔴 CRITICAL              │
│                          │
│ Login button not         │
│ responding on mobile     │
│                          │
│ [BUG]                    │
│ 👤 Jane Smith            │
│ 📅 Feb 15                │
└──────────────────────────┘
```

#### 3. Ticket Detail View
```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to List                                    [Edit] [•••]│
├─────────────────────────────────────────────────────────────┤
│ TK-0001  🔴 CRITICAL  [BUG]                                 │
│                                                              │
│ Login button not responding on mobile                       │
│                                                              │
│ 👤 Assigned: Jane Smith     📅 Due: Feb 15, 2026            │
│ 📊 Reporter: John Doe       ⏰ Created: Jan 30, 2026        │
│                                                              │
│ [TO_DO ▼] [CRITICAL ▼] [BUG ▼]                             │
├─────────────────────────────────────────────────────────────┤
│ ## Description                                               │
│                                                              │
│ When clicking the login button on iOS Safari, nothing       │
│ happens. This issue was reported by multiple users.         │
│                                                              │
│ ### Steps to Reproduce                                      │
│ 1. Open app on iOS Safari                                   │
│ 2. Navigate to login page                                   │
│ 3. Enter credentials                                        │
│ 4. Click login button                                       │
│                                                              │
│ ### Expected Behavior                                       │
│ User should be logged in                                    │
├─────────────────────────────────────────────────────────────┤
│ 📎 Attachments (2)                                          │
│ • screenshot_bug.png (245 KB)                               │
│ • error_log.txt (12 KB)                                     │
├─────────────────────────────────────────────────────────────┤
│ 💬 Comments (5)                                             │
│                                                              │
│ Jane Smith • 2 hours ago                                    │
│ I've reproduced this issue. It seems to be related...       │
│                                                              │
│ [Write a comment...]                    [📎] [Send]         │
└─────────────────────────────────────────────────────────────┘
```

### Page Layouts

#### 1. Dashboard (List View)
```
┌──────────────────────────────────────────────────────────────┐
│ [☰] TaskFlow               [🔍 Search...]    [+] [👤] [🌓]   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ My Tickets                                                    │
│                                                               │
│ [List] [Kanban]    Filters: [Status ▼] [Type ▼] [Priority ▼]│
│                                                               │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ TK-0001 🔴 CRITICAL                            [•••]  │   │
│ │ Login button not responding on mobile                │   │
│ │ [BUG] [mobile] [ios]                                 │   │
│ │ 👤 Jane Smith  📅 Feb 15  💬 5  📎 2                │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                               │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ TK-0002 🟡 MEDIUM                              [•••]  │   │
│ │ Add dark mode support to dashboard                   │   │
│ │ [FEATURE_REQUEST] [ui] [enhancement]                 │   │
│ │ 👤 Unassigned  📅 Feb 20  💬 2  📎 0                │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 2. Dashboard (Kanban View)
```
┌──────────────────────────────────────────────────────────────┐
│ [☰] TaskFlow               [🔍 Search...]    [+] [👤] [🌓]   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ My Tickets                                                    │
│                                                               │
│ [List] [Kanban]    Filters: [Status ▼] [Type ▼] [Priority ▼]│
│                                                               │
│ ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│ │ TO DO   │  │IN PROG. │  │FOR CONF.│  │COMPLETE │         │
│ │   (3)   │  │   (2)   │  │   (1)   │  │   (5)   │         │
│ ├─────────┤  ├─────────┤  ├─────────┤  ├─────────┤         │
│ │┌───────┐│  │┌───────┐│  │┌───────┐│  │┌───────┐│         │
│ ││TK-0001││  ││TK-0003││  ││TK-0007││  ││TK-0012││         │
│ ││🔴 CRIT││  ││🟡 MED ││  ││🟢 LOW ││  ││🟢 LOW ││         │
│ │└───────┘│  │└───────┘│  │└───────┘│  │└───────┘│         │
│ │         │  │         │  │         │  │         │         │
│ │┌───────┐│  │┌───────┐│  └─────────┘  │┌───────┐│         │
│ ││TK-0002││  ││TK-0005││              ││TK-0008││         │
│ ││🟡 MED ││  ││🟠 HIGH││              │└───────┘│         │
│ │└───────┘│  │└───────┘│              │         │         │
│ └─────────┘  └─────────┘              └─────────┘         │
└──────────────────────────────────────────────────────────────┘
```

### Keyboard Shortcuts

```
Global:
/ or Cmd+K        - Focus search
C                 - Create new ticket
Cmd+B             - Toggle sidebar
Cmd+/             - Show keyboard shortcuts
T                 - Toggle theme (light/dark)

Navigation:
G then D          - Go to Dashboard
G then M          - Go to My Tickets
G then R          - Go to Reported Tickets
J / K             - Navigate up/down in list
Enter             - Open selected ticket
Esc               - Close modal/drawer

Ticket View:
E                 - Edit ticket
A                 - Assign to me
Cmd+Enter         - Save changes
Delete            - Move to deleted
```

---

## 📅 14-Day Development Schedule

### Week 1: Foundation & Core Features

#### **Day 1-2: Project Setup & Infrastructure (8-12 hours)**

**Day 1 Morning (2-3 hours): Environment Setup**
- [x] Install required tools (if not already):
  - Node.js 18+ and npm
  - Java 17+ and Maven
  - MongoDB Community Edition
  - VS Code or IntelliJ IDEA
  - Postman (API testing)
- [x] Create GitHub repository
- [x] Setup project structure

**Day 1 Afternoon (2-3 hours): Backend Initialization**
- [x] Create Spring Boot project using Spring Initializr:
  - Dependencies: Web, Security, Data MongoDB, Lombok, Validation
- [x] Configure `application.yml` for local development
- [x] Setup MongoDB connection (local)
- [x] Create base package structure:
  ```
  com.taskflow
  ├── config
  ├── controller
  ├── model
  ├── repository
  ├── service
  ├── dto
  ├── security
  └── exception
  ```
- [x] Create global exception handler
- [x] Setup CORS configuration
- [x] Create base response wrapper

**Day 2 Morning (2-3 hours): Frontend Initialization**
- [x] Create Angular project with Vite:
  ```bash
  npm create vite@latest taskflow-frontend -- --template angular
  ```
- [x] Install dependencies:
  - Tailwind CSS
  - Angular Material (optional)
  - marked (markdown parser)
  - date-fns (date utilities)
- [x] Configure Tailwind CSS
- [x] Setup project structure:
  ```
  src/
  ├── app/
  │   ├── core/          (services, guards, interceptors)
  │   ├── shared/        (shared components, pipes, directives)
  │   ├── features/      (feature modules)
  │   └── layouts/       (layout components)
  ├── assets/
  └── styles/
  ```
- [x] Create routing structure
- [x] Setup HTTP interceptor for JWT
- [x] Create environment configurations

**Day 2 Afternoon (2-3 hours): Authentication Backend**
- [x] Create User model
- [x] Create UserRepository
- [x] Setup JWT configuration
- [x] Implement UserService (register, login, getUserInfo)
- [x] Implement AuthController (endpoints)
- [x] Add password encryption (BCrypt)
- [x] Test authentication endpoints with Postman

**Deliverables Day 1-2:**
- ✅ Project repositories created
- ✅ Backend running on localhost:8080
- ✅ Frontend running on localhost:5173
- ✅ Authentication API working
- ✅ MongoDB connected

---

#### **Day 3-4: Authentication UI & User Management (8-12 hours)**

**Day 3 Morning (2-3 hours): Auth Service & Guards**
- [x] Create AuthService in Angular
- [x] Implement JWT token storage (localStorage)
- [x] Create AuthGuard for protected routes
- [x] Create AuthInterceptor for adding JWT to requests
- [x] Create UserService for user management

**Day 3 Afternoon (2-3 hours): Login & Register Pages**
- [x] Create Login component
- [x] Create Register component
- [x] Add form validation
- [x] Add error handling and display
- [x] Style with Tailwind (minimal design)
- [x] Add loading states

**Day 4 Morning (2-3 hours): User Profile & Theme Toggle**
- [x] Create ProfileComponent
- [x] Implement profile update form
- [x] Create ThemeService
- [x] Implement theme toggle (light/dark)
- [x] Save theme preference to backend
- [x] Apply theme across app
- [x] **Added:** Profile picture upload with avatar overlay UI
- [x] **Added:** Dedicated `/auth/avatar` backend endpoint with Base64 fallback
- [x] **Added:** Dark/light mode toggle on login page (for unauthenticated users)

**Day 4 Afternoon (2-3 hours): Layout Components**
- [x] Create AppShellComponent (main layout)
- [x] Create HeaderComponent (with search, create button, profile menu)
- [x] Create SidebarComponent (navigation)
- [x] Implement responsive behavior
- [x] Add keyboard shortcuts modal

**Deliverables Day 3-4:**
- ✅ Users can register and login
- ✅ JWT authentication working end-to-end
- ✅ Profile page functional
- ✅ Theme toggle working (light/dark)
- ✅ Basic app layout complete

---

#### **Day 5-6: Ticket Management Backend (8-12 hours)**

**Day 5 Morning (2-3 hours): Ticket Model & Repository**
- [x] Create Ticket model with all fields
- [x] Create TicketRepository with custom queries
- [x] Add indexes for performance
- [x] Implement ticket number auto-generation
- [x] Create TicketDTO classes (request/response)

**Day 5 Afternoon (2-3 hours): Ticket Service Layer**
- [x] Implement TicketService:
  - createTicket
  - updateTicket (partial updates for all fields)
  - deleteTicket (soft delete)
  - getTicketById
  - getAllTickets (with filters)
  - getMyTickets
  - getReportedTickets
- [x] Add validation logic
- [x] Add business rules (status transitions)
- [x] Handle exceptions

**Day 6 Morning (2-3 hours): Ticket Controller**
- [x] Create TicketController with all endpoints
- [x] Add request validation
- [x] Add pagination support
- [x] Add filtering and sorting
- [x] Add search functionality
- [x] Test all endpoints with Postman

**Day 6 Afternoon (2-3 hours): Comment System Backend**
- [x] Create Comment model
- [x] Create CommentRepository
- [x] Create CommentService
- [x] Create CommentController
- [x] Add endpoints for comments
- [x] Test comment functionality

**Deliverables Day 5-6:**
- ✅ Complete Ticket CRUD API
- ✅ Filtering, sorting, pagination working
- ✅ Comment system API complete
- ✅ All endpoints tested

---

#### **Day 7: Ticket List View & Filters (4-6 hours)**

**Morning (2-3 hours): Ticket Service & State Management**
- [x] Create TicketService in Angular
- [x] Implement API calls for tickets
- [x] Create state management (simple service-based state with Angular Signals)
- [x] Add loading and error states

**Afternoon (2-3 hours): Ticket List Component**
- [x] Create TicketListComponent
- [x] Create TicketCardComponent (list item)
- [x] Implement ticket fetching
- [x] Add filters (status, type, priority)
- [x] Add search functionality
- [x] Add pagination
- [x] Style components

**Deliverables Day 7:**
- ✅ Ticket list view working
- ✅ Filters and search functional
- ✅ Pagination working
- ✅ Loading states implemented

---

### Week 2: Advanced Features & Deployment

#### **Day 8: Kanban Board View (4-6 hours)**

**Morning (2-3 hours): Kanban Board Component**
- [x] Create KanbanBoardComponent
- [x] Create KanbanColumnComponent
- [x] Create KanbanCardComponent
- [x] Implement drag-and-drop functionality
- [x] Group tickets by status

**Afternoon (2-3 hours): Drag & Drop Logic**
- [x] Implement card dragging
- [x] Update ticket status on drop
- [x] Add visual feedback during drag
- [x] Handle errors gracefully
- [x] Add animations

**Deliverables Day 8:**
- ✅ Kanban board view complete
- ✅ Drag and drop working
- ✅ Status updates on drop
- ✅ Smooth animations

---

#### **Day 9-10: Ticket Detail View & Creation (8-12 hours)**

**Day 9 Morning (2-3 hours): Ticket Detail View**
- [x] Create TicketDetailComponent
- [x] Fetch and display ticket data
- [x] Render markdown description
- [x] Display assignee, reporter, dates
- [x] Add status/priority/type selectors
- [x] Style the detail view (restyled with Material Icons Round, colored property grid, card-based layout)

**Day 9 Afternoon (2-3 hours): Ticket Edit Mode**
- [x] Add edit mode toggle
- [x] Create editable form
- [x] Implement inline editing (title click-to-edit, description edit with save/cancel, tags editing, due date picker)
- [x] Add save/cancel actions
- [x] Handle validation
- [x] **Added:** Extracted inline template/styles to separate .html/.css files

**Day 10 Morning (2-3 hours): Create Ticket Modal**
- [x] Create TicketCreateComponent (modal)
- [x] Build ticket creation form
- [x] Add validation
- [x] Implement markdown editor
- [x] Add type/priority/status selectors
- [x] Add assignee dropdown (user search)
- [x] **Added:** Restyled with Tailwind dark mode, Material Icons, pink accent, colored label dots
- [x] **Added:** Extracted inline template/styles to separate .html/.css files

**Day 10 Afternoon (2-3 hours): Comment Section**
- [x] Create CommentListComponent
- [x] Create CommentFormComponent
- [x] Implement comment posting
- [x] Implement comment editing/deleting
- [x] Render markdown in comments
- [x] Add optimistic updates

**Deliverables Day 9-10:**
- ✅ Ticket detail view complete
- ✅ Ticket creation working
- ✅ Ticket editing functional
- ✅ Comments system working
- ✅ Markdown rendering perfect

---

#### **Day 11: File Attachments (4-6 hours)**

**Morning (2-3 hours): File Upload Backend**
- [x] Setup Cloudinary account (free tier)
- [x] Add Cloudinary dependency to Spring Boot
- [x] Create AttachmentModel
- [x] Create AttachmentService (upload, delete) — with Base64 data URL fallback when Cloudinary is not configured
- [x] Create AttachmentController
- [x] Test file upload with Postman

**Afternoon (2-3 hours): File Upload Frontend**
- [x] Create FileUploadComponent
- [x] Add drag-and-drop zone
- [x] Implement file upload to backend
- [x] Display uploaded files
- [x] Add file preview for images
- [x] Add delete functionality
- [x] Handle large files and errors

**Deliverables Day 11:**
- ✅ File upload working
- ✅ Files stored in Cloudinary
- ✅ File preview and download
- ✅ Delete functionality

---

#### **Day 12: Daily Standup Report & Polish (4-6 hours)**

**Morning (2-3 hours): Standup Report Backend**
- [x] Create ReportController
- [x] Implement standup report generation logic
- [x] Query tickets completed yesterday
- [x] Query tickets in progress today
- [x] Generate markdown report
- [x] Add endpoint

**Afternoon (2-3 hours): Standup Report UI**
- [x] Create StandupReportComponent
- [x] Add "Generate Report" button
- [x] Display markdown report
- [x] Add copy-to-clipboard functionality
- [x] Add date selector
- [x] Style the report view

**Deliverables Day 12:**
- ✅ Standup report generation working
- ✅ Markdown report formatted nicely
- ✅ Copy-to-clipboard functional

---

#### **Day 13: Responsive Design & Testing (4-6 hours)**

**Morning (2-3 hours): Mobile Responsiveness**
- [ ] Test all pages on mobile viewport
- [ ] Fix layout issues
- [ ] Optimize touch targets
- [x] Add mobile menu (sidebar collapses on mobile)
- [ ] Test tablet viewport
- [ ] Fix any responsive bugs

**Afternoon (2-3 hours): Cross-browser Testing & Bug Fixes**
- [ ] Test on Chrome, Firefox, Safari
- [ ] Fix any browser-specific issues
- [ ] Test authentication flow end-to-end
- [ ] Test ticket creation flow
- [ ] Test file uploads
- [ ] Fix critical bugs

**Deliverables Day 13:**
- ✅ Fully responsive on mobile and tablet
- ✅ Works on all major browsers
- ✅ Critical bugs fixed
- ✅ Smooth user experience

---

#### **Day 14: Deployment & Final Polish (4-6 hours)**

**Morning (2-3 hours): Backend Deployment to Railway**
- [ ] Create Railway account
- [ ] Create new project
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Setup MongoDB Atlas connection string
- [ ] Deploy backend
- [ ] Test API endpoints on production URL

**Afternoon (2-3 hours): Frontend Deployment to Vercel**
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Configure build settings
- [ ] Add environment variables (API URL)
- [ ] Deploy frontend
- [ ] Test full application flow
- [ ] Fix any production issues

**Final Hour: Documentation & Demo Prep**
- [ ] Create README.md with:
  - Project description
  - Features list
  - Tech stack
  - Setup instructions
  - Live demo link
  - Screenshots
- [ ] Record a short demo video (optional)
- [ ] Test the live app one final time

**Deliverables Day 14:**
- ✅ Backend deployed on Railway
- ✅ Frontend deployed on Vercel
- ✅ Database on MongoDB Atlas
- ✅ Complete README documentation
- ✅ Live, working demo

---

## 🔐 Security Considerations

### Authentication & Authorization

1. **Password Security**
   - Use BCrypt for password hashing (strength: 12)
   - Enforce minimum password requirements:
     - At least 8 characters
     - At least 1 uppercase letter
     - At least 1 lowercase letter
     - At least 1 number
     - At least 1 special character

2. **JWT Tokens**
   - Use HS256 algorithm
   - Token expiration: 24 hours
   - Store securely in localStorage (or httpOnly cookies for production)
   - Include user ID and role in payload
   - Refresh token mechanism (optional for MVP)

3. **API Security**
   - CORS configuration (whitelist frontend domain)
   - Rate limiting (Spring Security)
   - Input validation on all endpoints
   - SQL/NoSQL injection prevention
   - XSS prevention

4. **File Upload Security**
   - Validate file types (whitelist)
   - Limit file size (max 10MB)
   - Scan for malicious content (optional)
   - Use Cloudinary's security features

---

## 🧪 Testing Strategy

### Backend Testing

**Unit Tests** (Optional for MVP, but recommended)
```java
@Test
void shouldCreateTicket() {
    // Given
    TicketDTO ticketDTO = new TicketDTO();
    ticketDTO.setTitle("Test ticket");
    // ... set other fields
    
    // When
    Ticket created = ticketService.createTicket(ticketDTO, userId);
    
    // Then
    assertNotNull(created.getId());
    assertEquals("Test ticket", created.getTitle());
}
```

**Integration Tests** (Postman Collection)
Create a Postman collection with:
- [x] Register user
- [x] Login user
- [x] Create ticket
- [x] Get all tickets
- [x] Update ticket
- [x] Delete ticket
- [x] Add comment
- [x] Upload file
- [x] Generate standup report

### Frontend Testing

**Manual Testing Checklist**
- [x] User registration flow
- [x] User login flow
- [x] Create ticket
- [x] Edit ticket (inline editing: title, description, tags, due date, status, priority, type, assignee)
- [x] Delete ticket
- [x] View ticket details
- [x] Add comment
- [x] Upload file
- [x] Switch between list and kanban views
- [x] Filter tickets by status/type/priority
- [x] Search tickets
- [x] Toggle theme
- [x] Generate standup report
- [ ] Mobile responsiveness (needs full testing)
- [x] Keyboard shortcuts

**End-to-End Testing** (Optional)
Use Playwright or Cypress for automated E2E tests (post-MVP)

---

## 🚀 Deployment Guide

### Prerequisites
- [ ] GitHub account
- [ ] Vercel account
- [ ] Railway account
- [x] MongoDB Atlas account (or local MongoDB configured)
- [x] Cloudinary account (optional — Base64 fallback works without it)

### Step 1: MongoDB Atlas Setup

1. **Create Account & Cluster**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account
   - Create a new cluster (M0 Free tier)
   - Choose region (closest to Railway data center)
   - Wait for cluster creation (3-5 minutes)

2. **Configure Database Access**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and strong password
   - Grant "Read and write to any database" role
   - Click "Add User"

3. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
     - Note: For production, whitelist specific IPs
   - Click "Confirm"

4. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your credentials

### Step 2: Cloudinary Setup

1. **Create Account**
   - Go to https://cloudinary.com/
   - Sign up for free account

2. **Get Credentials**
   - Go to Dashboard
   - Copy these values:
     - Cloud Name
     - API Key
     - API Secret

### Step 3: Backend Deployment (Railway)

1. **Prepare Backend**
   - Ensure your `application.yml` uses environment variables:
   ```yaml
   spring:
     data:
       mongodb:
         uri: ${MONGODB_URI}
   
   jwt:
     secret: ${JWT_SECRET}
   
   cloudinary:
     cloud-name: ${CLOUDINARY_CLOUD_NAME}
     api-key: ${CLOUDINARY_API_KEY}
     api-secret: ${CLOUDINARY_API_SECRET}
   ```

2. **Create Railway Project**
   - Go to https://railway.app/
   - Sign in with GitHub
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your backend repository
   - Click "Deploy Now"

3. **Configure Environment Variables**
   - Go to your Railway project
   - Click on your service
   - Go to "Variables" tab
   - Add these variables:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/taskflow
     JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
     CLOUDINARY_CLOUD_NAME=your-cloud-name
     CLOUDINARY_API_KEY=your-api-key
     CLOUDINARY_API_SECRET=your-api-secret
     PORT=8080
     ```

4. **Deploy**
   - Railway will automatically build and deploy
   - Wait for deployment to complete
   - Copy the public URL (e.g., `https://taskflow-backend.railway.app`)

5. **Test Backend**
   - Test health endpoint: `https://your-app.railway.app/api/v1/health`
   - Test with Postman

### Step 4: Frontend Deployment (Vercel)

1. **Prepare Frontend**
   - Update environment file (`src/environments/environment.prod.ts`):
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://taskflow-backend.railway.app/api/v1'
   };
   ```

   - Ensure API URL is configurable
   - Update `angular.json` for production build

2. **Create Vercel Project**
   - Go to https://vercel.com/
   - Sign in with GitHub
   - Click "Add New" → "Project"
   - Import your frontend repository
   - Configure project:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://taskflow-backend.railway.app/api/v1
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build and deployment
   - Copy the production URL (e.g., `https://taskflow.vercel.app`)

5. **Update CORS in Backend**
   - Go back to Railway
   - Update CORS configuration to allow your Vercel domain
   - In your Spring Boot CORS config:
   ```java
   @Bean
   public WebMvcConfigurer corsConfigurer() {
       return new WebMvcConfigurer() {
           @Override
           public void addCorsMappings(CorsRegistry registry) {
               registry.addMapping("/api/**")
                   .allowedOrigins(
                       "http://localhost:5173",
                       "https://taskflow.vercel.app"  // Add your Vercel URL
                   )
                   .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                   .allowedHeaders("*")
                   .allowCredentials(true);
           }
       };
   }
   ```
   - Redeploy backend

### Step 5: Final Testing

1. **Test Full Flow**
   - [ ] Visit your Vercel URL
   - [ ] Register a new account
   - [ ] Login
   - [ ] Create a ticket
   - [ ] Upload a file
   - [ ] Add a comment
   - [ ] Switch views (list/kanban)
   - [ ] Generate standup report
   - [ ] Toggle theme
   - [ ] Test on mobile device

2. **Performance Check**
   - Test page load times
   - Check API response times
   - Verify images load from Cloudinary

3. **Monitor & Debug**
   - Check Railway logs for errors
   - Check Vercel deployment logs
   - Monitor MongoDB Atlas metrics

---

## 📊 Project Structure

### Backend Structure
```
taskflow-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── taskflow/
│   │   │           ├── TaskflowApplication.java
│   │   │           ├── config/
│   │   │           │   ├── SecurityConfig.java
│   │   │           │   ├── JwtConfig.java
│   │   │           │   ├── MongoConfig.java
│   │   │           │   ├── CloudinaryConfig.java
│   │   │           │   └── CorsConfig.java
│   │   │           ├── controller/
│   │   │           │   ├── AuthController.java
│   │   │           │   ├── UserController.java
│   │   │           │   ├── TicketController.java
│   │   │           │   ├── CommentController.java
│   │   │           │   ├── AttachmentController.java
│   │   │           │   └── ReportController.java
│   │   │           ├── dto/
│   │   │           │   ├── request/
│   │   │           │   │   ├── LoginRequest.java
│   │   │           │   │   ├── RegisterRequest.java
│   │   │           │   │   ├── TicketRequest.java
│   │   │           │   │   └── CommentRequest.java
│   │   │           │   └── response/
│   │   │           │       ├── AuthResponse.java
│   │   │           │       ├── TicketResponse.java
│   │   │           │       ├── CommentResponse.java
│   │   │           │       └── ApiResponse.java
│   │   │           ├── exception/
│   │   │           │   ├── GlobalExceptionHandler.java
│   │   │           │   ├── ResourceNotFoundException.java
│   │   │           │   ├── UnauthorizedException.java
│   │   │           │   └── ValidationException.java
│   │   │           ├── model/
│   │   │           │   ├── User.java
│   │   │           │   ├── Ticket.java
│   │   │           │   ├── Comment.java
│   │   │           │   └── Attachment.java
│   │   │           ├── repository/
│   │   │           │   ├── UserRepository.java
│   │   │           │   ├── TicketRepository.java
│   │   │           │   ├── CommentRepository.java
│   │   │           │   └── AttachmentRepository.java
│   │   │           ├── security/
│   │   │           │   ├── JwtTokenProvider.java
│   │   │           │   ├── JwtAuthenticationFilter.java
│   │   │           │   └── CustomUserDetailsService.java
│   │   │           └── service/
│   │   │               ├── AuthService.java
│   │   │               ├── UserService.java
│   │   │               ├── TicketService.java
│   │   │               ├── CommentService.java
│   │   │               ├── AttachmentService.java
│   │   │               └── ReportService.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── application-prod.yml
│   └── test/
│       └── java/
│           └── com/
│               └── taskflow/
│                   └── (test classes)
├── .gitignore
├── pom.xml (or build.gradle)
└── README.md
```

### Frontend Structure
```
taskflow-frontend/
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.routes.ts
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   └── error.interceptor.ts
│   │   │   ├── models/
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── ticket.model.ts
│   │   │   │   ├── comment.model.ts
│   │   │   │   └── attachment.model.ts
│   │   │   └── services/
│   │   │       ├── auth.service.ts
│   │   │       ├── user.service.ts
│   │   │       ├── ticket.service.ts
│   │   │       ├── comment.service.ts
│   │   │       ├── attachment.service.ts
│   │   │       ├── theme.service.ts
│   │   │       └── report.service.ts
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── login.component.ts
│   │   │   │   └── register/
│   │   │   │       └── register.component.ts
│   │   │   ├── tickets/
│   │   │   │   ├── ticket-list/
│   │   │   │   │   └── ticket-list.component.ts
│   │   │   │   ├── ticket-board/
│   │   │   │   │   └── ticket-board.component.ts
│   │   │   │   ├── ticket-detail/
│   │   │   │   │   └── ticket-detail.component.ts
│   │   │   │   └── ticket-create/
│   │   │   │       └── ticket-create.component.ts
│   │   │   ├── profile/
│   │   │   │   └── profile.component.ts
│   │   │   └── reports/
│   │   │       └── standup-report.component.ts
│   │   ├── layouts/
│   │   │   ├── app-shell/
│   │   │   │   └── app-shell.component.ts
│   │   │   ├── header/
│   │   │   │   └── header.component.ts
│   │   │   └── sidebar/
│   │   │       └── sidebar.component.ts
│   │   └── shared/
│   │       ├── components/
│   │       │   ├── ticket-card/
│   │       │   │   └── ticket-card.component.ts
│   │       │   ├── comment-list/
│   │       │   │   └── comment-list.component.ts
│   │       │   ├── markdown-editor/
│   │       │   │   └── markdown-editor.component.ts
│   │       │   ├── file-upload/
│   │       │   │   └── file-upload.component.ts
│   │       │   └── loader/
│   │       │       └── loader.component.ts
│   │       ├── pipes/
│   │       │   ├── markdown.pipe.ts
│   │       │   └── date-format.pipe.ts
│   │       └── directives/
│   │           └── auto-focus.directive.ts
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   └── styles/
│       ├── styles.css
│       ├── themes/
│       │   ├── light-theme.css
│       │   └── dark-theme.css
│       └── utilities/
│           └── animations.css
├── .gitignore
├── angular.json
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔄 Git Workflow

### Branch Strategy
```
main (production)
└── develop (development)
    ├── feature/auth
    ├── feature/tickets
    ├── feature/comments
    ├── feature/attachments
    └── feature/reports
```

### Commit Message Convention
```
feat: Add ticket creation functionality
fix: Resolve login redirect issue
style: Update button colors for dark theme
refactor: Simplify ticket service logic
docs: Update README with deployment steps
test: Add unit tests for ticket service
chore: Update dependencies
```

### Daily Workflow
```bash
# Start of day
git checkout develop
git pull origin develop
git checkout -b feature/your-feature

# Work on feature
git add .
git commit -m "feat: your change description"

# End of day
git push origin feature/your-feature

# When feature is complete
# Create Pull Request on GitHub
# Merge to develop
# Delete feature branch
```

---

## 📈 Post-MVP Roadmap (Phase 2 & Beyond)

### Phase 2: Enhanced Features (Weeks 3-4)
1. **Google OAuth Integration**
   - Social login with Google
   - Simplify onboarding

2. **Email Notifications**
   - Ticket assignment notifications
   - Comment notifications
   - Due date reminders

3. **Advanced Filters**
   - Custom filter combinations
   - Save filter presets
   - Advanced search with operators

4. **User Mentions**
   - @mention users in comments
   - Mention notifications

5. **Ticket Relationships**
   - Link related tickets
   - Block/depends-on relationships
   - Subtasks

### Phase 3: Team Features (Weeks 5-6)
1. **Workspaces/Teams**
   - Multiple workspaces per user
   - Team-based access control
   - Workspace settings

2. **Labels & Categories**
   - Custom labels
   - Color coding
   - Label management

3. **Activity Feed**
   - Real-time updates
   - Activity timeline per ticket
   - User activity log

### Phase 4: Analytics & Reporting (Weeks 7-8)
1. **Dashboard Analytics**
   - Ticket statistics
   - Charts and graphs
   - Performance metrics

2. **Custom Reports**
   - Report builder
   - Export to CSV/PDF
   - Scheduled reports

3. **Time Tracking**
   - Log time on tickets
   - Time estimates
   - Burndown charts

### Phase 5: Advanced Features (Weeks 9-12)
1. **Real-time Collaboration**
   - WebSocket integration
   - Live cursors
   - Instant updates

2. **Automation Rules**
   - Auto-assign based on rules
   - Status transitions
   - SLA management

3. **Integration APIs**
   - GitHub integration
   - Slack integration
   - Webhook support

4. **Mobile Apps**
   - iOS app
   - Android app
   - Push notifications

---

## 💡 Tips for Success

### Development Best Practices
1. **Code Quality**
   - Write clean, readable code
   - Follow naming conventions
   - Add comments for complex logic
   - Use TypeScript types properly

2. **Version Control**
   - Commit frequently (every few hours)
   - Write meaningful commit messages
   - Keep commits focused and small

3. **Testing**
   - Test as you build, don't leave it for the end
   - Test on different browsers
   - Test on mobile devices

4. **Time Management**
   - Start with the hardest parts first
   - Take breaks every 2 hours
   - Don't skip sleep!
   - If stuck, move on and come back later

### Troubleshooting Common Issues

**Issue: CORS errors**
```
Solution: 
- Check CORS configuration in Spring Boot
- Verify frontend URL is whitelisted
- Check if credentials are being sent
```

**Issue: JWT token not being sent**
```
Solution:
- Check interceptor is registered
- Verify token is in localStorage
- Check Authorization header format: "Bearer <token>"
```

**Issue: MongoDB connection fails**
```
Solution:
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas
- Ensure username/password are correct
```

**Issue: File upload fails**
```
Solution:
- Check Cloudinary credentials
- Verify file size is under limit
- Check CORS on Cloudinary side
```

**Issue: Deployment fails**
```
Solution:
- Check build logs for errors
- Verify all environment variables are set
- Ensure dependencies are correctly listed
```

### Resources

**Documentation**
- [Angular Docs](https://angular.dev/)
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)

**Learning Resources**
- [Angular University](https://angular-university.io/)
- [Baeldung - Spring Boot](https://www.baeldung.com/spring-boot)
- [MongoDB University](https://university.mongodb.com/)

**Community**
- Stack Overflow
- Reddit r/angular
- Reddit r/SpringBoot
- Discord - Angular Community
- Discord - Spring Boot Community

---

## 📝 Final Checklist

### Before Deployment
- [x] All core features working locally
- [ ] No console errors
- [ ] Responsive on mobile
- [x] Dark theme working
- [x] All API endpoints tested
- [x] Error handling implemented
- [x] Loading states added
- [x] Form validations working

### Deployment
- [ ] MongoDB Atlas setup complete
- [ ] Cloudinary setup complete
- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] SSL working (HTTPS)

### Documentation
- [ ] README.md complete
- [ ] API documentation (optional)
- [ ] Setup instructions clear
- [ ] Screenshots added
- [ ] Live demo link included

### Demo Preparation
- [ ] Create demo account
- [ ] Add sample data
- [ ] Test full user flow
- [ ] Prepare talking points
- [ ] Record demo video (optional)

---

## 🎉 Conclusion

You now have a complete, actionable plan to build TaskFlow in 14 days. This plan is designed for a developer with intermediate skills working 4-6 hours per day.

**Key Success Factors:**
1. ⏰ **Stay disciplined** with the schedule
2. 🎯 **Focus on MVP features** first
3. 🐛 **Test continuously**, don't wait until the end
4. 💪 **Don't give up** when facing challenges
5. 🚀 **Ship it!** A deployed MVP is better than a perfect plan

Remember: This is a portfolio project. It doesn't have to be perfect. Focus on:
- ✅ Clean, working code
- ✅ Good UX/UI
- ✅ Deployed and accessible
- ✅ Demonstrates your full-stack skills

**You've got this! 🚀**

Good luck with your project, and remember to have fun building it!

---

## 📞 Support & Questions

If you need clarification on any part of this plan:
1. Re-read the relevant section carefully
2. Check the official documentation links
3. Search on Stack Overflow
4. Ask in developer communities

**Project maintained by:** David Polo Abrugena

---

*Last Updated: February 1, 2026*

---

## 📊 Progress Summary

### Completed Features
- [x] User authentication (register, login, JWT)
- [x] User profile management (name, password, avatar upload)
- [x] Dark/light theme toggle (app-wide + login page)
- [x] Ticket CRUD (create, read, update, delete with soft-delete)
- [x] Ticket list view with filters, search, pagination
- [x] Kanban board view with drag-and-drop
- [x] Ticket detail view with inline editing (title, description, tags, due date, status, priority, type, assignee)
- [x] Ticket create modal (restyled with Tailwind dark mode + Material Icons)
- [x] Comment system (add, edit, delete with markdown)
- [x] File attachments (Cloudinary + Base64 fallback)
- [x] Daily standup report generation
- [x] Keyboard shortcuts
- [x] Component restructuring (ticket-create and ticket-detail extracted to separate .html/.css/.ts files)
- [x] Material Icons (Outlined + Round) integrated

### Remaining Tasks
- [ ] Full mobile responsiveness testing
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Production deployment (Vercel + Railway + MongoDB Atlas)
- [ ] README documentation with screenshots
- [ ] Console error cleanup
