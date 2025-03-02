package middleware

import (
	"net/http"
	"strings"
)

// Middleware to set Content Security Policy headers
func SetCSPHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Security-Policy",
			"default-src 'self'; "+
				"script-src 'self' https://cdn.gpteng.co https://cdnjs.cloudflare.com 'unsafe-inline' 'unsafe-eval'; "+
				"style-src 'self' https://cdnjs.cloudflare.com 'unsafe-inline'; "+
				"font-src 'self' data: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/; "+
				"img-src 'self' data: blob: https://*.yourdomain.com https://i.pravatar.cc; "+
				"frame-ancestors 'none'; "+
				"object-src 'none'; "+
				"base-uri 'self'; "+
				"form-action 'self';",
		)
		// Set Content-Type for .js files
		if strings.HasSuffix(r.URL.Path, ".js") {
			w.Header().Set("Content-Type", "application/javascript")
		}
		next.ServeHTTP(w, r)
	})
}
