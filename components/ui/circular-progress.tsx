import * as React from "react"
import { cn } from "@/lib/utils"

interface CircularProgressProps extends React.SVGProps<SVGSVGElement> {
  value: number
  label: string
  isImprovement?: boolean
  maxValue?: number
}

export function CircularProgress({ 
  value, 
  label, 
  className, 
  isImprovement = false, 
  maxValue = 100,
  ...props 
}: CircularProgressProps) {
  const circumference = 2 * Math.PI * 45
  const absValue = Math.abs(value)
  const strokeDashoffset = circumference - (Math.min(absValue, maxValue) / maxValue) * circumference

  const getColor = (value: number, isImprovement: boolean) => {
    if (value === 0) {
      return { circle: "text-muted-foreground/20", text: "text-muted-foreground/20" }
    }
    if (isImprovement) {
      return value < 0 
        ? { circle: "text-red-500", text: "text-red-500" }
        : { circle: "text-green-500", text: "text-green-500" }
    }
    if (value < 50) return { circle: "text-red-500", text: "text-red-500" }
    if (value < 90) return { circle: "text-yellow-500", text: "text-yellow-500" }
    return { circle: "text-green-500", text: "text-green-500" }
  }

  const { circle: circleColor, text: textColor } = getColor(value, isImprovement)

  const displayValue = isImprovement ? value.toFixed(1) : Math.round(value)
  const displayLabel = isImprovement 
    ? `${value > 0 ? '+' : ''}${value.toFixed(Math.abs(value) < 10 ? 1 : 0)}%`
    : `${displayValue}%`

  return (
    <div className="flex flex-col items-center">
      <svg
        className={cn("w-24 h-24", className)}
        viewBox="0 0 100 100"
        {...props}
      >
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3" />
          </filter>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <circle
          className="text-muted-foreground/20 stroke-current"
          strokeWidth="10"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
        />
        <circle
          className={cn("stroke-current", circleColor)}
          strokeWidth="10"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          transform="rotate(-90 50 50)"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: isImprovement ? 0 : strokeDashoffset,
            transition: "stroke-dashoffset 0.5s ease-in-out",
          }}
          filter="url(#shadow)"
          stroke="url(#gradient)"
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dy="0.3em"
          className={cn(
            "font-bold fill-current",
            textColor,
            isImprovement ? "text-xl" : "text-2xl"
          )}
          filter="url(#shadow)"
        >
          {displayLabel}
        </text>
      </svg>
      <span className="mt-3 text-sm font-medium text-gray-600">{label}</span>
    </div>
  )
}