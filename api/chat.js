export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { message } = req.body || {};
    const userMessage = String(message || "").trim();

    if (!userMessage) {
      return res.status(400).json({ error: "El mensaje es obligatorio." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Falta la variable GEMINI_API_KEY." });
    }

    const systemPrompt = `
Eres Infinity AI, asistente virtual de Flores (Bolivia).
Responde en espanol claro, profesional y breve.
No inventes informacion. Si no sabes algo, dilo.
Prioriza ayuda sobre: planes de internet, pagos, soporte tecnico, streaming y contacto.
Cuando convenga, da pasos concretos y accionables.
`.trim();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: userMessage }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const providerError =
        data?.error?.message || "Error al consultar Gemini.";
      return res.status(response.status).json({ error: providerError });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No se pudo generar respuesta.";

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
}
