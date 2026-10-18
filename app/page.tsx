'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Task = { id: string; title: string; done: boolean; category: string };
type CoachingClient = { id: string; name: string; packageSize: 8 | 12 | 16; remaining: number; sessions: { date: string }[] };
function localDateKey(date = new Date()) { const y = date.getFullYear(); const m = String(date.getMonth() + 1).padStart(2, '0'); const d = String(date.getDate()).padStart(2, '0'); return `${y}-${m}-${d}`; }
function localWeekKey(date = new Date()) { const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate()); monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7)); return localDateKey(monday); }
type WeeklyReview = { wins: string; blockers: string; lesson: string; next: string };
const emptyReview: WeeklyReview = { wins: '', blockers: '', lesson: '', next: '' };
const goalStepsList = ['Definește un rezultat măsurabil', 'Alege 3 acțiuni pentru săptămâna aceasta', 'Măsoară progresul în fiecare duminică', 'Revizuiește planul și ajustează următorul pas'];
const initialTasks: Task[] = [
  { id: 't1', title: 'Contactează 3 potențiali clienți', done: false, category: 'Business' },
  { id: 't2', title: 'Publică sau pregătește un clip util', done: false, category: 'Conținut' },
  { id: 't3', title: 'Antrenament / recuperare conform planului', done: false, category: 'Sănătate' },
];
const areas = [{ name: 'Carieră & bani', score: 4 }, { name: 'Sănătate', score: 8 }, { name: 'Relații', score: 3 }, { name: 'Dezvoltare', score: 5 }, { name: 'Credință', score: 5 }, { name: 'Libertate', score: 8 }];
const navItems = ['Overview','Daily planner','90-day goals','Business & money','Clients','Health & performance','Relationships','Faith & mind','Analytics','Settings & backup'];
const icons = ['◫','✓','◎','↗','♙','⌁','♡','✦','▥','⚙'];
const descriptions: Record<string,string> = {
  'Daily planner':'Transformă prioritățile în acțiuni clare pentru ziua de azi.',
  '90-day goals':'Urmărește obiectivele și pașii care te duc mai aproape de ele.',
  'Business & money':'Gestionează veniturile și creșterea business-ului.',
  'Clients':'Urmărește pachetele și ședințele fiecărui client.',
  'Health & performance':'Ai grijă de antrenamente, recuperare și energie.',
  'Relationships':'Fă loc pentru oamenii și relațiile importante.',
  'Faith & mind':'Construiește consecvență în credință și reflecție personală.',
  'Analytics':'Urmărește consecvența și progresul în timp.',
  'Settings & backup':'Setările și opțiunile de salvare ale spațiului tău de lucru.'
};
export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeSection, setActiveSection] = useState('Overview');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('Demo local — conectează Supabase pentru sincronizare.');
  const [income, setIncome] = useState(3000);
  const [clients, setClients] = useState(7);
  const [goal, setGoal] = useState('Dezvoltă business-ul de coaching');
  const [dailyFocus, setDailyFocus] = useState('');
  const [goalSteps, setGoalSteps] = useState<Record<string,boolean>>({});
  const [reviewWeek, setReviewWeek] = useState(localWeekKey());
  const [weeklyReviews, setWeeklyReviews] = useState<Record<string,WeeklyReview>>({});
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [reflection, setReflection] = useState('');
  const [journalDate, setJournalDate] = useState(localDateKey());
  const [journalEntries, setJournalEntries] = useState<Record<string,string>>({});
  const [journalLoaded, setJournalLoaded] = useState(false);
  const [clientsList, setClientsList] = useState<CoachingClient[]>([]);
  const [clientsLoaded, setClientsLoaded] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPackage, setNewClientPackage] = useState<8 | 12 | 16>(16);
  const [habits, setHabits] = useState<Record<string,boolean>>({});
  const completed = tasks.filter(t => t.done).length;
  const pct = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  useEffect(() => {
    try {
      const saved = localStorage.getItem('life-os-demo-tasks');
      if (saved) setTasks(JSON.parse(saved));
      const savedHabits = localStorage.getItem('life-os-habits');
      if (savedHabits) setHabits(JSON.parse(savedHabits));
      const savedGoal = localStorage.getItem('life-os-main-goal');
      if (savedGoal !== null) setGoal(savedGoal);
      const savedReflection = localStorage.getItem('life-os-reflection');
      if (savedReflection !== null) setReflection(savedReflection);
      const savedFocus = localStorage.getItem(`life-os-focus-${localDateKey()}`);
      if (savedFocus !== null) setDailyFocus(savedFocus);
      const savedGoalSteps = localStorage.getItem('life-os-goal-steps');
      if (savedGoalSteps) setGoalSteps(JSON.parse(savedGoalSteps));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      const saved = localStorage.getItem('life-os-weekly-reviews');
      if (saved) setWeeklyReviews(JSON.parse(saved));
    } catch {}
    setReviewsLoaded(true);
  }, []);
  useEffect(() => {
    if (reviewsLoaded) { try { localStorage.setItem('life-os-weekly-reviews', JSON.stringify(weeklyReviews)); } catch {} }
  }, [weeklyReviews, reviewsLoaded]);
  function updateWeeklyReview(field: keyof WeeklyReview, value: string) {
    setWeeklyReviews(previous => ({ ...previous, [reviewWeek]: { ...(previous[reviewWeek] || emptyReview), [field]: value } }));
  }
  function toggleGoalStep(step: string) {
    setGoalSteps(previous => {
      const next = { ...previous, [step]: !previous[step] };
      try { localStorage.setItem('life-os-goal-steps', JSON.stringify(next)); } catch {}
      return next;
    });
  }
  function saveTasks(next: Task[]) {
    setTasks(next);
    try { localStorage.setItem('life-os-demo-tasks', JSON.stringify(next)); } catch {}
  }
  function toggle(id: string) { saveTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)); }
  function addTask() {
    const title = prompt('Ce activitate vrei să adaugi?');
    if (title?.trim()) saveTasks([...tasks, { id: crypto.randomUUID(), title: title.trim(), done: false, category: activeSection === 'Daily planner' ? 'Personal' : activeSection }]);
  }
  function toggleHabit(name: string) {
    const next = { ...habits, [name]: !habits[name] };
    setHabits(next);
    try { localStorage.setItem('life-os-habits', JSON.stringify(next)); } catch {}
  }
  useEffect(() => {
    try {
      const saved = localStorage.getItem('life-os-journal-by-day');
      if (saved) setJournalEntries(JSON.parse(saved));
    } catch {}
    setJournalLoaded(true);
    try {
      const saved = localStorage.getItem('life-os-coaching-clients');
      if (saved) setClientsList(JSON.parse(saved));
    } catch {}
    setClientsLoaded(true);
  }, []);
  useEffect(() => {
    if (journalLoaded) { try { localStorage.setItem('life-os-journal-by-day', JSON.stringify(journalEntries)); } catch {} }
  }, [journalEntries, journalLoaded]);
  useEffect(() => {
    if (clientsLoaded) { try { localStorage.setItem('life-os-coaching-clients', JSON.stringify(clientsList)); } catch {} }
  }, [clientsList, clientsLoaded]);
  useEffect(() => { setReflection(journalEntries[journalDate] || ''); }, [journalDate, journalEntries]);
  function saveJournalEntry() {
    setJournalEntries(previous => ({ ...previous, [journalDate]: reflection }));
    setStatus(`Reflecția pentru ${journalDate} a fost salvată pe acest dispozitiv.`);
  }
  function addClient() {
    const name = newClientName.trim();
    if (!name) { setStatus('Scrie numele clientului înainte de a-l adăuga.'); return; }
    setClientsList(previous => [{ id: crypto.randomUUID(), name, packageSize: newClientPackage, remaining: newClientPackage, sessions: [] }, ...previous]);
    setNewClientName('');
    setStatus(`Clientul ${name} a fost adăugat.`);
  }
  function completeSession(id: string) {
    setClientsList(previous => previous.map(client => client.id !== id || client.remaining <= 0 ? client : { ...client, remaining: client.remaining - 1, sessions: [...client.sessions, { date: localDateKey() }] }));
  }
  function removeClient(id: string) { setClientsList(previous => previous.filter(client => client.id !== id)); }
  async function signIn() {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
      if (error) throw error;
      setStatus('Verifică emailul pentru linkul de autentificare.');
    } catch (e) { setStatus(e instanceof Error ? e.message : 'Nu s-a putut trimite linkul. Verifică setările.'); }
  }
  function header(title: string, subtitle: string) {
    return <header className="top"><div><div className="eyebrow">LIFE OS / WORKSPACE</div><h1>{title}</h1><p>{subtitle}</p></div><div className="date">{new Date().toLocaleDateString('ro-RO',{weekday:'short',day:'numeric',month:'short'})}</div></header>;
  }
  function sectionContent() {
    switch (activeSection) {
      case 'Daily planner':
        return <>{header('Daily planner','O zi bună se construiește din următoarea acțiune.') }
          <div className="stats"><article className="card"><label>PROGRESUL ZILEI</label><strong>{pct}%</strong><p>{completed} din {tasks.length} activități finalizate</p><div className="bar"><i style={{width:`${pct}%`}}/></div></article><article className="card"><label>FOCUS</label><strong>1 lucru</strong><p>Alege ce contează cel mai mult.</p></article></div>
          <article className="card"><div className="card-head"><div><h2>Lista de azi</h2><p>Bifează fiecare pas pe măsură ce îl termini.</p></div><span className="chip">DAILY EXECUTION</span></div><div className="tasks">{tasks.map(t=><label className={`task ${t.done?'done':''}`} key={t.id}><input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)}/><span><b>{t.title}</b><small>{t.category}</small></span></label>)}</div><button className="primary" onClick={addTask}>+ Adaugă activitate</button></article>
          <article className="card" style={{marginTop:14}}><h2>Obiceiuri zilnice</h2><p>Consecvență înainte de perfecțiune.</p>{['Mișcare / antrenament','Mese conform planului','10 minute de reflecție sau rugăciune','Pregătește ziua de mâine'].map(h=><label className={`task ${habits[h]?'done':''}`} key={h}><input type="checkbox" checked={!!habits[h]} onChange={()=>toggleHabit(h)}/><span><b>{h}</b></span></label>)}</article></>;
      case '90-day goals':
        return <>{header('Obiective pe 90 de zile',descriptions[activeSection])}<article className="card"><div className="card-head"><div><h2>Misiunea principală</h2><p>Definește un rezultat clar, apoi revizuiește-l săptămânal.</p></div><span className="chip">{goalStepsList.filter(step=>goalSteps[step]).length} / {goalStepsList.length} PAȘI</span></div><label>OBIECTIV</label><input className="email" value={goal} onChange={e=>{setGoal(e.target.value);try{localStorage.setItem('life-os-main-goal',e.target.value);}catch{}}} aria-label="Obiectiv principal"/><div className="goal-progress"><div className="area-label"><span>Progresul sistemului</span><b>{Math.round(goalStepsList.filter(step=>goalSteps[step]).length/goalStepsList.length*100)}%</b></div><div className="bar"><i style={{width:(goalStepsList.filter(step=>goalSteps[step]).length/goalStepsList.length*100)+'%'}}/></div></div><h3>Pașii tăi de execuție</h3><p className="muted">Nu trebuie să faci totul astăzi. Bifează pașii pe măsură ce îți construiești sistemul.</p><div className="tasks">{goalStepsList.map((step,index)=><label className={`task ${goalSteps[step]?'done':''}`} key={step}><input type="checkbox" checked={!!goalSteps[step]} onChange={()=>toggleGoalStep(step)}/><span><b>{step}</b><small>ETAPA 0{index+1}</small></span></label>)}</div><p className="muted">Obiectivul și pașii se salvează automat în browserul acestui dispozitiv.</p></article></>;
      case 'Business & money':
        return <>{header('Business & money',descriptions[activeSection])}<div className="stats"><article className="card"><label>VENIT LUNAR ESTIMAT</label><strong>{income.toLocaleString('ro-RO')} <small>RON</small></strong><p>Țintă: 5.000 RON</p><input aria-label="Venit lunar" type="range" min="0" max="10000" step="100" value={income} onChange={e=>setIncome(Number(e.target.value))}/></article><article className="card"><label>CLIENȚI ACTIVI</label><strong>{clients}</strong><p>Țintă: 11 clienți</p><input aria-label="Clienți activi" type="range" min="0" max="20" value={clients} onChange={e=>setClients(Number(e.target.value))}/></article></div><article className="card"><h2>Priorități pentru business</h2>{['Contactează potențiali clienți','Publică un clip educativ','Revino la lead-urile existente','Verifică progresul clienților'].map((h)=><label className={`task ${habits[h]?'done':''}`} key={h}><input type="checkbox" checked={!!habits[h]} onChange={()=>toggleHabit(h)}/><span><b>{h}</b></span></label>)}</article></>;
      case 'Clients':
        return <>{header('Clienții mei','Ține evidența pachetelor și marchează fiecare ședință încheiată.')}
          <article className="card"><h2>Adaugă un client</h2><p className="muted">Alege pachetul cumpărat. Fiecare ședință bifată scade automat din sold.</p><div className="content-grid" style={{gridTemplateColumns:'minmax(0,1fr) 160px',marginTop:14,marginBottom:0}}><input className="email" aria-label="Numele clientului" placeholder="Numele clientului" value={newClientName} onChange={e=>setNewClientName(e.target.value)}/><select className="email" aria-label="Pachet de ședințe" value={newClientPackage} onChange={e=>setNewClientPackage(Number(e.target.value) as 8|12|16)}><option value={16}>16 ședințe</option><option value={12}>12 ședințe</option><option value={8}>8 ședințe</option></select></div><button className="primary" onClick={addClient}>+ Adaugă client</button></article>
          <div className="stats" style={{marginTop:14}}><article className="card"><label>TOTAL CLIENȚI</label><strong>{clientsList.length}</strong></article><article className="card"><label>ȘEDINȚE RĂMASE</label><strong>{clientsList.reduce((sum,c)=>sum+c.remaining,0)}</strong></article><article className="card"><label>ȘEDINȚE EFECTUATE</label><strong>{clientsList.reduce((sum,c)=>sum+c.sessions.length,0)}</strong></article><article className="card"><label>PACHETE EPUIZATE</label><strong>{clientsList.filter(c=>c.remaining===0).length}</strong></article></div>
          {clientsList.length ? <div className="content-grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))'}}>{clientsList.map(client=><article className="card" key={client.id}><div className="card-head"><div><h2>{client.name}</h2><p>Pachet inițial: {client.packageSize} ședințe</p></div><button className="secondary" onClick={()=>removeClient(client.id)} aria-label={'Șterge clientul '+client.name}>Șterge</button></div><div className="area-label"><span>Ședințe rămase</span><b>{client.remaining} / {client.packageSize}</b></div><div className="bar"><i style={{width:(client.remaining/client.packageSize*100)+'%'}}/></div><button className="primary" disabled={client.remaining===0} onClick={()=>completeSession(client.id)}>{client.remaining===0?'Pachet finalizat':'✓ Marchează ședința ca efectuată'}</button><p className="muted">{client.sessions.length} ședințe efectuate înregistrate</p>{client.sessions.length>0 && <details><summary>Istoric ședințe</summary><div className="milestones">{[...client.sessions].reverse().map((session,index)=><span key={client.id+'-'+index}>{session.date}</span>)}</div></details>}</article>)}</div> : <article className="card" style={{marginTop:14}}><h2>Lista ta de clienți va apărea aici</h2><p className="muted">Adaugă primul client, selectează 8, 12 sau 16 ședințe și apoi marchează fiecare ședință după antrenament.</p></article>}
          <p className="muted">Lista și istoricul sunt salvate în browserul acestui dispozitiv. Pentru acces de pe alte dispozitive, trebuie configurată sincronizarea prin cont.</p></>;
      case 'Health & performance':
        return <>{header('Health & performance',descriptions[activeSection])}<div className="content-grid"><article className="card"><h2>Checklist de sănătate</h2>{['Antrenament conform planului','Mese și hidratare','Pauze și recuperare','Rutina de somn'].map(h=><label className={`task ${habits[h]?'done':''}`} key={h}><input type="checkbox" checked={!!habits[h]} onChange={()=>toggleHabit(h)}/><span><b>{h}</b></span></label>)}</article><article className="card"><h2>Principiul de bază</h2><p className="muted">Progresul fizic contează doar dacă îl poți susține. Notează antrenamentele, somnul și cum te simți, fără să forțezi când corpul cere recuperare.</p></article></div></>;
      case 'Relationships':
        return <>{header('Relationships',descriptions[activeSection])}<article className="card"><h2>Intenția săptămânii</h2><p className="muted">Alege o acțiune concretă pentru a investi în relațiile importante.</p>{['Sună pe cineva drag','Planifică timp de calitate fără telefon','Spune cuiva că apreciezi ceva la el'].map(h=><label className={`task ${habits[h]?'done':''}`} key={h}><input type="checkbox" checked={!!habits[h]} onChange={()=>toggleHabit(h)}/><span><b>{h}</b></span></label>)}</article></>;
      case 'Faith & mind':
        return <>{header('Faith & mind','Un jurnal personal, organizat pe zile.')}
          <article className="card"><div className="card-head"><div><h2>Jurnal de reflecție</h2><p>Rugăciuni, gânduri și lecții din fiecare zi.</p></div><span className="chip">{Object.keys(journalEntries).filter(day => journalEntries[day]?.trim()).length} ZILE</span></div>
          <label htmlFor="journal-date">ALEGE ZIUA</label><input id="journal-date" className="email" type="date" value={journalDate} onChange={e=>setJournalDate(e.target.value)} style={{marginTop:8,marginBottom:14}}/>
          <p className="muted">Întrebare de reflecție: ce vreau să fac astăzi în acord cu valorile și credința mea?</p>
          <textarea className="email" rows={7} placeholder="Scrie aici rugăciunea, reflecția sau gândurile zilei..." value={reflection} onChange={e=>setReflection(e.target.value)} />
          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:12}}><button className="primary" style={{width:'auto',marginTop:0}} onClick={saveJournalEntry}>Salvează ziua</button><button className="secondary" onClick={()=>{setJournalDate(localDateKey());}}>Revino la azi</button></div>
          <p className="status" role="status">{status}</p><h3>Zile salvate</h3>
          {Object.keys(journalEntries).filter(day=>journalEntries[day]?.trim()).sort((a,b)=>b.localeCompare(a)).length ? <div className="milestones">{Object.keys(journalEntries).filter(day=>journalEntries[day]?.trim()).sort((a,b)=>b.localeCompare(a)).map(day=><button className="secondary" key={day} onClick={()=>setJournalDate(day)}>{day}{day===localDateKey()?' · Azi':''}</button>)}</div> : <p className="muted">Încă nu ai zile salvate. Scrie prima reflecție și apasă „Salvează ziua”.</p>}
          <p className="muted">Datele sunt salvate în browserul acestui dispozitiv. Pentru sincronizare între dispozitive va trebui conectată baza de date.</p></article></>;
      case 'Analytics': {
        const review = weeklyReviews[reviewWeek] || emptyReview;
        const savedReviewWeeks = Object.keys(weeklyReviews).filter(week => Object.values(weeklyReviews[week] || emptyReview).some(value => value.trim())).sort((a,b)=>b.localeCompare(a));
        return <>{header('Analytics & weekly review','Nu poți îmbunătăți ce nu ești dispus să privești cu sinceritate.')}
          <div className="stats"><article className="card"><label>TASKURI FINALIZATE</label><strong>{completed}/{tasks.length}</strong><p>Progresul listei curente</p></article><article className="card"><label>RATA DE FINALIZARE</label><strong>{pct}%</strong><div className="bar"><i style={{width:`${pct}%`}}/></div></article><article className="card"><label>OBICEIURI BIFATE</label><strong>{Object.values(habits).filter(Boolean).length}</strong><p>Înregistrări locale</p></article><article className="card"><label>JURNAL</label><strong>{Object.values(journalEntries).filter(value=>value.trim()).length}</strong><p>Zile cu reflecție salvată</p></article></div>
          <article className="card review-card"><div className="card-head"><div><span className="eyebrow">WEEKLY RESET</span><h2 style={{marginTop:7}}>Revizuirea săptămânii</h2><p>Fii sincer, nu perfect. Scopul este să înveți și să ajustezi.</p></div><span className="chip">SALVARE AUTOMATĂ</span></div><label htmlFor="review-week">SĂPTĂMÂNA ÎNCEPUTĂ LA</label><input id="review-week" className="email" type="date" value={reviewWeek} onChange={e=>setReviewWeek(e.target.value)} style={{marginTop:8,marginBottom:18}}/><div className="review-grid"><label className="review-field"><span>01 / Ce a mers bine?</span><textarea className="email" rows={3} placeholder="Rezultate, acțiuni și momente de care ești mândru..." value={review.wins} onChange={e=>updateWeeklyReview('wins',e.target.value)}/></label><label className="review-field"><span>02 / Ce m-a blocat?</span><textarea className="email" rows={3} placeholder="Ce ai evitat? Ce ți-a consumat energia?" value={review.blockers} onChange={e=>updateWeeklyReview('blockers',e.target.value)}/></label><label className="review-field"><span>03 / Ce am învățat?</span><textarea className="email" rows={3} placeholder="Ce ai înțeles despre tine sau despre planul tău?" value={review.lesson} onChange={e=>updateWeeklyReview('lesson',e.target.value)}/></label><label className="review-field"><span>04 / Care este prioritatea următoare?</span><textarea className="email" rows={3} placeholder="Alege un rezultat clar pentru săptămâna următoare..." value={review.next} onChange={e=>updateWeeklyReview('next',e.target.value)}/></label></div><p className="review-save"><span className="saved-mark">●</span> Se salvează automat în acest browser</p>{savedReviewWeeks.length>0 && <><h3>Revizuiri anterioare</h3><div className="milestones">{savedReviewWeeks.map(week=><button key={week} className={reviewWeek===week?'primary':'secondary'} style={{width:'auto',marginTop:0}} onClick={()=>setReviewWeek(week)}>{week}</button>)}</div></>}</article>
          <article className="card"><h2>Scoruri orientative — Roata vieții</h2><p className="muted">Folosește scorurile ca punct de pornire pentru reflecție, nu ca verdict despre viața ta.</p>{areas.map(a=><div className="area" key={a.name}><div className="area-label"><span>{a.name}</span><b>{a.score}/10</b></div><div className="bar"><i style={{width:`${a.score*10}%`}}/></div></div>)}</article></>;
      }
      case 'Settings & backup':
        return <>{header('Settings & backup',descriptions[activeSection])}<article className="card"><h2>Starea aplicației</h2><p className="muted">Versiune demonstrativă. Taskurile și obiceiurile sunt păstrate local în browserul acestui dispozitiv. Sincronizarea între dispozitive nu este activă până la configurarea Supabase.</p><button className="secondary" onClick={()=>{const backup={tasks,habits,income,clients,goal,dailyFocus,goalSteps,journalEntries,weeklyReviews,clientsList,exportedAt:new Date().toISOString()};const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='life-os-backup.json';a.click();URL.revokeObjectURL(url);}}>Descarcă backup JSON</button><div style={{marginTop:18}}><h2>Autentificare prin email</h2><input className="email" type="email" placeholder="Adresa ta de email" value={email} onChange={e=>setEmail(e.target.value)}/><button className="primary" onClick={signIn}>Trimite link de autentificare</button><p className="status">{status}</p></div></article></>;
      default:
        return <>{header('Construiește-ți următorul nivel.','Nu ai nevoie de încă o listă. Ai nevoie să știi ce contează acum.')}<article className="focus-panel"><div className="focus-kicker"><span className="focus-pulse"/> INTENȚIA ZILEI <span className="focus-date">{new Date().toLocaleDateString('ro-RO',{day:'numeric',month:'long'})}</span></div><h2>Care este singurul lucru care ar face ziua de azi un succes?</h2><p>Nu ce e urgent pentru toată lumea. Ce contează cu adevărat pentru tine.</p><input className="focus-input" aria-label="Prioritatea principală a zilei" placeholder="Ex. Vorbesc cu 3 potențiali clienți..." value={dailyFocus} onChange={e=>{setDailyFocus(e.target.value);try{localStorage.setItem(`life-os-focus-${localDateKey()}`,e.target.value);}catch{}}}/><div className="focus-foot"><span>O intenție clară. Următorul pas concret.</span><span className="saved-mark">● Se salvează automat</span></div></article><div className="notice"><b>Principiul LIFE OS:</b> mai puțin zgomot, mai multă intenție. Alege, acționează, revizuiește.</div><div className="stats"><article className="card"><label>VENIT LUNAR</label><strong>{income.toLocaleString('ro-RO')} <small>RON</small></strong><p>Țintă: 5.000 RON</p><input aria-label="Venit lunar" type="range" min="0" max="10000" step="100" value={income} onChange={e=>setIncome(Number(e.target.value))}/></article><article className="card"><label>CLIENȚI ACTIVI</label><strong>{clients}</strong><p>Țintă: 11 clienți</p><input aria-label="Clienți activi" type="range" min="0" max="20" value={clients} onChange={e=>setClients(Number(e.target.value))}/></article><article className="card"><label>PLAN ZILNIC</label><strong>{pct}%</strong><p>{completed} din {tasks.length} activități</p><div className="bar"><i style={{width:`${pct}%`}}/></div></article><article className="card"><label>SPRINT</label><strong>90 <small>zile</small></strong><p>Revizuire în fiecare duminică</p></article></div><div className="content-grid"><article className="card"><div className="card-head"><div><h2>Prioritățile de astăzi</h2><p>Acțiuni care duc la rezultate.</p></div><span className="chip">DAILY EXECUTION</span></div><div className="tasks">{tasks.map(t=><label className={`task ${t.done?'done':''}`} key={t.id}><input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)}/><span><b>{t.title}</b><small>{t.category}</small></span></label>)}</div><button className="secondary" onClick={addTask}>+ Adaugă activitate</button></article><article className="card"><div className="card-head"><div><h2>Roata vieții</h2><p>Scoruri orientative din autoevaluarea ta.</p></div></div>{areas.map(a=><div className="area" key={a.name}><div className="area-label"><span>{a.name}</span><b>{a.score}/10</b></div><div className="bar"><i style={{width:`${a.score*10}%`}}/></div></div>)}</article></div><div className="content-grid lower"><article className="card"><div className="card-head"><div><h2>90-day mission</h2><p>Un rezultat clar, măsurat săptămânal.</p></div></div><h3>{goal}</h3><p className="muted">Ținte inițiale: creșterea venitului de la 3.000 la 5.000 RON și de la 7 la aproximativ 11 clienți, fără să sacrifici sănătatea și relațiile.</p><div className="milestones"><span>01 · Lead-uri</span><span>02 · Conversie</span><span>03 · Retenție</span><span>04 · Venit</span></div></article><article className="card"><div className="card-head"><div><h2>Activează sincronizarea</h2><p>Conectează autentificarea prin email.</p></div></div><input className="email" type="email" placeholder="Adresa ta de email" value={email} onChange={e=>setEmail(e.target.value)}/><button className="primary" onClick={signIn}>Trimite link de autentificare</button><p className="status">{status}</p><p className="muted tiny">Va funcționa după configurarea variabilelor Supabase și a URL-urilor de redirect.</p></article></div></>;
    }
  }
  return <main className="shell">
    <aside className="sidebar"><div className="brand"><div className="logo">L</div><div><b>LIFE OS</b><small>PERSONAL COMMAND CENTER</small></div></div><div className="navlabel">WORKSPACE</div><nav>{navItems.map((x,i)=><a href={`#${x.toLowerCase().replaceAll(' ','-')}`} onClick={e=>{e.preventDefault();setActiveSection(x);}} className={activeSection===x?'active':''} key={x}><span>{icons[i]}</span>{x}</a>)}</nav><div className="sidebar-note"><small>90-DAY FOCUS</small><b>Grow the coaching business.</b><p>Consistență, nu perfecțiune.</p></div></aside>
    <section className="main">{sectionContent()}<footer>LIFE OS · Built for consistency, not perfection.</footer></section>
  </main>;
}
