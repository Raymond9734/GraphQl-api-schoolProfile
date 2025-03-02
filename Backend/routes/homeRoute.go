package routes

import (
	"net/http"

	"github.com/Raymond9734/GraphQl-api-schoolProfile/Backend/handlers"
	"github.com/Raymond9734/GraphQl-api-schoolProfile/Backend/middleware"
	"github.com/Raymond9734/GraphQl-api-schoolProfile/Backend/utils"
)

func SetupHomeRoute() {
	http.Handle("/", utils.ApplyMiddleware(http.HandlerFunc(handlers.HomeHandler),
		middleware.CORSMiddleware,
		middleware.SetCSPHeaders,
	))
}
