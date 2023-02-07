package auth

import (
	"context"
	"github.com/gin-gonic/gin"
	"go-qushift-auth-be/internal/dto"
)

type Service interface {
	SignUp(ctx context.Context, userDto *dto.UserDto) error
	SignIn(ctx context.Context, username, password string) (string, error)
	ParseToken(ctx context.Context, accessToken string) (string, error)
	VerifyToken(ctx context.Context, c *gin.Context) error
}
