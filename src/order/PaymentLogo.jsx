export default function PaymentLogo({ method }) {
  return (
    <span className={`payment-logo payment-logo--${method}`} aria-hidden="true">
      {method === 'vietqr' ? <img src="/images/payment/vietqr.png" alt="" />
        : method === 'wallet' ? <>
          <img src="/images/payment/momo.svg" alt="" />
          <img src="/images/payment/zalopay.svg" alt="" />
        </> : method === 'cash' ? (
          <svg viewBox="0 0 64 48" fill="none">
            <rect x="8" y="6" width="52" height="32" rx="5" fill="#8fc49a" stroke="#09321d" strokeWidth="2" />
            <rect x="3" y="12" width="52" height="32" rx="5" fill="#d8ebd3" stroke="#09321d" strokeWidth="2" />
            <path d="M14 17a6 6 0 0 1-6 6v10a6 6 0 0 1 6 6h30a6 6 0 0 1 6-6V23a6 6 0 0 1-6-6H14Z" stroke="#47855c" strokeWidth="1.5" />
            <ellipse cx="29" cy="28" rx="8" ry="10" fill="#8fc49a" />
            <text x="29" y="33" textAnchor="middle" fill="#09321d" fontSize="16" fontFamily="sans-serif">₫</text>
          </svg>
        ) : (
          <svg viewBox="0 0 64 48" fill="none">
            <rect x="5" y="6" width="54" height="37" rx="6" fill="#09321d" />
            <path d="M5 15h54v8H5z" fill="#8fc49a" />
            <rect x="12" y="28" width="10" height="8" rx="2" fill="#eb860d" />
            <circle cx="43" cy="33" r="5" fill="#ef6848" /><circle cx="49" cy="33" r="5" fill="#f8b347" fillOpacity=".9" />
          </svg>
        )}
    </span>
  )
}
