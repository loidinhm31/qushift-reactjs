package main

import (
	"go-qushift-auth-service/config"
	"go-qushift-auth-service/internal/server"
	database "go-qushift-auth-service/pkg/database/postgres"
	"go-qushift-auth-service/pkg/utils"
	"log"
	"os"
)

func main() {
	log.Println("Starting API server")

	configPath := utils.GetConfigPath(os.Getenv("config"))

	cfgFile, err := config.LoadConfig(configPath)
	if err != nil {
		log.Fatalf("LoadConfig: %v", err)
	}

	cfg, err := config.ParseConfig(cfgFile)
	if err != nil {
		log.Fatalf("ParseConfig: %v", err)
	}

	psqlDB, err := database.NewPsqlDB(cfg, false)
	if err != nil {
		log.Fatalf("Postgresql init: %s", err)
	} else {
		log.Println("Postgres connected")
	}

	s := server.NewServer(cfg, psqlDB)
	s.Run()
}
