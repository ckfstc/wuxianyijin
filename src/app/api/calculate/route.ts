import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface SalaryRecord {
  employee_name: string
  salary_amount: number
}

interface CityStandard {
  base_min: number
  base_max: number
  rate: number
}

interface ResultRecord {
  employee_name: string
  avg_salary: number
  contribution_base: number
  company_fee: number
}

export async function POST() {
  try {
    // 1. 清空 results 表
    const { error: deleteError } = await supabase
      .from('results')
      .delete()
      .neq('id', 0)

    if (deleteError) {
      return NextResponse.json(
        { error: '清空 results 表失败: ' + deleteError.message },
        { status: 500 }
      )
    }

    // 2. 从 salaries 表读取所有数据
    const { data: salariesData, error: salariesError } = await supabase
      .from('salaries')
      .select('employee_name, salary_amount')

    if (salariesError) {
      return NextResponse.json(
        { error: '读取 salaries 数据失败: ' + salariesError.message },
        { status: 500 }
      )
    }

    // 3. 按员工姓名分组，计算年度月平均工资
    const salaryMap = new Map<string, number[]>()

    for (const record of salariesData as SalaryRecord[]) {
      if (!salaryMap.has(record.employee_name)) {
        salaryMap.set(record.employee_name, [])
      }
      salaryMap.get(record.employee_name)!.push(record.salary_amount)
    }

    const avgSalaries: { name: string; avg: number }[] = []

    for (const [name, amounts] of salaryMap) {
      const sum = amounts.reduce((a, b) => a + b, 0)
      const avg = sum / amounts.length
      avgSalaries.push({ name, avg })
    }

    // 4. 从 cities 表获取佛山的社保标准
    const { data: cityData, error: cityError } = await supabase
      .from('cities')
      .select('base_min, base_max, rate')
      .eq('city_name', '佛山')
      .single()

    if (cityError || !cityData) {
      return NextResponse.json(
        { error: '未找到佛山的社保标准数据，请先上传 cities.xlsx' },
        { status: 500 }
      )
    }

    const cityStandard = cityData as unknown as CityStandard

    // 5. 计算每位员工的结果
    const results: ResultRecord[] = []

    for (const employee of avgSalaries) {
      let contributionBase: number

      // 比较平均工资与基数上下限，确定最终缴费基数
      if (employee.avg < cityStandard.base_min) {
        contributionBase = cityStandard.base_min
      } else if (employee.avg > cityStandard.base_max) {
        contributionBase = cityStandard.base_max
      } else {
        contributionBase = employee.avg
      }

      // 计算公司缴纳金额
      const companyFee = contributionBase * cityStandard.rate

      results.push({
        employee_name: employee.name,
        avg_salary: Math.round(employee.avg * 100) / 100,
        contribution_base: Math.round(contributionBase * 100) / 100,
        company_fee: Math.round(companyFee * 100) / 100,
      })
    }

    // 6. 将结果存入 results 表
    const { error: insertError } = await supabase
      .from('results')
      .insert(results)

    if (insertError) {
      return NextResponse.json(
        { error: '插入计算结果失败: ' + insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `计算完成，共处理 ${results.length} 名员工的数据`,
      results,
    })
  } catch (error) {
    console.error('计算出错:', error)
    return NextResponse.json(
      { error: '计算失败: ' + (error as Error).message },
      { status: 500 }
    )
  }
}
