
type UpdatedValue = Date | string | null | undefined;

export function formatUpdated(value: UpdatedValue): string {
  if (!value) return "—";

  if (typeof value === "string" && !value.includes("T")) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return "agora mesmo";
  if (diffMin < 60) return `há ${diffMin} min`;

  const diffH = Math.round(diffMin / 60);

  if (diffH < 24) return `há ${diffH} h`;

  return date.toLocaleDateString("pt-BR");
}
