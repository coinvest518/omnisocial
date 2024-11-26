'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Image as KonvaImage, Text, Rect, Transformer } from 'react-konva'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SketchPicker } from 'react-color'
import { Download, Undo, Redo, Upload } from 'lucide-react'
import useImage from 'use-image';

interface Element {
  id: string
  type: 'text' | 'rect' | 'image'
  x: number
  y: number
  width?: number
  height?: number
  text?: string
  fill?: string
  fontSize?: number
  fontFamily?: string
  src?: string
}

const fonts = ['Arial', 'Helvetica', 'Times New Roman', 'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact']

export default function EnhancedThumbnailEditor({ backgroundImage }: { backgroundImage: string }) {
  const [elements, setElements] = useState<Element[]>([])
  const [history, setHistory] = useState<Element[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [selectedId, selectElement] = useState<string | null>(null)
  const [newText, setNewText] = useState('')
  const [textColor, setTextColor] = useState('#ffffff')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [fontSize, setFontSize] = useState(30)
  const [fontFamily, setFontFamily] = useState('Arial')
  const stageRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedId) {
        handleDelete()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId])

  const addToHistory = (newElements: Element[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newElements)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const addText = () => {
    if (newText) {
      const newElement: Element = {
        id: Date.now().toString(),
        type: 'text',
        x: 50,
        y: 50,
        text: newText,
        fill: textColor,
        fontSize: fontSize,
        fontFamily: fontFamily,
      }
      const newElements = [...elements, newElement]
      setElements(newElements)
      addToHistory(newElements)
      setNewText('')
    }
  }

  const addRectangle = () => {
    const newElement: Element = {
      id: Date.now().toString(),
      type: 'rect',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      fill: 'rgba(0,0,0,0.5)',
    }
    const newElements = [...elements, newElement]
    setElements(newElements)
    addToHistory(newElements)
  }

  const handleDragEnd = (e: any) => {
    const id = e.target.id()
    const newElements = elements.map((el) =>
      el.id === id ? { ...el, x: e.target.x(), y: e.target.y() } : el
    )
    setElements(newElements)
    addToHistory(newElements)
  }

  const handleTransformEnd = (e: any) => {
    const node = e.target
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    node.scaleX(1)
    node.scaleY(1)

    const newElements = elements.map((el) =>
      el.id === node.id()
        ? {
            ...el,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          }
        : el
    )
    setElements(newElements)
    addToHistory(newElements)
  }

  const handleSelect = (id: string) => {
    selectElement(id === selectedId ? null : id)
  }

  const handleDelete = () => {
    if (selectedId) {
      const newElements = elements.filter((el) => el.id !== selectedId)
      setElements(newElements)
      addToHistory(newElements)
      selectElement(null)
    }
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setElements(history[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setElements(history[historyIndex + 1])
    }
  }

  const handleExport = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL()
      const link = document.createElement('a')
      link.download = 'thumbnail.png'
      link.href = uri
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          const img = new window.Image()
          img.src = result
          img.onload = () => {
            const newElement: Element = {
              id: Date.now().toString(),
              type: 'image',
              x: 100,
              y: 100,
              width: img.width,
              height: img.height,
              src: result,
            }
            const newElements = [...elements, newElement]
            setElements(newElements)
            addToHistory(newElements)
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }
  const [bgImage] = useImage(backgroundImage);


  return (
    <div className="flex flex-col items-center space-y-4">
      <Stage width={1280} height={720} ref={stageRef}>
        <Layer>
          <KonvaImage image={bgImage} width={1280} height={720} />
          {elements.map((el) => {
            if (el.type === 'text') {
              return (
                <Text
                  key={el.id}
                  id={el.id}
                  x={el.x}
                  y={el.y}
                  text={el.text}
                  fontSize={el.fontSize}
                  fontFamily={el.fontFamily}
                  fill={el.fill}
                  draggable
                  onDragEnd={handleDragEnd}
                  onClick={() => handleSelect(el.id)}
                  onTransformEnd={handleTransformEnd}
                />
              )
            } else if (el.type === 'rect') {
              return (
                <Rect
                  key={el.id}
                  id={el.id}
                  x={el.x}
                  y={el.y}
                  width={el.width}
                  height={el.height}
                  fill={el.fill}
                  draggable
                  onDragEnd={handleDragEnd}
                  onClick={() => handleSelect(el.id)}
                  onTransformEnd={handleTransformEnd}
                />
              )
            } else if (el.type === 'image') {
              const [img] = useImage(el.src || '');

              return (
                <KonvaImage
                  key={el.id}
                  id={el.id}
                  x={el.x}
                  y={el.y}
                  width={el.width}
                  height={el.height}
                  image={img}
                  draggable
                  onDragEnd={handleDragEnd}
                  onClick={() => handleSelect(el.id)}
                  onTransformEnd={handleTransformEnd}
                />
              )
            }
          })}
          {selectedId && (
            <Transformer
              nodes={stageRef.current?.findOne(`#${selectedId}`)}
              keepRatio={false}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox
                }
                return newBox
              }}
            />
          )}
        </Layer>
      </Stage>
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="new-text">Add Text:</Label>
          <Input
            id="new-text"
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="w-40"
          />
          <Button onClick={addText}>Add Text</Button>
        </div>
        <Button onClick={addRectangle}>Add Rectangle</Button>
        <Button onClick={handleDelete} disabled={!selectedId}>Delete Selected</Button>
        <Button onClick={() => setShowColorPicker(!showColorPicker)}>
          {showColorPicker ? 'Hide Color Picker' : 'Show Color Picker'}
        </Button>
        <Button onClick={handleUndo} disabled={historyIndex <= 0}>
          <Undo className="w-4 h-4 mr-2" />
          Undo
        </Button>
        <Button onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
          <Redo className="w-4 h-4 mr-2" />
          Redo
        </Button>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button onClick={() => fileInputRef.current?.click()}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Image
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageUpload}
          accept="image/*"
        />
      </div>
      {showColorPicker && (
        <SketchPicker
          color={textColor}
          onChangeComplete={(color) => setTextColor(color.hex)}
        />
      )}
      <div className="flex items-center space-x-2">
        <Label htmlFor="font-size">Font Size:</Label>
        <Slider
          id="font-size"
          min={10}
          max={100}
          step={1}
          value={[fontSize]}
          onValueChange={(value) => setFontSize(value[0])}
          className="w-48"
        />
        <span>{fontSize}px</span>
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="font-family">Font Family:</Label>
        <Select value={fontFamily} onValueChange={setFontFamily}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            {fonts.map((font) => (
              <SelectItem key={font} value={font}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}