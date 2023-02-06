package http

import (
	"github.com/gin-gonic/gin"
	"go-qushift-auth-be/internal/users"
	"net/http"
)

type userHandler struct {
	userService users.Service
}

func NewUserHandler(userService users.Service) users.Handler {
	return &userHandler{
		userService: userService,
	}
}

func (h *userHandler) Info() gin.HandlerFunc {
	return func(c *gin.Context) {
		username := c.Param("username")

		user, err := h.userService.GetUser(c.Request.Context(), c, username)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": err.Error(),
			})
			c.Abort()
			return
		}

		c.JSON(http.StatusOK, user)
	}
}
