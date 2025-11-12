import { headers } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE = 'https://api4.thetvdb.com/v4'
let token: string | null = null
let tokenExpires = 0
const oneMonthMs = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds

async function login() {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({apikey: process.env.TVDB_API_KEY})
  })

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }

  const data = await res.json()

  token = data.data.token
  tokenExpires = Date.now() + oneMonthMs  
}

async function ensureToken() {
  if (token != null && Date.now() < tokenExpires) return 
  console.log(!!process.env.TVDB_API_KEY)
  await login()
}

async function search(query: string) {
  await ensureToken()
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`,
    {headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`}}
  )

  if (!res.ok) {
    throw new Error(`Search failed: ${res.status}`)
  }

  return await res.json()
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const q = url.searchParams.get("q") || ""
    const data = await search(q)
    return NextResponse.json(data)
  } catch (err: unknown) {
    console.error("TVDB API error:", err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}