FRONTEND_DIR = ./web
BACKEND_DIR = .

.PHONY: all frontend-install build-frontend start-frontend start-backend

all: build-frontend start-backend

frontend-install:
	@echo "Installing frontend dependencies..."
	@cd $(FRONTEND_DIR) && bun install

build-frontend:
	@echo "Building frontend..."
	@cd $(FRONTEND_DIR) && bun install && DISABLE_ESLINT_PLUGIN='true' VITE_REACT_APP_VERSION=$$(cat ../VERSION) bun run build

start-frontend:
	@echo "Starting frontend dev server..."
	@cd $(FRONTEND_DIR) && VITE_REACT_APP_VERSION=$$(cat ../VERSION) bun run dev

start-backend:
	@echo "Starting backend dev server..."
	@cd $(BACKEND_DIR) && go run main.go &
