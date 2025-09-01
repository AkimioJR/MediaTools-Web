import React from 'react'

interface FormattedTextProps {
  text: string
  className?: string
  lineClassName?: string
  trim?: boolean
}

/**
 * FormattedText组件 - 将多行文本按行分割并渲染
 * @param text - 要渲染的文本内容
 * @param className - 容器容器的CSS类名
 * @param lineClassName - 每行文本的CSS类名
 * @param trim - 是否去除首尾空白字符，默认为true
 */
export const FormattedText: React.FC<FormattedTextProps> = ({
  text,
  className = '',
  lineClassName = '',
  trim = true,
}) => {
  const processedText = trim ? text.trim() : text
  const lines = processedText.split('\n')

  return (
    <div className={className}>
      {lines.map((line, index) => (
        <p key={index} className={lineClassName}>
          {line}
        </p>
      ))}
    </div>
  )
}

export default FormattedText
