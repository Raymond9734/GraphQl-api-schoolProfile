package routes

import (
	"net/http"
	"path/filepath"
)

func ServeStaticFolders() {
	// Create a file server handler for the FrontEnd directory
	fs := http.FileServer(http.Dir("FrontEnd"))

	// Handle CSS files
	http.HandleFunc("/css/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/css")
		fs.ServeHTTP(w, r)
	})

	// Handle JavaScript files
	http.HandleFunc("/js/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/javascript")
		fs.ServeHTTP(w, r)
	})

	// Handle other static files
	http.HandleFunc("/static/", func(w http.ResponseWriter, r *http.Request) {
		// Set MIME type based on file extension
		switch filepath.Ext(r.URL.Path) {
		case ".png", ".jpg", ".jpeg":
			w.Header().Set("Content-Type", "image/"+filepath.Ext(r.URL.Path)[1:])
		case ".svg":
			w.Header().Set("Content-Type", "image/svg+xml")
		case ".json":
			w.Header().Set("Content-Type", "application/json")
		}
		fs.ServeHTTP(w, r)
	})
}
