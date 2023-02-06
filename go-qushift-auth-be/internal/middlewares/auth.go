package middlewares

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"go-qushift-auth-be/internal/errors"
	"net/http"
	"strings"
)

const CtxUserKey = "userId"

func (mw *MiddlewareManager) JWTValidation() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.Request.Header["Authorization"]

		if len(authHeader) == 0 {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Unauthorized",
			})
			c.Abort()
			return
		}

		extractHeader := authHeader[0]

		headerParts := strings.Split(extractHeader, " ")
		fmt.Println(headerParts)
		if len(headerParts) != 2 {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Unauthorized",
			})
			c.Abort()
			return
		}

		if headerParts[0] != "Bearer" {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Unauthorized",
			})
			c.Abort()
			return
		}

		userId, err := mw.authService.ParseToken(c.Request.Context(), headerParts[1])
		if err != nil {
			status := http.StatusInternalServerError
			if err == errors.ErrInvalidAccessToken {
				status = http.StatusUnauthorized
			}
			c.JSON(status, gin.H{
				"message": err.Error(),
			})
			c.Abort()
			return
		}

		c.Set(CtxUserKey, userId)
		c.Next()
	}
}
