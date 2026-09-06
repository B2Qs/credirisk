# CrediRisk — MVP de Consulta de Riesgo Financiero

MVP para evaluar el score crediticio de personas o empresas según su RUT, con control de acceso basado en roles (JWT + RBAC).

## Stack
- Backend: Node.js + TypeScript + Express
- Frontend: React + TypeScript + Vite
- Monorepo: Yarn Workspaces

## Cómo correr el proyecto
```bash
yarn install
cp apps/api/.env.example apps/api/.env
yarn dev:api   # http://localhost:4000
yarn dev:web   # http://localhost:5173
```

## Usuarios de prueba
| Rol   | Usuario | Password    | RUT en token |
|-------|---------|-------------|--------------|
| admin | admin   | password123 | (no aplica)  |
| user  | user    | password123 | 22.222.222-2 |

## Endpoints
- `POST /login` — retorna JWT (payload incluye `rut` solo si `role === 'user'`)
- `GET /score/:rut` — protegido, requiere JWT válido + autorización por rol

## Autorización
- `admin`: puede consultar cualquier RUT
- `user`: solo puede consultar el RUT de su propio token (403 si intenta otro)

## Scope del MVP
- Sin base de datos (usuarios mock en memoria)
- Sin refresh tokens
- Auditoría básica por consola con RUT enmascarado
