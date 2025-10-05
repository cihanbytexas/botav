export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { token, image_url } = req.body;
  if (!token || !image_url)
    return res.status(400).json({ error: "Missing token or image_url" });

  try {
    // Resmi fetch ile çek
    const img = await fetch(image_url);
    const arrayBuffer = await img.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const bannerData = `data:image/png;base64,${base64}`;

    // Discord API PATCH isteği
    const response = await fetch("https://discord.com/api/v10/users/@me", {
      method: "PATCH",
      headers: {
        "Authorization": `Bot ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ banner: bannerData })
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: result });
    }

    res.status(200).json({ success: true, message: "Banner updated!", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
