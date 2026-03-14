import * as XLSX from 'xlsx'

export interface CityData {
  city_name: string
  year: string
  base_min: number
  base_max: number
  rate: number
}

export interface SalaryData {
  employee_id: string
  employee_name: string
  month: string
  salary_amount: number
}

export function parseCitiesExcel(file: Buffer): CityData[] {
  const workbook = XLSX.read(file, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const data = XLSX.utils.sheet_to_json(sheet) as any[]

  return data.map((row) => ({
    city_name: row['city_namte '] || row['city_name'] || '',
    year: String(row['year']),
    base_min: Number(row['base_min']),
    base_max: Number(row['base_max']),
    rate: Number(row['rate']),
  }))
}

export function parseSalariesExcel(file: Buffer): SalaryData[] {
  const workbook = XLSX.read(file, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const data = XLSX.utils.sheet_to_json(sheet) as any[]

  return data.map((row) => ({
    employee_id: String(row['employee_id']),
    employee_name: String(row['employee_name']),
    month: String(row['month']),
    salary_amount: Number(row['salary_amount']),
  }))
}
