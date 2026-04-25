export default function AdminTable({ headers, rows, renderRow }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            {headers.map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', borderBottom: '2px solid #eee', fontWeight: '600', fontSize: '0.9rem' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={headers.length} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Sin resultados</td></tr>
            : rows.map((row, i) => renderRow(row, i))
          }
        </tbody>
      </table>
    </div>
  )
}
