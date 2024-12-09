"use client"
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Calculator, AlertCircle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

interface BillingCycle {
  label: string;
  days: number;
  multiplier: number;
}

interface DateFormat {
  label: string;
  format: (date: string) => string;
}

interface Calculations {
  totalDays: number;
  cycleLength: number;
  dailyRate: string;
  proratedAmount: string;
  percentageUsed: string;
  annualizedAmount: string;
  refundAmount?: string;
  earlyTerminationFee?: string;
}

interface ValidationErrors {
  billingAmount?: string;
  startDate?: string;
  endDate?: string;
  dateRange?: string;
  terminationDate?: string;
}

const billingCycles: Record<string, BillingCycle> = {
  monthly: { label: 'Monthly', days: 30, multiplier: 1 },
  quarterly: { label: 'Quarterly', days: 90, multiplier: 3 },
  semiannual: { label: 'Semi-Annual', days: 180, multiplier: 6 },
  annual: { label: 'Annual', days: 365, multiplier: 12 }
};

const dateFormats: Record<string, DateFormat> = {
  'MM/DD/YYYY': { label: 'MM/DD/YYYY', format: (date) => new Date(date).toLocaleDateString('en-US') },
  'DD/MM/YYYY': { label: 'DD/MM/YYYY', format: (date) => new Date(date).toLocaleDateString('en-GB') },
  'YYYY-MM-DD': { label: 'YYYY-MM-DD', format: (date) => new Date(date).toISOString().split('T')[0] }
};

const paymentTypes = {
  advance: 'Advance Payment',
  arrears: 'Payment in Arrears'
};

