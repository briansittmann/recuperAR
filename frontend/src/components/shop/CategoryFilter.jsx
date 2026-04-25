export default function CategoryFilter({ categories, selected, onSelect }) {
  const btnStyle = (active) => ({
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    border: '1px solid #1a1a1a',
    background: active ? '#1a1a1a' : 'transparent',
    color: active ? '#fff' : '#1a1a1a',
    cursor: 'pointer',
    fontSize: '0.9rem',
  })

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
      <button style={btnStyle(!selected)} onClick={() => onSelect('')}>Todos</button>
      {categories.map(cat => (
        <button key={cat.id} style={btnStyle(selected === cat.slug)} onClick={() => onSelect(cat.slug)}>
          {cat.name}
        </button>
      ))}
    </div>
  )
}
