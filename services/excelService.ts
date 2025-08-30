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

export const validateFileHeaders = (
  filesWithSheets: UploadedFileState[]
): Promise<string[]> => {
  return new Promise(async (resolve) => {
    if (filesWithSheets.length <= 1) {
      return resolve([]);
    }

    let firstHeaders: string[] | null = null;
    const invalidFileNames: string[] = [];

    for (const fileItem of filesWithSheets) {
      const fileName = fileItem.file.name;
      try {
        const fileBuffer = await fileItem.file.arrayBuffer();
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

        const sheetsToProcess: string[] = fileItem.selectedSheet === '__ALL__' ? workbook.SheetNames : [fileItem.selectedSheet];
        
        let headersFoundInFile = false;
        for (const sheetName of sheetsToProcess) {
          if (!workbook.SheetNames.includes(sheetName)) continue;
          
          const worksheet = workbook.Sheets[sheetName];
          const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet, { defval: "", raw: false, dateNF: 'yyyy-mm-dd' });

          if (jsonData.length > 0) {
            headersFoundInFile = true;
            const currentHeaders = Object.keys(jsonData[0]);
            
            if (!firstHeaders) {
              firstHeaders = currentHeaders;
            } else if (JSON.stringify(firstHeaders) !== JSON.stringify(currentHeaders)) {
              if (!invalidFileNames.includes(fileName)) {
                invalidFileNames.push(fileName);
              }
              break; 
            }
          }
        }
      } catch (error) {
        if (!invalidFileNames.includes(fileName)) {
          invalidFileNames.push(fileName);
        }
      }
    }
    resolve(invalidFileNames);
  });
};


export const readExcelFiles = (
  filesWithSheets: UploadedFileState[]
): Promise<{ data: ExcelRow[], headers: string[] }> => {
  return new Promise(async (resolve, reject) => {
    if (filesWithSheets.length === 0) {
      return resolve({ data: [], headers: [] });
    }

    const allData: ExcelRow[] = [];
    let headers: string[] = [];

    try {
        for (const fileItem of filesWithSheets) {
          const file = fileItem.file;
          const selectedSheet = fileItem.selectedSheet;

          const fileBuffer = await file.arrayBuffer();
          const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

          const sheetsToProcess: string[] = selectedSheet === '__ALL__' ? workbook.SheetNames : [selectedSheet];
          
          for (const sheetName of sheetsToProcess) {
              if (!workbook.SheetNames.includes(sheetName)) continue;

              const worksheet = workbook.Sheets[sheetName];
              const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet, { defval: "", raw: false, dateNF: 'yyyy-mm-dd' });
              
              if (jsonData.length > 0) {
                  if (headers.length === 0) {
                      headers = Object.keys(jsonData[0]);
                  }
                  allData.push(...jsonData);
              }
          }
        }
        resolve({ data: allData, headers });
    } catch (error) {
        reject(error);
    }
  });
};


export const exportToExcel = (data: ExcelRow[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};