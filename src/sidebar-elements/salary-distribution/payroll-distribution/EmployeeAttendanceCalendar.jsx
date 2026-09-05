import { useEffect, useMemo, useState } from "react";
import { getEmployeeAttendance } from "../services/payrollApi";
import Loader from "../../../alert-modal/Loader";

const EmployeeAttendanceCalendar = ({ employeeId, payrollMonth }) => {
  const [attendance, setAttendance] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!employeeId || !payrollMonth) return;

    let cancelled = false;

    const loadAttendance = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getEmployeeAttendance({
          employeeId,
          month: payrollMonth,
        });

        if (cancelled) return;

        setAttendance(data.attendance || []);
        setHolidays(data.holidays || []);
      } catch (error) {
        if (cancelled) return;

        console.error("EMPLOYEE ATTENDANCE ERROR:", error);

        setError(error.message || "Unable to load employee attendance.");

        setAttendance([]);
        setHolidays([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAttendance();

    return () => {
      cancelled = true;
    };
  }, [employeeId, payrollMonth]);

  /*
   * Convert Apps Script date into YYYY-MM-DD.
   *
   * The API returns dates in UTC ISO format.
   * We intentionally use UTC here so the date does not
   * shift because of the browser's local timezone.
   */
  const getDateKey = (value) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return [
      date.getUTCFullYear(),
      String(date.getUTCMonth() + 1).padStart(2, "0"),
      String(date.getUTCDate()).padStart(2, "0"),
    ].join("-");
  };

  const getTime = (value) => {
    if (!value) return "";

    // Backend now returns time directly as "HH:mm"
    if (typeof value === "string") {
      return value;
    }

    // Fallback for Date values, if any older API response is received
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
    }

    return "";
  };
  
  const calendarDays = useMemo(() => {
    if (!payrollMonth) return [];

    const [year, month] = payrollMonth.split("-").map(Number);

    if (!year || !month) return [];

    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

    const attendanceMap = {};
    const holidayMap = {};

    attendance.forEach((record) => {
      const key = getDateKey(record.date);

      if (key) {
        attendanceMap[key] = record;
      }
    });

    holidays.forEach((holiday) => {
      const key = getDateKey(holiday.date);

      if (key) {
        holidayMap[key] = holiday;
      }
    });

    return Array.from({ length: daysInMonth }, (_, index) => {
      const dayNumber = index + 1;

      const date = new Date(Date.UTC(year, month - 1, dayNumber));

      const dateKey = getDateKey(date);

      const dayOfWeek = date.getUTCDay();

      const isSunday = dayOfWeek === 0;

      const attendanceRecord = attendanceMap[dateKey] || null;

      const holiday = holidayMap[dateKey] || null;

      let status = "Absent";

      if (holiday) {
        status = "Holiday";
      } else if (isSunday) {
        status = attendanceRecord ? "Present" : "Sunday";
      } else if (attendanceRecord) {
        status = "Present";
      }

      return {
        date,
        dateKey,
        dayNumber,
        dayName: date.toLocaleDateString("en-IN", {
          weekday: "short",
          timeZone: "UTC",
        }),
        isSunday,
        attendance: attendanceRecord,
        holiday,
        status,
      };
    });
  }, [attendance, holidays, payrollMonth]);

  const summary = useMemo(() => {
    const present = calendarDays.filter(
      (day) => day.status === "Present",
    ).length;

    const absent = calendarDays.filter((day) => day.status === "Absent").length;

    const sundays = calendarDays.filter(
      (day) => day.status === "Sunday",
    ).length;

    const holidayCount = calendarDays.filter(
      (day) => day.status === "Holiday",
    ).length;

    return {
      present,
      absent,
      sundays,
      holidays: holidayCount,
    };
  }, [calendarDays]);

  const getStatusClasses = (status) => {
    switch (status) {
      case "Present":
        return "border-emerald-200 bg-emerald-50";

      case "Absent":
        return "border-red-200 bg-red-50";

      case "Sunday":
        return "border-slate-200 bg-slate-100";

      case "Holiday":
        return "border-blue-200 bg-blue-50";

      default:
        return "border-slate-200 bg-white";
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case "Present":
        return "bg-emerald-500";

      case "Absent":
        return "bg-red-500";

      case "Sunday":
        return "bg-slate-400";

      case "Holiday":
        return "bg-blue-500";

      default:
        return "bg-slate-300";
    }
  };

  const monthLabel = useMemo(() => {
    if (!payrollMonth) return "";

    const [year, month] = payrollMonth.split("-").map(Number);

    if (!year || !month) return "";

    return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  }, [payrollMonth]);

  if (loading) {
    return (
      <Loader
        message="Loading attendance..."
        subMessage="Please wait while employee attendance is being loaded."
      />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-800">
          Attendance Calendar
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Daily attendance for {monthLabel}.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* Summary */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
          <p className="text-xs text-emerald-600">Present</p>

          <p className="mt-1 text-lg font-semibold text-emerald-700">
            {summary.present}
          </p>
        </div>

        <div className="rounded-lg border border-red-100 bg-red-50 p-3">
          <p className="text-xs text-red-600">Absent</p>

          <p className="mt-1 text-lg font-semibold text-red-700">
            {summary.absent}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Sundays</p>

          <p className="mt-1 text-lg font-semibold text-slate-700">
            {summary.sundays}
          </p>
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
          <p className="text-xs text-blue-600">Holidays</p>

          <p className="mt-1 text-lg font-semibold text-blue-700">
            {summary.holidays}
          </p>
        </div>
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            {day}
          </div>
        ))}

        {/* Empty cells before first day */}
        {calendarDays.length > 0 &&
          Array.from({
            length: calendarDays[0].date.getUTCDay(),
          }).map((_, index) => <div key={`empty-${index}`} />)}

        {calendarDays.map((day) => (
          <div
            key={day.dateKey}
            className={`group relative min-h-22 rounded-lg border p-2 transition ${getStatusClasses(
              day.status,
            )}`}
          >
            {/* Date */}
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-slate-700">
                {day.dayNumber}
              </span>

              <span
                className={`h-2 w-2 rounded-full ${getStatusDot(day.status)}`}
              />
            </div>

            {/* Status */}
            <div className="mt-2">
              <p className="text-[11px] font-medium text-slate-700">
                {day.status}
              </p>

              {day.attendance && (
                <div className="mt-1 space-y-0.5">
                  {day.attendance.firstIn && (
                    <p className="text-[10px] text-slate-500">
                      In: {getTime(day.attendance.firstIn)}
                    </p>
                  )}

                  {day.attendance.lastOut && (
                    <p className="text-[10px] text-slate-500">
                      Out: {getTime(day.attendance.lastOut)}
                    </p>
                  )}
                </div>
              )}

              {day.holiday && (
                <p
                  className="mt-1 truncate text-[10px] font-medium text-blue-600"
                  title={day.holiday.name}
                >
                  {day.holiday.name}
                </p>
              )}

              {day.attendance?.remarks && (
                <p
                  className="mt-1 truncate text-[10px] text-slate-500"
                  title={day.attendance.remarks}
                >
                  {day.attendance.remarks}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-4">
        {[
          ["Present", "bg-emerald-500"],
          ["Absent", "bg-red-500"],
          ["Sunday", "bg-slate-400"],
          ["Holiday", "bg-blue-500"],
        ].map(([label, color]) => (
          <div
            key={label}
            className="flex items-center gap-2 text-xs text-slate-500"
          >
            <span className={`h-2.5 w-2.5 rounded-full ${color}`} />

            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeAttendanceCalendar;
