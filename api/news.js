export default async function handler(req, res) {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const query = searchParams.get("q") || "";
  
    const apiKey = process.meta.env.NEWS_API_KEY;
    console.log("API Key:", process.env.NEWS_API_KEY);
  
    if (!apiKey) {
      return res.status(500).json({ error: "API Key tidak ditemukan" });
    }
  
    const apiUrl = query
      ? `https://newsapi.org/v2/everything?q=${query}&language=id&apiKey=${apiKey}`
      : `https://newsapi.org/v2/top-headlines?country=id&apiKey=${apiKey}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
        console.log("terjdi Gagal mengambil berita", error)
        return res.status(500).json({ error: "Gagal mengambil berita" });
    }
  }
  