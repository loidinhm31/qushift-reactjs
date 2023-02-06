package main

import (
	"go-qushift-auth-be/config"
	"go-qushift-auth-be/internal/server"
	database "go-qushift-auth-be/pkg/database/postgres"
	"go-qushift-auth-be/pkg/utils"
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
