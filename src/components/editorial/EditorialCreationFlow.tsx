import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { SelectContentStep } from "./SelectContentStep"
import { CanvasEditorStep } from "./CanvasEditorStep"
import { PreviewPublishStep } from "./PreviewPublishStep"
import { ArrowLeft } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

export interface VizListItem {
  id: string
  contentId: string
  contentThumbnail: string
  selectionArea: {
    left: number
    top: number
    width: number
    height: number
  }
  creatorUsername: string
  creatorAvatar: string
  status: "approved" | "pending" | "declined"
  addedDate: string
}

export interface CanvasElement {
  id: string
  type: "image" | "text" | "shape" | "emoji" | "drawing"
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
  data: any
}

export interface EditorialPage {
  id: string
  canvasElements: CanvasElement[]
  backgroundColor: string
}

interface EditorialCreationFlowProps {
  onBack: () => void
}

export function EditorialCreationFlow({ onBack }: EditorialCreationFlowProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [selectedItems, setSelectedItems] = useState<VizListItem[]>([])
  const [pages, setPages] = useState<EditorialPage[]>([
    {
      id: "page-1",
      canvasElements: [],
      backgroundColor: "#FFFFFF"
    }
  ])
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  const handleSelectContent = (items: VizListItem[]) => {
    setSelectedItems(items)
    setCurrentStep(2)
  }

  const handleBackToSelect = () => {
    setCurrentStep(1)
  }

  const handleProceedToPreview = () => {
    setCurrentStep(3)
  }

  const handleBackToEditor = () => {
    setCurrentStep(2)
  }

  return (
    <div className="w-full h-full">
      {currentStep === 1 && (
        <SelectContentStep 
          onNext={handleSelectContent}
          onBack={onBack}
        />
      )}

      {currentStep === 2 && (
        <CanvasEditorStep
          selectedItems={selectedItems}
          pages={pages}
          setPages={setPages}
          currentPageIndex={currentPageIndex}
          setCurrentPageIndex={setCurrentPageIndex}
          onBack={handleBackToSelect}
          onPublish={handleProceedToPreview}
        />
      )}

      {currentStep === 3 && (
        <PreviewPublishStep
          pages={pages}
          selectedItems={selectedItems}
          onBack={handleBackToEditor}
        />
      )}
    </div>
  )
}
