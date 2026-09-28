# Definition of Done

Aplicar los controles a la entrega de la fase: en 00/01, sin aplicación ni assets, lint/typecheck/build/E2E y pruebas visuales no aplican y deben registrarse como no ejecutados, nunca como aprobados. La entrega documental requiere revisión de coherencia, referencias, cálculos, alcance y estado actualizado. Un commit no sustituye esas comprobaciones; si no se crea, declararlo pendiente y no afirmar cierre de integración Git. Esta precisión no rebaja la aceptación del producto de entrenamiento ni autoriza fases nuevas.

Una fase está terminada cuando:

- satisface criterios de aceptación;
- typecheck, lint y pruebas pasan;
- documentación y ADR están actualizados;
- la duración declarada coincide con la calculada;
- assets referenciados existen;
- licencias están registradas;
- no hay errores de consola;
- hay evidencia reproducible;
- las limitaciones conocidas están escritas;
- el cambio está en un commit de alcance claro.

## Requisitos de entrega

- Auditoría de costo/licencia por versión instalada, incluyendo transitivas y assets.
- Ningún servicio/pago/cloud requerido para usar el flujo principal.
- Evidencia de reutilización y explicación de cualquier módulo nuevo.
- Física de Rapier separada de clips guiados; una autoridad de transform por objeto.
- Sin solvers, rigs completos ni editor de animación desarrollados innecesariamente.
- Cero placeholders en la sesión entregada para entrenamiento real.
- Pruebas offline y licencias registradas. No declarar hechos no comprobados.

- Costo/licencia evaluados para la funcionalidad y contexto reales, aunque la herramienta sea gratuita no abierta.
- Disparadores futuros y alternativas documentados; ninguna contratación o gasto activado.
- Los adaptadores opcionales no convierten el núcleo local en una función de pago.
