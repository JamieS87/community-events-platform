import { Tables } from "@/dbtypes";
import { Badge, BadgeProps } from "@/components/ui/badge";

type PricingModelBadgeProps = {
  pricing_model: Tables<"events">["pricing_model"];
} & BadgeProps;

export default async function PricingModelBadge({
  pricing_model,
  ...props
}: PricingModelBadgeProps) {
  return (
    <Badge className="text-md" {...props}>
      {pricing_model[0].toUpperCase() + pricing_model.slice(1)}
    </Badge>
  );
}
