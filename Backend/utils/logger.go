package utils

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"runtime"
	"time"
)

var (
	infoLogger    *log.Logger
	errorLogger   *log.Logger
	warningLogger *log.Logger
	debugLogger   *log.Logger
)

func InitializeLogger() error {
	logDir := "logs"
	if err := os.MkdirAll(logDir, 0o755); err != nil {
		return fmt.Errorf("failed to create log directory: %v", err)
	}

	logFile := filepath.Join(logDir, fmt.Sprintf("%s.log", time.Now().Format("2006-01-02")))
	file, err := os.OpenFile(logFile, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		return fmt.Errorf("failed to open log file: %v", err)
	}

	// Initialize loggers with different prefixes
	infoLogger = log.New(file, "INFO: ", log.Ldate|log.Ltime)
	errorLogger = log.New(file, "ERROR: ", log.Ldate|log.Ltime)
	warningLogger = log.New(file, "WARNING: ", log.Ldate|log.Ltime)
	debugLogger = log.New(file, "DEBUG: ", log.Ldate|log.Ltime)

	return nil
}

func getFileInfo() string {
	_, file, line, ok := runtime.Caller(2)
	if !ok {
		return "unknown:0"
	}
	return fmt.Sprintf("%s:%d", filepath.Base(file), line)
}

func LogInfo(format string, v ...interface{}) {
	msg := fmt.Sprintf(format, v...)
	infoLogger.Printf("[%s] %s", getFileInfo(), msg)
}

func LogError(format string, v ...interface{}) {
	msg := fmt.Sprintf(format, v...)
	errorLogger.Printf("[%s] %s", getFileInfo(), msg)
}

func LogWarning(format string, v ...interface{}) {
	msg := fmt.Sprintf(format, v...)
	warningLogger.Printf("[%s] %s", getFileInfo(), msg)
}

func LogDebug(format string, v ...interface{}) {
	msg := fmt.Sprintf(format, v...)
	debugLogger.Printf("[%s] %s", getFileInfo(), msg)
}

func CloseLogger() error {
	// Close all loggers by setting them to nil
	infoLogger = nil
	errorLogger = nil
	warningLogger = nil
	debugLogger = nil

	// Get the log directory path
	logDir := "logs"

	// Remove all files in the logs directory
	if err := os.RemoveAll(logDir); err != nil {
		return fmt.Errorf("failed to remove log directory: %v", err)
	}

	return nil
}
