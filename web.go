package web

import (
	"embed"
	"fmt"
	"io"
)

//go:embed dist
var WebDist embed.FS

func getFileData(path string) []byte {
	f, err := WebDist.Open(path)
	if err != nil {
		panic(fmt.Sprintf("打开 %s 资源失败: %v", path, err))
	}
	defer f.Close()
	data, err := io.ReadAll(f)
	if err != nil {
		panic(fmt.Sprintf("读取 %s 资源失败: %v", path, err))
	}
	return data
}

func GetIconData() []byte {
	return getFileData("dist/favicon.ico")
}

func GetLogoSVGData() []byte {
	return getFileData("dist/logo.svg")
}
