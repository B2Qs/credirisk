.PHONY: install dev clean

install:
	yarn install

## Lanza backend y frontend juntos; Ctrl+C mata ambos procesos
dev:
	@trap 'kill 0' SIGINT; \
	yarn dev:api & \
	yarn dev:web & \
	wait

clean:
	rm -rf node_modules apps/*/node_modules packages/*/node_modules apps/web/node_modules/.vite
	yarn install
