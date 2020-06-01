package main

import (
	"github.com/rabelais88/portfolio2020/api/app"
)

func main() {
	_, db := app.Init()
	defer db.Close()
}
