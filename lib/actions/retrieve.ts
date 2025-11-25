export async function retrieve(query: string) {
  try {
    const res = await fetch(`${process.env.SERVER_BASE_URL}/api/retrieve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        key: 'ngrok-skip-browser-warning',
        value: 'true',
      },
      body: JSON.stringify({
        query,
      }),
    })
    return res.json()
  } catch {
    return 'Error, please try again.'
  }
}
