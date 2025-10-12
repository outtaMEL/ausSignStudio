'use client'

import { User, Settings, Bell, Shield, LogOut } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* User Info */}
      <div className="border rounded-2xl p-6 bg-white">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center">
            <User className="h-12 w-12 text-emerald-700" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">用户名:</h1>
            <p className="text-zinc-500 text-sm mb-4">user@example.com</p>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-lg border text-sm hover:bg-zinc-50">
                编辑资料
              </button>
              <button className="px-4 py-2 rounded-lg border text-sm hover:bg-zinc-50">
                修改密码
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-xl p-4 bg-white">
          <div className="text-2xl font-bold text-emerald-700">12</div>
          <div className="text-sm text-zinc-500 mt-1">已保存标志</div>
        </div>
        <div className="border rounded-xl p-4 bg-white">
          <div className="text-2xl font-bold text-emerald-700">5</div>
          <div className="text-sm text-zinc-500 mt-1">自定义模板</div>
        </div>
        <div className="border rounded-xl p-4 bg-white">
          <div className="text-2xl font-bold text-emerald-700">48</div>
          <div className="text-sm text-zinc-500 mt-1">总导出次数</div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="border rounded-2xl p-6 bg-white">
        <h2 className="text-lg font-semibold mb-4">设置</h2>
        <div className="space-y-3">
          <SettingItem
            icon={<Settings className="h-5 w-5" />}
            title="通用设置"
            description="语言、主题、默认参数等"
          />
          <SettingItem
            icon={<Bell className="h-5 w-5" />}
            title="通知设置"
            description="邮件通知、审计提醒等"
          />
          <SettingItem
            icon={<Shield className="h-5 w-5" />}
            title="隐私与安全"
            description="账户安全、数据权限等"
          />
        </div>
      </div>

      {/* Account Actions */}
      <div className="border rounded-2xl p-6 bg-white">
        <h2 className="text-lg font-semibold mb-4">账户操作</h2>
        <div className="space-y-3">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border hover:bg-zinc-50 text-left">
            <LogOut className="h-5 w-5 text-zinc-500" />
            <div>
              <div className="font-medium text-sm">退出登录</div>
              <div className="text-xs text-zinc-500">登出当前账户</div>
            </div>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-red-200 hover:bg-red-50 text-left">
            <Shield className="h-5 w-5 text-red-600" />
            <div>
              <div className="font-medium text-sm text-red-600">删除账户</div>
              <div className="text-xs text-red-500">永久删除账户及所有数据</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

function SettingItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg border hover:bg-zinc-50 text-left">
      <div className="text-zinc-500">{icon}</div>
      <div className="flex-1">
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-zinc-500">{description}</div>
      </div>
      <div className="text-zinc-400">›</div>
    </button>
  )
}