export const ProrationCalculator: React.FC = () => {
  const [billingAmount, setBillingAmount] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [terminationDate, setTerminationDate] = useState<string>('');
  const [cycle, setCycle] = useState<string>('monthly');
  const [dateFormat, setDateFormat] = useState<string>('MM/DD/YYYY');
  const [paymentType, setPaymentType] = useState<string>('advance');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isCancelled, setIsCancelled] = useState<boolean>(false);
  const [hasEarlyTerminationFee, setHasEarlyTerminationFee] = useState<boolean>(false);
  const [earlyTerminationFeeAmount, setEarlyTerminationFeeAmount] = useState<string>('');
  const [gracePercentage, setGracePercentage] = useState<string>('0');

  const validateInputs = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!billingAmount) {
      newErrors.billingAmount = 'Billing amount is required';
    } else if (isNaN(Number(billingAmount)) || parseFloat(billingAmount) <= 0) {
      newErrors.billingAmount = 'Please enter a valid positive number';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (isCancelled && !terminationDate) {
      newErrors.terminationDate = 'Termination date is required when cancelled';
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }

      if (isCancelled && terminationDate) {
        const termination = new Date(terminationDate);
        if (termination < start || termination > end) {
          newErrors.terminationDate = 'Termination date must be within the coverage period';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculations = useMemo((): Calculations | null => {
    if (!billingAmount || !startDate || !endDate || !validateInputs()) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const termination = isCancelled && terminationDate ? new Date(terminationDate) : null;
    
    const cycleData = billingCycles[cycle];
    const originalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalDays = termination 
      ? Math.ceil((termination.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      : originalDays;
    
    const dailyRate = parseFloat(billingAmount) / cycleData.days;
    const proratedAmount = dailyRate * totalDays;
    
    const grace = parseFloat(gracePercentage) / 100;
    const adjustedAmount = proratedAmount * (1 - grace);

    let refundAmount;
    let earlyTerminationFee;

    if (isCancelled && termination) {
      const unusedDays = originalDays - totalDays;
      const refund = dailyRate * unusedDays;
      
      if (hasEarlyTerminationFee && earlyTerminationFeeAmount) {
        earlyTerminationFee = parseFloat(earlyTerminationFeeAmount);
        refundAmount = Math.max(0, refund - earlyTerminationFee);
      } else {
        refundAmount = refund;
      }
    }
    
    return {
      totalDays,
      cycleLength: cycleData.days,
      dailyRate: dailyRate.toFixed(2),
      proratedAmount: adjustedAmount.toFixed(2),
      percentageUsed: ((totalDays / cycleData.days) * 100).toFixed(1),
      annualizedAmount: (adjustedAmount * (365 / totalDays)).toFixed(2),
      refundAmount: refundAmount?.toFixed(2),
      earlyTerminationFee: earlyTerminationFee?.toFixed(2)
    };
  }, [billingAmount, startDate, endDate, terminationDate, cycle, isCancelled, hasEarlyTerminationFee, earlyTerminationFeeAmount, gracePercentage]);

  const formatDate = (date: string): string => {
    if (!date) return '';
    return dateFormats[dateFormat].format(date);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          Insurance Proration Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billing-amount" className="flex items-center gap-2">
                Premium Amount ($)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Enter the full {billingCycles[cycle].label.toLowerCase()} premium amount
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="billing-amount"
                type="number"
                placeholder="Enter amount"
                value={billingAmount}
                onChange={(e) => setBillingAmount(e.target.value)}
                className={errors.billingAmount ? 'border-red-500' : ''}
              />
              {errors.billingAmount && (
                <span className="text-sm text-red-500">{errors.billingAmount}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Coverage Period</Label>
              <Select value={cycle} onValueChange={setCycle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(billingCycles).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Type</Label>
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(paymentTypes).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select value={dateFormat} onValueChange={setDateFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(dateFormats).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date" className="flex items-center gap-2">
                Coverage Start Date
                <Calendar className="w-4 h-4" />
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={errors.startDate ? 'border-red-500' : ''}
              />
              {errors.startDate && (
                <span className="text-sm text-red-500">{errors.startDate}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date" className="flex items-center gap-2">
                Coverage End Date
                <Calendar className="w-4 h-4" />
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && (
                <span className="text-sm text-red-500">{errors.endDate}</span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={isCancelled}
                onCheckedChange={setIsCancelled}
              />
              <Label>Early Cancellation</Label>
            </div>

            {isCancelled && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="termination-date" className="flex items-center gap-2">
                    Termination Date
                    <Calendar className="w-4 h-4" />
                  </Label>
                  <Input
                    id="termination-date"
                    type="date"
                    value={terminationDate}
                    onChange={(e) => setTerminationDate(e.target.value)}
                    className={errors.terminationDate ? 'border-red-500' : ''}
                  />
                  {errors.terminationDate && (
                    <span className="text-sm text-red-500">{errors.terminationDate}</span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={hasEarlyTerminationFee}
                    onCheckedChange={setHasEarlyTerminationFee}
                  />
                  <Label>Early Termination Fee</Label>
                </div>

                {hasEarlyTerminationFee && (
                  <div className="space-y-2">
                    <Label htmlFor="termination-fee">Termination Fee Amount ($)</Label>
                    <Input
                      id="termination-fee"
                      type="number"
                      placeholder="Enter fee amount"
                      value={earlyTerminationFeeAmount}
                      onChange={(e) => setEarlyTerminationFeeAmount(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="grace-percentage" className="flex items-center gap-2">
              Grace Percentage (%)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Enter a percentage discount or grace period adjustment
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="grace-percentage"
              type="number"
              placeholder="Enter percentage"
              value={gracePercentage}
              onChange={(e) => setGracePercentage(e.target.value)}
              min="0"
              max="100"
            />
          </div>

          {errors.dateRange && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.dateRange}</AlertDescription>
            </Alert>
          )}

          {calculations && (
            <div className="mt-6 space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Coverage Period</TableCell>
                    <TableCell>
                      {formatDate(startDate)} - {isCancelled ? formatDate(terminationDate) : formatDate(endDate)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Days in Period</TableCell>
                    <TableCell>{calculations.totalDays} of {calculations.cycleLength} days</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Daily Premium Rate</TableCell>
                    <TableCell>${calculations.dailyRate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Coverage Percentage</TableCell>
                    <TableCell>{calculations.percentageUsed}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Payment Type</TableCell>
                    <TableCell>{paymentTypes[paymentType]}</TableCell>
                  </TableRow>
                  {parseFloat(gracePercentage) > 0 && (
                    <TableRow>
                      <TableCell>Grace Adjustment</TableCell>
                      <TableCell>-{gracePercentage}%</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className="font-bold">Prorated Premium</TableCell>
                    <TableCell className="font-bold text-lg">${calculations.proratedAmount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Annualized Premium</TableCell>
                    <TableCell>${calculations.annualizedAmount}</TableCell>
                  </TableRow>
                  {isCancelled && calculations.refundAmount && (
                    <>
                      {calculations.earlyTerminationFee && (
                        <TableRow>
                          <TableCell>Early Termination Fee</TableCell>
                          <TableCell className="text-red-500">-${calculations.earlyTerminationFee}</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell className="font-bold">Refund Amount</TableCell>
                        <TableCell className="font-bold text-green-600">${calculations.refundAmount}</TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    
  );
};

