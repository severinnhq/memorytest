import * as React from "react"
import { cn } from "@/lib/utils"

interface CircularProgressProps extends React.SVGProps<SVGSVGElement> {
  value: number
  label: string
}

export function CircularProgress({ value, label, className, ...props }: CircularProgressProps) {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (value / 100) * circumference

  const getColor = (value: number) => {
    if (value < 50) return "text-red-500"
    if (value < 90) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="flex flex-col items-center">
      <svg
        className={cn("w-24 h-24", className)}
        viewBox="0 0 100 100"
        {...props}
      >
        <circle
          className="text-muted-foreground stroke-current"
          strokeWidth="10"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
        />
        <circle
          className={cn("stroke-current", getColor(value))}
          strokeWidth="10"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          transform="rotate(-90 50 50)"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dy="0.3em"
          className="text-2xl font-bold fill-current"
        >
          {Math.round(value)}%
        </text>
      </svg>
      <span className="mt-2 text-sm font-medium">{label}</span>
    </div>
  )
}