export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { sport, apiKey } = req.query;

  if (!sport || !apiKey) {
    return res.status(400).json({ error: "Paramètres manquants : sport et apiKey requis" });
  }

  const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=eu&markets=h2h&bookmakers=betclic,unibet,winamax,bet365,williamhill,pinnacle&oddsFormat=decimal`;

  try {
    const response = await fetch(url);
    const remaining = response.headers.get("x-requests-remaining");
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.setHeader("x-requests-remaining", remaining || "?");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Erreur proxy : " + err.message });
  }
}
