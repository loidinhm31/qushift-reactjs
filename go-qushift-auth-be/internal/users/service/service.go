package service

import (
	"context"
	"github.com/gin-gonic/gin"
	"go-qushift-auth-be/internal/auth"
	"go-qushift-auth-be/internal/dto"
	"go-qushift-auth-be/internal/errors"
	"go-qushift-auth-be/internal/middlewares"
	"go-qushift-auth-be/internal/users"
)

type userService struct {
	authService auth.Service
	userRepo    users.UserRepository
}

func NewUserService(authService auth.Service, userRepo users.UserRepository) users.Service {
	return &userService{
		authService: authService,
		userRepo:    userRepo,
	}
}

func (a *userService) GetUser(ctx context.Context, c *gin.Context, username string) (*dto.UserDto, error) {
	userId, exist := c.Get(middlewares.CtxUserKey)
	if !exist {
		return nil, errors.ErrInvalidAccessToken
	}

	result, err := a.userRepo.GetUserByUsername(ctx, username)
	if err != nil {
		return nil, errors.ErrNotFound
	}

	if result.UserID != userId {
		return nil, errors.ErrNotFound
	}

	user := &dto.UserDto{
		Username:  result.Username,
		FirstName: result.FirstName,
		LastName:  result.LastName,
		CreatedAt: result.CreatedAt,
		UpdatedAt: result.UpdatedAt,
	}

	return user, nil
}
