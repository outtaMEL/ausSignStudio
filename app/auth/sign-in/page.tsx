'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { LogIn } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login - just redirect to dashboard
    router.push('/')
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
            <LogIn className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">登录</CardTitle>
          <CardDescription>
            登录到 AU Direction Sign Studio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full">
              登录
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">还没有账号？</span>{' '}
              <Link href="/auth/sign-up" className="text-primary hover:underline">
                注册
              </Link>
            </div>
            
            <div className="pt-4 border-t text-center text-xs text-muted-foreground">
              这是一个演示登录页面
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

