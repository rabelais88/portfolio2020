package app

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func CORSMiddlewareWrapper(next echo.HandlerFunc) echo.HandlerFunc {
	return func(ctx echo.Context) error {
		req := ctx.Request()
		log.Printf("accessing middleware...%v", req.Header.Get("Origin"))
		dynamicCORSConfig := middleware.CORSConfig{
			AllowOrigins: []string{req.Header.Get("Origin")},
			AllowHeaders: []string{"Accept", "Cache-Control", "Content-Type", "X-Requested-With"},
		}
		CORSMiddleware := middleware.CORSWithConfig(dynamicCORSConfig)
		CORSHandler := CORSMiddleware(next)
		return CORSHandler(ctx)
	}
}

func setResponseACAOHeaderFromRequest(req http.Request, resp echo.Response) {
	resp.Header().Set(echo.HeaderAccessControlAllowOrigin,
		req.Header.Get(echo.HeaderOrigin))
}

func ACAOHeaderOverwriteMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(ctx echo.Context) error {
		ctx.Response().Before(func() {
			setResponseACAOHeaderFromRequest(*ctx.Request(), *ctx.Response())
		})
		return next(ctx)
	}
}
