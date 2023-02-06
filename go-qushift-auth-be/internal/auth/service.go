package auth

import (
	"context"
	"go-qushift-auth-be/internal/dto"
)

type Service interface {
	SignUp(ctx context.Context, username, password string) (*dto.UserDto, error)
	SignIn(ctx context.Context, username, password string) (string, error)
	ParseToken(ctx context.Context, accessToken string) (string, error)
}
