package app

import (
	"fmt"
	"log"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"github.com/rabelais88/portfolio2020/api/env"
	"github.com/rabelais88/portfolio2020/api/model"
)

func ConnectDB(config *env.Config) *gorm.DB {
	dbPath := fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s", config.DBHost, config.DBPort, config.DBUser, config.DBName, config.DBPassword)
	dbType := "postgres"
	switch config.Env {
	case env.ENVIRONMENTS.TEST:
		dbPath = ":memory:"
		dbType = "sqlite3"
		log.Println("DB on memory for local test")
	case env.ENVIRONMENTS.DEV:
		if config.DBMemory == `true` {
			dbPath = ":memory:"
			dbType = "sqlite3"
			log.Println("DB on memory for local test")
		} else {
			dbPath += " sslmode=disable"
			log.Println(dbPath)
			log.Println("connecting to DB...")
		}
	}

	db, err := gorm.Open(dbType, dbPath)
	if err != nil {
		log.Fatalln("there was an error with database connection", err)
	}

	db.AutoMigrate(&model.Post{}, &model.Article{}, &model.User{})

	log.Println("connected to DB")

	return db
}
