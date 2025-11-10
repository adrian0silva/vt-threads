import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");
  const limit = searchParams.get("limit") || "20";

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  try {
    // Primeiro, obter token
    const tokenResponse = await fetch(
      `${req.nextUrl.origin}/api/spotify/token`,
      {
        method: "GET",
      }
    );

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: "Failed to get access token" },
        { status: 500 }
      );
    }

    const { access_token } = await tokenResponse.json();

    // Buscar músicas
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!searchResponse.ok) {
      const error = await searchResponse.text();
      console.error("Spotify search error:", error);
      return NextResponse.json(
        { error: "Failed to search Spotify" },
        { status: searchResponse.status }
      );
    }

    const data = await searchResponse.json();

    // Transformar dados para o formato esperado
    const tracks = data.tracks?.items?.map((track: any) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((a: any) => a.name).join(", "),
      album: track.album.name,
      preview_url: track.preview_url,
      image_url: track.album.images?.[0]?.url || track.album.images?.[1]?.url || null,
      duration_ms: track.duration_ms,
    })) || [];

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error("Error searching Spotify:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

