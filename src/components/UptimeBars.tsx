export function UptimeBars({ data }: { data: ('up' | 'down')[] }) {
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