package control

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/disintegration/imaging"
	"github.com/labstack/echo/v4"
	"github.com/novalagung/gubrak/v2"
	"github.com/rabelais88/portfolio2020/api/env"
)

const thumbWidth = 200
const thumbHeight = 200

var resizableExts = []string{".jpg", ".jpeg"}

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

		resizedFilename := fmt.Sprintf("preview-%s", filename)
		resizedFileloc := filepath.Join(cc.Config.FileLocation, resizedFilename)

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

		fileExt := filepath.Ext(fileLoc)
		extIndex, err := gubrak.From(resizableExts).IndexOf(fileExt).ResultAndError()
		if err != nil {
			return MakeError(http.StatusInternalServerError, "ERROR_WHILE_PARSING_FILE_EXTENSION")
		}
		if extIndex == -1 {
			// do not resize for non-resizable extensions
			_, err := cc.S3W.UploadFile(cc.Config.S3ImageBucket, fileLoc)
			if err != nil {
				log.Fatal(`error while uploading`, fileLoc)
			}
			urls = append(urls, filename)
			continue
		}

		// Create resized image
		resized, err := imaging.Open(fileLoc)
		if err != nil {
			return MakeError(http.StatusInternalServerError, "ERROR_WHILE_OPENING_RESIZE_TARGET")
		}

		resized = imaging.Resize(resized, thumbWidth, thumbHeight, imaging.Lanczos)
		if err := imaging.Save(resized, resizedFileloc); err != nil {
			return MakeError(http.StatusInternalServerError, "ERROR_WHILE_SAVING_RESIZED_IMAGE")
		}

		_, err = cc.S3W.UploadFile(cc.Config.S3ImageBucket, fileLoc)
		if err != nil {
			log.Fatal(`error while uploading`, fileLoc)
		}
		_, err = cc.S3W.UploadFile(cc.Config.S3ImageBucket, resizedFileloc)
		if err != nil {
			log.Fatal(`error while uploading`, resizedFileloc)
		}
		urls = append(urls, filename)
	}

	errRes := cc.JSON(http.StatusOK, UploadFileResponse{urls})

	if errRes != nil {
		return MakeError(http.StatusInternalServerError, "ERROR_WHILE_CREATING_RESPONSE")
	}
	return errRes

}
