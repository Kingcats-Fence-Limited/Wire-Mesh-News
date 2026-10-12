/** Two-letter initials for avatar placeholders ("Mei Lin" → "ML"). */
export const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
