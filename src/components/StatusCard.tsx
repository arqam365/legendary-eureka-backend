import { StatusBadge } from './StatusBadge'
import { UptimeBars } from './UptimeBars'

export function StatusCard({
                               title,
                               description,
                               status,
                           }: {
    title: string
    description: string
    status: 'operational' | 'degraded' | 'down'
}) {
    const uptime = Array.from({ length: 30 }, () =>
        Math.random() > 0.05 ? 'up' : 'down'
    )

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <StatusBadge status={status} />
            </div>

            <p className="text-sm text-slate-600 mt-1">{description}</p>

            <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Uptime (last 30 days)</span>
                    <span>100% – No current issues</span>
                </div>

                <UptimeBars data={uptime} />
            </div>
        </div>
    )
}