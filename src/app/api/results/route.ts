import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: '查询结果失败: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ results: data })
  } catch (error) {
    console.error('查询出错:', error)
    return NextResponse.json(
      { error: '查询失败: ' + (error as Error).message },
      { status: 500 }
    )
  }
}
