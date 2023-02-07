package http

import (
	"github.com/gin-gonic/gin"
	"go-qushift-auth-be/internal/auth"
)

// MapAuthRoutes Map auth routes
func MapAuthRoutes(authGroup *gin.RouterGroup, h auth.Handler) {
	authGroup.POST("/signup", h.SignUp())
	authGroup.GET("/verify", h.VerifyToken())
	// authGroup.POST("/logout", h.Logout())
	authGroup.GET("/ping", h.Ping())
}
