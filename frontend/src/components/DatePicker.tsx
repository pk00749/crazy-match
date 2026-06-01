interface Props {
  value: string
  onChange: (date: string) => void
}

export default function DatePicker({ value, onChange }: Props) {
  return (
    <div className="date-picker">
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="date-input"
      />
    </div>
  )
}