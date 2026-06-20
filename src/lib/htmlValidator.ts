export interface HtmlValidationIssue {
  type: "error" | "warning" | "info";
  message: string;
  detail: string;
}

export interface HtmlValidationResult {
  isValid: boolean;
  errors: HtmlValidationIssue[];
  warnings: HtmlValidationIssue[];
  info: HtmlValidationIssue[];
  stats: {
    lines: number;
    characters: number;
    tags: number;
    errors: number;
    warnings: number;
    info: number;
    isValid: boolean;
  };
}

export function validateHTML(html: string): HtmlValidationResult {
  const errors: HtmlValidationIssue[] = [];
  const warnings: HtmlValidationIssue[] = [];
  const info: HtmlValidationIssue[] = [];

  // 1. Check if empty
  if (!html || html.trim() === "") {
    errors.push({
      type: "error",
      message: "HTML code is empty",
      detail: "Please paste some HTML code to check"
    });
    return {
      isValid: false,
      errors,
      warnings,
      info,
      stats: getStats(html, errors, warnings, info)
    };
  }

  // 2. Check for DOCTYPE
  if (!html.toUpperCase().includes("<!DOCTYPE HTML>")) {
    warnings.push({
      type: "warning",
      message: "Missing DOCTYPE declaration",
      detail: "Add <!DOCTYPE html> at the beginning of your document"
    });
  }

  // 3. Check for basic HTML structure
  if (!html.includes("<html")) {
    errors.push({
      type: "error",
      message: "Missing <html> tag",
      detail: "Your HTML should be wrapped in <html> tags"
    });
  }

  if (!html.includes("<head") && !html.includes("<title")) {
    warnings.push({
      type: "warning",
      message: "Missing <head> section",
      detail: "Consider adding a <head> section with a title"
    });
  }

  if (!html.includes("<body")) {
    warnings.push({
      type: "warning",
      message: "Missing <body> tag",
      detail: "Your content should be inside <body> tags"
    });
  }

  // 4. Check for unclosed tags & structural anomalies
  checkUnclosedTags(html, warnings);
  checkMalformedAttributes(html, warnings);
  checkCommonIssues(html, warnings, info);
  checkSecurityIssues(html, warnings, info);

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    info,
    stats: getStats(html, errors, warnings, info)
  };
}

// A robust Stack implementation instead of pointer loops
function checkUnclosedTags(html: string, warnings: HtmlValidationIssue[]) {
  const selfClosingTags = [
    "img", "br", "hr", "input", "meta", "link",
    "area", "base", "col", "embed", "param",
    "source", "track", "wbr"
  ];
  const tagRegex = /<\/?([a-zA-Z0-9-]+)(?:\s[^>]*)?>/g;
  const stack: string[] = [];
  const unclosed: string[] = [];
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();

    if (selfClosingTags.includes(tagName) || fullTag.endsWith("/>")) {
      continue; // Skip self-closing tags
    }

    if (fullTag.startsWith("</")) {
      // Closing tag logic
      if (stack.length > 0 && stack[stack.length - 1] === tagName) {
        stack.pop();
      } else {
        // Mismatched or stray closing tag
        unclosed.push(`stray </${tagName}>`);
      }
    } else {
      // Opening tag logic
      stack.push(tagName);
    }
  }

  // Anything left in the stack is an unclosed opening tag
  const finalUnclosed = [...stack, ...unclosed];

  if (finalUnclosed.length > 0) {
    warnings.push({
      type: "warning",
      message: `Structural tag anomalies detected: ${[...new Set(finalUnclosed)].join(", ")}`,
      detail: "Make sure your HTML tag tree nesting is closed cleanly."
    });
  }
}

function checkMalformedAttributes(html: string, warnings: HtmlValidationIssue[]) {
    // This regex looks for an attribute name, an equals sign, 
    // and catches it if it doesn't start with a single or double quote.
    const malformedRegex = /\b[a-zA-Z\-]+=\s*([^'"\s>][^>\s]*)/g;
    
    let match;
    while ((match = malformedRegex.exec(html)) !== null) {
        const fullMatch = match[0];
        const valuePart = match[1];

        // Ensure we aren't accidentally matching something inside a valid style or content string
        // by checking if the value contains internal assignments without outer quotes
        if (valuePart && !valuePart.startsWith('"') && !valuePart.startsWith("'")) {
            
            // IGNORE: Common multi-property internal assignments like width=device-width inside quotes
            if (fullMatch.includes('content=') || fullMatch.includes('style=')) {
                continue; 
            }

            warnings.push({
                type: 'warning',
                message: `Attribute value without quotes: ${valuePart}`,
                detail: 'Consider wrapping attribute values in quotes for HTML validity.'
            });
        }
    }
}

function checkCommonIssues(html: string, warnings: HtmlValidationIssue[], info: HtmlValidationIssue[]) {
  const deprecatedTags = ["font", "center", "marquee", "blink", "frame"];
  deprecatedTags.forEach((tag) => {
    if (new RegExp(`<${tag}\\b`, "i").test(html)) {
      warnings.push({
        type: "warning",
        message: `Deprecated tag: <${tag}>`,
        detail: `The <${tag}> tag is deprecated. Use modern CSS styling instead.`
      });
    }
  });

  if (!/<img[^>]+alt=/i.test(html) && html.includes("<img")) {
    info.push({
      type: "info",
      message: "Images without alt attributes",
      detail: "Consider adding alt attributes to images for screen-reader accessibility."
    });
  }

  if (!html.includes("<title>")) {
    info.push({
      type: "info",
      message: "Missing page title",
      detail: "Add a <title> tag inside the <head> section."
    });
  }

  if (!html.includes("viewport")) {
    info.push({
      type: "info",
      message: "Missing viewport meta tag",
      detail: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> for mobile layouts.'
    });
  }
}

function checkSecurityIssues(html: string, warnings: HtmlValidationIssue[], info: HtmlValidationIssue[]) {
  const inlineEvents = /\bon(click|load|mouseover|submit|focus|blur|change|keyup|input)\s*=/gi;
  if (inlineEvents.test(html)) {
    info.push({
      type: "info",
      message: "Inline event handlers detected",
      detail: "Consider using addEventListener() in external JavaScript files to adhere to a clean CSP."
    });
  }

  if (/href\s*=\s*['"]javascript:/gi.test(html)) {
    warnings.push({
      type: "warning",
      message: "Potential XSS vulnerability / Bad practice",
      detail: 'Avoid using "javascript:" inside href attributes.'
    });
  }
}

function getStats(
  html: string,
  errors: HtmlValidationIssue[],
  warnings: HtmlValidationIssue[],
  info: HtmlValidationIssue[]
) {
  const lines = html ? html.split("\n").length : 0;
  const characters = html ? html.length : 0;
  const tags = html ? (html.match(/<[^>]+>/g) || []).length : 0;

  return {
    lines,
    characters,
    tags,
    errors: errors.length,
    warnings: warnings.length,
    info: info ? info.length : 0,
    isValid: errors.length === 0
  };
}
