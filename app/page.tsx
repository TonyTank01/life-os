'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Task = { id: string; title: string; done: boolean; category: string };
const initialTasks: Task[] = [
  { id: 't1', title: 'Contactează 3 potențiali clienți', done: false, category: 'Business' },
  { id: 't2', title: 'Publică sau pregătește un clip util', done: false, category: 'Conținut' },
  { id: 't3', title: 'Antrenament / recuperare conform planului', done: false, category: 'Sănătate' },
];
const areas = [{ name: 'Carieră & bani', score: 4 }, { name: 'Sănătate', score: 8 }, { name: 'Relații', score: 3 }, { name: 'Dezvoltare', score: 5 }, { name: 'Credință', score: 5 }, { name: 'Libertate', score: 8 }];
const navItems = ['Overview','Daily planner','90-day goals','Business & money','Health & performance','Relationships','Faith & mind','Analytics','Settings & backup'];
const icons = ['◫','✓','◎','↗','⌁','♡','✦','▥','⚙'];
const descriptions: Record<string,string> = {
  'Daily planner':'Transformă prioritățile în acțiuni clare pentru ziua de azi.',
  '90-day goals':'Urmărește obiectivele și pașii care te duc mai aproape de ele.',
  'Business & money':'Gestionează clienții, veniturile și creșterea business-ului.',
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
  const [reflection, setReflection] = useState('');
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
    } catch {}
  }, []);
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
        return <>{header('Obiective pe 90 de zile',descriptions[activeSection])}<article className="card"><div className="card-head"><div><h2>Misiunea principală</h2><p>Definește un rezultat clar, apoi revizuiește-l săptămânal.</p></div></div><label>OBIECTIV</label><input className="email" value={goal} onChange={e=>{setGoal(e.target.value);try{localStorage.setItem('life-os-main-goal',e.target.value);}catch{}}} aria-label="Obiectiv principal"/><h3>Etape recomandate</h3><div className="milestones">{['01 · Definește ținta','02 · Acțiuni săptămânale','03 · Măsoară progresul','04 · Revizuiește'].map(x=><span key={x}>{x}</span>)}</div><p className="muted">Obiectivul se salvează automat în acest browser și revine când redeschizi aplicația pe acest dispozitiv.</p></article></>;
      case 'Business & money':
        return <>{header('Business & money',descriptions[activeSection])}<div className="stats"><article className="card"><label>VENIT LUNAR ESTIMAT</label><strong>{income.toLocaleString('ro-RO')} <small>RON</small></strong><p>Țintă: 5.000 RON</p><input aria-label="Venit lunar" type="range" min="0" max="10000" step="100" value={income} onChange={e=>setIncome(Number(e.target.value))}/></article><article className="card"><label>CLIENȚI ACTIVI</label><strong>{clients}</strong><p>Țintă: 11 clienți</p><input aria-label="Clienți activi" type="range" min="0" max="20" value={clients} onChange={e=>setClients(Number(e.target.value))}/></article></div><article className="card"><h2>Priorități pentru business</h2>{['Contactează potențiali clienți','Publică un clip educativ','Revino la lead-urile existente','Verifică progresul clienților'].map((h)=><label className={`task ${habits[h]?'done':''}`} key={h}><input type="checkbox" checked={!!habits[h]} onChange={()=>toggleHabit(h)}/><span><b>{h}</b></span></label>)}</article></>;
      case 'Health & performance':
        return <>{header('Health & performance',descriptions[activeSection])}<div className="content-grid"><article className="card"><h2>Checklist de sănătate</h2>{['Antrenament conform planului','Mese și hidratare','Pauze și recuperare','Rutina de somn'].map(h=><label className={`task ${habits[h]?'done':''}`} key={h}><input type="checkbox" checked={!!habits[h]} onChange={()=>toggleHabit(h)}/><span><b>{h}</b></span></label>)}</article><article className="card"><h2>Principiul de bază</h2><p className="muted">Progresul fizic contează doar dacă îl poți susține. Notează antrenamentele, somnul și cum te simți, fără să forțezi când corpul cere recuperare.</p></article></div></>;
      case 'Relationships':
        return <>{header('Relationships',descriptions[activeSection])}<article className="card"><h2>Intenția săptămânii</h2><p className="muted">Alege o acțiune concretă pentru a investi în relațiile importante.</p>{['Sună pe cineva drag','Planifică timp de calitate fără telefon','Spune cuiva că apreciezi ceva la el'].map(h=><label className={`task ${habits[h]?'done':''}`} key={h}><input type="checkbox" checked={!!habits[h]} onChange={()=>toggleHabit(h)}/><span><b>{h}</b></span></label>)}</article></>;
      case 'Faith & mind':
        return <>{header('Faith & mind',descriptions[activeSection])}<article className="card"><h2>Moment de reflecție</h2><p className="muted">Ce fel de om vreau să fiu astăzi și ce pot face concret pentru a trăi în acord cu valorile mele?</p><textarea className="email" rows={5} placeholder="Scrie aici reflecția ta..." value={reflection} onChange={e=>setReflection(e.target.value)}/><div style={{marginTop:12}}><button className="secondary" onClick={()=>{try{localStorage.setItem('life-os-reflection',reflection);setStatus('Reflecția a fost salvată pe acest dispozitiv.');}catch{setStatus('Nu am putut salva reflecția.');}}}>Salvează pe acest dispozitiv</button></div><p className="status">{status}</p></article></>;
      case 'Analytics':
        return <>{header('Analytics',descriptions[activeSection])}<div className="stats"><article className="card"><label>TASKURI FINALIZATE</label><strong>{completed}/{tasks.length}</strong><p>Progresul listei curente</p></article><article className="card"><label>RATA DE FINALIZARE</label><strong>{pct}%</strong><div className="bar"><i style={{width:`${pct}%`}}/></div></article><article className="card"><label>OBICEIURI BIFATE</label><strong>{Object.values(habits).filter(Boolean).length}</strong><p>Înregistrări locale</p></article></div><article className="card"><h2>Scoruri orientative — Roata vieții</h2>{areas.map(a=><div className="area" key={a.name}><div className="area-label"><span>{a.name}</span><b>{a.score}/10</b></div><div className="bar"><i style={{width:`${a.score*10}%`}}/></div></div>)}</article></>;
      case 'Settings & backup':
        return <>{header('Settings & backup',descriptions[activeSection])}<article className="card"><h2>Starea aplicației</h2><p className="muted">Versiune demonstrativă. Taskurile și obiceiurile sunt păstrate local în browserul acestui dispozitiv. Sincronizarea între dispozitive nu este activă până la configurarea Supabase.</p><button className="secondary" onClick={()=>{const backup={tasks,habits,income,clients,exportedAt:new Date().toISOString()};const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='life-os-backup.json';a.click();URL.revokeObjectURL(url);}}>Descarcă backup JSON</button><div style={{marginTop:18}}><h2>Autentificare prin email</h2><input className="email" type="email" placeholder="Adresa ta de email" value={email} onChange={e=>setEmail(e.target.value)}/><button className="primary" onClick={signIn}>Trimite link de autentificare</button><p className="status">{status}</p></div></article></>;
      default:
        return <>{header('Construiește-ți următorul nivel.','Claritate în plan. Progres în fiecare zi.')}<div className="notice"><b>Arhitectură online pregătită.</b> Interfața este funcțională în modul demo. Sincronizarea reală se activează după configurarea Supabase.</div><div className="stats"><article className="card"><label>VENIT LUNAR</label><strong>{income.toLocaleString('ro-RO')} <small>RON</small></strong><p>Țintă: 5.000 RON</p><input aria-label="Venit lunar" type="range" min="0" max="10000" step="100" value={income} onChange={e=>setIncome(Number(e.target.value))}/></article><article className="card"><label>CLIENȚI ACTIVI</label><strong>{clients}</strong><p>Țintă: 11 clienți</p><input aria-label="Clienți activi" type="range" min="0" max="20" value={clients} onChange={e=>setClients(Number(e.target.value))}/></article><article className="card"><label>PLAN ZILNIC</label><strong>{pct}%</strong><p>{completed} din {tasks.length} activități</p><div className="bar"><i style={{width:`${pct}%`}}/></div></article><article className="card"><label>SPRINT</label><strong>90 <small>zile</small></strong><p>Revizuire în fiecare duminică</p></article></div><div className="content-grid"><article className="card"><div className="card-head"><div><h2>Prioritățile de astăzi</h2><p>Acțiuni care duc la rezultate.</p></div><span className="chip">DAILY EXECUTION</span></div><div className="tasks">{tasks.map(t=><label className={`task ${t.done?'done':''}`} key={t.id}><input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)}/><span><b>{t.title}</b><small>{t.category}</small></span></label>)}</div><button className="secondary" onClick={addTask}>+ Adaugă activitate</button></article><article className="card"><div className="card-head"><div><h2>Roata vieții</h2><p>Scoruri orientative din autoevaluarea ta.</p></div></div>{areas.map(a=><div className="area" key={a.name}><div className="area-label"><span>{a.name}</span><b>{a.score}/10</b></div><div className="bar"><i style={{width:`${a.score*10}%`}}/></div></div>)}</article></div><div className="content-grid lower"><article className="card"><div className="card-head"><div><h2>90-day mission</h2><p>Un rezultat clar, măsurat săptămânal.</p></div></div><h3>{goal}</h3><p className="muted">Ținte inițiale: creșterea venitului de la 3.000 la 5.000 RON și de la 7 la aproximativ 11 clienți, fără să sacrifici sănătatea și relațiile.</p><div className="milestones"><span>01 · Lead-uri</span><span>02 · Conversie</span><span>03 · Retenție</span><span>04 · Venit</span></div></article><article className="card"><div className="card-head"><div><h2>Activează sincronizarea</h2><p>Conectează autentificarea prin email.</p></div></div><input className="email" type="email" placeholder="Adresa ta de email" value={email} onChange={e=>setEmail(e.target.value)}/><button className="primary" onClick={signIn}>Trimite link de autentificare</button><p className="status">{status}</p><p className="muted tiny">Va funcționa după configurarea variabilelor Supabase și a URL-urilor de redirect.</p></article></div></>;
    }
  }
  return <main className="shell">
    <aside className="sidebar"><div className="brand"><div className="logo">L</div><div><b>LIFE OS</b><small>PERSONAL COMMAND CENTER</small></div></div><div className="navlabel">WORKSPACE</div><nav>{navItems.map((x,i)=><a href={`#${x.toLowerCase().replaceAll(' ','-')}`} onClick={e=>{e.preventDefault();setActiveSection(x);}} className={activeSection===x?'active':''} key={x}><span>{icons[i]}</span>{x}</a>)}</nav><div className="sidebar-note"><small>90-DAY FOCUS</small><b>Grow the coaching business.</b><p>Consistență, nu perfecțiune.</p></div></aside>
    <section className="main">{sectionContent()}<footer>LIFE OS · Built for consistency, not perfection.</footer></section>
  </main>;
}
