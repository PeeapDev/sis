'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Share2, Copy, Check, Clock, Lock, Unlock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ShareHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  academicHistory: any[]
}

export function ShareHistoryDialog({ open, onOpenChange, academicHistory }: ShareHistoryDialogProps) {
  const { toast } = useToast()
  const [days, setDays] = useState(7)
  const [generatedPin, setGeneratedPin] = useState<string | null>(null)
  const [expiryDate, setExpiryDate] = useState<Date | null>(null)
  const [selectedStages, setSelectedStages] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const generatePin = () => {
    // Generate 7-digit PIN
    const pin = Math.floor(1000000 + Math.random() * 9000000).toString()
    const expiry = new Date()
    expiry.setDate(expiry.getDate() + days)
    
    setGeneratedPin(pin)
    setExpiryDate(expiry)
    
    // TODO: Save to database with expiry date and selected stages
    toast({
      title: "Success",
      description: "Share PIN generated successfully!",
    })
  }

  const copyToClipboard = async () => {
    if (generatedPin) {
      await navigator.clipboard.writeText(generatedPin)
      setCopied(true)
      toast({
        title: "Copied",
        description: "PIN copied to clipboard!",
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const toggleStage = (stageId: string) => {
    setSelectedStages(prev => 
      prev.includes(stageId) 
        ? prev.filter(id => id !== stageId)
        : [...prev, stageId]
    )
  }

  const selectAll = () => {
    setSelectedStages(academicHistory.filter(s => s.isCompleted || s.isCurrent).map(s => s.id))
  }

  const deselectAll = () => {
    setSelectedStages([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Academic History
          </DialogTitle>
          <DialogDescription>
            Generate a secure PIN to share your academic history with others
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Select Stages to Share */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Select Stages to Share</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={deselectAll}>
                  Deselect All
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
              {academicHistory.filter(s => s.isCompleted || s.isCurrent).map((stage) => (
                <div 
                  key={stage.id} 
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
                >
                  <Checkbox
                    id={stage.id}
                    checked={selectedStages.includes(stage.id)}
                    onCheckedChange={() => toggleStage(stage.id)}
                  />
                  <label
                    htmlFor={stage.id}
                    className="flex-1 flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-sm">{stage.grade}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {stage.schoolName} • {stage.year}
                      </p>
                    </div>
                    {stage.isCurrent && (
                      <Badge className="bg-blue-500 text-white text-[10px]">CURRENT</Badge>
                    )}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {selectedStages.length} stage(s) selected
            </p>
          </div>

          {/* Set Expiry Days */}
          <div className="space-y-3">
            <Label htmlFor="days">Share Duration (Days)</Label>
            <div className="flex items-center gap-3">
              <Input
                id="days"
                type="number"
                min={7}
                max={365}
                value={days}
                onChange={(e) => setDays(Math.max(7, parseInt(e.target.value) || 7))}
                className="w-32"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Minimum: 7 days
              </span>
            </div>
          </div>

          {/* Generate Button */}
          {!generatedPin && (
            <Button 
              onClick={generatePin} 
              className="w-full"
              disabled={selectedStages.length === 0}
            >
              <Lock className="h-4 w-4 mr-2" />
              Generate Share PIN
            </Button>
          )}

          {/* Generated PIN Display */}
          <AnimatePresence>
            {generatedPin && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-500">
                  <div className="flex items-center gap-2 mb-3">
                    <Unlock className="h-5 w-5 text-green-600" />
                    <h3 className="font-bold text-green-900 dark:text-green-100">
                      Share PIN Generated!
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-green-300">
                      <p className="text-3xl font-mono font-bold text-center text-green-600 tracking-wider">
                        {generatedPin}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                      className="h-12 w-12"
                    >
                      {copied ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
                    <Clock className="h-4 w-4" />
                    <span>
                      Expires on: {expiryDate?.toLocaleDateString()} at {expiryDate?.toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="mt-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded border border-green-300">
                    <p className="text-xs text-green-800 dark:text-green-200">
                      <strong>Note:</strong> Share this PIN with trusted individuals only. 
                      They can view your selected academic history using the Result Checker on the homepage.
                    </p>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => {
                    setGeneratedPin(null)
                    setExpiryDate(null)
                    setSelectedStages([])
                  }}
                  className="w-full"
                >
                  Generate New PIN
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
