package middleware

import (
	"net/http"

	"github.com/Raymond9734/GraphQl-api-schoolProfile/Backend/utils"
)

// ValidatePathAndMethod is a middleware factory that returns a middleware function
// to validate the path and method of incoming requests.
func ValidatePathAndMethod(expectedPath string, expectedMethod string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Check if the path and method match the expected values
			if r.URL.Path != expectedPath {
				utils.LogWarning("Page Not Found - remote_addr: %s, method: %s, path: %s",
					r.RemoteAddr,
					r.Method,
					r.URL.Path,
				)
				w.WriteHeader(http.StatusNotFound)
				return
			} else if r.Method != expectedMethod {
				utils.LogWarning("Method Not Allowed - remote_addr: %s, method: %s, path: %s",
					r.RemoteAddr,
					r.Method,
					r.URL.Path,
				)
				w.WriteHeader(http.StatusMethodNotAllowed)
			}

			// Call the next handler if validation passes
			next.ServeHTTP(w, r)
		})
	}
}
