# IA para preparar avatar, rig, movimientos y video

Fecha de consulta: 2026-09-26. Complemento documental de fase 00 solicitado por el usuario. No se abrieron cuentas, subieron archivos, generaron recursos, descargaron modelos ni instalaron herramientas. Se comparan candidatos representativos; no es una búsqueda exhaustiva ni una prueba de calidad.

## Dictamen y corrección de la propuesta anterior

La auditoría previa no comparaba con suficiente detalle la IA de producción. No hay evidencia para afirmar que Blender sin asistencia sea siempre más rápido, ni que una herramienta generativa resuelva mejor estos ejercicios. Mantener la base local propuesta y evaluar asistencia concreta antes de autoría extensa. IA y Blender pueden formar parte del mismo proceso; un recurso generado no sustituye por sí mismo al reproductor de la aplicación.

**Verificado** significa que una fuente primaria publica una capacidad o condición; **propuesto** identifica una decisión razonada todavía sin prueba; **pendiente** incluye elegibilidad final, términos completos, archivo exportable, calidad, rendimiento y trabajo total. Ningún candidato nuevo queda incorporado o aprobado para producir contenido por este informe.

## Qué trabajo resuelve cada pieza

| Pieza | Resultado necesario | Aportación posible de automatización/IA | Base propuesta y motivo |
|---|---|---|---|
| Avatar | Malla genérica que se deforme correctamente | Generar forma/texturas a partir de texto o imagen | Evaluar primero un humanoide ya riggeado de Quaternius: reduce pasos por comprobar; no se necesita una apariencia exclusiva |
| Rig | Esqueleto, pesos de deformación y controles | Colocar articulaciones y asignar pesos automáticamente | Aprovechar el rig existente; comprobar pies, deformación y editabilidad antes de añadir otro sistema |
| Movimiento | Clip de un ejercicio concreto, editable y revisable | Captura desde video, generación por texto o asistencia a poses | Reutilizar clip adecuado; comparar asistencia si falta y corregir/exportar con herramientas existentes |
| Física | Contactos o trayectorias con un propósito definido | Asistencia para balance/apoyos o modelos aprendidos especializados | Rapier conserva la prueba aislada de contactos; ninguna captura o generación acredita por sí sola el gesto deportivo |
| Video | Explicación visual coherente y con derechos | Crear o transformar imágenes/secuencias | Complemento posible; un MP4 no aporta por sí solo un avatar articulado que pueda verse desde tres cámaras |

Three/Fiber muestra la escena; Blender prepara y corrige recursos; Rapier calcula los contactos del laboratorio separado. Esta división no depende de cómo se obtuvo un clip. Una asistencia física durante autoría y una simulación interactiva durante reproducción tienen funciones diferentes.

## Candidatos y límites publicados

### Meshy: generación 3D y preparación de personajes

