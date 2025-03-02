package middleware

import (
	"net/http"
	"strings"

	"github.com/Raymond9734/GraphQl-api-schoolProfile/Backend/utils"
)

func JWTAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Try to get the token from the Authorization header
		authHeader := r.Header.Get("Authorization")
		var tokenString string

		if authHeader != "" {
			tokenString = strings.TrimPrefix(authHeader, "Bearer ")
		} else {
			// If no Authorization header, try to get the token from the query parameters
			tokenString = r.URL.Query().Get("token")
		}

		// If no token is found in either location, deny access
		if tokenString == "" {
			utils.LogWarning("Unauthorized attempt - Token missing - remote_addr: %s, method: %s, path: %s",
				r.RemoteAddr,
				r.Method,
				r.URL.Path,
			)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		// Validate the token
		claims, err := utils.ValidateJWT(tokenString)
		if err != nil || !claims {
			utils.LogWarning("Unauthorized attempt - Invalid token - remote_addr: %s, method: %s, path: %s",
				r.RemoteAddr,
				r.Method,
				r.URL.Path,
			)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		// Pass the request to the next handler
		next.ServeHTTP(w, r)
	})
}
