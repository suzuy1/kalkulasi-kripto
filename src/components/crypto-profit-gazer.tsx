"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowDownRight,
  ArrowUpRight,
  Loader2,
  Minus,
  Plus,
} from "lucide-react";

import { simulateInvestmentScenarios } from "@/ai/flows/simulate-investment-scenarios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { BTCIcon, ETHIcon, SOLIcon, SUIIcon, XRPIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

const allocationSchema = z.object({
  BTC: z.coerce.number().min(0, "Must be >= 0").max(100, "Must be <= 100"),
  ETH: z.coerce.number().min(0, "Must be >= 0").max(100, "Must be <= 100"),
  SOL: z.coerce.number().min(0, "Must be >= 0").max(100, "Must be <= 100"),
  XRP: z.coerce.number().min(0, "Must be >= 0").max(100, "Must be <= 100"),
  SUI: z.coerce.number().min(0, "Must be >= 0").max(100, "Must be <= 100"),
});

const formSchema = z
  .object({
    investment: z.coerce
      .number({ invalid_type_error: "Please enter a valid amount" })
      .positive({ message: "Investment must be a positive number." }),
    allocations: allocationSchema,
  })
  .refine(
    (data) => {
      const total = Object.values(data.allocations).reduce(
        (acc, val) => acc + val,
        0
      );
      return Math.abs(total - 100) < 0.01;
    },
    {
      message: "Total allocation must be exactly 100%.",
      path: ["allocations"],
    }
  );

type ResultData = {
  totalProfitLoss: number;
  percentageChange: number;
  finalValue: number;
  breakdown: {
    name: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    allocation: number;
    returnRate: number;
    profitLoss: number;
  }[];
};

const cryptos = [
  { id: "BTC", name: "Bitcoin", Icon: BTCIcon },
  { id: "ETH", name: "Ethereum", Icon: ETHIcon },
  { id: "SOL", name: "Solana", Icon: SOLIcon },
  { id: "XRP", name: "XRP", Icon: XRPIcon },
  { id: "SUI", name: "Sui", Icon: SUIIcon },
] as const;

