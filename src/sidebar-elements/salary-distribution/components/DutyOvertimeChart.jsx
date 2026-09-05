const DutyOvertimeChart = () => {
  const data = [
    {
      name: "QPT",
      dutyHours: 3200,
      overtimeHours: 420,
    },
    {
      name: "APT",
      dutyHours: 2100,
      overtimeHours: 280,
    },
    {
      name: "SPI",
      dutyHours: 1450,
      overtimeHours: 190,
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-800">
          Duty Hours vs Overtime Hours
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Comparison of regular duty hours and overtime hours by firm.
        </p>
      </div>

      <div className="space-y-5">
        {data.map((item) => {
          const total = item.dutyHours + item.overtimeHours;

          const dutyWidth = (item.dutyHours / total) * 100;
          const overtimeWidth = (item.overtimeHours / total) * 100;

          return (
            <div key={item.name}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  {item.name}
                </span>

                <span className="text-xs text-slate-500">
                  {item.dutyHours.toLocaleString()} duty /{" "}
                  {item.overtimeHours.toLocaleString()} OT
                </span>
              </div>

              <div className="flex h-8 overflow-hidden rounded-lg bg-slate-100">
                <div
                  className="flex items-center justify-center bg-slate-700 text-xs font-medium text-white"
                  style={{ width: `${dutyWidth}%` }}
                >
                  Duty
                </div>

                <div
                  className="flex items-center justify-center bg-emerald-500 text-xs font-medium text-white"
                  style={{ width: `${overtimeWidth}%` }}
                >
                  OT
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-5 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          Duty Hours
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Overtime Hours
        </div>
      </div>
    </div>
  );
};

export default DutyOvertimeChart;
