import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-semibold text-[#1d1d1f] mb-12">
        五险一金计算器
      </h1>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
        {/* 数据上传卡片 */}
        <Link
          href="/upload"
          className="flex-1 p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
        >
          <div className="w-12 h-12 bg-[#0071e3] rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-[#1d1d1f] mb-2">
            数据上传
          </h2>
          <p className="text-[#86868b] text-sm">
            上传 Excel 文件，导入城市社保标准和员工工资数据
          </p>
        </Link>

        {/* 结果查询卡片 */}
        <Link
          href="/results"
          className="flex-1 p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
        >
          <div className="w-12 h-12 bg-[#34c759] rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-[#1d1d1f] mb-2">
            结果查询
          </h2>
          <p className="text-[#86868b] text-sm">
            查看已计算的员工社保公积金缴纳明细
          </p>
        </Link>
      </div>
    </div>
  );
}
