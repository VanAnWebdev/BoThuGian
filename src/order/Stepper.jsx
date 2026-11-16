// Nút − số lượng + (về 0 thì món bị bỏ khỏi giỏ)
export default function Stepper({ value, onChange, label }) {
  return (
    <div className="stepper" role="group" aria-label={`Số lượng ${label}`}>
      <button type="button" onClick={() => onChange(value - 1)} aria-label={value === 1 ? `Bỏ ${label}` : `Bớt ${label}`}>−</button>
      <span className="num" aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} aria-label={`Thêm ${label}`}>+</button>
    </div>
  )
}
