# Full stack todo app
A full stack todo app built as a refresher for web app development. Also as a way for me to learn backend development.

## Stack
The stack is comprised of the following components
- Backend: Go
    - Echo
- Frontend: Next.js
    - shadcn/ui

## Running
To run the production build, run `docker compose up` with `compose-prod.yaml`
```sh
docker compose -f compose-prod.yml up
```

## Building
Use `docker-compose` to build the app
```sh
docker compose up --build
```

## Building for development
### Frontend
cd into `frontend` and use bun
```sh
bun install
bun run dev
```

### Backend
cd into `backend` and use `air`
```sh
go install github.com/cosmtrek/air@latest
air
```
