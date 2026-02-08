export function StatusBadge({ status }: { status: 'operational' | 'degraded' | 'down' }) {
    const map = {
        operational: 'bg-green-50 text-green-700 border-green-200',
        degraded: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        down: 'bg-red-50 text-red-700 border-red-200',
    }

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${map[status]}`}>
      <span className="w-2 h-2 rounded-full bg-current" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
    )
}