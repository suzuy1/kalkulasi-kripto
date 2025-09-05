"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calculator,
  Loader2,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Bar,
  BarChart,
  XAxis,
  YAxis,
} from "recharts";

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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const assetSchema = z.object({
  name: z.string().min(1, "Nama aset diperlukan"),
  allocation: z.coerce.number().min(0).max(100),
  priceChange: z.coerce.number(),
});

const formSchema = z
  .object({
    investment: z.coerce
      .number({ invalid_type_error: "Silakan masukkan jumlah yang valid" })
      .positive({ message: "Investasi harus berupa angka positif." }),
    assets: z.array(assetSchema),
  })
  .refine(
    (data) => {
      const totalAllocation = data.assets.reduce(
        (sum, asset) => sum + asset.allocation,
        0
      );
      return Math.abs(totalAllocation - 100) < 0.01;
    },
    {
      message: "Total alokasi harus tepat 100%.",
      path: ["assets"],
    }
  );
  
type FormData = z.infer<typeof formSchema>;

type ResultData = {
  totalProfitLoss: number;
  percentageChange: number;
  finalValue: number;
  breakdown: {
    name: string;
    value: number;
    allocation: number;
    priceChange: number;
    profitLoss: number;
  }[];
};

const defaultValues: FormData = {
  investment: 7000000,
  assets: [
    { name: "BTC", allocation: 35, priceChange: 0 },
    { name: "ETH", allocation: 20, priceChange: 0 },
    { name: "SOL", allocation: 15, priceChange: 0 },
    { name: "XRP", allocation: 15, priceChange: 0 },
    { name: "SUI", allocation: 15, priceChange: 0 },
  ],
};

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const POSITIVE_COLOR = "hsl(142.1 76.2% 36.3%)"; // green-600
const NEGATIVE_COLOR = "hsl(0 84.2% 60.2%)"; // destructive

