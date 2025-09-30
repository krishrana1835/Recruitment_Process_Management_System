import * as XLSX from 'xlsx';

/**
 * Converts an Excel file to a JSON array.
 * @param {File} file - The Excel file to convert.
 * @returns {Promise<any[]>} A promise that resolves with the JSON data.
 */
export function excelToJson(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) {
        reject("File read error");
        return;
      }

      try {
        // Read the file into a workbook
        const workbook = XLSX.read(data, { type: 'binary' });

        // Get the first worksheet name
        const sheetName = workbook.SheetNames[0];

        // Get the first worksheet
        const worksheet = workbook.Sheets[sheetName];

        // Convert the worksheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsBinaryString(file);
  });
}