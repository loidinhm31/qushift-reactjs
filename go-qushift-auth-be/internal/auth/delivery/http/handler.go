package http

import (
	"github.com/gin-gonic/gin"
	"go-qushift-auth-be/internal/auth"
	"go-qushift-auth-be/internal/dto"
	"go-qushift-auth-be/internal/errors"
	"go-qushift-auth-be/pkg/utils"
	"net/http"
)

type authHandler struct {
	authService auth.Service
}

func NewAuthHandler(authService auth.Service) auth.Handler {
	return &authHandler{
		authService: authService,
	}
}

func (h *authHandler) Ping() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	}
}

func (h *authHandler) SignUp() gin.HandlerFunc {
	return func(c *gin.Context) {
		user := &dto.UserDto{}

		if err := utils.ReadRequest(c, user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "error",
			})
			c.Abort()
			return
		}

		err := h.authService.SignUp(c.Request.Context(), user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": err.Error(),
			})
			c.Abort()
			return
		}
		c.JSON(http.StatusCreated, gin.H{
			"message": "created",
		})
	}
}

func (h *authHandler) SignIn() gin.HandlerFunc {
	return func(c *gin.Context) {
		user := &dto.UserDto{}

		if err := utils.ReadRequest(c, user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "error",
			})
			c.Abort()
			return
		}
		token, err := h.authService.SignIn(c.Request.Context(), user.Username, user.Password)
		if err != nil {
			if err == errors.ErrNotFound {
				c.JSON(http.StatusUnauthorized, gin.H{
					"message": err.Error(),
				})
				c.Abort()
				return
			}
			if err == errors.ErrWrongPassword {
				c.JSON(http.StatusUnauthorized, gin.H{
					"message": err.Error(),
				})
				c.Abort()
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": err.Error(),
			})
			c.Abort()
			return
		}
		c.JSON(http.StatusOK, dto.UserWithToken{User: user, Token: token})
	}
}

func (h *authHandler) VerifyToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		err := h.authService.VerifyToken(c.Request.Context(), c)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": err.Error(),
			})
			c.Abort()
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "ok",
		})
	}
}
