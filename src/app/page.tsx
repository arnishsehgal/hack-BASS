"use client";

import * as React from "react";
import Header from "@/components/header";
import UploadSection from "@/components/upload-section";
import ModelViewer3D from "@/components/model-viewer-3d";
import MaterialPanel from "@/components/material-panel";
import type { Wall } from "@/lib/mock-data";

export default function Home() {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [processingStep, setProcessingStep] = React.useState(0);
  const [is3DReady, setIs3DReady] = React.useState(false);
  const [selectedWall, setSelectedWall] = React.useState<Wall | null>(null);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      setIsProcessing(true);
      setIs3DReady(false);
      setSelectedWall(null);
      
      const steps = ["Parsing", "Graphing", "3D Ready"];
      let currentStep = 0;
      setProcessingStep(currentStep);

      const interval = setInterval(() => {
        currentStep++;
        if (currentStep < steps.length) {
          setProcessingStep(currentStep);
        } else {
          clearInterval(interval);
          setIsProcessing(false);
          setIs3DReady(true);
        }
      }, 1500);
    }
  };

  const handleWallSelect = (wall: Wall | null) => {
    setSelectedWall(wall);
  };
  
  return (
    <div className="flex flex-col h-screen w-screen bg-background overflow-hidden">
      <Header is3DReady={is3DReady} />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[350px_1fr_400px] gap-4 p-4 overflow-hidden">
        {/* Left Sidebar */}
        <div className="bg-card border rounded-lg flex flex-col p-4">
          <UploadSection
            onUpload={handleUpload}
            isProcessing={isProcessing}
            processingStep={processingStep}
          />
        </div>

        {/* Main Content */}
        <div className="bg-card border rounded-lg relative overflow-hidden">
          <ModelViewer3D
            isReady={is3DReady}
            onWallSelect={handleWallSelect}
            selectedWallId={selectedWall?.id}
          />
        </div>

        {/* Right Sidebar */}
        <div className="bg-card border rounded-lg flex flex-col overflow-y-auto">
          <MaterialPanel selectedWall={selectedWall} />
        </div>
      </main>
    </div>
  );
}
