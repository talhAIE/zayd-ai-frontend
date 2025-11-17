import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  usageRecords?: Array<{
    date: string;
    duration: number;
  }>;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  usageRecords = [],
  ...props
}: CalendarProps) {
  const [tooltipContent, setTooltipContent] = React.useState<string | null>(
    null
  );
  const [tooltipPosition, _setTooltipPosition] = React.useState({
    top: 0,
    left: 0,
  });

  // Helper function to convert UTC date string to local date
  const convertUTCToLocalDate = (utcDateString: string): Date => {
    const date = new Date(utcDateString);

    if (
      utcDateString.includes("T") &&
      (utcDateString.includes("Z") || utcDateString.includes("+"))
    ) {
      // It's a full UTC datetime string - JavaScript will convert to local time automatically
      return date;
    } else {
      // It's just a date string like "2025-06-17" - treat as local date
      const parts = utcDateString.split("-");
      return new Date(
        parseInt(parts[0]),
        parseInt(parts[1]) - 1,
        parseInt(parts[2])
      );
    }
  };

  // Helper function to compare dates (year, month, day only)
  const isSameDate = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Format duration in a readable format
  const formatDuration = (duration: number) => {
    if (duration < 60) {
      return `${duration} seconds`;
    } else if (duration < 3600) {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes} minute${minutes > 1 ? "s" : ""}${
        seconds > 0 ? ` ${seconds} second${seconds > 1 ? "s" : ""}` : ""
      }`;
    } else {
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      return `${hours} hour${hours > 1 ? "s" : ""}${
        minutes > 0 ? ` ${minutes} minute${minutes > 1 ? "s" : ""}` : ""
      }`;
    }
  };

  // Function to check if a day has usage records
  const hasUsageRecord = React.useCallback(
    (day: Date) => {
      if (!usageRecords || usageRecords.length === 0) return false;

      return usageRecords.some((record) => {
        const localDate = convertUTCToLocalDate(record.date);
        return isSameDate(day, localDate);
      });
    },
    [usageRecords]
  );

  // Custom modifiers for highlighting dates with usage
  const modifiers = React.useMemo(
    () => ({
      hasUsage: (day: Date) => hasUsageRecord(day),
    }),
    [hasUsageRecord]
  );

  // Custom styles for the modifiers
  const modifiersStyles = React.useMemo(
    () => ({
      hasUsage: {
        backgroundColor: "#FFE3E3",
        color: "#FF1F1F",
      },
    }),
    []
  );

  // Handle day mouse enter for tooltip
  const handleDayMouseEnter = (day: Date, _activeModifiers: any) => {
    if (!usageRecords || usageRecords.length === 0) return;

    const record = usageRecords.find((r) => {
      const localDate = convertUTCToLocalDate(r.date);
      return isSameDate(day, localDate);
    });

    if (record) {
      const formattedDuration = formatDuration(record.duration);
      setTooltipContent(`Usage: ${formattedDuration}`);
    }
  };

  // Handle day mouse leave to hide tooltip
  const handleDayMouseLeave = () => {
    setTooltipContent(null);
  };

  return (
    <div className="relative">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={{
          months: "space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "w-full flex",
          head_cell:
            "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: cn(
            "relative p-0 text-center text-sm w-full focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
            props.mode === "range"
              ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              : "[&:has([aria-selected])]:rounded-md"
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
          ),
          day_range_start: "day-range-start",
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-[#D6E6FF] text-[#0058BD]",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: () => <ChevronLeftIcon className="h-4 w-4" />,
          IconRight: () => <ChevronRightIcon className="h-4 w-4" />,
        }}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        onDayMouseEnter={handleDayMouseEnter}
        onDayMouseLeave={handleDayMouseLeave}
        {...props}
      />
      {tooltipContent && (
        <div
          className="absolute bg-gray-600 text-white px-4 py-2 rounded shadow-md border border-gray-200 z-50 text-sm"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            pointerEvents: "none",
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
