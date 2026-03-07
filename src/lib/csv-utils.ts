/**
 * Simple utility to convert an array of objects to a CSV string.
 */
export function jsonToCsv(data: any[]): string {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add Headers
  csvRows.push(headers.join(","));

  // Add Data Rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      const escaped = ('' + val).replace(/"/g, '""'); // Escape double quotes
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}
