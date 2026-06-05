import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  const { msg } = req.query;
  
  if (!msg) {
    return res.status(400).json({ error: "Mensagem vazia" });
  }

  try {
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
          content: msg,
        },
      ],
    });

    return res.json({
      response: message.content[0].text,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Erro ao processar",
    });
  }
}
