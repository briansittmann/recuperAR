export default function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false }) {
  const styles = {
    primary:   { background: '#1a1a1a', color: '#fff' },
    secondary: { background: '#e5e7eb', color: '#1a1a1a' },
    danger:    { background: '#dc2626', color: '#fff' },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        padding: '0.6rem 1.2rem',
        border: 'none',
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        fontWeight: '500',
        fontSize: '0.9rem',
      }}
    >
      {children}
    </button>
  )
}
