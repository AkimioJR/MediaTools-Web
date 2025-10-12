declare module 'react' {
  interface CSSProperties {
    '--wails-draggable'?: string
    [key: `--${string}`]: string | number | undefined
  }
}

declare global {
  interface Window {
    runtime?: any
  }
}

export { }
