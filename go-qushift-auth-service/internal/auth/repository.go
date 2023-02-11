package auth

import (
	"context"
	"go-qushift-auth-service/internal/models"
)

type UserRepository interface {
	CreateUser(ctx context.Context, user *models.User) error
	GetUserByUsername(ctx context.Context, username string) (*models.User, error)
	GetUserById(ctx context.Context, userId string) (*models.User, error)
}
