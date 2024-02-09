package main

import (
  "os"
  "bytes"
  "text/template"

  "gorm.io/driver/postgres"
  "gorm.io/gorm"
)

type DBConfig struct {
  Host     string
  User     string
  Password string
  DBName   string
  Port     string
  SSLMode  string
  Timezone string
}

func getenv(key, fallback string) string {
  value, exists := os.LookupEnv(key)
  if !exists {
    value = fallback
  }
  return value
}

func initDB() (*gorm.DB, error) {
  conf := DBConfig{}

  conf.Host = getenv("DB_HOST", "localhost")
  conf.User = getenv("DB_USER", "postgres")
  conf.Password = getenv("DB_PASSWORD", "postgres")
  conf.DBName = getenv("DB_NAME", "todo")
  conf.Port = getenv("DB_PORT", "5432")
  conf.SSLMode = getenv("DB_SSLMODE", "disable")
  conf.Timezone = getenv("DB_TIMEZONE", "Asia/Tokyo")

  tmpl, err := template.New("dsn").Parse("host={{.Host}} user={{.User}} password={{.Password}} dbname={{.DBName}} port={{.Port}} sslmode={{.SSLMode}} TimeZone={{.Timezone}}")
  if err != nil {
    panic(err)
  }

  var dsn bytes.Buffer

  err = tmpl.Execute(&dsn, conf)

  db, err := gorm.Open(postgres.Open(dsn.String()), &gorm.Config{})

  if err != nil {
    return nil, err
  }

  return db, nil
}
