'use client'

import Link from 'next/link'

function SectionCard({ title, subtitle, children }: any) {
  return (
    <section className="border rounded-2xl p-4 mb-6 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

const TEMPLATES = [
  { code: 'G1-1', name: 'Stack Wide', thumb: '/thumbs/g1-1.svg' },
  { code: 'G1-N', name: 'Stack Narrow', thumb: '/thumbs/g1-n.svg' },
  { code: 'G2', name: 'Intersection Type 1', thumb: '/thumbs/g2.svg' },
  { code: 'G3', name: 'Intersection Type 2', thumb: '/thumbs/g3.svg' },
  { code: 'Type 3', name: 'Fingerboard', thumb: '/thumbs/type3.svg' },
  { code: 'Type D', name: 'Driving Instruction', thumb: '/thumbs/typed.svg' },
  { code: 'DIA', name: 'Diagrammatic', thumb: '/thumbs/dia.svg' },
]

export default function DashboardPage() {
  return (
    <>
      {/* 顶部两块并排 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="Saved" subtitle="你保存的标志与模板">
          <div className="text-zinc-500 text-sm">暂无保存内容</div>
        </SectionCard>
        <SectionCard title="Recent" subtitle="最近打开">
          <div className="text-zinc-500 text-sm">暂无最近记录</div>
        </SectionCard>
      </div>

      {/* 下方：所有模板 */}
      <SectionCard title="All Templates" subtitle="选择模板开始；Details 可查看参数">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {TEMPLATES.map((t) => (
            <div key={t.code} className="border rounded-xl overflow-hidden bg-white">
              <div className="aspect-[4/3] grid place-items-center bg-zinc-50">
                {/* 可替换为真实缩略图 */}
                <span className="text-xs text-zinc-400">{t.thumb}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-zinc-500">{t.code}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/new" className="text-emerald-700 text-sm">
                    Use
                  </Link>
                  <Link href={`/templates/${t.code}`} className="text-zinc-500 text-xs underline">
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  )
}

