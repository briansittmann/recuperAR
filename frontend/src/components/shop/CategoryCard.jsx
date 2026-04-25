export default function CategoryCard({ category, active, onClick }) {
  return (
    <button
      type="button"
      className={`category-card-new glass${active ? ' category-card-new--active' : ''}`}
      onClick={onClick}
    >
      <div className="category-card-new__icon-wrap">
        <span className="material-symbols-outlined">{category.icon || 'category'}</span>
      </div>
      <span className="category-card-new__name">{category.name}</span>
    </button>
  )
}
