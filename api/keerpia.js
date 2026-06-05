export default async function handler(req, res) {
  // CORS — permite chamadas do GitHub Pages e Vercel
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não suportado" });
  }

  const { msg } = req.query;

  if (!msg || msg.trim() === "") {
    return res.status(400).json({ error: "Mensagem vazia" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key não configurada" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 600,
        system: `Você é KeerpIA, assistente especializado em diagnósticos digitais e ecommerce para a plataforma Keerp. Seja direto, prático e cite números/dados quando possível. Respostas curtas (2-3 frases máximo).`,
        messages: [{ role: "user", content: msg.trim() }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "Erro na API" });
    }

    return res.status(200).json({
      response: data.content[0].text,
      success: true,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message || "Erro ao processar" });
  }
}