**Verificado documentalmente:** la ayuda específica de Free publica 100 créditos mensuales, 10 descargas al mes de Meshy 6 Lite y salida CC BY 4.0 con atribución. Descargar resultados de Meshy 6/7 requiere plan pagado; Free no incluye API. [Condiciones publicadas de Free](https://help.meshy.ai/en/articles/15696428-what-is-included-on-the-free-plan).

La guía general documenta Smart-Rig sin consumo de créditos y exportaciones GLB/FBX. Esto no demuestra que cualquier combinación de generación, rig y descarga esté disponible gratis. [Guía del producto](https://help.meshy.ai/en/articles/9991793-how-to-use-meshy-complete-beginner-s-tutorial).

**Propuesto:** alternativa para un avatar/prop que el catálogo no resuelva, sin depender de su cuota para completar el proyecto. **Pendiente:** comprobar la ruta completa de exportación, términos de contenido/privacidad y deformación del archivo. La página de precios devolvió una comprobación de navegador; se usaron las ayudas oficiales. Hay diferencias entre guía general y ayuda de Free sobre compra de créditos: no se adopta esa vía ni se infiere una cuota de API.

### Mixamo: auto-rigging y biblioteca

**Verificado:** Adobe publica acceso gratuito con Adobe ID, sin suscripción Creative Cloud, y uso de personajes/animaciones en proyectos personales y comerciales; el auto-rigger se limita a humanoides bípedos. Es automatización útil, no se presenta como un generador moderno de cualquier ejercicio por texto. [FAQ de Adobe](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html).

Los [términos adicionales](https://wwwimages2.adobe.com/content/dam/cc/en/legal/servicetou/Mixamo-Addl-Terms-en_US-20210623.pdf), vigentes en el texto consultado desde 2021, restringen usar servicio, contenido o salidas para crear, entrenar, probar o mejorar sistemas IA/ML. No usar sus recursos como dataset ni introducirlos por defecto en procesos que contribuyan a entrenamiento de modelos. El uso de una salida con otra herramienta IA requiere comprobar el caso, no una prohibición inferida de toda edición automática.

**Propuesto:** mantenerlo como alternativa de biblioteca/rig. **Pendiente:** archivo, términos generales aplicables y redistribución dentro del GLB del proyecto; tampoco se presupone cobertura deportiva.

### DeepMotion Animate 3D: movimiento desde video

**Verificado:** la FAQ permite Freemium personal no comercial y exportaciones de animación, con condiciones de formato. También explica que los créditos pueden agotarse y que los programas de etiquetado/corrección contribuyen a mejorar sus modelos. No participar ni subir referencias por defecto. [FAQ/precios Animate 3D](https://www.deepmotion.com/pricing-animate3d).

**Inconsistencia pendiente:** esa FAQ aún anuncia 60 segundos mensuales, mientras el contenido público indexado de [Launch](https://www.deepmotion.com/launch) y [registro Freemium](https://www.deepmotion.com/sign-up?plan=Freemium) muestra 25 créditos mensuales. No presupuestar el catálogo con ninguno de esos valores sin confirmar la oferta efectiva. Tampoco trasladar automáticamente cuotas de SayMotion a Animate 3D.

**Propuesto:** primer candidato auxiliar de captura a contrastar si falta un clip y existe video adecuado con derechos suficientes. **Pendiente:** términos de carga/procesamiento/salida, límites efectivos, privacidad y correcciones. Una grabación reproduce también errores del ejecutante; no pedir al usuario que demuestre una técnica que desconoce. El cambio a uso comercial exige nueva revisión.

### Cascadeur: poses y asistencia física

**Verificado en su FAQ:** dispone de asistencia a poses y herramientas físicas. El plan Free exporta solamente su formato .casc; los formatos de intercambio figuran en planes pagados. La misma FAQ declara revisión global de 2024; la página de planes no se recuperó directamente. [FAQ oficial](https://cascadeur.com/help/faq).

**Decisión:** no basar el flujo gratuito Blender/GLB en Free ni en un trial. No se ha acreditado una ruta vigente de exportación gratuita apropiada. No se fija tarifa pagada ni se presume elegibilidad educativa. Reevaluar si cambian esas condiciones; no es un rechazo por calidad de la herramienta.

### TRELLIS.2: ejemplo de generación 3D local

**Verificado:** el repositorio de Microsoft declara modelo y código MIT, dependencias con términos separados y un requisito publicado de GPU NVIDIA con al menos 24 GB de memoria; solo reporta pruebas en Linux. [Repositorio oficial](https://github.com/microsoft/TRELLIS.2), [licencia](https://raw.githubusercontent.com/microsoft/TRELLIS.2/main/LICENSE).

**Conclusión para este equipo:** la inspección previa acredita Intel UHD como adaptador primario; no acredita el hardware requerido por esa ruta. No instalar ni proponer compra/alquiler de GPU. No equivale a afirmar que toda IA local sea inviable. **Pendiente:** artefactos, dependencias y cualquier alternativa de menor consumo. Los recursos gratuitos de cómputo externos tampoco se consideran capacidad garantizada.

### Runway: video generativo

**Verificado:** el plan Free anuncia 125 créditos de una sola asignación, no una cuota mensual renovable. [Precios oficiales](https://runway.com/pricing).

**Decisión:** no usarlo como vía indispensable de producción continua a costo cero. Un video complementario podría evaluarse por separado; derechos de entrada/salida, continuidad del movimiento y utilidad didáctica siguen pendientes. Generar un video y renderizar una escena ya construida son trabajos distintos; Remotion continúa como candidato de exportación local futura, fuera del MVP1.

## Por qué mantener la base y dónde sí probar asistencia

La propuesta prioriza un avatar genérico ya articulado porque ese requisito puede satisfacerse reutilizando; añadir generación también añadiría comprobaciones de geometría, rig y compatibilidad. Es una expectativa de menor trabajo, no un ahorro medido. La mayor oportunidad de asistencia está en obtener y corregir gestos específicos cuando el catálogo no los contiene.

**Costo de producción y costo de reproducción son distintos.** Si licencia y formato lo permiten, una salida preparada con un servicio externo puede empaquetarse para reproducción local sin volver a invocarlo. No se afirma que la licencia sobreviva a cualquier cambio contractual: registrar los derechos aplicables a cada archivo. El runtime del MVP no necesita generadores, créditos ni cuentas. Una cuota opcional solo es aceptable si existe una ruta alternativa real para conservar el resultado requerido.

En una fase posterior autorizada, comparar como máximo una ruta asistida pertinente frente a adaptar el recurso disponible, antes de fabricar muchos clips:

1. Fijar el mismo gesto y criterio de enseñanza; empezar por hip-hinge como prueba visual propuesta, sin convertirla en una prescripción.
2. Elegir referencia y recurso con derechos compatibles, incluidos permiso de procesamiento externo y restricciones IA cuando correspondan.
3. Medir tiempo total: preparación, generación/captura, intentos, corrección, integración y revisión. Registrar cuotas/costo y no solo segundos de generación.
4. Comprobar esqueleto editable, apoyos, pies, articulaciones, contacto con material, escala, área y tres vistas. Examinar después un gesto con balón y otro en suelo para detectar límites que el primero no revele.
5. Elegir la ruta que produzca el clip correcto con menor trabajo demostrado y sin gasto obligatorio. Si falla la representación, corregirla; no cambiar el ejercicio adecuado por conveniencia de la herramienta.
6. Mantener draft hasta las revisiones técnica y deportiva exigidas. Ni un resultado atractivo ni un modelo especializado sustituyen esas revisiones.

No se exige probar todos los proveedores, entrenar modelos propios ni construir auto-riggers. La referencia a una prueba futura no autoriza cargas, instalaciones o descargas en 00. Véanse el [plan](../plans/mvp1-execution-plan.md), la [auditoría de reutilización](reuse-audit.md) y la [matriz económica](feature-cost-matrix.md).
