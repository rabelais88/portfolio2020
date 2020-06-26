package control

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/env"
)

type UploadFileResponse struct {
	Urls []string `json:"urls"`
}

func UploadFile(c echo.Context) error {
	cc := c.(*env.CustomContext)

	if err := RoleAdminOnly(cc); err != nil {
		return err
	}

	form, err := cc.MultipartForm()
	if err != nil {
		return MakeError(http.StatusBadRequest, "BAD_MULTIPART_FORM")
	}

	if _, err := os.Stat(cc.Config.FileLocation); os.IsNotExist(err) {
		_err := os.MkdirAll(cc.Config.FileLocation, os.ModePerm)
		if _err != nil {
			log.Printf("error while creating directory at %s", cc.Config.FileLocation)
		}
	}

	files := form.File["files"]

	urls := []string{}

	for _, file := range files {
		// Source
		src, err := file.Open()
		if err != nil {
			return err
		}
		defer src.Close()

		now := time.Now()
		filename := fmt.Sprintf("%d-%s", now.UnixNano(), filepath.Clean(file.Filename))
		fileLoc := filepath.Join(cc.Config.FileLocation, filename)

		// Destination
		dst, err := os.Create(fileLoc)
		if err != nil {
			return err
		}
		defer dst.Close()

		// Copy
		if _, err = io.Copy(dst, src); err != nil {
			return err
		}

		urls = append(urls, filename)
	}

	errRes := cc.JSON(http.StatusOK, UploadFileResponse{urls})

	if errRes != nil {
		return MakeError(http.StatusInternalServerError, "ERROR_WHILE_CREATING_RESPONSE")
	}
	return errRes

}
