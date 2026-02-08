type Status = 'operational' | 'degraded' | 'down'

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    operational: 'bg-green-50 text-green-700 border-green-200',
    degraded: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    down: 'bg-red-50 text-red-700 border-red-200',
  }

  return (
      <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
      >
      <span className="w-2 h-2 rounded-full bg-current" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function UptimeBars({ data }: { data: ('up' | 'down')[] }) {
  return (
      <div className="flex gap-[3px] mt-3">
        {data.map((d, i) => (
            <div
                key={i}
                className={`h-8 w-[4px] rounded-sm ${
                    d === 'up' ? 'bg-green-500/80' : 'bg-red-500'
                }`}
            />
        ))}
      </div>
  )
}

function generateUptime(status: Status, days = 30): ('up' | 'down')[] {
    if (status === 'operational') {
        return Array(days).fill('up')
    }

    if (status === 'degraded') {
        return Array.from({ length: days }, (_, i) =>
            i % 7 === 0 ? 'down' : 'up'
        )
    }

    // down
    return Array(days).fill('down')
}

function StatusCard({
                      title,
                      description,
                      status,
                    }: {
  title: string
  description: string
  status: Status
}) {
    const uptime = generateUptime(status)

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

export default function HomePage() {
  return (
      <div className="min-h-screen bg-[#F8FAFF]">
        <header className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
              R
            </div>
            <div>
              <div className="font-semibold text-slate-900">Revzion</div>
              <div className="text-xs text-slate-500">Platform Status</div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-14">
          <h1 className="text-3xl font-semibold text-slate-900">
            Platform Status
          </h1>
          <p className="text-slate-600 mt-2">
            Any issues with Revzion services will be listed below.
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <StatusCard
                title="Security & Authentication"
                description="Login, permissions, and access control"
                status="operational"
            />

            <StatusCard
                title="API Layer"
                description="Public and Admin APIs"
                status="degraded"
            />

            <StatusCard
                title="Content Delivery"
                description="Static assets and media delivery"
                status="operational"
            />

            <StatusCard
                title="Database"
                description="Primary PostgreSQL cluster"
                status="operational"
            />
          </div>
        </main>
      </div>
  )
}