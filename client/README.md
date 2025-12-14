# Kotakodelab Full-Stack / Frontend homework (TypeScript, REST API)

## Requirements

- [Node.js 16.14.2](https://nodejs.org) or later
- [Yarn 1.22.17](https://classic.yarnpkg.com) or later

## Configuration

Copy file `.env.example` to `.env`

```bash
cp .env.example .env
```

| Key                      | Description                       | Required | Type     |
|--------------------------|-----------------------------------|----------|----------|
| `APP_NAME`               | App Name                          | **✓**    | `string` |
| `APP_VERSION`            | App Version                       |          | `string` |
| `APP_BUILD_SIGNATURE`    | App Build Signature               |          | `string` |
|                          |                                   |          |          |
| `API_BASE_URL`           | API Base URL                      | **✓**    | `string` |
|                          |                                   |          |          |
| `MOCK_API_BASE_URL`      | Mock API Base URL                 |          | `string` |
| `MOCK_API_CLIENT_ID`     | Mock API Credential Client ID     |          | `string` |
| `MOCK_API_CLIENT_SECRET` | Mock API Credential Client Secret |          | `string` |

## Installation

```bash
yarn install --frozen-lockfile
```

> Why use `--frozen-lockfile`?
>
> See https://classic.yarnpkg.com/en/docs/cli/install#toc-yarn-install-frozen-lockfile

## Usage

- Start Application
  ```bash
  yarn dev
  ```
- Build Application
  ```bash
  yarn build
  ```
- Check `package.json` to see more script.

## Requirements Checklist
- [x] Staff should be able to login
- [x] Staff should be able to logout
- [x] Staff should be able to see another staff
- [x] Staff should be able to update the staff data
- [x] Staff should not be able to update another staff data
- [x] Staff should be able to clock in
- [x] Staff should be able to clock out

## Setup Instructions

### Prerequisites

Ensure the backend API is running first (see `../api/README.md`)

### Environment Configuration

Create `.env` file:

```bash
cp .env.example .env
```

Update `.env` with:

```env
# Application
APP_NAME=HRIS System

# API Configuration
API_BASE_URL=http://localhost:8080/api
```

**Note:** Remove `NEXT_PUBLIC_` prefix - the code uses plain variable names.

### Install and Run

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Application will start on http://localhost:3009
```

### Build for Production

```bash
yarn build
```

## Features

- **Login** - `/login` - Staff authentication
- **Home** - `/` - Dashboard with navigation
- **Attendance** - `/attendance` - Clock in/out functionality
- **History** - `/attendance/history` - View attendance records
- **Staff Directory** - `/staffs` - View all staff members
- **Profile** - `/profile` - Edit own profile

## Testing the Application

1. **Login**: Use credentials created via backend API
2. **Clock In**: Navigate to Attendance and click "Clock In"
3. **View History**: See your attendance records
4. **Clock Out**: Return to attendance and click "Clock Out"
5. **Staff Directory**: View other staff members
6. **Profile**: Update your information
7. **Logout**: Log out from home page