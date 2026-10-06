# Candidato para conversación sin cuota de inferencia

2026-10-06. Autorización general vigente. **Investigado, no descargado ni ejecutado.** No es una función disponible en la aplicación.

| Recurso | Procedencia verificada | Licencia / archivo seleccionado |
|---|---|---|
| llama.cpp | [Release b11429](https://github.com/ggml-org/llama.cpp/releases/tag/b11429), indicado por nightly-tag.txt de v0.6.0; fecha 2026-10-05 | [MIT de ese tag](https://github.com/ggml-org/llama.cpp/blob/b11429/LICENSE). Windows CPU x64 ZIP, 19.398.918 bytes; SHA-256 1283323272b04cd07905816a597a0da810918102de958f4ff6f7bbaa70ed2efe |
| Qwen3-4B-GGUF | [Repositorio del autor](https://huggingface.co/Qwen/Qwen3-4B-GGUF), revisión bc640142c66e1fdd12af0bd68f40445458f3869b | [Apache-2.0](https://huggingface.co/Qwen/Qwen3-4B-GGUF/blob/bc640142c66e1fdd12af0bd68f40445458f3869b/LICENSE). Qwen3-4B-Q4_K_M.gguf, 2.497.280.256 bytes; SHA-256 7485fe6f11af29433bc51cab58009521f205840f5b4ae3a32fa7f92e8534fdf5 |

Se leyeron ambas licencias completas y metadatos públicos; sin acceso a credenciales. Permiten el uso local sin tarifa de inferencia, conservando avisos/condiciones; no garantizan calidad ni conceden aval o marcas. Antes de distribución, conservar también licencias y avisos de componentes del paquete. No se instala globalmente ni se cambia licencia del código propio. Pesos/runtime irían en .local, fuera de Git. Preparación portable, sin instalador. Candidato para CPU existente; no se promete rendimiento ni competencia deportiva por tamaño/publicidad del modelo.

Alternativas: reglas locales reutilizan catálogo y son independientes de cuentas, pero no sustituyen razonamiento conversacional. API cloud ordinaria introduce consumo facturable y no será obligatoria. Integrar Codex/ChatGPT exige elegibilidad/autorización mediante flujo oficial; no extraer tokens existentes ni confundir suscripción de desarrollo con acceso del producto. [Opciones previas](conversational-coach-feasibility.md).

## Espacio y siguiente verificación

En esta revisión C: tenía 136.929.280 bytes libres. Se retiraron exclusivamente cuatro MP4 duplicados de .playwright-mcp dentro del proyecto, después de comprobar hashes idénticos a originales conservados en assets/downloads. Recuperados 201.170.915 bytes; lectura posterior 338.055.168 bytes libres. No archivos personales/globales eliminados ni cambios fuera del proyecto. **No cabe el modelo con margen suficiente.** Se solicitó liberar al menos 5 GB para su evaluación local y se continúa trabajo independiente. No descargar un modelo inferior solo para ocultar esta limitación ni inventar una prueba de calidad.

Después: confirmar espacio, conservar licencias, descargar desde fuentes oficiales fijadas, verificar tamaños/hashes, inspeccionar paquete portable y probar versión. Motor solo en loopback, sin exponerlo a la LAN. Para teléfono/TV, mediador del proyecto limitado a las operaciones necesarias, sin shell y sin persistir perfiles en logs. Casos sintéticos de audiencia, lugar, material, negativa ante dolor, peticiones fuera del catálogo y ausencia de garantías de profesionalización. Respuestas inválidas no modifican un plan. Evaluar latencia/memoria antes de comprometer esta vía. El runtime no necesita red para inferencia tras preparación; no afirmar instalación/ejecución mientras siga pendiente.
