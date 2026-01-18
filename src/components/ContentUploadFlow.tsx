import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Upload, ArrowLeft, ArrowRight } from "@phosphor-icons/react"
import { MediaCaptureStep } from "./upload-steps/MediaCaptureStep"
import { SelectionToolStep } from "./upload-steps/SelectionToolStep"
import { MetadataStep } from "./upload-steps/MetadataStep"
import { cn } from "@/lib/utils"

interface ContentUploadFlowProps {
  onBack: () => void
}

export type MediaType = "image" | "video"

export interface MediaFile {
  url: string
  type: MediaType
  file?: File
}

export interface Selection {
  id: string
  x: number
  y: number
  width: number
  height: number
  points: { x: number; y: number }[]
  type: "open" | "approval"
}

export function ContentUploadFlow({ onBack }: ContentUploadFlowProps) {
  const [step, setStep] = useState(1)
  const [media, setMedia] = useState<MediaFile | null>(null)
  const [selections, setSelections] = useState<Selection[]>([])

  const handleMediaCapture = (mediaFile: MediaFile) => {
    setMedia(mediaFile)
    setStep(2)
  }

  const handleSelectionsComplete = (finalSelections: Selection[]) => {
    setSelections(finalSelections)
    setStep(3)
  }

  const handleBack = () => {
    if (step === 1) {
      onBack()
    } else {
      setStep(step - 1)
    }
  }

  return (
    <div className="w-full max-w-[800px] mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <ProgressIndicator currentStep={step} totalSteps={3} />
        </div>
      </div>

      {step === 1 && <MediaCaptureStep onCapture={handleMediaCapture} />}
      {step === 2 && media && (
        <SelectionToolStep
          media={media}
          onComplete={handleSelectionsComplete}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && media && (
        <MetadataStep
          media={media}
          selections={selections}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  )
}

function ProgressIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            index + 1 === currentStep ? "w-8 bg-primary" : "w-2 bg-border"
          )}
        />
      ))}
      <span className="ml-2 text-sm text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </span>
    </div>
  )
}
