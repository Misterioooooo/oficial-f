import servicios from "../data/servicios.json";

function obtenerContexto(pregunta) {
  const texto = String(pregunta || "").toLowerCase();
  const serializar = (valor) =>
    valor ? JSON.stringify(valor, null, 2) : null;

  if (texto.includes("internet") || texto.includes("plan") || texto.includes("mbps") || texto.includes("fibra")) {
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

  if (texto.includes("soporte") || texto.includes("wifi") || texto.includes("tecnico")) {
    return serializar(servicios.empresa);
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
            content: `Eres el asistente oficial de Flores en Bolivia.
Tu tono debe ser amigable, profesional y cercano.

Reglas:
- Cuando la pregunta sea sobre los servicios del negocio, usa la informacion oficial proporcionada.
- No inventes servicios ni precios.
- Si preguntan algo general (como matematicas o preguntas normales), puedes responder normalmente.
- Si no existe el servicio solicitado, indica educadamente que no esta disponible y ofrece el contacto 67236144.

Informacion oficial:
${contexto}

Responde de forma clara, util y no demasiado corta.
Evita respuestas excesivamente tecnicas.
Manten tono humano.`
          },
          { role: "user", content: userMessage }
        ],
        temperature: 0.3
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


