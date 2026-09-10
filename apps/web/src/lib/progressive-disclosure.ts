export interface DisclosureCondition {
  field: string;
  operator: "equals" | "notEquals" | "contains" | "truthy";
  value?: string | boolean;
}

export function evaluateCondition(
  condition: DisclosureCondition,
  formState: Record<string, string | boolean | number | string[]>
): boolean {
  const fieldValue = formState[condition.field];

  switch (condition.operator) {
    case "equals":
      return fieldValue === condition.value;
    case "notEquals":
      return fieldValue !== condition.value;
    case "contains":
      return Array.isArray(fieldValue) && typeof condition.value === "string"
        ? fieldValue.includes(condition.value)
        : false;
    case "truthy":
      return Boolean(fieldValue);
    default:
      return true;
  }
}

export interface ProgressiveRules {
  [targetField: string]: DisclosureCondition;
}

export const CANONICAL_PROGRESSIVE_RULES: ProgressiveRules = {
  // End of Tenancy: Show add-ons only if user opts for extra services
  cleaningAddons: { field: "requestExtras", operator: "equals", value: true },

  // Pest Control: Show visit package choices only after pest type is selected
  pestTreatmentPackage: { field: "pestSlug", operator: "truthy" },

  // Gardening: Show waste volume questions only if clearance or waste selected
  wasteClearanceBags: { field: "serviceType", operator: "equals", value: "clearance" },

  // Removals: Show packing boxes & materials only if packing service = true
  packingBoxesCount: { field: "packingRequired", operator: "equals", value: true },
};
