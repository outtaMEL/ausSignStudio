'use client'

import { Suspense } from 'react'
import Link from 'next/link'

function NewPageContent() {
  return (
    <div className="border rounded-2xl p-4 bg-white">
      <h1 className="text-xl font-semibold mb-3">Create New Sign · 创建新标志</h1>
      <p className="text-sm text-zinc-500 mb-6">
        详细输入功能正在优化中。请先使用编辑器创建标志。
      </p>
      <Link 
        href="/editor"
        className="inline-block px-4 py-2 rounded-lg bg-emerald-700 text-white text-sm"
      >
        打开编辑器
      </Link>
    </div>
  )
}

export default function NewPage() {
  return (
    <Suspense fallback={<div className="border rounded-2xl p-4 bg-white">Loading...</div>}>
      <NewPageContent />
    </Suspense>
  )
}


