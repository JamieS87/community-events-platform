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
        "bg-info text-info-foreground border border-info/80 hover:bg-info hover:cursor-default px-4 py-2",
        props.className
      )}
      {...props}
    >
      {pricing_model[0].toUpperCase() + pricing_model.slice(1).toUpperCase()}
    </Badge>
  );
}
