export function parseBBCode(content: string) {
    const elements: Array<{
      type: "text" | "image" | "youtube" | "twitter"
      content: string
      data?: unknown
    }> = []
  
    // Regex patterns for BBCode tags
    const patterns = [
      { type: "youtube", regex: /\[youtube\](.*?)\[\/youtube\]/g },
      { type: "twitter", regex: /\[twitter\](.*?)\[\/twitter\]/g },
      { type: "image", regex: /\[img\](.*?)\[\/img\]/g },
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
  