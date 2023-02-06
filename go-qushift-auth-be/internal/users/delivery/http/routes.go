package http

import (
	"github.com/gin-gonic/gin"
	"go-qushift-auth-be/internal/users"
)

// MapUserRoutes Map auth routes
func MapUserRoutes(authGroup *gin.RouterGroup, h users.Handler) {
	authGroup.GET("/:username", h.Info())
}
