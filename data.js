// =============================================================
// data.js
// Datos y configuración centralizada de la demo.
// Para agregar un paso nuevo: pushear un objeto al array correspondiente.
// =============================================================

// Items del menú lateral del builder de Copilot Studio.
// Se resaltan según el `nav` del paso activo.
export const NAV_ITEMS = ['Overview', 'Instructions', 'Knowledge', 'Actions', 'Triggers', 'Test'];

// Pasos de la pestaña "Configuración en Copilot Studio".
// Cada paso describe una pantalla del builder.
//   t    : título corto (stepper)
//   s    : subtítulo (stepper)
//   nav  : item del nav lateral que queda activo en este paso
//   html : función que devuelve el HTML del contenido principal
export const configSteps = [
  {
    t: 'Contexto · Trigger',
    s: 'Qué dispara al agente',
    nav: 'Overview',
    html: () => `
      <h1 class="section-title">Antes de empezar · El disparador</h1>
      <div class="section-sub">El agente no se ejecuta a demanda: arranca solo cuando se cumplen ciertas condiciones en M365.</div>

      <div class="trigger-card">
        <div class="trigger-card-head">
          <div class="trigger-title">
            <span class="trigger-dot"></span>
            <b>Trigger</b>
          </div>
          <span class="trigger-badge">Esperando</span>
        </div>
        <div class="trigger-grid">
          <div class="trigger-item">
            <div class="ti-ic">📂</div>
            <div class="ti-text">
              <b>SharePoint · /CFO/Reportes</b>
              <span>Carpeta gobernada por CFO Office</span>
            </div>
          </div>
          <div class="trigger-item">
            <div class="ti-ic">⏰</div>
            <div class="ti-text">
              <b>Programado · Lunes 7:00 AM</b>
              <span>Si hay reuniones del comité en los próximos 7 días</span>
            </div>
          </div>
          <div class="trigger-item">
            <div class="ti-ic">📨</div>
            <div class="ti-text">
              <b>Reportes semanales actualizados</b>
              <span>Cualquier archivo nuevo en la carpeta despierta al agente</span>
            </div>
          </div>
          <div class="trigger-item">
            <div class="ti-ic">▶</div>
            <div class="ti-text">
              <b>Manual desde Teams</b>
              <span>“Preparar brief del comité” en cualquier momento</span>
            </div>
          </div>
        </div>
      </div>

      <div class="callout">
        <b>Por qué importa.</b> Definir bien el trigger es lo que diferencia un <i>agente</i> de un <i>prompt</i>: el agente actúa sin que alguien lo pida, dentro de los límites pactados.
      </div>`
  },
  {
    t: 'Crear agente',
    s: 'Nombre, objetivo y canal',
    nav: 'Overview',
    html: () => `
      <h1 class="section-title">Crear el agente</h1>
      <div class="section-sub">En Copilot Studio: Create agent → describir el objetivo en lenguaje natural.</div>
      <div class="field">
        <label>Nombre</label>
        <input class="input" value="Preparador de Comité Ejecutivo" readonly>
      </div>
      <div class="field">
        <label>Descripción</label>
        <textarea class="textarea" readonly>Agente interno que prepara un briefing semanal para el comité ejecutivo a partir de fuentes M365 autorizadas: calendario, documentos de SharePoint y minutas anteriores.</textarea>
      </div>
      <div class="callout">
        <b>Realista:</b> el agente consolida y resume información existente. No toma decisiones ni reemplaza revisión humana.
      </div>`
  },
  {
    t: 'Instrucciones',
    s: 'Scope y límites',
    nav: 'Instructions',
    html: () => `
      <h1 class="section-title">Definir instrucciones del agente</h1>
      <div class="section-sub">Las instrucciones evitan sobreprometer y fijan formato, tono y límites.</div>
      <div class="field">
        <label>Instructions</label>
        <textarea class="textarea" style="min-height:250px" readonly>Preparar un briefing ejecutivo semanal para el comité.

Usar solo información disponible en las fuentes conectadas. Si falta información, indicarlo explícitamente.

Output esperado:
1. agenda del próximo comité
2. cambios relevantes vs. semana anterior
3. acciones abiertas con responsable y fecha
4. riesgos o temas que requieren escalamiento
5. links a documentos fuente

Tono: ejecutivo, conciso, sin inventar datos.</textarea>
      </div>`
  },
  {
    t: 'Conectar fuentes',
    s: 'SharePoint, Outlook, Teams',
    nav: 'Knowledge',
    html: () => `
      <h1 class="section-title">Conectar knowledge sources</h1>
      <div class="section-sub">Se conectan ubicaciones específicas, no "toda la empresa".</div>
      <div class="connector-list">
        <div class="connector">
          <div class="ic" style="background:#0f6cbd">O</div>
          <div><b>Outlook Calendar</b><div class="small">Reunión del comité, invitados y agenda</div></div>
        </div>
        <div class="connector">
          <div class="ic" style="background:#038387">S</div>
          <div><b>SharePoint CFO Office</b><div class="small">P&L, reportes y documentos base</div></div>
        </div>
        <div class="connector">
          <div class="ic" style="background:#6264a7">T</div>
          <div><b>Teams / Minutas</b><div class="small">Acciones abiertas del comité anterior</div></div>
        </div>
        <div class="connector">
          <div class="ic" style="background:#217346">X</div>
          <div><b>Excel P&L</b><div class="small">Tabla estándar de KPIs</div></div>
        </div>
      </div>
      <div class="callout">Requisito clave: permisos correctos y carpetas/documentos gobernados.</div>`
  },
  {
    t: 'Crear acciones',
    s: 'Buscar, resumir, enviar',
    nav: 'Actions',
    html: () => `
      <h1 class="section-title">Configurar tools / actions</h1>
      <div class="section-sub">El agente usa acciones para recuperar información y entregar el resultado.</div>
      <div class="connector-list">
        <div class="connector">
          <div class="ic" style="background:#0f6cbd">1</div>
          <div><b>Get calendar events</b><div class="small">Encuentra comité de la semana</div></div>
        </div>
        <div class="connector">
          <div class="ic" style="background:#038387">2</div>
          <div><b>Search SharePoint files</b><div class="small">Busca P&L y reportes recientes</div></div>
        </div>
        <div class="connector">
          <div class="ic" style="background:#6264a7">3</div>
          <div><b>Read meeting notes</b><div class="small">Trae acuerdos previos</div></div>
        </div>
        <div class="connector">
          <div class="ic" style="background:#0f6cbd">4</div>
          <div><b>Send Teams message</b><div class="small">Publica briefing al usuario/equipo</div></div>
        </div>
      </div>`
  },
  {
    t: 'Trigger',
    s: 'Programado lunes 7 AM',
    nav: 'Triggers',
    html: () => `
      <h1 class="section-title">Definir el disparador</h1>
      <div class="section-sub">Para que sea agente y no solo prompt, se ejecuta sin que alguien lo pida.</div>
      <div class="field">
        <label>Trigger type</label>
        <input class="input" value="Scheduled trigger" readonly>
      </div>
      <div class="field">
        <label>Frecuencia</label>
        <input class="input" value="Todos los lunes · 7:00 AM" readonly>
      </div>
      <div class="field">
        <label>Condición</label>
        <input class="input" value="Solo si existe reunión 'Comité Ejecutivo' en los próximos 7 días" readonly>
      </div>
      <div class="callout">
        <b>Alternativa realista:</b> también puede publicarse como agente en Teams y ejecutarse manualmente con "Preparar brief del comité".
      </div>`
  },
  {
    t: 'Test y publicar',
    s: 'Validar antes de escalar',
    nav: 'Test',
    html: () => `
      <h1 class="section-title">Probar y publicar</h1>
      <div class="section-sub">Antes de publicar, se valida con documentos reales controlados.</div>
      <div class="field">
        <label>Test prompt</label>
        <textarea class="textarea" readonly>Prepará el briefing para el comité ejecutivo de esta semana. Mostrá fuentes usadas y marcá información faltante.</textarea>
      </div>
      <div class="connector-list">
        <div class="connector">
          <div class="ic" style="background:#107c10">✓</div>
          <div><b>Resultado validado</b><div class="small">Sin datos inventados; incluye links fuente</div></div>
        </div>
        <div class="connector">
          <div class="ic" style="background:#ca5010">!</div>
          <div><b>Human review</b><div class="small">CFO Office revisa antes de ampliar audiencia</div></div>
        </div>
      </div>`
  },
  {
    t: 'Entregables',
    s: 'Lo que produce el agente',
    nav: 'Test',
    html: () => `
      <h1 class="section-title">Entregables del agente</h1>
      <div class="section-sub">Cuatro outputs listos para revisar y compartir. Generados a partir de las fuentes autorizadas.</div>

      <div class="deliv-grid">

        <!-- Mail -->
        <article class="deliv mail">
          <header>
            <span class="deliv-icon">✉</span>
            <div class="deliv-meta">
              <b>Resumen ejecutivo</b>
              <span>Outlook · para CFO</span>
            </div>
            <span class="deliv-status done">Listo</span>
          </header>
          <div class="mail-body">
            <div class="mail-meta">
              <div><b>De:</b> orquestador@empresa.com</div>
              <div><b>Para:</b> cfo@empresa.com</div>
              <div><b>Asunto:</b> Performance semanal · Sem 18 · Resumen ejecutivo</div>
            </div>
            <hr>
            <p><b>Headline.</b> Ventas <span class="pos">+3.2%</span> vs plan, traccionadas por OXXO México (+5.1%). Margen bruto <span class="neg">–40 pbs</span> por mix.</p>
            <p><b>Alertas clave.</b> Región SUR <span class="neg">–7%</span> vs plan · Headcount BR <span class="neg">+4.2%</span> sin aprobación.</p>
            <p><b>Próximos pasos.</b> Revisar plan SUR, validar HC BR con CHRO.</p>
            <p class="mail-foot">Detalle completo y slide adjunta. Generado automáticamente.</p>
          </div>
        </article>

        <!-- Alertas Teams -->
        <article class="deliv alerts">
          <header>
            <span class="deliv-icon">🚨</span>
            <div class="deliv-meta">
              <b>Alertas críticas</b>
              <span>Teams · Canal CFO Office</span>
            </div>
            <span class="deliv-status done">Listo</span>
          </header>
          <ul class="alert-list">
            <li class="al alta">
              <span class="al-pill">ALTA</span>
              <div><b>SUR</b> · Ventas –7% vs plan · 4ta semana consecutiva</div>
            </li>
            <li class="al media">
              <span class="al-pill">MEDIA</span>
              <div><b>BR</b> · Headcount +4.2% sin aprobación</div>
            </li>
            <li class="al baja">
              <span class="al-pill">BAJA</span>
              <div><b>CENTRO</b> · Margen –20 pbs vs Q-1</div>
            </li>
          </ul>
        </article>

        <!-- Slide -->
        <article class="deliv slide">
          <header>
            <span class="deliv-icon">▦</span>
            <div class="deliv-meta">
              <b>Slide para Comité</b>
              <span>PowerPoint · 1 página</span>
            </div>
            <span class="deliv-status done">Listo</span>
          </header>
          <div class="slide-body">
            <div class="slide-title">Performance Semanal · Sem 18</div>
            <div class="slide-kpis">
              <div class="kpi"><b class="pos">+3.2%</b><span>Ventas vs plan</span></div>
              <div class="kpi"><b>42.1%</b><span>Margen bruto</span></div>
              <div class="kpi"><b class="neg">–7%</b><span>SUR vs plan</span></div>
            </div>
            <div class="slide-regions">
              <span>N</span><span>CT</span><span>NEA</span>
              <span class="reg-bad">SUR</span><span>CUYO</span><span>PAT</span><span class="reg-warn">BR</span>
            </div>
          </div>
        </article>

        <!-- Audio -->
        <article class="deliv audio">
          <header>
            <span class="deliv-icon">🎧</span>
            <div class="deliv-meta">
              <b>Audio Brief</b>
              <span>NotebookLM · 10 min</span>
            </div>
            <span class="deliv-status done">Listo</span>
          </header>
          <div class="audio-body">
            <button class="audio-play" type="button" aria-label="Reproducir">▶</button>
            <div class="audio-info">
              <b>Reproduciendo</b>
              <div class="audio-bar"><div class="audio-fill"></div></div>
              <span class="audio-time">0:00 · 10:00</span>
            </div>
          </div>
        </article>

      </div>

      <div class="callout">
        <b>Listo para revisar.</b> Ningún entregable se envía solo: el CFO valida antes de ampliar audiencia.
      </div>`
  }
];

