"use client";

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, CheckCircle2, Loader, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface UploadSectionProps {
  onUpload: (files: File[]) => void;
  isProcessing: boolean;
  processingStep: number;
}

const processingSteps = ["Parsing", "Graphing", "3D Ready"];

const UploadSection: React.FC<UploadSectionProps> = ({ onUpload, isProcessing, processingStep }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const onDropRejected = useCallback(() => {
    alert("Unsupported file type. Please upload a PNG or JPEG image.");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    multiple: false,
  });

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h2 className="text-lg font-semibold font-headline">Floor Plan Input</h2>
        <p className="text-sm text-muted-foreground">Upload a 2D floor plan to begin.</p>
      </div>
      <div
        {...getRootProps()}
        className={cn(
          "flex-1 border-2 border-dashed rounded-lg flex items-center justify-center text-center transition-colors cursor-pointer",
          isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <UploadCloud className="w-10 h-10" />
          <p className="font-semibold">
            {isDragActive ? "Drop the file here..." : "Drag & drop a PNG/JPG file or click to browse"}
          </p>
          <p className="text-xs">Max file size: 10MB</p>
        </div>
      </div>

      <div className="h-32">
        <h3 className="font-semibold mb-2">Processing Pipeline</h3>
        {isProcessing ? (
          <div className="space-y-3">
             <div className="flex justify-between items-center text-sm text-muted-foreground">
              {processingSteps.map((step, index) => (
                <div key={step} className={cn(
                    "flex items-center gap-2",
                    processingStep > index && "text-primary font-semibold",
                    processingStep === index && "text-accent-foreground font-semibold"
                )}>
                  {processingStep > index ? <CheckCircle2 className="h-4 w-4" /> : <Loader className={cn("h-4 w-4", processingStep === index && "animate-spin")} />}
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <Progress value={((processingStep + 1) / processingSteps.length) * 100} className="h-2" />
            <p className="text-xs text-center text-muted-foreground animate-pulse">
                {processingSteps[processingStep]}...
            </p>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg text-center">
            Awaiting file upload...
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;
