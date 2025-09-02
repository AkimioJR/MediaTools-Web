import type { MediaTransferHistory } from '@/types'

export interface DetailModalProps {
  row: MediaTransferHistory
  onClose: () => void
}

export default function DetailModal({ row }: DetailModalProps) {
  const statusText = row.status ? '成功' : '失败'

  return (
    <div className="space-y-4">
      <Section title="媒体信息">
        <div className="divide-y divide-default-200">
          <Field label="名称">
            <span className="font-medium">{row.item.title}</span>
            {row.item.year ? (
              <span className="ml-2 text-foreground-500">
                ({row.item.year})
              </span>
            ) : null}
          </Field>
          <Field label="原始名称" value={row.item.original_title} />
          <Field label="类型" value={row.item.media_type} />
          {row.item.media_type === 'TV' ? (
            <Field
              label="季/集"
              value={`${row.item.season_str} ${row.item.episode_str}`}
            />
          ) : null}
        </div>
      </Section>

      <Section title="路径">
        <div className="divide-y divide-default-200">
          <Field label="源路径">
            <Mono>{row.src_path}</Mono>
          </Field>
          <Field label="目标路径">
            <Mono>{row.dst_path}</Mono>
          </Field>
        </div>
      </Section>

      <Section title="状态">
        <div className="divide-y divide-default-200">
          <Field label="方式" value={row.transfer_type} />
          <Field label="状态">
            <StatusBadge success={row.status}>{statusText}</StatusBadge>
          </Field>
          {row.message ? (
            <Field label="消息">
              <p className="text-foreground-500 break-words leading-relaxed">
                {row.message}
              </p>
            </Field>
          ) : null}
        </div>
      </Section>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <h4 className="text-sm font-semibold tracking-wide text-foreground-700">
        {title}
      </h4>
      {children}
    </div>
  )
}

function Field({
  label,
  value,
  children,
}: {
  label: string
  value?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div className="py-2">
      <div className="text-[11px] text-foreground-400">{label}</div>
      <div className="mt-0.5 text-[13px] sm:text-sm break-words">
        {value ?? children}
      </div>
    </div>
  )
}

function StatusBadge({
  success,
  children,
}: {
  success: boolean
  children: React.ReactNode
}) {
  const base = 'inline-flex items-center rounded-small px-2 py-0.5 text-xs'
  const color = success
    ? 'bg-success-100 text-success-600'
    : 'bg-danger-100 text-danger-600'

  return <span className={`${base} ${color}`}>{children}</span>
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs sm:text-[13px] break-all">
      {children}
    </span>
  )
}
