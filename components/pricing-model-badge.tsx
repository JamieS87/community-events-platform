"use client";

import { Tables } from "@/dbtypes";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PricingModelBadgeProps = {
  pricing_model: Tables<"events">["pricing_model"];
} & BadgeProps;

export default function PricingModelBadge({
  pricing_model,
  ...props
}: PricingModelBadgeProps) {
  return (
    <Badge
      className={cn(
        "text-md",
        "bg-sky-200 border-sky-400 text-sky-700 hover:bg-sky-200 hover:border-sky-400 hover:text-sky-700 hover:cursor-default",
        props.className
      )}
      {...props}
    >
      {pricing_model[0].toUpperCase() + pricing_model.slice(1)}
    </Badge>
  );
}
