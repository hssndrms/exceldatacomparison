
import type { ExcelRow, UploadedFileState } from '../types';

declare const XLSX: any;

export const getExcelSheetNames = (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                resolve(workbook.SheetNames);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsBinaryString(file);
    });
};

export const readExcelFiles = (filesWithSheets: UploadedFileState[]): Promise<{ data: ExcelRow[], headers: string[] }> => {
  return new Promise(async (resolve, reject) => {
    if (filesWithSheets.length === 0) {
      return resolve({ data: [], headers: [] });
    }

    const allData: ExcelRow[] = [];
    let firstHeaders: string[] | null = null;

    for (const fileItem of filesWithSheets) {
        const file = fileItem.file;
        const selectedSheet = fileItem.selectedSheet;

        try {
            const fileBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

            const sheetsToProcess: string[] = [];
            if (selectedSheet === '__ALL__') {
                sheetsToProcess.push(...workbook.SheetNames);
            } else if (selectedSheet && workbook.SheetNames.includes(selectedSheet)) {
                sheetsToProcess.push(selectedSheet);
            }

            for (const sheetName of sheetsToProcess) {
                const worksheet = workbook.Sheets[sheetName];
                if (worksheet) {
                    const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet, { defval: "", raw: false, dateNF: 'yyyy-mm-dd' });
                    
                    if (jsonData.length > 0) {
                        const currentHeaders = Object.keys(jsonData[0]);
                        if (!firstHeaders) {
                            firstHeaders = currentHeaders;
                        } else if (JSON.stringify(firstHeaders) !== JSON.stringify(currentHeaders)) {
                            console.warn(`"${sheetName}" sayfası "${file.name}" dosyasında farklı başlıklara sahip ve atlanacak.`);
                            continue;
                        }
                        allData.push(...jsonData);
                    }
                }
            }
        } catch (error) {
            return reject(error);
        }
    }
    
    resolve({ data: allData, headers: firstHeaders || [] });
  });
};


export const exportToExcel = (data: ExcelRow[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
