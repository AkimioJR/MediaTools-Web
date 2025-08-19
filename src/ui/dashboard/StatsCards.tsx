import { Card, CardBody } from '@heroui/card'

export interface StatItem {
  label: string
  value: string
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}

export function StatsCards({ stats }: { stats: StatItem[] }) {
  return (
    <Card radius="lg" shadow="sm">
      <CardBody className="p-3 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-content1 rounded-xl p-3 sm:p-4 border border-divider hover:shadow-md transition-all duration-200"
            >
              <div className="text-xs font-medium text-foreground-500 mb-1">
                {stat.label}
              </div>
              <div
                className={`text-base sm:text-lg font-bold ${
                  stat.color === 'primary'
                    ? 'text-primary'
                    : stat.color === 'success'
                      ? 'text-success'
                      : stat.color === 'warning'
                        ? 'text-warning'
                        : stat.color === 'danger'
                          ? 'text-danger'
                          : 'text-foreground'
                }`}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
