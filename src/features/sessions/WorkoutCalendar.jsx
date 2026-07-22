import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './WorkoutCalendar.css';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function dateKey(date) {
  return date.toISOString().split('T')[0];
}

function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, month, day));
  return cells;
}

function WorkoutCalendar({ sessions }) {
  const navigate = useNavigate();
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const sessionsByDate = useMemo(() => {
    const map = {};
    sessions.forEach((s) => {
      if (s.status !== 'completed' || !s.completedAt?.toDate) return;
      const key = dateKey(s.completedAt.toDate());
      if (!map[key]) map[key] = [];
      map[key].push(s);
    });
    return map;
  }, [sessions]);

  const cells = buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth());
  const monthLabel = viewDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const todayKey = dateKey(today);

  const changeMonth = (delta) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const handleDayClick = (day) => {
    const key = dateKey(day);
    const daySessions = sessionsByDate[key];
    if (daySessions?.length) navigate(`/history/${daySessions[0].id}`);
  };

  return (
    <div className="workout-calendar">
      <div className="workout-calendar-header">
        <button className="session-icon-btn" onClick={() => changeMonth(-1)} aria-label="Previous month">
          <ChevronLeft size={18} />
        </button>
        <span className="workout-calendar-month">{monthLabel}</span>
        <button className="session-icon-btn" onClick={() => changeMonth(1)} aria-label="Next month">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="workout-calendar-weekdays">
        {WEEKDAY_LABELS.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>

      <div className="workout-calendar-grid">
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="workout-calendar-cell is-empty" />;
          const key = dateKey(day);
          const hasSession = Boolean(sessionsByDate[key]?.length);
          const isToday = key === todayKey;

          return (
            <button
              key={i}
              className={`workout-calendar-cell ${hasSession ? 'has-session' : ''} ${isToday ? 'is-today' : ''}`}
              onClick={() => handleDayClick(day)}
              disabled={!hasSession}
            >
              {day.getDate()}
              {hasSession && <span className="workout-calendar-dot" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default WorkoutCalendar;
