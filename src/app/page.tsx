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
  const [selectedWall, setSelectedWall] = React.useState<any | null>(null);
  const [elements, setElements] = React.useState<any[]>([]);
  const [materialsData, setMaterialsData] = React.useState<any>(null);
  const [explanationsData, setExplanationsData] = React.useState<any>(null);

  const handleUpload = async (files: File[]) => {
    if (files.length > 0) {
      setIsProcessing(true);
      setIs3DReady(false);
      setSelectedWall(null);
      setMaterialsData(null);
      setExplanationsData(null);
      setProcessingStep(0); // Parsing

      const formData = new FormData();
      formData.append("file", files[0]);

      try {
        const response = await fetch("http://localhost:8000/api/process-floorplan", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        setProcessingStep(1); // Graphing
        const data = await response.json();
        
        if (data.status === "success" && data.model3D?.elements) {
          setElements(data.model3D.elements);
          setMaterialsData(data.materials);
          setExplanationsData(data.explanations);
          setProcessingStep(2); // 3D Ready
          setIsProcessing(false);
          setIs3DReady(true);
        } else {
          // If the backend parsed successfully but returned a logical error
          throw new Error(data.message || "Failed to process floorplan on backend.");
        }
      } catch (error) {
        console.error("Pipeline failed:", error);
        alert("Pipeline processing failed. Check the console or backend terminal.");
        setIsProcessing(false);
        setIs3DReady(false);
      }
    }
  };

  const handleWallSelect = (wall: any | null) => {
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
            elements={elements}
            onWallSelect={handleWallSelect}
            selectedWallId={selectedWall?.id}
          />
        </div>

        {/* Right Sidebar */}
        <div className="bg-card border rounded-lg flex flex-col overflow-y-auto">
          <MaterialPanel 
            selectedWall={selectedWall} 
            materialsData={materialsData}
            explanationsData={explanationsData}
          />
        </div>
      </main>
    </div>
  );
}
