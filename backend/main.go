package main

import (
	"net/http"
  "os"

	"github.com/labstack/echo/v4"
  "github.com/labstack/echo/v4/middleware"
)

func main() {
  port := os.Getenv("PORT")

  // Create a new instance of Echo
  e := echo.New()
  e.Use(middleware.CORS())

  // Connect to database
  db, err := initDB()
  if err != nil {
    e.Logger.Fatal(err)
  }

  service := TodoService{db: db}

  err = db.AutoMigrate(&Todo{})
  if err != nil {
    e.Logger.Fatal(err)
  }

  e.GET("/", func(c echo.Context) error {
    return c.String(http.StatusOK, "Hello, World!")
  })

  e.GET("/todos", service.getTodos)
  e.GET("/todos/:id", service.getTodo)
  e.POST("/todos", service.addTodo)
  e.PUT("/todos", service.updateTodo)
  e.DELETE("/todos/:id", service.deleteTodo)

  // Start as a web server, and log any errors
  e.Logger.Fatal(e.Start(":" + port))
}
