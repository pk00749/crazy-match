import { useState } from 'react'

interface DatePickerProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export default function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const [viewDate, setViewDate] = useState(new Date(selectedDate))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const days = []
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d))
  }

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const isToday = (date: Date) => {
    const t = new Date()
    return date.toDateString() === t.toDateString()
  }

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString()
  }

  return (
    <div className="date-picker">
      <div className="date-picker-header">
        <button onClick={prevMonth}>&lt;</button>
        <span>{year}年{month + 1}月</span>
        <button onClick={nextMonth}>&gt;</button>
      </div>
      <div className="date-picker-weekdays">
        {weekDays.map(d => <span key={d}>{d}</span>)}
      </div>
      <div className="date-picker-grid">
        {days.map((date, i) => (
          date ? (
            <button
              key={i}
              className={`day ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
              onClick={() => onDateChange(date)}
            >
              {date.getDate()}
            </button>
          ) : (
            <span key={i} className="empty" />
          )
        ))}
      </div>
    </div>
  )
}