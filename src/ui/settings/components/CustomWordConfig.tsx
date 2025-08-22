import { Textarea } from '@heroui/input'
import { Tooltip } from '@heroui/tooltip'
import { Info } from 'lucide-react'

interface CustomWordConfigProps {
  customWordConfig: {
    identify_word?: string[]
    customization?: string[]
    exclude_words?: string[]
  } | null
  onUpdateField: (
    field: 'identify_word' | 'customization' | 'exclude_words',
    value: string,
  ) => void
}

export function CustomWordConfig({
  customWordConfig,
  onUpdateField,
}: CustomWordConfigProps) {
  const identifyWordHints = [
    '屏蔽词',
    '被替换词 => 替换词',
    '前定位词 <> 后定位词 >> 集偏移量（EP）',
    '被替换词 => 替换词 && 前定位词 <> 后定位词 >> 集偏移量（EP）',
    '（其中<被替换词>支持正则表达式，其余不支持，单独一个<被替换词>则会被替换为空字符串）',
    '{[tmdbid=xxx;type=movie/tv;s=xxx;e=xxx]} 直接指定 TMDB ID，其中s、e为季数和集数',
  ]

  const toMultilineValue = (list?: string[]) =>
    list && list.length > 0 ? list.join('\n') : ''

  return (
    <>
      <div className="flex items-start gap-2">
        <Textarea
          className="flex-1"
          label={
            <div className="flex items-center gap-2">
              <p>自定义识别词</p>
              <Tooltip
                showArrow
                closeDelay={0}
                content={
                  <div className="text-xs space-y-1 max-w-xs p-1">
                    {identifyWordHints.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                }
                placement="right"
              >
                <Info className="w-4 h-4 text-foreground-500 cursor-default" />
              </Tooltip>
            </div>
          }
          maxRows={12}
          minRows={8}
          placeholder="输入自定义识别词，用逗号分隔"
          value={toMultilineValue(customWordConfig?.identify_word)}
          onValueChange={(value) => onUpdateField('identify_word', value)}
        />
      </div>

      <Textarea
        description="用于电影/电视剧重命名的自定义词（每行一个，支持使用正则表达式，注意转义）"
        label="自定义词条"
        maxRows={12}
        minRows={8}
        placeholder="输入自定义占位词，用逗号分隔"
        value={toMultilineValue(customWordConfig?.customization)}
        onValueChange={(value) => onUpdateField('customization', value)}
      />

      <Textarea
        description="路径中包含这些词的将不会自动转移（每行一个）"
        label="媒体库过滤词"
        placeholder="输入自定义排除词，用逗号分隔"
        value={toMultilineValue(customWordConfig?.exclude_words)}
        onValueChange={(value) => onUpdateField('exclude_words', value)}
      />
    </>
  )
}
