package repository

import (
	"context"
	"go-qushift-auth-service/internal/auth"
	"go-qushift-auth-service/internal/models"
	"gorm.io/gorm"
	"strings"
)

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) auth.UserRepository {
	return &userRepository{db: db}
}

func (ur *userRepository) CreateUser(ctx context.Context, user *models.User) error {
	result := ur.db.WithContext(ctx).Create(&user)

	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (ur *userRepository) GetUserByUsername(ctx context.Context, username string) (*models.User, error) {
	var user models.User
	err := ur.db.WithContext(ctx).Where(&models.User{
		Username: strings.ToLower(username),
	}).First(&user).Error

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (ur *userRepository) GetUserById(ctx context.Context, userId string) (*models.User, error) {
	var user models.User
	err := ur.db.WithContext(ctx).Where(&models.User{
		UserID: userId,
	}).First(&user).Error

	if err != nil {
		return nil, err
	}

	return &user, nil
}
