package users

import "github.com/gin-gonic/gin"

type Handler interface {
	Info() gin.HandlerFunc
}
