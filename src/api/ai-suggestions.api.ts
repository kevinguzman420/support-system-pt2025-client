interface SuggestionRequest {
  title: string;
  description: string;
  category?: string;
  previousResponses?: string[];
}

interface SuggestionResponse {
  success: boolean;
  suggestion: string;
  message?: string;
}

export const generateResponseSuggestion = async (
  data: SuggestionRequest
): Promise<SuggestionResponse> => {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY || "";

  if (!apiKey) {
    return {
      success: false,
      suggestion: "",
      message: "API Key de Hugging Face no configurada",
    };
  }

  // Lista de modelos para intentar (en orden de preferencia)
  const models = [
    "mistralai/Mixtral-8x7B-Instruct-v0.1",
    "HuggingFaceH4/zephyr-7b-beta",
    "microsoft/Phi-3-mini-4k-instruct",
    "google/flan-t5-base",
  ];

  try {
    // Construir el prompt para el modelo
    const contextInfo = data.previousResponses?.length 
      ? `\n\nRespuestas previas: ${data.previousResponses.slice(-2).join(". ")}`
      : "";

    const prompt = `Eres un asistente de soporte técnico profesional. 

Ticket de soporte:
- Título: ${data.title}
- Categoría: ${data.category || "General"}
- Descripción: ${data.description}${contextInfo}

Genera una respuesta profesional, empática y útil (máximo 150 palabras) que ayude al cliente con su problema. Incluye pasos específicos si es posible.

Respuesta:`;

    // Intentar con cada modelo hasta que uno funcione
    for (const modelId of models) {
      try {
        console.log(`Intentando con modelo: ${modelId}`);
        
        const response = await fetch(
          `https://api-inference.huggingface.co/models/${modelId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: prompt,
              parameters: {
                max_new_tokens: 200,
                temperature: 0.7,
                top_p: 0.9,
                do_sample: true,
                return_full_text: false,
              },
              options: {
                wait_for_model: true,
                use_cache: false,
              },
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log(`Respuesta exitosa de ${modelId}:`, result);
          
          // Extraer el texto generado
          let suggestion = "";
          if (Array.isArray(result) && result.length > 0) {
            suggestion = result[0].generated_text || result[0].translation_text || "";
          } else if (result.generated_text) {
            suggestion = result.generated_text;
          } else if (typeof result === "string") {
            suggestion = result;
          }

          // Limpiar la sugerencia
          suggestion = suggestion.trim();
          
          if (suggestion.includes("Respuesta:")) {
            suggestion = suggestion.split("Respuesta:").pop()?.trim() || suggestion;
          }

          if (suggestion && suggestion.length >= 10) {
            return {
              success: true,
              suggestion,
            };
          }
        } else {
          console.log(`Modelo ${modelId} no disponible, intentando siguiente...`);
        }
      } catch (modelError) {
        console.log(`Error con modelo ${modelId}:`, modelError);
        continue;
      }
    }

    // Si ningún modelo funcionó, devolver un mensaje predeterminado inteligente
    return {
      success: true,
      suggestion: `Gracias por contactarnos respecto a "${data.title}". 

Hemos recibido su solicitud en la categoría ${data.category || "General"} y nuestro equipo está revisando los detalles que nos ha proporcionado.

Próximos pasos:
1. Nuestro equipo de soporte revisará su caso en detalle
2. Le proporcionaremos una solución específica a la brevedad
3. Si necesitamos más información, nos pondremos en contacto con usted

¿Hay algún detalle adicional que pueda ayudarnos a resolver su problema más rápidamente?

Atentamente,
Equipo de Soporte Técnico`,
    };
  } catch (error) {
    console.error("Error al generar sugerencia:", error);
    
    // Respuesta de respaldo
    return {
      success: true,
      suggestion: `Gracias por ponerse en contacto con nosotros.

Hemos recibido su consulta sobre "${data.title}" y entendemos la importancia de resolver este asunto.

Nuestro equipo está comprometido en ayudarle y trabajaremos para proporcionarle una solución adecuada lo antes posible.

Si tiene información adicional que pueda ayudarnos, no dude en compartirla.

Atentamente,
Equipo de Soporte`,
    };
  }
};
