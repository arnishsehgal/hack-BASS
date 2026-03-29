import * as React from 'react';
import { FileText, BrainCircuit, BarChartHorizontalBig } from 'lucide-react';
import { generateMaterialRecommendationExplanation } from '@/ai/flows/material-recommendation-explanation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wall } from '@/lib/mock-data';
import MaterialTradeoffChart from './material-tradeoff-chart';
import { ScrollArea } from './ui/scroll-area';

interface MaterialPanelProps {
  selectedWall: Wall | null;
}

const MaterialPanel: React.FC<MaterialPanelProps> = ({ selectedWall }) => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-3">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold font-headline">Material Intelligence</h2>
        </div>
        
        {!selectedWall ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-20">
            <FileText className="h-12 w-12 mb-4" />
            <p className="font-semibold">No Element Selected</p>
            <p className="text-sm">Click on a wall in the 3D model to see AI recommendations.</p>
          </div>
        ) : (
          <React.Suspense fallback={<LoadingState />}>
            <RecommendationLoader wall={selectedWall} />
          </React.Suspense>
        )}
      </div>
    </ScrollArea>
  );
};

async function RecommendationLoader({ wall }: { wall: Wall }) {
  const data = await generateMaterialRecommendationExplanation({
    elementDescription: wall.description,
    context: 'Eco-friendly design goals for a residential building.',
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5" />
            AI-Generated Rationale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{data.explanation}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChartHorizontalBig className="h-5 w-5" />
            Material Trade-Offs (Strength vs. Cost)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MaterialTradeoffChart data={data.materialTradeoffs} />
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default MaterialPanel;
