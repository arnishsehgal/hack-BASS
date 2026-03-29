import * as React from 'react';
import { FileText, BrainCircuit, BarChartHorizontalBig } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MaterialTradeoffChart from './material-tradeoff-chart';
import { ScrollArea } from './ui/scroll-area';

interface MaterialPanelProps {
  selectedWall?: any | null; // Kept for prop backwards compatibility but mostly ignored now
  materialsData: any;
  explanationsData: any;
}

const MaterialPanel: React.FC<MaterialPanelProps> = ({ materialsData, explanationsData }) => {
  const explanationText = typeof explanationsData === 'string' 
    ? explanationsData 
    : explanationsData?.explanation || "AI explanation unavailable.";

  const hasData = materialsData && Object.keys(materialsData).length > 0;

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-3">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold font-headline">Material Intelligence</h2>
        </div>
        
        {!hasData ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-20">
            <FileText className="h-12 w-12 mb-4" />
            <p className="font-semibold">Awaiting Data</p>
            <p className="text-sm">Upload a floor plan to generate AI material recommendations.</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-5 w-5" />
                  AI-Generated Rationale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{explanationText}</p>
              </CardContent>
            </Card>

            <h3 className="font-semibold pt-4">All Element Recommendations:</h3>
            <div className="flex flex-col gap-6">
              {Object.entries(materialsData).map(([wallId, recommendations]: [string, any]) => {
                const chartData = recommendations.map((m: any) => ({
                    material: m.material,
                    strengthScore: m.details.strength,
                    // Reverse the cost dynamically since lower cost = higher cost effectiveness score if we map 1 to 10
                    costScore: 11 - m.details.cost, 
                }));

                return (
                  <Card key={wallId} className="overflow-hidden border-primary/20">
                    <div className="bg-secondary/50 p-3 text-sm font-semibold border-b">
                      Element: {wallId.toUpperCase()}
                    </div>
                    <CardContent className="p-4 space-y-4">
                      {/* Trade-Off Score Chart */}
                      <div className="h-[200px] w-full">
                         <MaterialTradeoffChart data={chartData} />
                      </div>
                      
                      {/* Top Material Options */}
                      <div className="space-y-2">
                        {recommendations.map((m: any, idx: number) => (
                           <div key={idx} className={`p-3 rounded-md border flex justify-between items-center ${idx === 0 ? "border-primary/50 bg-primary/5" : "bg-card"}`}>
                              <div>
                                <p className="font-semibold text-sm">{m.material}</p>
                                <p className="text-xs text-muted-foreground">Score: {m.score}</p>
                              </div>
                              <div className="text-right text-xs text-muted-foreground">
                                <p>Cost: {m.details.cost}/10</p>
                                <p>Strength: {m.details.strength}/10</p>
                              </div>
                           </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default MaterialPanel;
