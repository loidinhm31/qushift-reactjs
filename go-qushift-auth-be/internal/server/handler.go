package server

import (
	"github.com/gin-gonic/gin"
	authHttp "go-qushift-auth-be/internal/auth/delivery/http"
	userHttp "go-qushift-auth-be/internal/users/delivery/http"

	authService "go-qushift-auth-be/internal/auth/service"
	userService "go-qushift-auth-be/internal/users/service"

	"go-qushift-auth-be/internal/middlewares"
	usersRepository "go-qushift-auth-be/internal/users/repository"
	"log"
	"net/http"
	"time"
)

func (s *Server) MapHandlers(g *gin.Engine) error {
	// Init repositories
	uRepo := usersRepository.NewUserRepository(s.db)

	// Init service
	aService := authService.NewAuthService(uRepo, []byte(s.cfg.Server.SigningKey), s.cfg.Server.TokenTTL)
	uService := userService.NewUserService(aService, uRepo)

	// Init handler
	aHandler := authHttp.NewAuthHandler(aService)
	uHandler := userHttp.NewUserHandler(uService)

	// Init middlewares
	mw := middlewares.NewMiddlewareManager(aService)

	apiV1 := g.Group("/api/v1")

	health := apiV1.Group("/health")
	authGroup := apiV1.Group("/auth")
	userGroup := apiV1.Group("/users")

	userGroup.Use(mw.JWTValidation())

	authHttp.MapAuthRoutes(authGroup, aHandler)
	userHttp.MapUserRoutes(userGroup, uHandler)

	health.GET("", func(c *gin.Context) {
		log.Printf("Health check: %d", time.Now().Unix())
		c.String(http.StatusOK, "up")
	})

	return nil
}
