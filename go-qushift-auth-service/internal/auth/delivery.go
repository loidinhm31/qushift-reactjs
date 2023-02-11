package auth

import "github.com/gin-gonic/gin"

type Handler interface {
	Ping() gin.HandlerFunc
	SignUp() gin.HandlerFunc
	Login() gin.HandlerFunc
	VerifyToken() gin.HandlerFunc
	// Logout() gin.HandlerFunc
}
