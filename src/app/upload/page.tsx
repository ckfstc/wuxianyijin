"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const citiesRef = useRef<HTMLInputElement>(null);
  const salariesRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!citiesRef.current?.files?.[0] || !salariesRef.current?.files?.[0]) {
      setMessage("请同时选择 cities.xlsx 和 salaries.xlsx 文件");
      setMessageType("error");
      return;
    }

    setUploading(true);
    setMessage("");
    setMessageType("");

    try {
      const formData = new FormData();
      formData.append("cities", citiesRef.current.files[0]);
      formData.append("salaries", salariesRef.current.files[0]);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setMessageType("success");
      } else {
        setMessage(data.error || "上传失败");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("上传出错: " + (error as Error).message);
      setMessageType("error");
    } finally {
      setUploading(false);
    }
  };

  const handleCalculate = async () => {
    setCalculating(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("/api/calculate", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setMessageType("success");
      } else {
        setMessage(data.error || "计算失败");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("计算出错: " + (error as Error).message);
      setMessageType("error");
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
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
            数据上传与操作
          </h1>
        </div>

        {/* 上传区域 */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <h2 className="text-lg font-medium text-[#1d1d1f] mb-6">
            选择 Excel 文件
          </h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm text-[#86868b] mb-2">
                cities.xlsx (城市社保标准)
              </label>
              <input
                ref={citiesRef}
                type="file"
                accept=".xlsx,.xls"
                className="w-full p-3 border border-[#e5e5e5] rounded-xl text-sm text-[#1d1d1f] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#f5f5f7] file:text-[#1d1d1f] hover:file:bg-[#e5e5e5] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm text-[#86868b] mb-2">
                salaries.xlsx (员工工资数据)
              </label>
              <input
                ref={salariesRef}
                type="file"
                accept=".xlsx,.xls"
                className="w-full p-3 border border-[#e5e5e5] rounded-xl text-sm text-[#1d1d1f] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#f5f5f7] file:text-[#1d1d1f] hover:file:bg-[#e5e5e5] cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full py-3 bg-[#0071e3] text-white font-medium rounded-xl hover:bg-[#0077ed] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? "上传中..." : "上传数据"}
          </button>
        </div>

        {/* 计算按钮 */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <h2 className="text-lg font-medium text-[#1d1d1f] mb-4">
            执行计算
          </h2>
          <p className="text-sm text-[#86868b] mb-6">
            点击按钮后，将根据已上传的数据执行五险一金计算，并将结果存入数据库
          </p>

          <button
            onClick={handleCalculate}
            disabled={calculating}
            className="w-full py-3 bg-[#34c759] text-white font-medium rounded-xl hover:bg-[#30d158] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {calculating ? "计算中..." : "执行计算并存储结果"}
          </button>
        </div>

        {/* 消息提示 */}
        {message && (
          <div
            className={`p-4 rounded-xl ${
              messageType === "success"
                ? "bg-[#34c759]/10 text-[#34c759]"
                : "bg-[#ff3b30]/10 text-[#ff3b30]"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
