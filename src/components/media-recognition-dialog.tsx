import type { RecognizeMediaDetail } from '@/types/media'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { Divider } from '@heroui/divider'
import { Spinner } from '@heroui/spinner'

import { RecognizeService } from '@/services/recognize'
import MediaDetailCard from '@/components/media-detail-card'

interface MediaDetailProps {
  mediaResp?: RecognizeMediaDetail | null
  errMsg?: string | null
}

const MediaDetail = React.memo(function MediaDetail({
  mediaResp,
  errMsg,
}: MediaDetailProps) {
  if (errMsg) {
    return (
      <Card className="w-full" shadow="sm">
        <CardBody>
          <div className="p-4 rounded-lg bg-danger-50 border border-danger-200">
            <div className="flex items-center gap-2 text-danger-600">
              <span className="font-medium">识别失败</span>
            </div>
            <p className="text-danger-700 mt-1">{errMsg}</p>
          </div>
        </CardBody>
      </Card>
    )
  }

  if (!mediaResp?.item?.title) {
    return null
  }

  const { item } = mediaResp

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <MediaDetailCard
        customRule={mediaResp.custom_rule}
        item={item}
        metaRule={mediaResp.meta_rule}
      />
    </motion.div>
  )
})

export function MediaRecognitionDialog({
  defaultValue = '',
}: {
  defaultValue?: string
}) {
  const [mediaTitle, setMediaTitle] = useState(defaultValue)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<RecognizeMediaDetail | null>(null)
  const [errMsg, setErrMsg] = useState<string | null>(null)

  useEffect(() => {
    if (defaultValue && defaultValue.trim()) {
      setMediaTitle(defaultValue)
      const timer = setTimeout(() => {
        handleRecognize(defaultValue)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [defaultValue])

  async function handleRecognize(title?: string) {
    const targetTitle = title || mediaTitle

    if (!targetTitle.trim()) return

    setIsLoading(true)
    setResult(null)
    setErrMsg(null)

    try {
      const response = await RecognizeService.RecognizeMedia(targetTitle.trim())

      setResult(response)
    } catch (error) {
      setResult(null)
      setErrMsg((error as Error).message)
      console.error('Media recognition error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && mediaTitle.trim()) {
      handleRecognize()
    }
  }

  const getButtonText = () => {
    if (isLoading) {
      return '识别中...'
    } else if (result || errMsg) {
      return '再次识别'
    }

    return '开始识别'
  }

  return (
    <div className="flex flex-col max-h-[85vh] md:max-h-[90vh]">
      {!defaultValue.trim() && (
        <div className="flex gap-3 items-center mb-4 flex-shrink-0">
          <Input
            className="flex-1"
            isDisabled={isLoading}
            label="请输入媒体名称"
            size="sm"
            value={mediaTitle}
            onKeyDown={handleKeyPress}
            onValueChange={setMediaTitle}
          />
          <Button
            className="px-6"
            color="primary"
            isDisabled={!mediaTitle.trim() || isLoading}
            isLoading={isLoading}
            variant="shadow"
            onPress={() => handleRecognize()}
          >
            {getButtonText()}
          </Button>
        </div>
      )}

      {isLoading && Boolean(defaultValue.trim()) && (
        <div className="flex justify-center items-center h-full">
          <Spinner variant="gradient" />
        </div>
      )}

      <AnimatePresence>
        {(result || errMsg) && (
          <motion.div
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-col min-h-0 flex-1"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
            transition={{
              height: { duration: 0.4, ease: 'easeInOut' },
              opacity: { duration: 0.3 },
            }}
          >
            <motion.div
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              {!defaultValue.trim() && <Divider className="mb-4" />}
            </motion.div>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 min-h-0 px-1"
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <MediaDetail errMsg={errMsg} mediaResp={result} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
