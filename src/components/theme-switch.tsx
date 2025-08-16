import { useState, useEffect } from 'react'
import { Button } from '@heroui/button'
import { useTheme } from '@heroui/use-theme'
import { Sun, Moon, Monitor } from 'lucide-react'

import { HeaderIcon } from '@/components/icon'

export interface ThemeSwitchProps {
  className?: string
}

type ThemeMode = 'light' | 'dark' | 'system'

export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [themeMode, setThemeMode] = useState<ThemeMode>('system')

  const { setTheme } = useTheme()

  // 检测系统主题
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }

    return 'light'
  }

  // 应用主题
  const applyTheme = (mode: ThemeMode) => {
    if (mode === 'system') {
      setTheme(getSystemTheme())
    } else {
      setTheme(mode)
    }
  }

  // 监听系统主题变化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      const handleSystemThemeChange = () => {
        if (themeMode === 'system') {
          setTheme(getSystemTheme())
        }
      }

      mediaQuery.addEventListener('change', handleSystemThemeChange)

      return () =>
        mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [themeMode, setTheme])

  // 初始化
  useEffect(() => {
    setIsMounted(true)

    // 从localStorage读取保存的主题模式
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode

    if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
      setThemeMode(savedMode)
      applyTheme(savedMode)
    } else {
      // 默认跟随系统
      setThemeMode('system')
      applyTheme('system')
    }
  }, [])

  if (!isMounted) return <div className="w-6 h-6" />

  const handleThemeToggle = () => {
    let nextMode: ThemeMode

    // 循环切换：system -> light -> dark -> system
    switch (themeMode) {
      case 'system':
        nextMode = 'light'
        break
      case 'light':
        nextMode = 'dark'
        break
      case 'dark':
        nextMode = 'system'
        break
      default:
        nextMode = 'system'
    }

    setThemeMode(nextMode)
    applyTheme(nextMode)
    localStorage.setItem('theme-mode', nextMode)
  }

  const getIcon = () => {
    switch (themeMode) {
      case 'light':
        return Sun
      case 'dark':
        return Moon
      case 'system':
        return Monitor
      default:
        return Monitor
    }
  }

  const getAriaLabel = () => {
    switch (themeMode) {
      case 'light':
        return 'Switch to dark mode'
      case 'dark':
        return 'Switch to system mode'
      case 'system':
        return 'Switch to light mode'
      default:
        return 'Switch theme'
    }
  }

  return (
    <Button
      isIconOnly
      aria-label={getAriaLabel()}
      className={className}
      size="sm"
      variant="light"
      onPress={handleThemeToggle}
    >
      <HeaderIcon icon={getIcon()} />
    </Button>
  )
}
