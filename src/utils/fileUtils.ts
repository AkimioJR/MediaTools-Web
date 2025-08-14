/**
 * 文件相关工具函数
 */

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小字符串
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 格式化日期
 * @param dateString 日期字符串
 * @returns 格式化后的日期字符串
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('zh-CN')
}

/**
 * 根据文件扩展名获取对应的图标
 * @param ext 文件扩展名
 * @returns 图标名称
 */
export const getFileIcon = (ext: string): string => {
  switch (ext.toLowerCase()) {
    // 压缩包
    case '.zip':
    case '.rar':
    case '.bak':
    case '.tar':
    case '.gz':
    case '.bz2':
      return 'mdi-folder-zip-outline' // 压缩包

    // 开发
    case '.htm':
    case '.html':
      return 'mdi-language-html5' // HTML 文件图标
    case '.vue':
      return 'mdi-vuejs' // Vue 文件图标
    case '.js':
      return 'mdi-language-javascript' // JavaScript 文件图标
    case '.ts':
      return 'mdi-language-typescript' // TypeScript 文件图标
    case '.json':
      return 'mdi-file-document-outline' // JSON 文件图标
    case '.css':
    case '.scss':
    case '.less':
      return 'mdi-language-css3' // CSS 文件图标
    case '.php':
      return 'mdi-language-php' // PHP 文件图标
    case '.py':
      return 'mdi-language-python' // Python 文件图标
    case '.java':
      return 'mdi-language-java' // Java 文件图标
    case '.go':
      return 'mdi-language-go' // Go 文件图标
    case '.c':
    case '.h':
      return 'mdi-language-c' // C 文件图标
    case '.cpp':
      return 'mdi-language-cpp' // C++ 文件图标
    case '.cs':
      return 'mdi-language-csharp' // C# 文件图标
    case '.sql':
      return 'mdi-database' // SQL 文件图标
    case '.sh':
    case '.bat':
      return 'mdi-language-bash' // Bash 脚本图标
    case '.ps1':
      return 'mdi-language-powershell' // PowerShell 脚本图标

    // markdown
    case '.md':
    case '.markdown':
      return 'mdi-language-markdown-outline' // Markdown 文件图标

    // 图片
    case '.png':
      return 'mdi-file-png-box' // PNG 文件图标
    case '.jpg':
    case '.jpeg':
      return 'mdi-file-jpg-box' // JPEG 文件图标
    case '.gif':
      return 'mdi-file-gif-box' // GIF 文件图标
    case '.bmp':
    case '.webp':
    case '.ico':
    case '.svg':
      return 'mdi-file-image-box' // 图片文件图标

    // 视频
    case '.mp4':
    case '.mkv':
    case '.avi':
    case '.wmv':
    case '.mov':
    case '.flv':
    case '.rmvb':
      return 'mdi-filmstrip'

    // 文档
    case '.txt':
    case '.log':
      return 'mdi-file-document-outline' // 文本文件图标
    case '.env':
    case '.yml':
    case '.yaml':
    case '.config':
      return 'mdi-file-cog-outline' // 配置文件图标
    case '.csv':
      return 'mdi-file-delimited' // CSV 文件图标

    // office
    case '.xls':
    case '.xlsx':
      return 'mdi-file-excel' // Excel 文件图标
    case '.doc':
    case '.docx':
      return 'mdi-file-word' // Word 文件图标
    case '.ppt':
    case '.pptx':
      return 'mdi-file-powerpoint' // PowerPoint 文件图标
    case '.pdf':
      return 'mdi-file-pdf-box' // PDF 文件图标

    // 音频
    case '.mp2':
    case '.mp3':
    case '.m4a':
    case '.wma':
    case '.aac':
    case '.ogg':
    case '.wav':
    case '.flac':
      return 'mdi-file-music-box' // 音频文件图标

    // 字体
    case '.ttf':
    case '.otf':
    case '.woff':
    case '.woff2':
    case '.eot':
      return 'mdi-file-font' // 字体文件图标

    // 字幕
    case '.srt':
    case '.ass':
    case '.sub':
      return 'mdi-subtitles' // 字幕文件图标

    default:
      return 'mdi-file-box'
  }
}
