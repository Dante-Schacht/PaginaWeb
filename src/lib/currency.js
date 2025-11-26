export const formatCLP = (value) => {
  try {
    const n = Number(value) || 0
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
  } catch {
    return '$0'
  }
}

