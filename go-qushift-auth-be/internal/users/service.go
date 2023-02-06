package users

import (
	"context"
	"github.com/gin-gonic/gin"
	"go-qushift-auth-be/internal/dto"
)

type Service interface {
	GetUser(ctx context.Context, c *gin.Context, username string) (*dto.UserDto, error)
}
