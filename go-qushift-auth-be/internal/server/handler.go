package server

import (
	"github.com/gin-gonic/gin"
	authHttp "go-qushift-auth-be/internal/auth/delivery/http"
	usersRepository "go-qushift-auth-be/internal/auth/repository"
	authService "go-qushift-auth-be/internal/auth/service"
	"log"
	"net/http"
	"time"
)

func (s *Server) MapHandlers(g *gin.Engine) error {
	// Init repositories
	uRepo := usersRepository.NewUserRepository(s.db)

	// Init service
	aService := authService.NewAuthService(uRepo,
		[]byte(s.cfg.Server.SigningKey),
		s.cfg.Server.TokenTTL,
		s.cfg.Server.ClientId, s.cfg.Server.ClientSecret)

	// Init handler
	aHandler := authHttp.NewAuthHandler(aService)

	// Init middlewares
	//mw := middlewares.NewMiddlewareManager(aService)

	apiV1 := g.Group("/api/v1")

	health := apiV1.Group("/health")
	authGroupPublic := apiV1.Group("/auth")

	authHttp.MapAuthRoutes(authGroupPublic, aHandler)

	health.GET("", func(c *gin.Context) {
		log.Printf("Health check: %d", time.Now().Unix())
		c.String(http.StatusOK, "up")
	})

	return nil
}
