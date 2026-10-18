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
export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('Demo local — conectează Supabase pentru sincronizare.');
  const [income, setIncome] = useState(3000);
  const [clients, setClients] = useState(7);
  const completed = tasks.filter(t => t.done).length;
  const pct = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  useEffect(() => {
    try { const saved = localStorage.getItem('life-os-demo-tasks'); if (saved) setTasks(JSON.parse(saved)); } catch {}
  }, []);
  function toggle(id: string) { setTasks(old => { const next = old.map(t => t.id === id ? { ...t, done: !t.done } : t); try { localStorage.setItem('life-os-demo-tasks', JSON.stringify(next)); } catch {} return next; }); }
  async function signIn() {
    try { const supabase = createClient(); const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } }); if (error) throw error; setStatus('Verifică emailul pentru linkul de autentificare.'); }
    catch (e) { setStatus(e instanceof Error ? e.message : 'Nu s-a putut trimite linkul. Verifică setările.'); }
  }
  return <main className="shell">
    <aside className="sidebar"><div className="brand"><div className="logo">L</div><div><b>LIFE OS</b><small>PERSONAL COMMAND CENTER</small></div></div><div className="navlabel">WORKSPACE</div><nav>{['Overview','Daily planner','90-day goals','Business & money','Health & performance','Relationships','Faith & mind','Analytics','Settings & backup'].map((x,i)=><a className={i===0?'active':''} href={i===0?'#overview':`#${x.toLowerCase().replaceAll(' ','-')}`} key={x}><span>{['◫','✓','◎','↗','⌁','♡','✦','▥','⚙'][i]}</span>{x}</a>)}</nav><div className="sidebar-note"><small>90-DAY FOCUS</small><b>Grow the coaching business.</b><p>Consistență, nu perfecțiune.</p></div></aside>
    <section className="main" id="overview"><header className="top"><div><div className="eyebrow">PERSONAL OPERATING SYSTEM</div><h1>Construiește-ți următorul nivel.</h1><p>Claritate în plan. Progres în fiecare zi.</p></div><div className="date">{new Date().toLocaleDateString('ro-RO',{weekday:'short',day:'numeric',month:'short'})}</div></header>
      <div className="notice"><b>Arhitectură online pregătită.</b> Această interfață este un starter. Sincronizarea reală se activează după conectarea proiectului Supabase și configurarea autentificării.</div>
      <div className="stats"><article className="card"><label>VENIT LUNAR</label><strong>{income.toLocaleString('ro-RO')} <small>RON</small></strong><p>Țintă: 5.000 RON</p><input aria-label="Venit lunar" type="range" min="0" max="10000" step="100" value={income} onChange={e=>setIncome(Number(e.target.value))}/></article><article className="card"><label>CLIENȚI ACTIVI</label><strong>{clients}</strong><p>Țintă: 11 clienți</p><input aria-label="Clienți activi" type="range" min="0" max="20" value={clients} onChange={e=>setClients(Number(e.target.value))}/></article><article className="card"><label>PLAN ZILNIC</label><strong>{pct}%</strong><p>{completed} din {tasks.length} activități</p><div className="bar"><i style={{width:`${pct}%`}}/></div></article><article className="card"><label>SPRINT</label><strong>90 <small>zile</small></strong><p>Revizuire în fiecare duminică</p></article></div>
      <div className="content-grid"><article className="card"><div className="card-head"><div><h2>Prioritățile de astăzi</h2><p>Acțiuni care duc la rezultate.</p></div><span className="chip">DAILY EXECUTION</span></div><div className="tasks">{tasks.map(t=><label className={`task ${t.done?'done':''}`} key={t.id}><input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)}/><span><b>{t.title}</b><small>{t.category}</small></span></label>)}</div><button className="secondary" onClick={()=>{const title=prompt('Ce activitate vrei să adaugi?');if(title?.trim()){const next=[...tasks,{id:crypto.randomUUID(),title:title.trim(),done:false,category:'Personal'}];setTasks(next);try{localStorage.setItem('life-os-demo-tasks',JSON.stringify(next));}catch{}}}}>+ Adaugă activitate</button></article>
      <article className="card"><div className="card-head"><div><h2>Roata vieții</h2><p>Scoruri orientative din autoevaluarea ta.</p></div></div>{areas.map(a=><div className="area" key={a.name}><div className="area-label"><span>{a.name}</span><b>{a.score}/10</b></div><div className="bar"><i style={{width:`${a.score*10}%`}}/></div></div>)}</article></div>
      <div className="content-grid lower"><article className="card"><div className="card-head"><div><h2>90-day mission</h2><p>Un rezultat clar, măsurat săptămânal.</p></div></div><h3>Dezvoltă business-ul de coaching</h3><p className="muted">Ținte inițiale: creșterea venitului de la 3.000 la 5.000 RON și de la 7 la aproximativ 11 clienți, fără să sacrifici sănătatea și relațiile.</p><div className="milestones"><span>01 · Lead-uri</span><span>02 · Conversie</span><span>03 · Retenție</span><span>04 · Venit</span></div></article><article className="card"><div className="card-head"><div><h2>Activează sincronizarea</h2><p>Conectează autentificarea prin email.</p></div></div><input className="email" type="email" placeholder="Adresa ta de email" value={email} onChange={e=>setEmail(e.target.value)}/><button className="primary" onClick={signIn}>Trimite link de autentificare</button><p className="status">{status}</p><p className="muted tiny">Va funcționa după configurarea variabilelor Supabase și a URL-urilor de redirect.</p></article></div>
      <footer>LIFE OS · Built for consistency, not perfection.</footer>
    </section>
  </main>;
}
