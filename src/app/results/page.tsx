"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Result {
  id: number;
  employee_name: string;
  avg_salary: number;
  contribution_base: number;
  company_fee: number;
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch("/api/results");
      const data = await response.json();

      if (response.ok) {
        setResults(data.results || []);
      } else {
        setError(data.error || "获取数据失败");
      }
    } catch (err) {
      setError("获取数据出错: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* 顶部导航 */}
        <div className="flex items-center gap-4 mb-12">
          <Link
            href="/"
            className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
          >
            <svg
              className="w-5 h-5 text-[#1d1d1f]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-2xl font-semibold text-[#1d1d1f]">
            计算结果查询
          </h1>
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#0071e3] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="p-4 bg-[#ff3b30]/10 text-[#ff3b30] rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* 结果表格 */}
        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f5f5f7]">
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#86868b]">
                      员工姓名
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-[#86868b]">
                      年度月平均工资
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-[#86868b]">
                      最终缴费基数
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-[#86868b]">
                      公司缴纳金额
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-[#86868b]"
                      >
                        暂无计算结果，请先{" "}
                        <Link href="/upload" className="text-[#0071e3] hover:underline">
                          上传数据
                        </Link>{" "}
                        并执行计算
                      </td>
                    </tr>
                  ) : (
                    results.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`border-t border-[#e5e5e5] ${
                          index % 2 === 0 ? "bg-white" : "bg-[#fafafa]"
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-[#1d1d1f] font-medium">
                          {item.employee_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#1d1d1f] text-right">
                          ¥ {item.avg_salary.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#1d1d1f] text-right">
                          ¥ {item.contribution_base.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#34c759] text-right font-medium">
                          ¥ {item.company_fee.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
