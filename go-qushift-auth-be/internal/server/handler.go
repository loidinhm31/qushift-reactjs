package server

import (
	"github.com/gin-gonic/gin"
	authHttp "go-qushift-auth-be/internal/auth/delivery/http"
	authRepository "go-qushift-auth-be/internal/auth/repository"
	authService "go-qushift-auth-be/internal/auth/service"
	"log"
	"net/http"
	"time"
)

func (s *Server) MapHandlers(g *gin.Engine) error {
	// Init repositories
	aRepo := authRepository.NewUserRepository(s.db)

	// Init service
	aService := authService.NewAuthService(aRepo)

	// Init handler
	aHandler := authHttp.NewAuthHandler(aService)

	authorizedV1 := g.Group("/api/v1")

	health := authorizedV1.Group("/health")
	authGroup := authorizedV1.Group("/auth")

	authHttp.MapAuthRoutes(authGroup, aHandler)

	health.GET("", func(c *gin.Context) {
		log.Printf("Health check: %d", time.Now().Unix())
		c.String(http.StatusOK, "up")
	})

	return nil
}
