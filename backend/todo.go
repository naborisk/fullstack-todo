package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"strconv"
)

type Todo struct {
	ID          uint   `json:"id" gorm:"primary_key;auto_increment"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Completed   bool   `json:"completed"`
}

type TodoService struct {
	db *gorm.DB
}

func (s TodoService) getTodos(c echo.Context) error {
	data := []Todo{}
	err := s.db.Find(&data).Error

	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, data)
}

func (s TodoService) getTodo(c echo.Context) error {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)

	if err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"message": err.Error()})
	}

	data := Todo{ID: uint(id)}

	err = s.db.First(&data).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.JSON(http.StatusNotFound, echo.Map{"message": err.Error()})
		} else {
			return c.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
		}
	}

	return c.JSON(http.StatusOK, data)
}

func (s TodoService) addTodo(c echo.Context) error {
	data := Todo{}
	err := c.Bind(&data)
	if err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	err = s.db.Create(&data).Error

	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusCreated, data)
}

func (s TodoService) updateTodo(c echo.Context) error {
	data := Todo{}
	err := c.Bind(&data)
	if err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	err = s.db.Save(&data).Error

	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusCreated, data)
}

func (s TodoService) deleteTodo(c echo.Context) error {
	id := c.Param("id")

	data := Todo{}
	err := s.db.Delete(&data, id).Error

	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, data)
}
