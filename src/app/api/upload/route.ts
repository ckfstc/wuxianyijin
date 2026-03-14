import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { parseCitiesExcel, parseSalariesExcel } from '@/lib/excel'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const citiesFile = formData.get('cities') as File | null
    const salariesFile = formData.get('salaries') as File | null

    if (!citiesFile || !salariesFile) {
      return NextResponse.json(
        { error: '请同时上传 cities.xlsx 和 salaries.xlsx 文件' },
        { status: 400 }
      )
    }

    // 解析 cities.xlsx
    const citiesBuffer = Buffer.from(await citiesFile.arrayBuffer())
    const citiesData = parseCitiesExcel(citiesBuffer)

    // 解析 salaries.xlsx
    const salariesBuffer = Buffer.from(await salariesFile.arrayBuffer())
    const salariesData = parseSalariesExcel(salariesBuffer)

    // 清空现有数据并插入新数据
    const { error: citiesError } = await supabase
      .from('cities')
      .delete()
      .neq('id', 0)

    if (citiesError) {
      return NextResponse.json(
        { error: '清空 cities 表失败: ' + citiesError.message },
        { status: 500 }
      )
    }

    const { error: citiesInsertError } = await supabase
      .from('cities')
      .insert(citiesData)

    if (citiesInsertError) {
      return NextResponse.json(
        { error: '插入 cities 数据失败: ' + citiesInsertError.message },
        { status: 500 }
      )
    }

    // 清空 salaries 表并插入新数据
    const { error: salariesDeleteError } = await supabase
      .from('salaries')
      .delete()
      .neq('id', 0)

    if (salariesDeleteError) {
      return NextResponse.json(
        { error: '清空 salaries 表失败: ' + salariesDeleteError.message },
        { status: 500 }
      )
    }

    const { error: salariesInsertError } = await supabase
      .from('salaries')
      .insert(salariesData)

    if (salariesInsertError) {
      return NextResponse.json(
        { error: '插入 salaries 数据失败: ' + salariesInsertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `成功上传 ${citiesData.length} 条城市数据，${salariesData.length} 条工资数据`,
    })
  } catch (error) {
    console.error('上传数据出错:', error)
    return NextResponse.json(
      { error: '上传数据失败: ' + (error as Error).message },
      { status: 500 }
    )
  }
}
