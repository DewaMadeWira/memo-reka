"use client";

import React, { useMemo, useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

const chartConfig = {
    documents: {
        label: "Documents",
    },
    memo: {
        label: "Memo",
        color: "hsl(var(--chart-1))",
    },
    invitation: {
        label: "Undangan Rapat",
        color: "hsl(var(--chart-2))",
    },
    summary: {
        label: "Risalah Rapat",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

export function LineChartComponent({ chartData }: { chartData: any }) {
    const [timeRange, setTimeRange] = useState("90d");

    const filteredData = useMemo(() => {
        // If there's no data, return empty array
        if (!chartData || chartData.length === 0) return [];

        // Find the most recent date in the data
        const dates = chartData.map((item: any) => new Date(item.date));
        const referenceDate = new Date(
            Math.max(...dates.map((d: any) => d.getTime()))
        );

        let daysToSubtract = 90;
        if (timeRange === "30d") {
            daysToSubtract = 30;
        } else if (timeRange === "7d") {
            daysToSubtract = 7;
        }

        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);

        return chartData.filter((item: any) => {
            const date = new Date(item.date);
            return date >= startDate;
        });
    }, [chartData, timeRange]);

    // Add debugging to verify data
    useEffect(() => {
        console.log("Original Chart Data:", chartData);
        console.log("Filtered Chart Data:", filteredData);
    }, [chartData, filteredData]);

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Line Chart - Jumlah Surat</CardTitle>
                    <CardDescription>
                        Menunjukkan jumlah surat yang dibuat dalam rentang waktu
                        tertentu.
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            3 Bulan Terakhir
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            30 Hari Terakhir
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            7 Hari Terakhir
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {filteredData.length > 0 ? (
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <AreaChart data={filteredData}>
                            <defs>
                                <linearGradient
                                    id="fillMemo"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-memo)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-memo)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient
                                    id="fillInvitation"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-invitation)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-invitation)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient
                                    id="fillSummary"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-summary)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-summary)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    });
                                }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => {
                                            return new Date(
                                                value
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            });
                                        }}
                                        indicator="dot"
                                    />
                                }
                            />
                            <Area
                                dataKey="summary"
                                type="natural"
                                fill="url(#fillSummary)"
                                stroke="var(--color-summary)"
                                stackId="a"
                            />
                            <Area
                                dataKey="invitation"
                                type="natural"
                                fill="url(#fillInvitation)"
                                stroke="var(--color-invitation)"
                                stackId="a"
                            />
                            <Area
                                dataKey="memo"
                                type="natural"
                                fill="url(#fillMemo)"
                                stroke="var(--color-memo)"
                                stackId="a"
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                ) : (
                    <div className="flex h-[250px] items-center justify-center">
                        <p className="text-muted-foreground">
                            No data available for the selected time period
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
