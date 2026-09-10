/**
 * FluxGlow Standard Date Formatter
 * Estandariza todas las fechas de la aplicación a formato legible:
 * DD de MMM, YYYY (Ej: "06 de Sep, 2026")
 */

const MONTH_NAMES_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

export function formatFluxDate(inputDate?: string | number | Date | null): string {
  if (!inputDate) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = MONTH_NAMES_ES[now.getMonth()];
    const year = now.getFullYear();
    return `${day} de ${month}, ${year}`;
  }

  try {
    let date: Date;

    if (inputDate instanceof Date) {
      date = inputDate;
    } else if (typeof inputDate === 'number') {
      date = new Date(inputDate);
    } else {
      // Check if already in standard formatted style "DD de MMM, YYYY"
      const standardMatch = inputDate.match(/^(\d{1,2})\s+de\s+([A-Za-zñáéíóúÁÉÍÓÚ]{3,4}),?\s+(\d{4})/i);
      if (standardMatch) {
        const d = standardMatch[1].padStart(2, '0');
        const m = standardMatch[2].slice(0, 3);
        const formattedMonth = m.charAt(0).toUpperCase() + m.slice(1).toLowerCase();
        return `${d} de ${formattedMonth}, ${standardMatch[3]}`;
      }

      // Check for YYYY-MM-DD
      const isoYMD = inputDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (isoYMD) {
        const year = isoYMD[1];
        const monthIdx = parseInt(isoYMD[2], 10) - 1;
        const day = isoYMD[3];
        const month = MONTH_NAMES_ES[monthIdx] || 'Sep';
        return `${day} de ${month}, ${year}`;
      }

      date = new Date(inputDate);
    }

    if (isNaN(date.getTime())) {
      return '10 de Sep, 2026';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = MONTH_NAMES_ES[date.getMonth()];
    const year = date.getFullYear();

    return `${day} de ${month}, ${year}`;
  } catch {
    return '10 de Sep, 2026';
  }
}
