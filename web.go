package web

import (
	"embed"
)

//go:embed dist
var WebDist embed.FS

//go:embed dist/favicon.ico
var IconData []byte
