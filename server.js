const express = require('express');
const cors = require('cors');
const path = require('path');
const open = require('open');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Contenido de la resolución
const RESOLUTION_CONTENT = `
RESOLUCIÓN NÚMERO 371 DE 06 JUN 2024 - AGENCIA NACIONAL DE MINERÍA

OBJETO: Establecer las condiciones y periodicidad del reporte de información de los titulares mineros y beneficiarios de las demás figuras que por mandato legal permiten la exploración y explotación de recursos naturales no renovables en la plataforma de Control a la Producción de la ANM.

ÁMBITO DE APLICACIÓN: Titulares mineros y beneficiarios que se encuentren desarrollando labores de explotación, excepto mineros de subsistencia (artículo 2).

DEFINICIONES CLAVE (artículo 3):
- Plataforma de Control a la Producción: Sistema integral de tecnologías para capturar, recibir, procesar y analizar datos de producción minera
- Formulario Web: Herramienta principal para cargar formatos de registro de información
- Servicios Web: Herramienta de intercomunicación entre máquinas para compartir datos con dos módulos:
  * Módulo de comunicación alternativa
  * Módulo para datos e información complementaria
- Capacidad Tecnológica: Recursos y elementos tecnológicos para monitoreo y control de volúmenes de producción
- Diagrama de flujo de puntos de control: Representación visual de puntos de control para volúmenes de producción

COMPONENTES TECNOLÓGICOS (artículo 4):
1. Formulario Web (principal y obligatorio)
2. Servicios Web con dos módulos

FORMATOS DE REGISTRO OBLIGATORIOS (artículo 6):
- Producción (mensual - dentro de 8 días hábiles)
- Inventarios (mensual)
- Regalías (trimestral)
- Proyecciones (anual)
- Ejecución de obras y/o material a beneficio (mensual)
- Utilización de maquinaria de transporte (mensual)
- Paradas de producción (mensual)
- Inventario de maquinaria (anual)
- Capacidad tecnológica (anual)

CRONOGRAMA DE IMPLEMENTACIÓN (artículo 11):
1. Proyectos de Interés Nacional y Gran Minería: 01 octubre 2024 - 30 septiembre 2025
2. Mediana Minería: 01 abril 2025 - 31 marzo 2026
3. Pequeña Minería y beneficiarios: 01 octubre 2025 - 30 septiembre 2026

FECHAS ESPECÍFICAS CAPACIDAD TECNOLÓGICA (artículo 11, parágrafo 3):
- Proyectos de Interés Nacional: octubre 2024
- Gran Minería: enero 2025
- Mediana Minería: julio 2025
- Pequeña Minería: julio 2026

OBLIGATORIEDAD ESPECIAL (artículo 5):
- Proyectos de Interés Nacional: obligatorio implementar servicios web complementarios en 9 meses
- Período de transición sin sanciones hasta vencimiento de plazos
- Después de plazos vencidos: sanciones por incumplimiento

PERIODICIDAD DE REPORTE (artículo 9):
- Información debe cargarse dentro de los primeros 8 días hábiles del período vencido
- Servicios Web complementarios: reporte diario
- Formulario Web: según frecuencia de cada formato

SANCIONES (artículo 14):
El incumplimiento dará lugar a imposición de multas según norma aplicable en cada caso.

CONFIDENCIALIDAD (artículo 8):
La información técnica y económica goza de reserva legal según artículo 88 de la Ley 685 de 2001.

BENEFICIARIOS DE OTRAS FIGURAS (artículo 6, parágrafo 3):
Solo deben reportar: producción, inventarios, regalías e inventario de maquinaria.

REPORTE ASISTIDO (artículo 11, parágrafo 5):
Pequeña minería puede usar modalidad asistida en sedes de la entidad.
`;

// Ruta API para chat
app.post('/api/chat', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Pregunta requerida' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ 
      error: 'API Key de OpenAI no configurada. Revisa tu archivo .env' 
    });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Eres un asistente especializado en la Resolución 371 de 2024 de la Agencia Nacional de Minería de Colombia. 

Tu función es responder preguntas específicamente sobre esta resolución. Debes:
1. Responder únicamente basándote en el contenido de la resolución
2. Ser preciso y citar artículos específicos cuando sea relevante
3. Si la pregunta no está relacionada con la resolución, redirigir cortésmente al tema
4. Usar un tono profesional pero accesible
5. Mencionar fechas, plazos y obligaciones específicas cuando corresponda
6. Incluir números de artículos y parágrafos cuando sea apropiado

Contenido de la Resolución 371/2024:
${RESOLUTION_CONTENT}`
          },
          {
            role: 'user',
            content: question
          }
        ],
        max_tokens: 600,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error de OpenAI: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    res.json({ answer });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Error procesando la consulta',
      details: error.message 
    });
  }
});

// Servir archivo principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  
  // Abrir navegador automáticamente
  setTimeout(async () => {
    try {
      await open(`http://localhost:${PORT}`);
      console.log('📱 Abriendo navegador...');
    } catch (error) {
      console.log('No se pudo abrir el navegador automáticamente');
      console.log('Abre manualmente: http://localhost:' + PORT);
    }
  }, 1500);
});