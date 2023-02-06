package users

import (
	"context"
	"go-qushift-auth-be/internal/models"
)

type UserRepository interface {
	CreateUser(ctx context.Context, user *models.User) error
	GetUserByUsername(ctx context.Context, username string) (*models.User, error)
	GetUserById(ctx context.Context, userId string) (*models.User, error)
}
