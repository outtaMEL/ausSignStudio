'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function TemplateDetailPage() {
  const params = useParams()
  const code = params.code as string

  return (
    <div className="border rounded-2xl p-6 bg-white">
      <div className="flex items-start gap-6">
        <div className="w-80 h-60 border rounded-xl grid place-items-center bg-zinc-50 text-zinc-400">
          {code} preview
        </div>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{code} Template</h1>
          <p className="text-zinc-600 mb-6">
            这是 {code} 模板的详细参数和规格说明。
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">尺寸规格</h3>
              <div className="text-sm text-zinc-600 space-y-1">
                <p>• 宽度: 3800mm</p>
                <p>• 高度: 1400mm</p>
                <p>• 主字号: 240mm</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">适用场景</h3>
              <p className="text-sm text-zinc-600">
                适用于高速公路、主干道等需要提前指示的场景。
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">规范参考</h3>
              <p className="text-sm text-zinc-600">
                AS 1742.6 Section 1.6.2
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-3">
            <Link
              href={`/new?tpl=${code}`}
              className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-sm"
            >
              使用此模板
            </Link>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg border text-sm"
            >
              返回
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

