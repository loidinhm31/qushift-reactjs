package http

import (
	"github.com/gin-gonic/gin"
	"go-qushift-auth-be/internal/auth"
)

// MapAuthRoutes Map auth routes
func MapAuthRoutes(authGroup *gin.RouterGroup, h auth.Handler) {
	authGroup.GET("/ping", h.Ping())
	authGroup.POST("/signup", h.SignUp())
	authGroup.POST("/login", h.Login())
	authGroup.POST("/verify", h.VerifyToken())
	// authGroup.POST("/logout", h.Logout())
}
