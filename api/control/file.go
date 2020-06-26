package control

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/constants"
	"github.com/rabelais88/portfolio2020/api/env"
)

type UploadFileResponse struct {
	Urls []string `json:"urls"`
}

func UploadFile(c echo.Context) error {
	cc := c.(*env.CustomContext)

	// skips authorization test & jwt validation for test env
	if cc.Config.Env != env.ENVIRONMENTS.TEST {
		u := GetUserFromContext(cc)
		if u.Role != constants.USER_ROLE.ADMIN {
			return MakeError(http.StatusUnauthorized, "NOT_AUTHORIZED")
		}
	}

	form, err := cc.MultipartForm()
	if err != nil {
		return MakeError(http.StatusBadRequest, "BAD_MULTIPART_FORM")
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
		directory := fmt.Sprintf("%s%s", cc.Config.FileLocation, string(filepath.Separator))
		fileLoc := fmt.Sprintf("%s%s", directory, filename)

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
