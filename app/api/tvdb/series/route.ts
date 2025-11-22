import { NextResponse } from "next/server";
import { ensureToken } from "../search/route";

const API_BASE = 'https://api4.thetvdb.com/v4'

async function getSeriesDetails(id: number) {
  const token = await ensureToken();
  const res = await fetch(`${API_BASE}/series/${id}/extended?meta=episodes`, {
    headers: {Authorization: `Bearer ${token}`}
  })
  if (!res.ok) throw new Error(`Series fetch failed: ${res.status}`);
  const data = await res.json();
  return data
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id") 
    if (!id) return NextResponse.json({error: "Missing id"}, {status:400})
    const data = await getSeriesDetails(Number(id))
    return NextResponse.json(data)
  } catch (err: unknown) {
    console.error("TVDB /series error:", err);
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      {error: message || "Internal Server Error"},
      {status: 500}
    )
  }
}