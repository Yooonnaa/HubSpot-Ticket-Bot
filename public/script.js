(function(){
    "use strict";

    const CATEGORIES = ["Website-Bug","Terminbuchung","Rechnung/Abo","Inhalte ändern","Preisanfrage","Allgemeine Frage"];
    const STATUS = [
        {key:"offen", label:"Offen"},
        {key:"bearbeitung", label:"In Bearbeitung"},
        {key:"beantwortet", label:"Beantwortet"},
        {key:"weitergeleitet", label:"Weitergeleitet"},
        {key:"geschlossen", label:"Geschlossen"}
    ];

    // Team-Routing und Priorität werden jetzt im Backend berechnet
    // (src/services/ticketLogic.js) und kommen fertig mit der API-Antwort.
    const TEAMS = {
        helpdesk: {label: "Helpdesk"},
        pm: {label: "Projekt Management"},
        cs: {label: "Customer Success"}
    };

    const PRIORITIES = [
        {key:"kritisch", label:"Kritisch"},
        {key:"hoch", label:"Hoch"},
        {key:"mittel", label:"Mittel"},
        {key:"niedrig", label:"Niedrig"}
    ];
    const PRIORITY_RANK = {kritisch:0, hoch:1, mittel:2, niedrig:3};
    const priorityLabel = k => (PRIORITIES.find(p=>p.key===k)||{}).label || k;

    let tickets = [];
    let selectedId = null;

    async function loadTickets() {
        const response = await fetch (`/tickets`)
            tickets = await response.json();

            tickets.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
        selectedId = tickets[0].id;

        renderFilters();
        renderAll();
    }

    let query = "";
    let catFilter = "all";
    let statusFilter = "all";
    let teamFilter = "all";
    let priorityFilter = "all";

    const statusLabel = k => (STATUS.find(s=>s.key===k)||{}).label || k;

    function saveDraftFromTextarea(){
        const ta = document.getElementById("draftInput");
        if(!ta) return;
        const t = tickets.find(t=>t.id===selectedId);
        if(t) t.draft = ta.value;
    }

    function renderStats(){
        const el = document.getElementById("stats");
        const total = tickets.length;
        const offen = tickets.filter(t=>t.status==="offen").length;
        const bearbeitung = tickets.filter(t=>t.status==="bearbeitung").length;
        const done = tickets.filter(t=>t.status==="beantwortet"||t.status==="geschlossen").length;
        const routed = tickets.filter(t=>t.team!=="helpdesk").length;
        const kritisch = tickets.filter(t=>t.priority==="kritisch").length;
        el.innerHTML = `
      <div class="stat"><span class="n">${total}</span><span class="l">Tickets gesamt</span></div>
      <div class="stat bad"><span class="n">${kritisch}</span><span class="l">Kritisch</span></div>
      <div class="stat warn"><span class="n">${offen}</span><span class="l">Offen</span></div>
      <div class="stat accent"><span class="n">${bearbeitung}</span><span class="l">In Bearbeitung</span></div>
      <div class="stat good"><span class="n">${done}</span><span class="l">Beantwortet / Geschlossen</span></div>
      <div class="stat bad"><span class="n">${routed}</span><span class="l">Zur Weiterleitung</span></div>
    `;
    }

    function renderFilters(){
        const catSel = document.getElementById("filterCategory");
        const statSel = document.getElementById("filterStatus");
        const teamSel = document.getElementById("filterTeam");
        const prioSel = document.getElementById("filterPriority");
        if(!catSel.options.length){
            catSel.innerHTML = `<option value="all">Alle Kategorien</option>` +
                CATEGORIES.map(c=>`<option value="${c}">${c}</option>`).join("");
            statSel.innerHTML = `<option value="all">Alle Status</option>` +
                STATUS.map(s=>`<option value="${s.key}">${s.label}</option>`).join("");
            teamSel.innerHTML = `<option value="all">Alle Zuständigkeiten</option>` +
                Object.keys(TEAMS).map(k=>`<option value="${k}">${TEAMS[k].label}</option>`).join("");
            prioSel.innerHTML = `<option value="all">Alle Prioritäten</option>` +
                PRIORITIES.map(p=>`<option value="${p.key}">${p.label}</option>`).join("");
        }
    }

    function filtered(){
        const q = query.trim().toLowerCase();
        return tickets.filter(t=>{
            if(catFilter!=="all" && t.category!==catFilter) return false;
            if(statusFilter!=="all" && t.status!==statusFilter) return false;
            if(teamFilter!=="all" && t.team!==teamFilter) return false;
            if(priorityFilter!=="all" && t.priority!==priorityFilter) return false;
            if(q && !(t.subject.toLowerCase().includes(q) || t.company.toLowerCase().includes(q))) return false;
            return true;
        });
    }

    function renderList(){
        const list = filtered();
        document.getElementById("resultCount").textContent = list.length + " von " + tickets.length;
        const el = document.getElementById("list");
        if(!list.length){
            el.innerHTML = `<div class="empty">Keine Tickets für diese Filter.</div>`;
            return;
        }
        el.innerHTML = list.map(t => `
      <button class="row ${t.id===selectedId?'active':''}" data-id="${t.id}" role="listitem">
        <div class="row-top">
          <span class="pill prio prio-lead prio-${t.priority}">${priorityLabel(t.priority)}</span>
          <span class="conf">${t.confidence}%</span>
        </div>
        <div class="row-subject">${t.subject}</div>
        <div class="row-company">${t.company}</div>
        <div class="row-bottom">
          <span class="row-id">#${t.id}</span>
          <span class="pill st-${t.status}">${statusLabel(t.status)}</span>
          <span class="pill cat">${t.category}</span>
          ${t.team!=="helpdesk" ? `<span class="pill route">↗ ${TEAMS[t.team].label}</span>` : ""}
        </div>
      </button>
    `).join("");
        el.querySelectorAll(".row").forEach(btn=>{
            btn.addEventListener("click", ()=>{
                saveDraftFromTextarea();
                selectedId = btn.dataset.id;
                renderAll();
            });
        });
    }

    function renderDetail(){
        const el = document.getElementById("detail");
        const t = tickets.find(t=>t.id===selectedId);
        if(!t){
            el.innerHTML = `<div class="empty">Ticket auswählen, um Details zu sehen.</div>`;
            return;
        }
        el.innerHTML = `
      <div class="detail-top">
        <div>
          <h2>#${t.id} · ${t.subject}</h2>
          <div class="detail-company">${t.company} · eingegangen ${t.created}</div>
        </div>
        <div class="badges">
          <span class="pill prio prio-lead prio-${t.priority}">${priorityLabel(t.priority)}</span>
          <span class="pill st-${t.status}">${statusLabel(t.status)}</span>
          <span class="pill cat">${t.category}</span>
          <span class="conf">Confidence ${t.confidence}%</span>
        </div>
      </div>

      <p class="hint">Warum diese Priorität? ${t.priorityReasons.join(" · ")}</p>

      ${t.team!=="helpdesk" ? `
      <div class="banner">
        <div>🔀 <strong>Weiterleitung empfohlen: ${TEAMS[t.team].label}</strong><br>${t.routeReason} — Helpdesk bearbeitet dieses Thema nicht selbst.</div>
      </div>` : ""}

      <div>
        <p class="field-label">Zusammenfassung</p>
        <p class="field-value">${t.summary}</p>
      </div>

      <details class="original">
        <summary>Original-Ticket anzeigen</summary>
        <div class="body">${t.full}</div>
      </details>

      <div>
        <p class="field-label">${t.team!=="helpdesk" ? "Weiterleitungs-Notiz (bearbeitbar)" : "Antwortentwurf (bearbeitbar)"}</p>
        <textarea id="draftInput" class="draft">${t.draft}</textarea>
        <p class="hint">Kein automatischer Versand — wird kopiert und manuell im HubSpot-Ticket eingefügt.</p>
      </div>

      <div class="actions">
        <button class="btn primary" id="btnCopy">${t.team!=="helpdesk" ? "Notiz kopieren" : "Entwurf kopieren"}</button>
        <button class="btn" id="btnMark" ${(t.status==="beantwortet"||t.status==="weitergeleitet")?"disabled":""}>${t.team!=="helpdesk" ? "Als weitergeleitet markieren" : "Als beantwortet markieren"}</button>
      </div>

      <div>
        <p class="field-label">Verlauf</p>
        <ul class="history">
          ${t.history.map(h=>`<li><time>${h[0]}</time>${h[1]}</li>`).join("")}
        </ul>
      </div>
    `;

        document.getElementById("btnCopy").addEventListener("click", async (e)=>{
            const ta = document.getElementById("draftInput");
            try{
                await navigator.clipboard.writeText(ta.value);
                const btn = e.currentTarget;
                const old = btn.textContent;
                btn.textContent = "Kopiert ✓";
                setTimeout(()=>{ btn.textContent = old; }, 1400);
            }catch(err){
                const ta2 = document.getElementById("draftInput");
                ta2.select();
            }
        });

        document.getElementById("btnMark").addEventListener("click", ()=>{
            saveDraftFromTextarea();
            const tk = tickets.find(t=>t.id===selectedId);
            const targetStatus = tk.team!=="helpdesk" ? "weitergeleitet" : "beantwortet";
            if(tk && tk.status!==targetStatus){
                tk.status = targetStatus;
                const now = "jetzt";
                tk.history = tk.history.concat([[now, tk.team!=="helpdesk" ? "Als weitergeleitet markiert" : "Als beantwortet markiert"]]);
                renderAll();
            }
        });
    }

    function renderAll(){
        renderStats();
        renderList();
        renderDetail();
    }

    document.getElementById("search").addEventListener("input", (e)=>{
        query = e.target.value;
        renderList();
    });
    document.getElementById("filterCategory").addEventListener("change", (e)=>{
        catFilter = e.target.value;
        renderList();
    });
    document.getElementById("filterStatus").addEventListener("change", (e)=>{
        statusFilter = e.target.value;
        renderList();
    });
    document.getElementById("filterTeam").addEventListener("change", (e)=>{
        teamFilter = e.target.value;
        renderList();
    });
    document.getElementById("filterPriority").addEventListener("change", (e)=>{
        priorityFilter = e.target.value;
        renderList();
    });

    loadTickets();
})();