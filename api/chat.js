import servicios from "../data/servicios.json";

function obtenerContexto(pregunta) {
  const texto = String(pregunta || "").toLowerCase();
  const serializar = (valor) =>
    valor ? JSON.stringify(valor, null, 2) : null;

  if (
    texto.includes("internet") ||
    texto.includes("wifi") ||
    texto.includes("plan") ||
    texto.includes("mbps") ||
    texto.includes("fibra") ||
    texto.includes("instalacion")
  ) {
    return serializar(servicios.internet);
  }

  if (texto.includes("canal") || texto.includes("iptv") || texto.includes("netflix") || texto.includes("magis") || texto.includes("stream")) {
    return serializar(servicios.streaming);
  }

  if (texto.includes("camara") || texto.includes("camaras") || texto.includes("cctv")) {
    return serializar(servicios.camaras);
  }

  if (texto.includes("repara") || texto.includes("televisor") || texto.includes("parlante") || texto.includes("radio") || texto.includes("electronico")) {
    return serializar(servicios.reparaciones);
  }

  if (texto.includes("hgw") || texto.includes("suplemento") || texto.includes("salud")) {
    return serializar(servicios.hgw);
  }

  if (texto.includes("cafini") || texto.includes("tv box") || texto.includes("producto") || texto.includes("tecnologia")) {
    return serializar(servicios.productos_tecnologia);
  }

  return serializar(servicios.empresa);
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { message } = req.body || {};
    const userMessage = String(message || "").trim();

    if (!userMessage) {
      return res.status(400).json({ error: "El mensaje es obligatorio." });
    }

    if (userMessage.length > 500) {
      return res.status(400).json({ error: "Mensaje demasiado largo." });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "Falta GROQ_API_KEY en el servidor." });
    }

    const contexto = obtenerContexto(userMessage);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
Eres el asistente oficial de Flores en Bolivia.
Ubicación: Oruro – Caracollo, final Av. Bernal, una cuadra antes de Fatecipol entre calle Ayacucho.

OBJETIVO PRINCIPAL:
Informar con claridad y ayudar a concretar ventas de forma natural y profesional.

ESTILO:
- Equilibrado y vendedor.
- Amigable, claro y seguro.
- No exagerado.
- No insistente.
- Profesional pero cercano.

REGLAS IMPORTANTES:
- Usa únicamente la información oficial proporcionada.
- No inventes precios, servicios ni descuentos.
- No menciones competencia.
- No prometas cosas que no estén en la información.
- Si no hay información suficiente, ofrece el WhatsApp 67236144 sin inventar.
- Si algo no está en la información oficial proporcionada, responde que debes confirmarlo por WhatsApp y no inventes ningún dato.

ESTRATEGIA DE VENTAS:

1) Si preguntan por WiFi o Internet:
   - Pregunta cuántas personas usarán el internet.
   - Pregunta si usan streaming o TV.
   - Recomienda el plan más adecuado según el caso.
   - Si mencionan ver canales, sugiere planes con canales incluidos.
   - Explica beneficios de forma breve (velocidad real, estabilidad, soporte).

2) Si preguntan por canales o streaming:
   - Explica opciones disponibles.
   - Si no tienen internet, sugiere contratar WiFi primero.
   - Relaciona IPTV con buena velocidad.

3) Si preguntan por cámaras:
   - Explica que se realiza instalación profesional.
   - Indica que la cotización depende del lugar.
   - No inventes precios si no están en la información.

4) Si preguntan por reparaciones:
   - Indica que se realiza diagnóstico sin costo.
   - Explica qué equipos se reparan.

5) Si preguntan ubicación:
   - Responde claramente con la dirección oficial.

6) Si el usuario muestra intención clara de compra (ej: "quiero contratar", "instalación", "me interesa", "cómo contrato"):
   - Invita amablemente a escribir al WhatsApp 67236144 para coordinar instalación o cotización.
   - No envíes WhatsApp si solo está preguntando información general.

CIERRE SUAVE:
Cuando detectes interés real, termina con algo como:
"Si deseas iniciar la instalación o coordinar detalles, puedes escribir directamente al 67236144 y te ayudamos de inmediato."

MANTÉN RESPUESTAS:
- Claras
- No demasiado largas
- Útiles
- Orientadas a ayudar y vender

Información oficial:
${contexto}
`
          },
          { role: "user", content: userMessage }
        ],
        temperature: 0.3,
        max_tokens: 400
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || JSON.stringify(data)
      });
    }

    const reply = data.choices?.[0]?.message?.content || "No se pudo generar respuesta.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}


