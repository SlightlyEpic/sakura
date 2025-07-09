package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Println("compile service started")
	for {
		time.Sleep(5 * time.Second)
	}
}
