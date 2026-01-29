'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Maximize2 } from 'lucide-react'

interface ScreenCaptureProps {
  onCapture: (file: File) => void
  onClose: () => void
}

export default function ScreenCapture({ onCapture, onClose }: ScreenCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selection, setSelection] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const captureScreen = useCallback(async () => {
    setIsCapturing(true)
    try {
      // Screen Capture APIを使用して画面全体をキャプチャ
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor', // 画面全体を優先
        } as any,
        audio: false,
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        
        // ビデオが読み込まれるまで待つ
        await new Promise<void>((resolve) => {
          const checkReady = () => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
              resolve()
            } else {
              setTimeout(checkReady, 100)
            }
          }
          checkReady()
        })
        
        // 画面共有の選択UIが消えるまで待つ（2秒待機）
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 静止画としてキャプチャ
        const video = videoRef.current
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        
        if (ctx) {
          ctx.drawImage(video, 0, 0)
          const imageDataUrl = canvas.toDataURL('image/png')
          setCapturedImage(imageDataUrl)
          
          // ストリームを停止
          stream.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
        
        setIsCapturing(false)
        
        // ストリームが停止したときの処理
        stream.getVideoTracks()[0].addEventListener('ended', () => {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
          }
          setIsCapturing(false)
        })
      }
    } catch (error) {
      console.error('Failed to capture screen:', error)
      if ((error as Error).name !== 'NotAllowedError') {
        alert('画面のキャプチャに失敗しました。ブラウザが画面共有をサポートしていない可能性があります。')
      }
      setIsCapturing(false)
    }
  }, [])

  const captureFromVideo = useCallback(() => {
    if (!videoRef.current) return
    
    const video = videoRef.current
    
    // ビデオが読み込まれているか確認
    if (video.readyState < 2) {
      video.addEventListener('loadeddata', () => {
        captureFromVideo()
      }, { once: true })
      return
    }
    
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      ctx.drawImage(video, 0, 0)
      const imageDataUrl = canvas.toDataURL('image/png')
      setCapturedImage(imageDataUrl)
      
      // ストリームを停止
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
      
      setIsCapturing(false)
    }
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // キャプチャした画像がある場合のみ選択可能
    if (!capturedImage || !containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setStartPos({ x, y })
    setIsSelecting(true)
    setSelection({ x, y, width: 0, height: 0 })
  }, [capturedImage])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isSelecting || !startPos || !containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const currentX = e.clientX - rect.left
    const currentY = e.clientY - rect.top
    
    const width = currentX - startPos.x
    const height = currentY - startPos.y
    
    setSelection({
      x: width < 0 ? currentX : startPos.x,
      y: height < 0 ? currentY : startPos.y,
      width: Math.abs(width),
      height: Math.abs(height),
    })
  }, [isSelecting, startPos])

  const handleMouseUp = useCallback(() => {
    if (!isSelecting || !selection || !capturedImage) return
    
    // 選択範囲が小さすぎる場合は無視
    if (selection.width < 10 || selection.height < 10) {
      setIsSelecting(false)
      setSelection(null)
      return
    }
    
    setIsSelecting(false)
    
    // キャプチャした画像から選択範囲を切り出し
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = selection.width
      canvas.height = selection.height
      const ctx = canvas.getContext('2d')
      
      if (ctx && containerRef.current) {
        // 表示されている画像のサイズと実際の画像サイズの比率を計算
        const displayWidth = containerRef.current.clientWidth
        const displayHeight = (img.height * displayWidth) / img.width
        const scaleX = img.width / displayWidth
        const scaleY = img.height / displayHeight
        
        ctx.drawImage(
          img,
          selection.x * scaleX,
          selection.y * scaleY,
          selection.width * scaleX,
          selection.height * scaleY,
          0,
          0,
          selection.width,
          selection.height
        )
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `thumbnail-${Date.now()}.png`, { type: 'image/png' })
            onCapture(file)
            onClose()
          }
        }, 'image/png')
      }
    }
    img.src = capturedImage
  }, [isSelecting, selection, capturedImage, onCapture, onClose])

  // ESCキーでキャンセル
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && videoRef.current?.srcObject) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
        onClose()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center">
      <div className="bg-background rounded-lg shadow-xl max-w-7xl w-full h-full md:h-auto md:max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">画面をキャプチャして領域を選択</h2>
          <div className="flex gap-2">
            {!capturedImage && (
              <Button onClick={captureScreen} disabled={isCapturing}>
                {isCapturing ? 'キャプチャ中...' : '画面をキャプチャ'}
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {isCapturing ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Maximize2 className="h-16 w-16 mb-4 opacity-50 animate-pulse" />
              <p className="text-lg mb-2">画面共有を選択してください</p>
              <p className="text-sm mb-4">「画面全体」または「ウィンドウ」を選択してください</p>
              <p className="text-xs text-muted-foreground">選択UIの点線が消えるまでお待ちください（約2秒）...</p>
            </div>
          ) : capturedImage ? (
            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary rounded-lg p-3">
                <p className="text-sm font-medium text-primary text-center">
                  💡 画像上をドラッグして領域を選択してください
                </p>
              </div>
              <div
                ref={containerRef}
                className="relative cursor-crosshair border-2 border-dashed border-muted-foreground/50 rounded-lg p-2 bg-muted/30"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  src={capturedImage}
                  alt="キャプチャした画面"
                  className="max-w-full h-auto rounded"
                  draggable={false}
                />
                {!selection && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-background/90 backdrop-blur-sm rounded-lg p-4 border border-primary">
                      <p className="text-sm font-medium text-center">
                        ここをドラッグして領域を選択
                      </p>
                    </div>
                  </div>
                )}
                {selection && selection.width > 0 && selection.height > 0 && (
                  <>
                    <div
                      className="absolute border-4 border-solid border-primary bg-primary/10 pointer-events-none z-10"
                      style={{
                        left: `${selection.x}px`,
                        top: `${selection.y}px`,
                        width: `${selection.width}px`,
                        height: `${selection.height}px`,
                        boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.2)',
                      }}
                    />
                    <div
                      className="absolute bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded pointer-events-none z-20"
                      style={{
                        left: `${selection.x}px`,
                        top: `${selection.y - 25}px`,
                      }}
                    >
                      {Math.round(selection.width)} × {Math.round(selection.height)}px
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="bg-primary/10 border border-primary rounded-lg p-6 max-w-md">
                <Maximize2 className="h-16 w-16 mb-4 opacity-50 mx-auto" />
                <p className="text-lg font-medium mb-2">画面をキャプチャして領域を選択</p>
                <p className="text-sm text-muted-foreground mb-4">
                  「画面をキャプチャ」ボタンをクリックすると、ブラウザの画面共有ダイアログが表示されます。
                </p>
                <div className="bg-background rounded p-3 text-left space-y-2 text-xs">
                  <p className="font-medium">📋 手順:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>「画面をキャプチャ」ボタンをクリック</li>
                    <li>画面共有ダイアログで「画面全体」または「ウィンドウ」を選択</li>
                    <li>自動的にキャプチャされます</li>
                    <li>キャプチャした画像上をドラッグして領域を選択</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {capturedImage && (
          <div className="p-4 border-t space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              <span className="font-medium text-foreground">画像上をドラッグ</span>して領域を選択してください。
            </p>
            <p className="text-xs text-muted-foreground text-center">
              マウスボタンを離すと自動的にサムネイルとして保存されます。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
