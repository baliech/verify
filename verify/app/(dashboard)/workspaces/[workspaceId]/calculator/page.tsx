"use client"
import { ProrationCalculator } from "@/features/workspaces/components/calculator";
import { CapsuleInput } from "@/features/workspaces/components/keyword-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CalculatorPage = () => {
  return (
    <div className="bg-gray-100 p-4 min-h-screen">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <p>examples</p>
            <div className="flex gap-2">
              <Badge>Date</Badge>
              <Badge>Total</Badge>
              <Badge>Name</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CapsuleInput />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Proration Settings</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ProrationCalculator />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalculatorPage;