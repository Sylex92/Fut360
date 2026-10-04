# Perfiles e historial sin mezcla

2026-10-04. Incremento del alcance acumulado, previo al código. Los tres objetivos siguen pendientes de entrega integral; crear perfiles no completa sus planes ni su enseñanza.

## Implementación y comprobación

1. Reutilizar IndexedDB, motor, historial y React. Añadir perfil local adulto/infantil con alias, pie preferido, modalidades y objetivos funcionales. Sin datos reales precargados, cuentas, medidas clínicas, nuevas dependencias ni peticiones externas.
2. Incorporar propietario de participante a los registros; mantener legados sin asignación. Consultas, guardado, recuperación, importación, exportación y borrado se limitan al perfil seleccionado. La revisión/propiedad de ventana sigue protegiendo escrituras concurrentes.
3. Elegir perfil fuera de una sesión activa y conservar selección por pestaña. La migración de registros legados a un adulto será explícita y atómica, sin modificar eventos o atribuir actividad al niño. Guardar en un perfil eliminado debe fallar; nunca recrearlo silenciosamente.
4. Crear, editar, respaldar/restaurar y eliminar perfiles con su historial. Confirmar destrucción y mostrar alcance de importación. El archivo completo conserva identidad y datos locales; no sincroniza dispositivos automáticamente.
5. Perfil infantil administrado por adulto: no habilitar las plantillas/cargas adultas ni videos externos como si ya estuvieran adaptados. El catálogo y plan infantil son otra entrega necesaria, no un cumplimiento implícito del objetivo 3.
6. Comprobar validaciones y archivos, migración desde IndexedDB v1, aislamiento A/B/legado, recuperación del plan correcto, importación atómica ante conflicto, borrado y escritura desde una pestaña obsoleta. Prueba de navegador en contexto sintético aislado; regresión del recorrido automático existente y vista estrecha.

## Costo, derechos y privacidad

Sin dependencia, servicio o licencia nuevos; se reutiliza la pila instalada. Almacenamiento sujeto a cuota/desalojo del navegador y distinto por origen/dispositivo. Los perfiles separan datos dentro de la app, no constituyen autenticación ni cifrado contra otra persona con acceso al mismo navegador. Respaldo explícito antes de borrar; no tomar perfiles como autorización para enviar datos a terceros.

## Condición de entrega de los tres objetivos

La primera entrega completa debe incluir planes adulto e infantil propios, enseñanza suficiente para **todas** sus tareas, flujo de entrenamiento, registro y revisión de progreso por perfil, creación/adaptación de rutinas y funcionamiento comprobado en computadora, teléfono y TV objetivo. Solo ampliaciones por encima de esa cobertura pueden quedar para después; no reducir requisitos mediante la etiqueta MVP.

Cobertura inicial comprobada: adulto, 52 fichas/32 familias con 13 referencias del gesto y siete parciales; 32 sin video exacto. Infancia, 11 propuestas documentales sin integración/enseñanza audiovisual propia. No hay biblioteca suficiente todavía. Antes de activar cada plan, vincular capacidades → tareas/variantes → demostraciones revisadas → progresiones → protocolo de seguimiento. El censo de 5.764 videos no acredita cobertura.

Datos solicitados: contexto actual y disponibilidad adulta, compañeros/oposición; carga/supervisión/disponibilidad infantil; modelo de TV. Solo bloquean decisiones dependientes. No pedir al usuario que seleccione metodología ni que produzca la biblioteca.
