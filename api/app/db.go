package app

import (
	"fmt"
	"log"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"github.com/rabelais88/portfolio2020/api/env"
)

func ConnectDB(config *env.Config) *gorm.DB {
	dbPath := fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s", config.DBHost, config.DBPort, config.DBUser, config.DBName, config.DBPassword)
	dbType := "postgres"
	if config.Env == env.ENVIRONMENTS.TEST {
		dbPath = ":memory:"
		dbType = "sqlite3"
	}

	if config.Env == env.ENVIRONMENTS.DEV {
		log.Printf("host %s:%s / user %s / database name %s\n", config.DBHost, config.DBPort, config.DBUser, config.DBName)
		log.Println("connecting to DB...")
	}

	db, err := gorm.Open(dbType, dbPath)
	if err != nil {
		log.Fatalln("there was an error with database connection", err)
	}
	defer db.Close()

	log.Println("connected to DB")

	return db
}