export function CryptoProfitGazer() {
  const [results, setResults] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      investment: 15000000,
      allocations: { BTC: 40, ETH: 30, SOL: 15, XRP: 10, SUI: 5 },
    },
    mode: "onChange",
  });

  const watchedAllocations = form.watch("allocations");
  const totalAllocation = Object.values(watchedAllocations).reduce(
    (sum, v) => sum + (Number(v) || 0),
    0
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResults(null);

    try {
      const { scenarios } = await simulateInvestmentScenarios({
        numberOfScenarios: cryptos.length,
      });

      if (!scenarios || scenarios.length !== cryptos.length) {
        throw new Error("Failed to get valid simulation scenarios from AI.");
      }

      let totalProfitLoss = 0;
      const breakdown = cryptos.map((crypto, index) => {
        const allocation = values.allocations[crypto.id];
        const investmentForCrypto = values.investment * (allocation / 100);
        const returnRate = scenarios[index].returnRate;
        const profitLoss = investmentForCrypto * returnRate;
        totalProfitLoss += profitLoss;
        return {
          name: crypto.name,
          icon: crypto.Icon,
          allocation: allocation,
          returnRate: returnRate,
          profitLoss: profitLoss,
        };
      });

      const percentageChange = (totalProfitLoss / values.investment) * 100;
      const finalValue = values.investment + totalProfitLoss;

      setResults({
        totalProfitLoss,
        percentageChange,
        finalValue,
        breakdown,
      });
    } catch (error) {
      console.error("Simulation failed:", error);
      toast({
        variant: "destructive",
        title: "Simulation Failed",
        description:
          "An error occurred while running the simulation. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      signDisplay: "auto",
    }).format(value);
  };
  
  const formatNumberInput = (value: number | string) => {
    if (value === '' || value === undefined || value === null) return '';
    const num = Number(String(value).replace(/\./g, ''));
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('id-ID').format(num);
  };
  
  const parseFormattedNumber = (value: string) => {
    return Number(value.replace(/\./g, ''));
  };

  const updateAllocation = (
    field: "BTC" | "ETH" | "SOL" | "XRP" | "SUI",
    delta: number
  ) => {
    const currentValue = form.getValues(`allocations.${field}`) || 0;
    let newValue = currentValue + delta;
    if (newValue < 0) newValue = 0;
    if (newValue > 100) newValue = 100;
    form.setValue(`allocations.${field}`, newValue, { shouldValidate: true });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Crypto Profit Gazer
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          A Web3 Investment Simulation Tool
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Investment & Allocation</CardTitle>
              <CardDescription>
                Enter your initial investment and allocate it across different
                crypto assets.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8 md:grid-cols-5">
              <div className="space-y-4 md:col-span-2">
                <FormField
                  control={form.control}
                  name="investment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Initial Investment (IDR)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="e.g., 15.000.000"
                          {...field}
                          value={formatNumberInput(field.value)}
                          onChange={(e) => {
                            const parsedValue = parseFormattedNumber(e.target.value);
                            field.onChange(isNaN(parsedValue) ? '' : parsedValue);
                          }}
                          className="text-lg h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4 md:col-span-3">
                 <FormLabel className="text-lg">Asset Allocation (%)</FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {cryptos.map((crypto) => (
                    <FormField
                      key={crypto.id}
                      control={form.control}
                      name={`allocations.${crypto.id}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <crypto.Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <Input
                                type="number"
                                placeholder="%"
                                {...field}
                                className="pl-10 text-center pr-16"
                              />
                               <div className="absolute right-0 top-0 h-full flex items-center">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-full w-8 rounded-r-md rounded-l-none"
                                  onClick={() => updateAllocation(crypto.id, 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-full w-8 rounded-l-md rounded-r-none border-r"
                                  onClick={() => updateAllocation(crypto.id, -1)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </FormControl>
                           <FormMessage className="text-xs"/>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <div
                  className={cn(
                    "text-right font-medium",
                    Math.abs(totalAllocation - 100) > 0.01
                      ? "text-destructive"
                      : "text-green-500"
                  )}
                >
                  Total: {totalAllocation.toFixed(0)}%
                </div>
                 {form.formState.errors.allocations && (
                    <p className="text-sm font-medium text-destructive text-right">
                      {form.formState.errors.allocations.message}
                    </p>
                  )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto ml-auto" size="lg">
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Simulate Scenarios
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
            <CardDescription>
              Based on AI-generated scenarios, here is the potential outcome of
              your investment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="rounded-lg border bg-card-foreground/5 p-4">
                <div className="text-sm text-muted-foreground">Profit / Loss</div>
                <div
                  className={cn(
                    "text-3xl font-bold",
                    results.totalProfitLoss >= 0
                      ? "text-green-500"
                      : "text-destructive"
                  )}
                >
                  {formatCurrency(results.totalProfitLoss)}
                </div>
              </div>
               <div className="rounded-lg border bg-card-foreground/5 p-4">
                <div className="text-sm text-muted-foreground">Percentage Change</div>
                 <div
                  className={cn(
                    "text-3xl font-bold flex items-center justify-center gap-2",
                    results.percentageChange >= 0
                      ? "text-green-500"
                      : "text-destructive"
                  )}
                >
                   {results.percentageChange >= 0 ? <ArrowUpRight/> : <ArrowDownRight/>}
                  {results.percentageChange.toFixed(2)}%
                </div>
              </div>
               <div className="rounded-lg border bg-card-foreground/5 p-4">
                <div className="text-sm text-muted-foreground">Final Portfolio Value</div>
                <div className="text-3xl font-bold">
                  {formatCurrency(results.finalValue)}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Detailed Breakdown</h4>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Asset</TableHead>
                      <TableHead className="text-right">Allocation</TableHead>
                      <TableHead className="text-right">Return Rate</TableHead>
                      <TableHead className="text-right">Profit/Loss</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.breakdown.map((item) => (
                      <TableRow key={item.name}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <item.icon className="h-6 w-6" />
                            {item.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.allocation}%
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-right",
                            item.returnRate >= 0
                              ? "text-green-400"
                              : "text-red-500"
                          )}
                        >
                          {(item.returnRate * 100).toFixed(2)}%
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-right",
                            item.profitLoss >= 0
                              ? "text-green-400"
                              : "text-red-500"
                          )}
                        >
                          {formatCurrency(item.profitLoss)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
