
function StatCard({ label, value, icon: Icon }) {
    return (
            <div className="rounded-[32px] border border-rose-200 bg-gradient-to-br from-white via-rose-50 to-rose-100 p-6 shadow-[0_12px_30px_rgba(244,114,182,0.20)]">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-rose-200 text-rose-700">
                <Icon size={24} />
            </div>

            <div>
                <p className="text-sm font-semibold text-stone-600">
                {label}
                </p>

                <p className="mt-2 break-words text-2xl font-bold text-rose-900 sm:text-3xl">
                    {value}
                </p>
            </div>
        </div>
    );
}

export default StatCard;
