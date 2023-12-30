# ==============================================================================
# Go migrate postgresql

force:
	migrate -database postgres://postgres:postgrespw@localhost:5432/auth?sslmode=disable -path migrations force 1

version:
	migrate -database postgres://postgres:postgrespw@localhost:5432/auth?sslmode=disable -path migrations version

migrate_up:
	migrate -database postgres://postgres:postgrespw@localhost:5432/auth?sslmode=disable -path migrations up 1

migrate_down:
	migrate -database postgres://postgres:postgrespw@localhost:5432/auth?sslmode=disable -path migrations down 1