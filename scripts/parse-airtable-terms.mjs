const expandSharedAffixes = (value) => {
  let slash = -1;
  let depth = 0;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (character === "(") depth += 1;
    if (character === ")") depth = Math.max(0, depth - 1);
    if (character !== "/" || depth !== 0) continue;
    if (slash !== -1) return undefined;
    slash = index;
  }

  if (slash === -1) return undefined;

  const before = value.slice(0, slash);
  const after = value.slice(slash + 1);
  const prefixEnd = before.lastIndexOf(" ");
  const suffixStart = after.indexOf(" ");
  if (prefixEnd === -1 || suffixStart === -1) return undefined;

  const prefix = before.slice(0, prefixEnd + 1);
  const firstAlternative = before.slice(prefixEnd + 1);
  const secondAlternative = after.slice(0, suffixStart);
  const suffix = after.slice(suffixStart);
  if (!firstAlternative || !secondAlternative || !suffix.trim())
    return undefined;

  return [
    `${prefix}${firstAlternative}${suffix}`,
    `${prefix}${secondAlternative}${suffix}`,
  ];
};

export const splitOutsideParentheses = (value) => {
  const normalized = String(value).trim();
  const expanded = expandSharedAffixes(normalized);
  if (expanded) return expanded;

  const parts = [];
  let current = "";
  let depth = 0;

  for (const character of normalized) {
    if (character === "(") depth += 1;
    if (character === ")") depth = Math.max(0, depth - 1);

    if ((character === "," || character === "/") && depth === 0) {
      if (current.trim()) parts.push(current.trim());
      current = "";
    } else {
      current += character;
    }
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
};

export const parseTermField = (value) => {
  const notes = [];
  const terms = splitOutsideParentheses(value).map((rawTerm) => {
    let term = rawTerm;
    const leadingNote = term.match(/^\(([^)]+)\)\s+(.+)$/);
    if (leadingNote) {
      notes.push(leadingNote[1]);
      term = leadingNote[2];
    }

    const trailingNote = term.match(/^(.+?)\s+\(([^)]+)\)$/);
    if (trailingNote) {
      term = trailingNote[1];
      notes.push(trailingNote[2]);
    }

    return term.trim();
  });

  return {
    terms: [...new Set(terms.filter(Boolean))],
    notes: [
      ...new Set(
        notes.map(
          (note) => `${note.charAt(0).toLocaleUpperCase()}${note.slice(1)}.`,
        ),
      ),
    ],
  };
};
