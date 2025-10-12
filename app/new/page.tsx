'use client'

import { Suspense } from 'react'
import DetailedSignInput from '@/components/DetailedSignInput'

function NewPageContent() {
  return (
    <div className="border rounded-2xl p-4 bg-white">
      <h1 className="text-xl font-semibold mb-3">Create New Sign · 创建新标志</h1>
      <p className="text-sm text-zinc-500 mb-6">
        选择标志类型，然后为每个方向逐项勾选并填写：箭头、目的地、路号、路名、距离等。左侧实时预览。
      </p>
      <DetailedSignInput />
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