// Pasos de la pestaña "Vista usuario final" (mockup de Teams).
// En esta vista cada paso AGREGA un mensaje al chat (no reemplaza el contenido).
//   t/s  : títulos del stepper y la timeline
//   html : función que devuelve el HTML de la burbuja
export const bizSteps = [
  {
    t: 'Notificación',
    s: 'Teams recibe el brief',
    html: () => `
      <div class="agent">
        <div class="avatar"></div>
        <div class="bubble">
          <div class="msg-head">Preparador de Comité Ejecutivo</div>
          Hola Lu, preparé el briefing para el Comité Ejecutivo del jueves 9:00 AM usando las fuentes aprobadas.
        </div>
      </div>`
  },
  {
    t: 'Fuentes',
    s: 'Documentos usados',
    html: () => `
      <div class="agent">
        <div class="avatar"></div>
        <div class="bubble">
          <div class="msg-head">Fuentes consultadas</div>
          <span class="source-chip">P&L_Abril.xlsx</span>
          <span class="source-chip">Minuta Comité anterior.docx</span>
          <span class="source-chip">Reporte Comercial Q2.pdf</span>
          <span class="source-chip">Outlook Calendar</span>
          <br><br>
          <span class="small">No se usaron fuentes fuera del workspace autorizado.</span>
        </div>
      </div>`
  },
  {
    t: 'Brief',
    s: 'Output ejecutivo',
    html: () => `
      <div class="agent">
        <div class="avatar"></div>
        <div class="bubble">
          <div class="msg-head">Brief ejecutivo generado</div>
          <div class="brief">
            <h4>Executive Committee Brief · Jueves 9:00</h4>
            <ul>
              <li><b>Agenda:</b> performance mensual, riesgos de margen, avance de iniciativas.</li>
              <li><b>Cambios relevantes:</b> EBITDA bajo plan en Región Norte; presión logística continúa.</li>
              <li><b>Acciones abiertas:</b> pricing review pendiente; validación CAPEX tiendas.</li>
              <li><b>Riesgos:</b> disponibilidad de forecast actualizado para Q3.</li>
            </ul>
          </div>
        </div>
      </div>`
  },
  {
    t: 'Acciones',
    s: 'Pendientes y responsables',
    html: () => `
      <div class="agent">
        <div class="avatar"></div>
        <div class="bubble">
          <div class="msg-head">Acciones abiertas detectadas</div>
          <div class="brief">
            <h4>Follow-up del comité anterior</h4>
            <ul>
              <li>Finanzas: actualizar forecast Q3 antes del miércoles.</li>
              <li>Operaciones: confirmar impacto de costo logístico.</li>
              <li>Comercial: cerrar recomendación de pricing para Región Norte.</li>
            </ul>
          </div>
        </div>
      </div>`
  },
  {
    t: 'Enviar',
    s: 'Compartir por Teams/email',
    html: () => `
      <div class="agent">
        <div class="avatar"></div>
        <div class="bubble">
          <div class="msg-head">Borrador listo para enviar</div>
          Preparé un mensaje de Teams para compartir el briefing con CFO Office. Requiere confirmación antes de enviarlo.
          <br><br>
          <button class="btn primary">Enviar briefing</button>
          <button class="btn">Editar</button>
        </div>
      </div>`
  }
];
