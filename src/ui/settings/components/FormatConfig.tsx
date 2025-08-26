import { Textarea } from '@heroui/input'

interface FormatConfigProps {
  formatConfig: {
    movie?: string
    tv?: string
  } | null
  onUpdateMovie: (value: string) => void
  onUpdateTV: (value: string) => void
}

export function FormatConfig({
  formatConfig,
  onUpdateMovie,
  onUpdateTV,
}: FormatConfigProps) {
  return (
    <>
      <div className="space-y-6">
        <Textarea
          defaultValue={formatConfig?.movie || ''}
          label="电影格式"
          placeholder="例如: {title} ({year})"
          onValueChange={onUpdateMovie}
        />
        <Textarea
          defaultValue={formatConfig?.tv || ''}
          label="电视剧格式"
          placeholder="例如: {title} S{season:02d}E{episode:02d}"
          onValueChange={onUpdateTV}
        />
      </div>
      <p className="text-xs sm:text-sm text-foreground-500">
        支持变量: {'{title}'}, {'{year}'}, {'{season}'}, {'{episode}'},{' '}
        {'{quality}'}
      </p>
    </>
  )
}
