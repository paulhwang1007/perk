import { createClient } from "@/utils/supabase/client"

const API_BASE_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

export async function authFetch(endpoint: string, options: RequestInit = {}) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        throw new Error("No active session")
    }

    const token = session.access_token

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    }

    const response = await fetch(`${API_BASE_url}${endpoint}`, {
        ...options,
        headers,
    })

    if (!response.ok) {
        if (response.status === 401) {
            // Handle unauthorized (redirect logic handled by middleware usually)
            console.error("Unauthorized request")
        }
        throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
}
