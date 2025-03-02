package main

import (
	"log"
	"net/http"

	"github.com/Raymond9734/GraphQl-api-schoolProfile/Backend/routes"
	"github.com/Raymond9734/GraphQl-api-schoolProfile/Backend/utils"
)

type Response struct {
	Message string `json:"message"`
}

func main() {
	if err := utils.InitializeLogger(); err != nil {
		log.Fatal(err)
	}

	utils.LogInfo("Starting Application server......")
	// Serve static files first
	routes.ServeStaticFolders()

	// Then set up other routes
	routes.SetupHomeRoute()

	// Start server
	log.Println("Server starting on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		utils.LogError("Error starting server: %v", err)
		log.Fatal(err)
	}
}
