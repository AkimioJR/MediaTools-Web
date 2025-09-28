package web

import (
	"embed"
	"io"
)

//go:embed dist
var WebDist embed.FS

func GetIconData() []byte {
	icon, err := WebDist.Open("dist/favicon.ico")
	if err != nil {
		panic("缺少图标资源: " + err.Error())
	}
	defer icon.Close()
	iconData, err := io.ReadAll(icon)
	if err != nil {
		panic("读取图标资源失败: " + err.Error())
	}
	return iconData
}
