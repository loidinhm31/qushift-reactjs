package service

import (
	"context"
	"fmt"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"go-qushift-auth-be/internal/auth"
	"go-qushift-auth-be/internal/dto"
	"go-qushift-auth-be/internal/models"
	"strings"
	"time"
)

type AuthClaims struct {
	jwt.StandardClaims
	Username string `json:"username"`
	UserId   string `json:"userId"`
}

type authService struct {
	authRepo       auth.UserRepository
	hashSalt       string
	signingKey     []byte
	expireDuration time.Duration
}

func NewAuthService(userRepo auth.UserRepository) auth.Service {
	return &authService{
		authRepo: userRepo,
	}
}

func (a *authService) SignUp(ctx context.Context, username, password string) (*dto.UserDto, error) {
	fmtusername := strings.ToLower(username)
	euser, _ := a.authRepo.GetUserByUsername(ctx, fmtusername)

	if euser != nil {
		return nil, auth.ErrUserExisted
	}
	user := &models.User{
		UserID:   uuid.New().String(),
		Username: fmtusername,
		Password: password,
	}
	user.HashPassword()
	err := a.authRepo.CreateUser(ctx, user)
	if err != nil {
		return nil, err
	}

	result, err := a.authRepo.GetUserByUsername(ctx, username)
	if err != nil {
		return nil, err
	}

	return &dto.UserDto{
		UserId:   result.UserID,
		Username: result.Username,
		Password: result.Password,
	}, nil
}

func (a *authService) SignIn(ctx context.Context, username, password string) (string, error) {
	user, _ := a.authRepo.GetUserByUsername(ctx, username)
	if user == nil {
		return "", auth.ErrUserNotFound
	}

	if !user.ComparePassword(password) {
		return "", auth.ErrWrongPassword
	}

	claims := AuthClaims{
		Username: user.Username,
		UserId:   user.UserID,
		StandardClaims: jwt.StandardClaims{
			IssuedAt:  time.Now().Unix(),
			Issuer:    "qushift",
			ExpiresAt: time.Now().Add(a.expireDuration).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString(a.signingKey)
}

func (a *authService) ParseToken(ctx context.Context, accessToken string) (string, error) {
	token, err := jwt.ParseWithClaims(accessToken, &AuthClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return a.signingKey, nil
	})

	if err != nil {
		return "", err
	}

	if claims, ok := token.Claims.(*AuthClaims); ok && token.Valid {
		return claims.UserId, nil
	}

	return "", auth.ErrInvalidAccessToken
}
