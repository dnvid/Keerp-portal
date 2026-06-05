export default async function handler(req, res) {
  // Apenas GET é suportado
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não suportado" });
  }

  const { msg } = req.query;

  if (!msg || msg.trim() === "") {
    return res.status(400).json({ error: "Mensagem vazia" });
  }

  // Verifica se a chave de API existe
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY não configurada");
    return res.status(500).json({ error: "Configuração de API não encontrada" });
  }

  try {
    // Importa dinâmico do SDK
    const { Anthropic } = await import("@anthropic-ai/sdk");
    
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 600,
      system: `Você é KeerpIA, assistente especializado em diagnósticos digitais e ecommerce para a plataforma Keerp.

Sua função: responder perguntas sobre performance de site, SEO, estratégia digital, diagnósticos e recomendações de melhoria.

Seja direto, prático e cite números/dados quando possível. Respostas curtas (2-3 frases máximo).`,
      messages: [
        {
          role: "user",
          content: msg.trim(),
        },
      ],
    });

    return res.status(200).json({
      response: message.content[0].text,
      success: true,
    });
  } catch (error) {
    console.error("Erro KeerpIA:", error);
    return res.status(500).json({
      error: error.message || "Erro ao processar mensagem",
    });
  }
}
