import { useNavigate } from 'react-router-dom'

import FuzzyText from '@/components/FuzzyText'

export default function NotFoundPage() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-8">
          <FuzzyText
            baseIntensity={0.2}
            color="#000"
            fontSize="clamp(8rem, 20vw, 12rem)"
            hoverIntensity={0.4}
          >
            404
          </FuzzyText>
        </div>

        <div className="mb-8 space-y-3">
          <p className="text-foreground-500 text-sm md:text-base leading-relaxed">
            抱歉，您访问的页面不存在或已被移动
          </p>
        </div>
        <button
          className="text-sm font-medium cursor-pointer"
          onClick={handleGoHome}
        >
          返回首页
        </button>
      </div>
    </div>
  )
}
