// Minimal, dependency-free CSV encode/decode. Handles quoting for values
// containing commas, quotes, or newlines — enough for the flat, simple
// data shapes this app exports (no nested objects/arrays in any column).

function escapeCsvValue(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsv(rows, columns) {
  const header = columns.map((c) => escapeCsvValue(c.label)).join(',');
  const lines = rows.map((row) =>
    columns.map((c) => escapeCsvValue(c.get(row))).join(',')
  );
  return [header, ...lines].join('\n');
}

// Parses a CSV string into an array of { [header]: value } objects. Handles
// quoted fields (including embedded commas/newlines/escaped quotes).
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const nonEmptyRows = rows.filter((r) => r.some((cell) => cell !== ''));
  if (nonEmptyRows.length === 0) return [];

  const [headerRow, ...dataRows] = nonEmptyRows;
  return dataRows.map((r) =>
    Object.fromEntries(headerRow.map((header, i) => [header, r[i] ?? '']))
  );
}

export function downloadCsv(filename, csvString) {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
