package handlers

import (
	"html/template"
	"net/http"

	"github.com/Raymond9734/GraphQl-api-schoolProfile/Backend/utils"
)

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	temp, err := template.ParseFiles("FrontEnd/index.html")
	if err != nil {
		utils.LogError("Error parsing template: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/html")
	err = temp.Execute(w, nil)
	if err != nil {
		utils.LogError("Error executing template: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}