export function CryptoProfitGazer() {
  const [results, setResults] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const getInitialValues = (): FormData => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("cryptoPortfolio");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          const result = formSchema.safeParse(parsedData);
          if (result.success) {
            return result.data;
          }
        } catch (error) {
          console.error("Failed to parse saved portfolio:", error);
        }
      }
    }
    return defaultValues;
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: getInitialValues(),
    mode: "onChange",
  });
  
  const watchedForm = form.watch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cryptoPortfolio", JSON.stringify(watchedForm));
    }
  }, [watchedForm]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "assets",
  });

  const totalAllocation = watchedForm.assets.reduce(
    (sum, asset) => sum + (Number(asset.allocation) || 0),
    0
  );

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setResults(null);

    await new Promise(resolve => setTimeout(resolve, 500));

    const { investment, assets } = values;

    let totalProfitLoss = 0;
    const breakdown = assets.map(asset => {
        const investmentForCrypto = investment * (asset.allocation / 100);
        const profitLoss = investmentForCrypto * (asset.priceChange / 100);
        totalProfitLoss += profitLoss;
        return {
            name: asset.name,
            value: investmentForCrypto + profitLoss,
            allocation: asset.allocation,
            priceChange: asset.priceChange,
            profitLoss: profitLoss,
        };
    });

    const percentageChange = investment > 0 ? (totalProfitLoss / investment) * 100 : 0;
    const finalValue = investment + totalProfitLoss;
    
    setResults({
      totalProfitLoss,
      percentageChange,
      finalValue,
      breakdown,
    });
    
    setIsLoading(false);
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

  const updateField = (
    index: number,
    field: `assets.${number}.allocation` | `assets.${number}.priceChange`,
    delta: number
  ) => {
    const currentValue = form.getValues(field) || 0;
    let newValue = currentValue + delta;
    if (field.endsWith('allocation')) {
        if (newValue < 0) newValue = 0;
        if (newValue > 100) newValue = 100;
    }
    form.setValue(field, newValue, { shouldValidate: true, shouldDirty: true });
  };
  
  const chartConfig = results
    ? results.breakdown.reduce((config, item, index) => {
        return {
          ...config,
          [item.name.toLowerCase()]: {
            label: item.name,
            color: CHART_COLORS[index % CHART_COLORS.length],
          },
        };
      }, {})
    : {};

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Kalkulator Keuntungan Kripto
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Hitung dan visualisasikan potensi keuntungan investasi Anda.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Data Investasi</CardTitle>
              <CardDescription>
                Masukkan modal, alokasi aset, dan prediksi perubahan harga.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
               <FormField
                  control={form.control}
                  name="investment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Modal Awal (IDR)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="contoh: 7.000.000"
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
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <FormLabel className="text-lg">Alokasi & Prediksi Aset</FormLabel>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
                        {/* Asset Name */}
                        <FormField
                            control={form.control}
                            name={`assets.${index}.name`}
                            render={({ field }) => (
                                <FormItem className="col-span-3">
                                    <FormControl>
                                        <Input placeholder="cth: BTC" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Allocation */}
                        <FormField
                            control={form.control}
                            name={`assets.${index}.allocation`}
                            render={({ field }) => (
                                <FormItem className="col-span-4">
                                <FormControl>
                                    <div className="relative">
                                    <Input
                                        type="number"
                                        placeholder="Alokasi %"
                                        {...field}
                                        className="pr-10 text-center"
                                    />
                                    <div className="absolute right-1 top-1/2 -translate-y-1/2 h-full flex flex-col justify-center">
                                        <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-1/2 w-8 rounded-bl-none rounded-br-none"
                                        onClick={() => updateField(index, `assets.${index}.allocation`, 1)}
                                        >
                                        <Plus className="h-3 w-3" />
                                        </Button>
                                        <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-1/2 w-8 rounded-tl-none rounded-tr-none"
                                        onClick={() => updateField(index, `assets.${index}.allocation`, -1)}
                                        >
                                        <Minus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs"/>
                                </FormItem>
                            )}
                        />

                        {/* Price Change */}
                         <FormField
                            control={form.control}
                            name={`assets.${index}.priceChange`}
                            render={({ field }) => (
                                <FormItem className="col-span-4">
                                <FormControl>
                                    <div className="relative">
                                    <Input
                                        type="number"
                                        placeholder="Harga %"
                                        {...field}
                                        className="pr-10 text-center"
                                    />
                                    <div className="absolute right-1 top-1/2 -translate-y-1/2 h-full flex flex-col justify-center">
                                        <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-1/2 w-8 rounded-bl-none rounded-br-none"
                                        onClick={() => updateField(index, `assets.${index}.priceChange`, 1)}
                                        >
                                        <Plus className="h-3 w-3" />
                                        </Button>
                                        <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-1/2 w-8 rounded-tl-none rounded-tr-none"
                                        onClick={() => updateField(index, `assets.${index}.priceChange`, -1)}
                                        >
                                        <Minus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs"/>
                                </FormItem>
                            )}
                        />
                        
                        {/* Remove Button */}
                        <div className="col-span-1 flex items-center h-10">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                className="text-muted-foreground hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                  ))}
                </div>
                 <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ name: "", allocation: 0, priceChange: 0 })}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Aset
                    </Button>
                    <div
                        className={cn(
                            "font-medium",
                            Math.abs(totalAllocation - 100) > 0.01
                            ? "text-destructive"
                            : "text-green-500"
                        )}
                        >
                        Total Alokasi: {totalAllocation.toFixed(0)}%
                    </div>
                 </div>
                 {form.formState.errors.assets && (
                    <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.assets.message}
                    </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto ml-auto" size="lg">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Calculator className="mr-2 h-4 w-4" />
                )}
                Hitung
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Hasil Kalkulasi</CardTitle>
            <CardDescription>
              Berikut adalah hasil potensial dari investasi Anda berdasarkan data yang dimasukkan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="rounded-lg border bg-card-foreground/5 p-4">
                <div className="text-sm text-muted-foreground">Total Keuntungan / Kerugian</div>
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
                <div className="text-sm text-muted-foreground">Perubahan Persentase</div>
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
                <div className="text-sm text-muted-foreground">Nilai Portofolio Akhir</div>
                <div className="text-3xl font-bold">
                  {formatCurrency(results.finalValue)}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                 <Tabs defaultValue="pie" className="w-full">
                    <div className="flex justify-center">
                      <TabsList>
                          <TabsTrigger value="pie">Diagram Lingkaran</TabsTrigger>
                          <TabsTrigger value="bar">Diagram Batang</TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent value="pie">
                        <h4 className="font-medium mb-4 text-center text-lg">Visualisasi Portofolio Akhir</h4>
                        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel nameKey="name" formatter={(value, name, props) => {
                                    const { payload } = props;
                                    return (
                                        <div className="flex flex-col gap-1 p-1">
                                        <div className="font-bold">{payload.name}</div>
                                        <div className="text-sm">Nilai Akhir: {formatCurrency(payload.value)}</div>
                                        <div className={cn("text-sm", payload.profitLoss >= 0 ? 'text-green-400' : 'text-red-500')}>
                                            Keuntungan/Kerugian: {formatCurrency(payload.profitLoss)}
                                        </div>
                                        </div>
                                    )
                                }}/>}
                                />
                                <Pie data={results.breakdown} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                                {results.breakdown.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                                </Pie>
                            </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </TabsContent>
                    <TabsContent value="bar">
                        <h4 className="font-medium mb-4 text-center text-lg">Visualisasi Keuntungan/Kerugian</h4>
                         <ChartContainer config={chartConfig} className="mx-auto aspect-video max-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={results.breakdown} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${formatCurrency(Number(value))}`} />
                                    <Tooltip 
                                        cursor={{fill: 'transparent'}}
                                        content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))}/>}
                                    />
                                    <Bar dataKey="profitLoss" radius={[4, 4, 0, 0]}>
                                        {results.breakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.profitLoss >= 0 ? POSITIVE_COLOR : NEGATIVE_COLOR} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </TabsContent>
                </Tabs>
                <div>
                  <h4 className="font-medium mb-4">Rincian Aset</h4>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[150px]">Aset</TableHead>
                          <TableHead className="text-right">Alokasi</TableHead>
                          <TableHead className="text-right">Prediksi Harga</TableHead>
                          <TableHead className="text-right">Keuntungan/Kerugian</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.breakdown.map((item) => {
                           return (
                          <TableRow key={item.name}>
                            <TableCell className="font-medium">
                              {item.name.toUpperCase()}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.allocation}%
                            </TableCell>
                            <TableCell
                              className={cn(
                                "text-right",
                                item.priceChange >= 0
                                  ? "text-green-400"
                                  : "text-red-500"
                              )}
                            >
                              {item.priceChange.toFixed(2)}%
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
                        )})}
                      </TableBody>
                    </Table>
                  </div>
                </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    