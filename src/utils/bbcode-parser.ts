type BBCodeElement =
  | { type: "text"; content: string }
  | { type: "image"; content: string; data: { url: string } }
  | { type: "youtube"; content: string; data: { id: string } }
  | { type: "twitter"; content: string; data: { id: string; url: string } }
  | { type: "quote"; content: string; data: { username?: string } }

export function parseBBCode(content: string): BBCodeElement[] {
  const elements: BBCodeElement[] = []

  // Regex patterns for BBCode tags
  const patterns = [
    { type: "youtube", regex: /\[youtube\](.*?)\[\/youtube\]/g },
    { type: "twitter", regex: /\[twitter\](.*?)\[\/twitter\]/g },
    { type: "image", regex: /\[img\](.*?)\[\/img\]/g },
    { type: "quote", regex: /\[quote(?:=(.*?))?\]([\s\S]*?)\[\/quote\]/g },
  ]

  let lastIndex = 0
  const matches: Array<{ type: string; match: RegExpExecArray; index: number }> = []

  // Find all matches
  patterns.forEach((pattern) => {
    let match
    const regex = new RegExp(pattern.regex.source, "g")
    while ((match = regex.exec(content)) !== null) {
      matches.push({
        type: pattern.type,
        match,
        index: match.index,
      })
    }
  })

  // Sort matches by position
  matches.sort((a, b) => a.index - b.index)

  // Process content
  matches.forEach(({ type, match }) => {
    // Add text before this match
    if (match.index > lastIndex) {
      const textContent = content.slice(lastIndex, match.index).trim()
      if (textContent) {
        elements.push({
          type: "text",
          content: textContent,
        })
      }
    }

    // Add the matched element
    const matchedContent = match[1]

    if (type === "youtube") {
      // Extract YouTube ID from URL or direct ID
      const youtubeId = extractYouTubeId(matchedContent)
      if (youtubeId) {
        elements.push({
          type: "youtube",
          content: matchedContent,
          data: { id: youtubeId },
        })
      }
    } else if (type === "twitter") {
      // Extract tweet ID from URL or direct ID
      const tweetId = extractTwitterId(matchedContent)
      if (tweetId) {
        elements.push({
          type: "twitter",
          content: matchedContent,
          data: { id: tweetId, url: matchedContent },
        })
      }
    } else if (type === "image") {
      elements.push({
        type: "image",
        content: matchedContent,
        data: { url: matchedContent },
      })
    } else if (type === "quote") {
      // match[1] depends on how the regex groups capture. 
      // regex: /\[quote(?:=(.*?))?\](.*?)\[\/quote\]/g
      // match[0] is full string
      // match[1] is username (group 1)
      // match[2] is content (group 2)

      // However, the current generic loop structure uses `match[1]` as "matchedContent" 
      // which might be simplistic for multi-group regex.
      // Let's look at the generic loop: `const matchedContent = match[1]`
      // For our quote regex: `[quote=User]Text[/quote]` -> match[1]="User", match[2]="Text"
      // For `[quote]Text[/quote]` -> match[1]=undefined, match[2]="Text"

      // We need to adjust how we handle this because the generic loop assumes match[1] is the content.
      // But for consistency with existing code's structure, we might need a small separate fix or just handle it here if we can access `match` object.
      // The loop gives us `match` (RegExpExecArray).

      const username = match[1]
      const quoteContent = match[2]

      // If it was a simple quote without username, match[1] would be the content in the generic logic 
      // IF the regex was `\[quote\](.*?)\[\/quote\]`.
      // But we have `\[quote(?:=(.*?))?\](.*?)\[\/quote\]`.

      elements.push({
        type: "quote",
        content: quoteContent || "",
        data: { username: username || undefined },
      })
    }

    lastIndex = match.index + match[0].length
  })

  // Add remaining text
  if (lastIndex < content.length) {
    const textContent = content.slice(lastIndex).trim()
    if (textContent) {
      elements.push({
        type: "text",
        content: textContent,
      })
    }
  }

  // If no BBCode found, treat as plain text
  if (elements.length === 0 && content.trim()) {
    elements.push({
      type: "text",
      content: content.trim(),
    })
  }

  return elements
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct ID
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}

function extractTwitterId(url: string): string | null {
  const patterns = [
    /twitter\.com\/\w+\/status\/(\d+)/,
    /x\.com\/\w+\/status\/(\d+)/,
    /^(\d+)$/, // Direct ID
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}
