'use client'

export default function LibraryPage() {
  return (
    <>
      <section className="border rounded-2xl p-4 mb-6 bg-white">
        <h2 className="text-lg font-semibold mb-1">Board Templates</h2>
        <p className="text-sm text-zinc-500 mb-3">所有板式模板（包含你的自定义）</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 模板网格 */}
          <div className="h-24 border rounded-xl grid place-items-center text-zinc-400">G1-1 …</div>
          <div className="h-24 border rounded-xl grid place-items-center text-zinc-400">G1-N …</div>
          <div className="h-24 border rounded-xl grid place-items-center text-zinc-400">G2 …</div>
          <div className="h-24 border rounded-xl grid place-items-center text-zinc-400">Diagram …</div>
        </div>
      </section>

      <section className="border rounded-2xl p-4 bg-white">
        <h2 className="text-lg font-semibold mb-1">Element Library</h2>
        <p className="text-sm text-zinc-500 mb-3">路盾、箭头、服务符号</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          <div className="h-16 border rounded-lg grid place-items-center text-xs text-zinc-500">Axx Shield</div>
          <div className="h-16 border rounded-lg grid place-items-center text-xs text-zinc-500">Mxx Shield</div>
          <div className="h-16 border rounded-lg grid place-items-center text-xs text-zinc-500">Arrow HL</div>
          <div className="h-16 border rounded-lg grid place-items-center text-xs text-zinc-500">Airport</div>
          <div className="h-16 border rounded-lg grid place-items-center text-xs text-zinc-500">Fuel</div>
          <div className="h-16 border rounded-lg grid place-items-center text-xs text-zinc-500">Parking</div>
        </div>
      </section>
    </>
  )
}

