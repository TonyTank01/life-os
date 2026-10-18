'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Task = { id: string; title: string; done: boolean; category: string };
type HealthWorkout = { id: string; category: string; exercise: string; sets: string; reps: string; weight: string; duration: string; notes: string };
type HealthMeal = { id: string; name: string; calories: number; protein: number; carbs: number; fat: number };
type HealthSleep = { hours: number; bedtime: string; wakeTime: string; quality: string };
type HealthDayLog = { workouts: HealthWorkout[]; meals: HealthMeal[]; waterLiters: number; sleep?: HealthSleep; recoveryDone: string[] };
type FoodItem = { name: string; calories: number; protein: number; carbs: number; fat: number };
const foodCatalog: FoodItem[] = [
{name:'Ovăz',calories:389,protein:16.9,carbs:66.3,fat:6.9},{name:'Orez alb fiert',calories:130,protein:2.7,carbs:28.2,fat:0.3},{name:'Paste fierte',calories:157,protein:5.8,carbs:30.9,fat:0.9},{name:'Cartofi fierți',calories:87,protein:1.9,carbs:20.1,fat:0.1},{name:'Pâine integrală',calories:247,protein:13,carbs:41,fat:4.2},
{name:'Piept de pui gătit',calories:165,protein:31,carbs:0,fat:3.6},{name:'Piept de pui crud',calories:120,protein:22.5,carbs:0,fat:2.6},{name:'Pulpe de pui gătite',calories:209,protein:26,carbs:0,fat:10.9},{name:'Carne tocată vită 10% grăsime',calories:176,protein:20,carbs:0,fat:10},{name:'Somon gătit',calories:206,protein:22,carbs:0,fat:12.4},{name:'Ton în suc propriu scurs',calories:116,protein:25.5,carbs:0,fat:0.8},{name:'Ou întreg',calories:143,protein:12.6,carbs:0.7,fat:9.5},{name:'Albuș de ou',calories:52,protein:10.9,carbs:0.7,fat:0.2},
{name:'Iaurt grecesc 2%',calories:73,protein:10,carbs:3.9,fat:2},{name:'Iaurt grecesc 10%',calories:133,protein:6.4,carbs:3.9,fat:10},{name:'Skyr simplu',calories:63,protein:11,carbs:4,fat:0.2},{name:'Lapte 1.5%',calories:46,protein:3.4,carbs:4.8,fat:1.5},{name:'Brânză de vaci slabă',calories:98,protein:11.1,carbs:3.4,fat:4.3},{name:'Cașcaval',calories:356,protein:25,carbs:1.5,fat:27},{name:'Mozzarella',calories:280,protein:28,carbs:3.1,fat:17},{name:'Whey protein pudră',calories:400,protein:80,carbs:8,fat:6},
{name:'Banană',calories:89,protein:1.1,carbs:22.8,fat:0.3},{name:'Măr',calories:52,protein:0.3,carbs:13.8,fat:0.2},{name:'Portocală',calories:47,protein:0.9,carbs:11.8,fat:0.1},{name:'Afine',calories:57,protein:0.7,carbs:14.5,fat:0.3},{name:'Căpșuni',calories:32,protein:0.7,carbs:7.7,fat:0.3},{name:'Avocado',calories:160,protein:2,carbs:8.5,fat:14.7},{name:'Roșii',calories:18,protein:0.9,carbs:3.9,fat:0.2},{name:'Castravete',calories:15,protein:0.7,carbs:3.6,fat:0.1},{name:'Broccoli',calories:34,protein:2.8,carbs:6.6,fat:0.4},{name:'Legume mixte',calories:65,protein:3.2,carbs:12,fat:0.5},
{name:'Migdale',calories:579,protein:21.2,carbs:21.6,fat:49.9},{name:'Nuci',calories:654,protein:15.2,carbs:13.7,fat:65.2},{name:'Unt de arahide',calories:588,protein:25,carbs:20,fat:50},{name:'Ulei de măsline',calories:884,protein:0,carbs:0,fat:100},{name:'Fasole fiartă',calories:127,protein:8.7,carbs:22.8,fat:0.5},{name:'Năut fiert',calories:164,protein:8.9,carbs:27.4,fat:2.6},{name:'Linte fiartă',calories:116,protein:9,carbs:20.1,fat:0.4},{name:'Tofu',calories:144,protein:17.3,carbs:2.8,fat:8.7},{name:'Ciocolată neagră 70%',calories:598,protein:7.8,carbs:45.9,fat:42.6},{name:'Miere',calories:304,protein:0.3,carbs:82.4,fat:0}
];
const exerciseCatalog = [
'Back squat','Front squat','Goblet squat','Smith machine squat','Hack squat','Leg press','Bulgarian split squat','Walking lunges','Reverse lunges','Leg extension','Seated leg curl','Lying leg curl','Romanian deadlift','Conventional deadlift','Sumo deadlift','Hip thrust','Glute bridge','Cable kickback','Hip abduction machine','Standing calf raise','Seated calf raise',
'Pull-ups','Chin-ups','Assisted pull-ups','Lat pulldown','Close-grip lat pulldown','Barbell row','Chest-supported row','One-arm dumbbell row','Seated cable row','Straight-arm pulldown','Face pull','Dumbbell shrug','Barbell curl','EZ-bar curl','Dumbbell curl','Hammer curl','Preacher curl','Cable curl',
'Barbell bench press','Incline barbell bench press','Dumbbell bench press','Incline dumbbell press','Machine chest press','Push-ups','Chest dips','Cable chest fly','Pec deck','Overhead press','Dumbbell shoulder press','Arnold press','Dumbbell lateral raise','Cable lateral raise','Reverse pec deck','Rear delt fly','Close-grip bench press','Triceps pushdown','Overhead triceps extension','Skull crushers',
'Plank','Side plank','Hanging leg raise','Lying leg raise','Cable crunch','Ab wheel rollout','Back extension','Treadmill run','Incline treadmill walk','Outdoor run','Walking','Stationary bike','Outdoor cycling','Elliptical','Rowing machine','Swimming','Stair climber','Zone 2 cardio','Jump rope','Hip flexor stretch','Hamstring stretch','Quad stretch','Calf stretch','Thoracic rotation','Cat-cow','Foam rolling'
];
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

  const [language, setLanguage] = useState<'ro' | 'en'>('ro');
  useEffect(() => {
    try { const savedLanguage = localStorage.getItem('life-os-language'); if (savedLanguage === 'ro' || savedLanguage === 'en') setLanguage(savedLanguage); } catch {}
  }, []);
  function changeLanguage(next: 'ro' | 'en') {
    setLanguage(next);
    try { localStorage.setItem('life-os-language', next); } catch {}
  }
  const translations: Record<string, string> = {
  "Prezentare": "Overview",
  "Plan zilnic": "Daily planner",
  "Obiective pe 90 de zile": "90-day goals",
  "Business și bani": "Business & money",
  "Clienți": "Clients",
  "Sănătate și performanță": "Health & performance",
  "Relații": "Relationships",
  "Credință și minte": "Faith & mind",
  "Analiză": "Analytics",
  "Setări și backup": "Settings & backup",
  "Construiește-ți următorul nivel.": "Build your next level.",
  "Nu ai nevoie de încă o listă. Ai nevoie să știi ce contează acum.": "You don't need another list. You need to know what matters now.",
  "Care este singurul lucru care ar face ziua de azi un succes?": "What is the one thing that would make today a success?",
  "Nu ce e urgent pentru toată lumea. Ce contează cu adevărat pentru tine.": "Not what is urgent for everyone else. What truly matters to you.",
  "Prioritatea principală a zilei": "Today's main priority",
  "O intenție clară. Următorul pas concret.": "One clear intention. One concrete next step.",
  "Se salvează automat": "Saved automatically",
  "Principiul LIFE OS:": "The LIFE OS principle:",
  "mai puțin zgomot, mai multă intenție. Alege, acționează, revizuiește.": "less noise, more intention. Choose, act, review.",
  "VENIT LUNAR": "MONTHLY INCOME",
  "Țintă: 5.000 RON": "Target: 5,000 RON",
  "CLIENȚI ACTIVI": "ACTIVE CLIENTS",
  "Țintă: 11 clienți": "Target: 11 clients",
  "PLAN ZILNIC": "DAILY PLAN",
  "activități": "tasks",
  "SPRINT": "SPRINT",
  "zile": "days",
  "Revizuire în fiecare duminică": "Review every Sunday",
  "Prioritățile de astăzi": "Today's priorities",
  "Acțiuni care duc la rezultate.": "Actions that lead to results.",
  "Adaugă activitate": "Add task",
  "Roata vieții": "Wheel of life",
  "Scoruri orientative din autoevaluarea ta.": "Indicative scores from your self-assessment.",
  "90-day mission": "Misiunea pe 90 de zile",
  "Un rezultat clar, măsurat săptămânal.": "A clear result, measured weekly.",
  "Ținte inițiale: creșterea venitului de la 3.000 la 5.000 RON și de la 7 la aproximativ 11 clienți, fără să sacrifici sănătatea și relațiile.": "Initial targets: grow income from RON 3,000 to RON 5,000 and from 7 to about 11 clients, without sacrificing health or relationships.",
  "Lead-uri": "Leads",
  "Conversie": "Conversion",
  "Retenție": "Retention",
  "Venit": "Revenue",
  "Activează sincronizarea": "Enable sync",
  "Conectează autentificarea prin email.": "Connect email authentication.",
  "Adresa ta de email": "Your email address",
  "Trimite link de autentificare": "Send sign-in link",
  "Va funcționa după configurarea variabilelor Supabase și a URL-urilor de redirect.": "This will work after Supabase variables and redirect URLs are configured.",
  "O zi bună se construiește din următoarea acțiune.": "A good day is built from the next action.",
  "PROGRESUL ZILEI": "DAILY PROGRESS",
  "activități finalizate": "tasks completed",
  "FOCUS": "FOCUS",
  "1 lucru": "1 thing",
  "Alege ce contează cel mai mult.": "Choose what matters most.",
  "Lista de azi": "Today's list",
  "Bifează fiecare pas pe măsură ce îl termini.": "Check off each step as you finish it.",
  "Obiceiuri zilnice": "Daily habits",
  "Consecvență înainte de perfecțiune.": "Consistency over perfection.",
  "Mișcare / antrenament": "Movement / workout",
  "Mese conform planului": "Meals according to plan",
  "10 minute de reflecție sau rugăciune": "10 minutes of reflection or prayer",
  "Pregătește ziua de mâine": "Prepare for tomorrow",
  "Obiectivul și pașii se salvează automat în browserul acestui dispozitiv.": "Your goal and steps are saved automatically in this device's browser.",
  "Misiunea principală": "Main mission",
  "Definește un rezultat clar, apoi revizuiește-l săptămânal.": "Define a clear outcome, then review it weekly.",
  "OBIECTIV": "GOAL",
  "Obiectiv principal": "Main goal",
  "Progresul sistemului": "System progress",
  "Pașii tăi de execuție": "Your execution steps",
  "Nu trebuie să faci totul astăzi. Bifează pașii pe măsură ce îți construiești sistemul.": "You don't have to do everything today. Check off steps as you build your system.",
  "Definește un rezultat măsurabil": "Define a measurable outcome",
  "Alege 3 acțiuni pentru săptămâna aceasta": "Choose 3 actions for this week",
  "Măsoară progresul în fiecare duminică": "Measure progress every Sunday",
  "Revizuiește planul și ajustează următorul pas": "Review the plan and adjust the next step",
  "Definește rezultatul și indicatorul de succes": "Define the outcome and success metric",
  "Alege 3 acțiuni săptămânale concrete": "Choose 3 concrete weekly actions",
  "Blochează timp în calendar pentru execuție": "Block time in your calendar for execution",
  "Analizează progresul din primele 30 de zile": "Review progress from the first 30 days",
  "Elimină obstacolul principal": "Remove the main obstacle",
  "Crește treptat acțiunile care funcționează": "Gradually increase the actions that work",
  "VENIT LUNAR ESTIMAT": "ESTIMATED MONTHLY INCOME",
  "Priorități pentru business": "Business priorities",
  "Contactează potențiali clienți": "Contact potential clients",
  "Publică un clip educativ": "Publish an educational video",
  "Revino la lead-urile existente": "Follow up with existing leads",
  "Verifică progresul clienților": "Review client progress",
  "Ține evidența pachetelor și marchează fiecare ședință încheiată.": "Track packages and mark each completed session.",
  "Adaugă un client": "Add a client",
  "Alege pachetul cumpărat. Fiecare ședință bifată scade automat din sold.": "Choose the purchased package. Each completed session automatically reduces the balance.",
  "Numele clientului": "Client name",
  "Pachet de ședințe": "Session package",
  "ședințe": "sessions",
  "+ Adaugă client": "+ Add client",
  "TOTAL CLIENȚI": "TOTAL CLIENTS",
  "ȘEDINȚE RĂMASE": "SESSIONS REMAINING",
  "ȘEDINȚE EFECTUATE": "SESSIONS COMPLETED",
  "PACHETE EPUIZATE": "PACKAGES COMPLETED",
  "Șterge": "Delete",
  "Pachet inițial:": "Original package:",
  "Pachet finalizat": "Package completed",
  "✓ Marchează ședința ca efectuată": "✓ Mark session as completed",
  "ședințe efectuate înregistrate": "completed sessions recorded",
  "Istoric ședințe": "Session history",
  "Lista ta de clienți va apărea aici": "Your client list will appear here",
  "Adaugă primul client, selectează 8, 12 sau 16 ședințe și apoi marchează fiecare ședință după antrenament.": "Add your first client, choose 8, 12 or 16 sessions, then mark each session after training.",
  "Lista și istoricul sunt salvate în browserul acestui dispozitiv. Pentru acces de pe alte dispozitive, trebuie configurată sincronizarea prin cont.": "Your list and history are saved in this device's browser. Account sync must be configured to access them on other devices.",
  "Checklist de sănătate": "Health checklist",
  "Antrenament conform planului": "Workout according to plan",
  "Mese și hidratare": "Meals and hydration",
  "Pauze și recuperare": "Breaks and recovery",
  "Rutina de somn": "Sleep routine",
  "Principiul de bază": "The core principle",
  "Progresul fizic contează doar dacă îl poți susține. Notează antrenamentele, somnul și cum te simți, fără să forțezi când corpul cere recuperare.": "Physical progress matters only if you can sustain it. Track workouts, sleep and how you feel, without pushing when your body needs recovery.",
  "Intenția săptămânii": "Weekly intention",
  "Alege o acțiune concretă pentru a investi în relațiile importante.": "Choose one concrete action to invest in important relationships.",
  "Sună pe cineva drag": "Call someone you care about",
  "Planifică timp de calitate fără telefon": "Plan quality time without your phone",
  "Spune cuiva că apreciezi ceva la el": "Tell someone what you appreciate about them",
  "Un jurnal personal, organizat pe zile.": "A personal journal, organized by day.",
  "Jurnal de reflecție": "Reflection journal",
  "Rugăciuni, gânduri și lecții din fiecare zi.": "Prayers, thoughts and lessons from each day.",
  "ALEGE ZIUA": "SELECT DAY",
  "Întrebare de reflecție: ce vreau să fac astăzi în acord cu valorile și credința mea?": "Reflection question: what do I want to do today in line with my values and faith?",
  "Scrie aici rugăciunea, reflecția sau gândurile zilei...": "Write your prayer, reflection or thoughts for the day here...",
  "Salvează ziua": "Save day",
  "Revino la azi": "Back to today",
  "Zile salvate": "Saved days",
  "Încă nu ai zile salvate. Scrie prima reflecție și apasă „Salvează ziua”.": "No saved days yet. Write your first reflection and click “Save day”.",
  "Datele sunt salvate în browserul acestui dispozitiv. Pentru sincronizare între dispozitive va trebui conectată baza de date.": "Your data is saved in this device's browser. A database must be connected to sync across devices.",
  "Nu poți îmbunătăți ce nu ești dispus să privești cu sinceritate.": "You can't improve what you're unwilling to look at honestly.",
  "TASKURI FINALIZATE": "TASKS COMPLETED",
  "Progresul listei curente": "Current list progress",
  "RATA DE FINALIZARE": "COMPLETION RATE",
  "OBICEIURI BIFATE": "HABITS CHECKED",
  "Înregistrări locale": "Local records",
  "JURNAL": "JOURNAL",
  "Zile cu reflecție salvată": "Days with saved reflections",
  "Revizuirea săptămânii": "Weekly review",
  "Fii sincer, nu perfect. Scopul este să înveți și să ajustezi.": "Be honest, not perfect. The goal is to learn and adjust.",
  "SALVARE AUTOMATĂ": "AUTO-SAVED",
  "SĂPTĂMÂNA ÎNCEPUTĂ LA": "WEEK STARTING",
  "01 / Ce a mers bine?": "01 / What went well?",
  "Rezultate, acțiuni și momente de care ești mândru...": "Results, actions and moments you're proud of...",
  "02 / Ce m-a blocat?": "02 / What got in my way?",
  "Ce ai evitat? Ce ți-a consumat energia?": "What did you avoid? What drained your energy?",
  "03 / Ce am învățat?": "03 / What did I learn?",
  "Ce ai înțeles despre tine sau despre planul tău?": "What did you learn about yourself or your plan?",
  "04 / Care este prioritatea următoare?": "04 / What's the next priority?",
  "Alege un rezultat clar pentru săptămâna următoare...": "Choose a clear outcome for next week...",
  "Se salvează automat în acest browser": "Automatically saved in this browser",
  "Revizuiri anterioare": "Previous reviews",
  "Scoruri orientative — Roata vieții": "Indicative scores — Wheel of life",
  "Folosește scorurile ca punct de pornire pentru reflecție, nu ca verdict despre viața ta.": "Use these scores as a starting point for reflection, not a verdict on your life.",
  "Setările și opțiunile de salvare ale spațiului tău de lucru.": "Settings and backup options for your workspace.",
  "Starea aplicației": "App status",
  "Versiune demonstrativă. Taskurile și obiceiurile sunt păstrate local în browserul acestui dispozitiv. Sincronizarea între dispozitive nu este activă până la configurarea Supabase.": "Demo version. Tasks and habits are stored locally in this device's browser. Cross-device sync is inactive until Supabase is configured.",
  "Descarcă backup JSON": "Download JSON backup",
  "Autentificare prin email": "Email sign-in",
  "Verifică emailul pentru linkul de autentificare.": "Check your email for the sign-in link.",
  "Nu s-a putut trimite linkul. Verifică setările.": "Could not send the link. Check the settings.",
  "Scrie numele clientului înainte de a-l adăuga.": "Enter the client's name before adding them.",
  "a fost adăugat.": "has been added.",
  "Reflecția pentru": "Reflection for",
  "a fost salvată pe acest dispozitiv.": "was saved on this device.",
  "PERSONAL COMMAND CENTER": "CENTRU PERSONAL DE COMANDĂ",
  "Consistență, nu perfecțiune.": "Consistency, not perfection.",
  "Built for consistency, not perfection.": "Creat pentru consecvență, nu perfecțiune."
};
  const reverseTranslations: Record<string, string> = {
  "Overview": "Prezentare",
  "Daily planner": "Plan zilnic",
  "90-day goals": "Obiective pe 90 de zile",
  "Business & money": "Business și bani",
  "Clients": "Clienți",
  "Health & performance": "Sănătate și performanță",
  "Relationships": "Relații",
  "Faith & mind": "Credință și minte",
  "Analytics": "Analiză",
  "Settings & backup": "Setări și backup",
  "Build your next level.": "Construiește-ți următorul nivel.",
  "You don't need another list. You need to know what matters now.": "Nu ai nevoie de încă o listă. Ai nevoie să știi ce contează acum.",
  "What is the one thing that would make today a success?": "Care este singurul lucru care ar face ziua de azi un succes?",
  "Not what is urgent for everyone else. What truly matters to you.": "Nu ce e urgent pentru toată lumea. Ce contează cu adevărat pentru tine.",
  "Today's main priority": "Prioritatea principală a zilei",
  "One clear intention. One concrete next step.": "O intenție clară. Următorul pas concret.",
  "Saved automatically": "Se salvează automat",
  "The LIFE OS principle:": "Principiul LIFE OS:",
  "less noise, more intention. Choose, act, review.": "mai puțin zgomot, mai multă intenție. Alege, acționează, revizuiește.",
  "MONTHLY INCOME": "VENIT LUNAR",
  "Target: 5,000 RON": "Țintă: 5.000 RON",
  "ACTIVE CLIENTS": "CLIENȚI ACTIVI",
  "Target: 11 clients": "Țintă: 11 clienți",
  "DAILY PLAN": "PLAN ZILNIC",
  "tasks": "activități",
  "SPRINT": "SPRINT",
  "days": "zile",
  "Review every Sunday": "Revizuire în fiecare duminică",
  "Today's priorities": "Prioritățile de astăzi",
  "Actions that lead to results.": "Acțiuni care duc la rezultate.",
  "Add task": "Adaugă activitate",
  "Wheel of life": "Roata vieții",
  "Indicative scores from your self-assessment.": "Scoruri orientative din autoevaluarea ta.",
  "Misiunea pe 90 de zile": "90-day mission",
  "A clear result, measured weekly.": "Un rezultat clar, măsurat săptămânal.",
  "Initial targets: grow income from RON 3,000 to RON 5,000 and from 7 to about 11 clients, without sacrificing health or relationships.": "Ținte inițiale: creșterea venitului de la 3.000 la 5.000 RON și de la 7 la aproximativ 11 clienți, fără să sacrifici sănătatea și relațiile.",
  "Leads": "Lead-uri",
  "Conversion": "Conversie",
  "Retention": "Retenție",
  "Revenue": "Venit",
  "Enable sync": "Activează sincronizarea",
  "Connect email authentication.": "Conectează autentificarea prin email.",
  "Your email address": "Adresa ta de email",
  "Send sign-in link": "Trimite link de autentificare",
  "This will work after Supabase variables and redirect URLs are configured.": "Va funcționa după configurarea variabilelor Supabase și a URL-urilor de redirect.",
  "A good day is built from the next action.": "O zi bună se construiește din următoarea acțiune.",
  "DAILY PROGRESS": "PROGRESUL ZILEI",
  "tasks completed": "activități finalizate",
  "FOCUS": "FOCUS",
  "1 thing": "1 lucru",
  "Choose what matters most.": "Alege ce contează cel mai mult.",
  "Today's list": "Lista de azi",
  "Check off each step as you finish it.": "Bifează fiecare pas pe măsură ce îl termini.",
  "Daily habits": "Obiceiuri zilnice",
  "Consistency over perfection.": "Consecvență înainte de perfecțiune.",
  "Movement / workout": "Mișcare / antrenament",
  "Meals according to plan": "Mese conform planului",
  "10 minutes of reflection or prayer": "10 minute de reflecție sau rugăciune",
  "Prepare for tomorrow": "Pregătește ziua de mâine",
  "Your goal and steps are saved automatically in this device's browser.": "Obiectivul și pașii se salvează automat în browserul acestui dispozitiv.",
  "Main mission": "Misiunea principală",
  "Define a clear outcome, then review it weekly.": "Definește un rezultat clar, apoi revizuiește-l săptămânal.",
  "GOAL": "OBIECTIV",
  "Main goal": "Obiectiv principal",
  "System progress": "Progresul sistemului",
  "Your execution steps": "Pașii tăi de execuție",
  "You don't have to do everything today. Check off steps as you build your system.": "Nu trebuie să faci totul astăzi. Bifează pașii pe măsură ce îți construiești sistemul.",
  "Define a measurable outcome": "Definește un rezultat măsurabil",
  "Choose 3 actions for this week": "Alege 3 acțiuni pentru săptămâna aceasta",
  "Measure progress every Sunday": "Măsoară progresul în fiecare duminică",
  "Review the plan and adjust the next step": "Revizuiește planul și ajustează următorul pas",
  "Define the outcome and success metric": "Definește rezultatul și indicatorul de succes",
  "Choose 3 concrete weekly actions": "Alege 3 acțiuni săptămânale concrete",
  "Block time in your calendar for execution": "Blochează timp în calendar pentru execuție",
  "Review progress from the first 30 days": "Analizează progresul din primele 30 de zile",
  "Remove the main obstacle": "Elimină obstacolul principal",
  "Gradually increase the actions that work": "Crește treptat acțiunile care funcționează",
  "ESTIMATED MONTHLY INCOME": "VENIT LUNAR ESTIMAT",
  "Business priorities": "Priorități pentru business",
  "Contact potential clients": "Contactează potențiali clienți",
  "Publish an educational video": "Publică un clip educativ",
  "Follow up with existing leads": "Revino la lead-urile existente",
  "Review client progress": "Verifică progresul clienților",
  "Track packages and mark each completed session.": "Ține evidența pachetelor și marchează fiecare ședință încheiată.",
  "Add a client": "Adaugă un client",
  "Choose the purchased package. Each completed session automatically reduces the balance.": "Alege pachetul cumpărat. Fiecare ședință bifată scade automat din sold.",
  "Client name": "Numele clientului",
  "Session package": "Pachet de ședințe",
  "sessions": "ședințe",
  "+ Add client": "+ Adaugă client",
  "TOTAL CLIENTS": "TOTAL CLIENȚI",
  "SESSIONS REMAINING": "ȘEDINȚE RĂMASE",
  "SESSIONS COMPLETED": "ȘEDINȚE EFECTUATE",
  "PACKAGES COMPLETED": "PACHETE EPUIZATE",
  "Delete": "Șterge",
  "Original package:": "Pachet inițial:",
  "Package completed": "Pachet finalizat",
  "✓ Mark session as completed": "✓ Marchează ședința ca efectuată",
  "completed sessions recorded": "ședințe efectuate înregistrate",
  "Session history": "Istoric ședințe",
  "Your client list will appear here": "Lista ta de clienți va apărea aici",
  "Add your first client, choose 8, 12 or 16 sessions, then mark each session after training.": "Adaugă primul client, selectează 8, 12 sau 16 ședințe și apoi marchează fiecare ședință după antrenament.",
  "Your list and history are saved in this device's browser. Account sync must be configured to access them on other devices.": "Lista și istoricul sunt salvate în browserul acestui dispozitiv. Pentru acces de pe alte dispozitive, trebuie configurată sincronizarea prin cont.",
  "Health checklist": "Checklist de sănătate",
  "Workout according to plan": "Antrenament conform planului",
  "Meals and hydration": "Mese și hidratare",
  "Breaks and recovery": "Pauze și recuperare",
  "Sleep routine": "Rutina de somn",
  "The core principle": "Principiul de bază",
  "Physical progress matters only if you can sustain it. Track workouts, sleep and how you feel, without pushing when your body needs recovery.": "Progresul fizic contează doar dacă îl poți susține. Notează antrenamentele, somnul și cum te simți, fără să forțezi când corpul cere recuperare.",
  "Weekly intention": "Intenția săptămânii",
  "Choose one concrete action to invest in important relationships.": "Alege o acțiune concretă pentru a investi în relațiile importante.",
  "Call someone you care about": "Sună pe cineva drag",
  "Plan quality time without your phone": "Planifică timp de calitate fără telefon",
  "Tell someone what you appreciate about them": "Spune cuiva că apreciezi ceva la el",
  "A personal journal, organized by day.": "Un jurnal personal, organizat pe zile.",
  "Reflection journal": "Jurnal de reflecție",
  "Prayers, thoughts and lessons from each day.": "Rugăciuni, gânduri și lecții din fiecare zi.",
  "SELECT DAY": "ALEGE ZIUA",
  "Reflection question: what do I want to do today in line with my values and faith?": "Întrebare de reflecție: ce vreau să fac astăzi în acord cu valorile și credința mea?",
  "Write your prayer, reflection or thoughts for the day here...": "Scrie aici rugăciunea, reflecția sau gândurile zilei...",
  "Save day": "Salvează ziua",
  "Back to today": "Revino la azi",
  "Saved days": "Zile salvate",
  "No saved days yet. Write your first reflection and click “Save day”.": "Încă nu ai zile salvate. Scrie prima reflecție și apasă „Salvează ziua”.",
  "Your data is saved in this device's browser. A database must be connected to sync across devices.": "Datele sunt salvate în browserul acestui dispozitiv. Pentru sincronizare între dispozitive va trebui conectată baza de date.",
  "You can't improve what you're unwilling to look at honestly.": "Nu poți îmbunătăți ce nu ești dispus să privești cu sinceritate.",
  "TASKS COMPLETED": "TASKURI FINALIZATE",
  "Current list progress": "Progresul listei curente",
  "COMPLETION RATE": "RATA DE FINALIZARE",
  "HABITS CHECKED": "OBICEIURI BIFATE",
  "Local records": "Înregistrări locale",
  "JOURNAL": "JURNAL",
  "Days with saved reflections": "Zile cu reflecție salvată",
  "Weekly review": "Revizuirea săptămânii",
  "Be honest, not perfect. The goal is to learn and adjust.": "Fii sincer, nu perfect. Scopul este să înveți și să ajustezi.",
  "AUTO-SAVED": "SALVARE AUTOMATĂ",
  "WEEK STARTING": "SĂPTĂMÂNA ÎNCEPUTĂ LA",
  "01 / What went well?": "01 / Ce a mers bine?",
  "Results, actions and moments you're proud of...": "Rezultate, acțiuni și momente de care ești mândru...",
  "02 / What got in my way?": "02 / Ce m-a blocat?",
  "What did you avoid? What drained your energy?": "Ce ai evitat? Ce ți-a consumat energia?",
  "03 / What did I learn?": "03 / Ce am învățat?",
  "What did you learn about yourself or your plan?": "Ce ai înțeles despre tine sau despre planul tău?",
  "04 / What's the next priority?": "04 / Care este prioritatea următoare?",
  "Choose a clear outcome for next week...": "Alege un rezultat clar pentru săptămâna următoare...",
  "Automatically saved in this browser": "Se salvează automat în acest browser",
  "Previous reviews": "Revizuiri anterioare",
  "Indicative scores — Wheel of life": "Scoruri orientative — Roata vieții",
  "Use these scores as a starting point for reflection, not a verdict on your life.": "Folosește scorurile ca punct de pornire pentru reflecție, nu ca verdict despre viața ta.",
  "Settings and backup options for your workspace.": "Setările și opțiunile de salvare ale spațiului tău de lucru.",
  "App status": "Starea aplicației",
  "Demo version. Tasks and habits are stored locally in this device's browser. Cross-device sync is inactive until Supabase is configured.": "Versiune demonstrativă. Taskurile și obiceiurile sunt păstrate local în browserul acestui dispozitiv. Sincronizarea între dispozitive nu este activă până la configurarea Supabase.",
  "Download JSON backup": "Descarcă backup JSON",
  "Email sign-in": "Autentificare prin email",
  "Check your email for the sign-in link.": "Verifică emailul pentru linkul de autentificare.",
  "Could not send the link. Check the settings.": "Nu s-a putut trimite linkul. Verifică setările.",
  "Enter the client's name before adding them.": "Scrie numele clientului înainte de a-l adăuga.",
  "has been added.": "a fost adăugat.",
  "Reflection for": "Reflecția pentru",
  "was saved on this device.": "a fost salvată pe acest dispozitiv.",
  "CENTRU PERSONAL DE COMANDĂ": "PERSONAL COMMAND CENTER",
  "Consistency, not perfection.": "Consistență, nu perfecțiune.",
  "Creat pentru consecvență, nu perfecțiune.": "Built for consistency, not perfection."
};
  function localizeText(value: string) {
    const trimmed = value.trim();
    const translated = language === 'en' ? translations[trimmed] : reverseTranslations[trimmed];
    return translated ? value.replace(trimmed, translated) : value;
  }
  function localizeNode(node: React.ReactNode): React.ReactNode {
    if (typeof node === 'string') return localizeText(node);
    if (Array.isArray(node)) return node.map((child, index) => <React.Fragment key={index}>{localizeNode(child)}</React.Fragment>);
    if (React.isValidElement(node)) {
      const props = node.props as Record<string, unknown>;
      const nextProps: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(props)) {
        if ((key === 'placeholder' || key === 'aria-label' || key === 'title') && typeof value === 'string') nextProps[key] = localizeText(value);
        else if (key === 'children') nextProps[key] = localizeNode(value as React.ReactNode);
        else nextProps[key] = value;
      }
      return React.cloneElement(node, nextProps);
    }
    return node;
  }

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeSection, setActiveSection] = useState('Overview');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('Demo local — conectează Supabase pentru sincronizare.');
  const [income, setIncome] = useState(3000);
  const [clients, setClients] = useState(7);
  const [goal, setGoal] = useState('Dezvoltă business-ul de coaching');
  type GoalPlan = { goal: string; actions: string[]; completed: boolean[] };
  const defaultGoalPlans: Record<string, GoalPlan> = {
    '30': { goal: '', actions: ['Definește rezultatul și indicatorul de succes', 'Alege 3 acțiuni săptămânale concrete', 'Blochează timp în calendar pentru execuție'], completed: [false, false, false] },
    '60': { goal: '', actions: ['Analizează progresul din primele 30 de zile', 'Elimină obstacolul principal', 'Crește treptat acțiunile care funcționează'], completed: [false, false, false] },
    '90': { goal: 'Dezvoltă business-ul de coaching', actions: ['Definește un rezultat măsurabil', 'Alege 3 acțiuni pentru săptămâna aceasta', 'Măsoară progresul în fiecare duminică', 'Revizuiește planul și ajustează următorul pas'], completed: [false, false, false, false] }
  };
  const [goalPlans, setGoalPlans] = useState<Record<string, GoalPlan>>(defaultGoalPlans);
  const [goalPeriod, setGoalPeriod] = useState<'30' | '60' | '90'>('90');
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
  const [healthLogs, setHealthLogs] = useState<Record<string, HealthDayLog>>({});
  const [healthLoaded, setHealthLoaded] = useState(false);
  const [healthTab, setHealthTab] = useState<'workout'|'nutrition'|'recovery'|'sleep'>('workout');
  const [workoutForm, setWorkoutForm] = useState({category:'Strength', exercise:'', sets:'3', reps:'10', weight:'', duration:'45', notes:''});
  const [mealForm, setMealForm] = useState({name:'', grams:'100', calories:'', protein:'', carbs:'', fat:''});
  const [waterInput, setWaterInput] = useState('0.25');
  const [sleepForm, setSleepForm] = useState({hours:'8', bedtime:'23:00', wakeTime:'07:00', quality:'good'});
  const completed = tasks.filter(t => t.done).length;
  const pct = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  useEffect(() => {
    try {
      const saved = localStorage.getItem('life-os-demo-tasks');
      if (saved) setTasks(JSON.parse(saved));
      const savedHabits = localStorage.getItem('life-os-habits');
      if (savedHabits) setHabits(JSON.parse(savedHabits));
      const savedHealthLogs = localStorage.getItem('life-os-health-logs');
      if (savedHealthLogs) setHealthLogs(JSON.parse(savedHealthLogs));
      setHealthLoaded(true);
      const savedGoal = localStorage.getItem('life-os-main-goal');
      if (savedGoal !== null) setGoal(savedGoal);
      const savedGoalPlans = localStorage.getItem('life-os-goal-plans');
      if (savedGoalPlans) {
        const parsed = JSON.parse(savedGoalPlans) as Record<string, GoalPlan>;
        setGoalPlans({ ...defaultGoalPlans, ...parsed });
        if (parsed['90']?.goal) setGoal(parsed['90'].goal);
      } else if (savedGoal !== null) {
        setGoalPlans(previous => ({ ...previous, '90': { ...previous['90'], goal: savedGoal } }));
      }
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
  function updateGoalPlan(period: '30' | '60' | '90', update: Partial<GoalPlan>) {
    if (period === '90' && update.goal !== undefined) {
      setGoal(update.goal);
      try { localStorage.setItem('life-os-main-goal', update.goal); } catch {}
    }
    setGoalPlans(previous => {
      const next = { ...previous, [period]: { ...previous[period], ...update } };
      try { localStorage.setItem('life-os-goal-plans', JSON.stringify(next)); } catch {}
      return next;
    });
  }
  function goalAdvice(goalText: string, period: '30' | '60' | '90') {
    const g = goalText.toLocaleLowerCase();
    const en = language === 'en';
    const advice: string[] = [];
    if (/venit|bani|business|client|vânz|vanz|revenue|income|business|client|sales|earn|money|coach/.test(g)) {
      advice.push(en ? 'Set a measurable target: revenue, number of clients, or conversion rate. Define your starting point first.' : 'Stabilește o țintă măsurabilă: venit, număr de clienți sau rată de conversie. Notează mai întâi punctul de plecare.');
      advice.push(en ? 'Prioritize revenue-generating actions: contact qualified leads, follow up, improve your offer, and ask satisfied clients for referrals.' : 'Prioritizează acțiunile care generează venit: contactează potențiali clienți potriviți, revino cu follow-up, îmbunătățește oferta și cere recomandări clienților mulțumiți.');
      advice.push(en ? 'Track weekly: leads contacted, consultations booked, clients gained, and revenue collected. Change one thing at a time.' : 'Urmărește săptămânal: lead-uri contactate, discuții programate, clienți câștigați și bani încasați. Schimbă câte un singur lucru odată.');
    } else if (/fitness|sală|sala|greutate|slăb|slab|masă musculară|masa musculara|alerg|maraton|triathlon|workout|muscle|weight|lose fat|run|running|health|sport/.test(g)) {
      advice.push(en ? 'Choose a measurable outcome and a realistic weekly rate of progress; avoid changing several habits at once.' : 'Alege un rezultat măsurabil și un ritm săptămânal realist; evită să schimbi prea multe obiceiuri simultan.');
      advice.push(en ? 'Schedule training, nutrition preparation, and recovery in your calendar. Consistency beats extreme weeks.' : 'Pune în calendar antrenamentele, pregătirea meselor și recuperarea. Consecvența bate săptămânile extreme.');
      advice.push(en ? 'Review performance, energy, and adherence weekly. Adjust the plan if recovery or health deteriorates.' : 'Revizuiește săptămânal performanța, energia și consecvența. Ajustează planul dacă recuperarea sau sănătatea se deteriorează.');
    } else if (/învăț|invat|stud|exam|skill|learn|course|certif|carier|career|program|code|programming/.test(g)) {
      advice.push(en ? 'Define the proof of success: a completed project, passed exam, portfolio piece, or demonstrated skill.' : 'Definește dovada succesului: un proiect finalizat, un examen promovat, o lucrare de portofoliu sau o abilitate demonstrată.');
      advice.push(en ? 'Use focused study blocks and active recall. Produce something each week instead of only consuming content.' : 'Folosește sesiuni de studiu concentrate și testare activă a memoriei. Produce ceva în fiecare săptămână, nu doar consuma conținut.');
      advice.push(en ? 'Get feedback early, identify the weakest sub-skill, and dedicate the next week to improving it.' : 'Cere feedback din timp, identifică abilitatea cea mai slabă și dedică-i săptămâna următoare.');
    } else if (/relaț|relat|partener|prieten|famil|relationship|partner|friend|family|social/.test(g)) {
      advice.push(en ? 'Turn the intention into a specific behavior you control, such as one meaningful conversation or planned quality time each week.' : 'Transformă intenția într-un comportament concret pe care îl controlezi, de exemplu o conversație sinceră sau timp de calitate planificat în fiecare săptămână.');
      advice.push(en ? 'Make space in your calendar and be present. Focus on consistency and listening, not forcing an outcome.' : 'Fă loc în calendar și fii prezent. Concentrează-te pe consecvență și ascultare, nu pe forțarea unui rezultat.');
      advice.push(en ? 'Reflect weekly on what strengthened the connection and what you want to do differently.' : 'Reflectează săptămânal la ce a întărit relația și ce vrei să faci diferit.');
    } else {
      advice.push(en ? 'Rewrite the goal as a clear outcome with a number, deadline, or observable proof of completion.' : 'Rescrie obiectivul ca rezultat clar, cu un număr, un termen-limită sau o dovadă observabilă a finalizării.');
      advice.push(en ? 'Break it into one to three actions each week and schedule them before the week begins.' : 'Împarte-l în una până la trei acțiuni săptămânale și programează-le înainte să înceapă săptămâna.');
      advice.push(en ? 'Identify the biggest obstacle now, prepare a fallback plan, and review progress every seven days.' : 'Identifică de acum cel mai mare obstacol, pregătește un plan alternativ și revizuiește progresul la fiecare șapte zile.');
    }
    if (period === '30') advice.push(en ? '30-day focus: prove the routine works and build momentum; keep the scope narrow.' : 'Focus pe 30 de zile: demonstrează că rutina funcționează și construiește ritm; păstrează obiectivul restrâns.');
    if (period === '60') advice.push(en ? '60-day focus: review your first-month data, remove the main bottleneck, and double down on what works.' : 'Focus pe 60 de zile: analizează datele primei luni, elimină blocajul principal și insistă pe ce funcționează.');
    if (period === '90') advice.push(en ? '90-day focus: evaluate the outcome against your starting point and decide what to sustain, stop, or scale.' : 'Focus pe 90 de zile: compară rezultatul cu punctul de plecare și decide ce păstrezi, oprești sau extinzi.');
    return advice;
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
  useEffect(() => {
    if (!healthLoaded) return;
    try { localStorage.setItem('life-os-health-logs', JSON.stringify(healthLogs)); } catch {}
  }, [healthLogs, healthLoaded]);
  const todayHealthKey = localDateKey();
  const todayHealth: HealthDayLog = healthLogs[todayHealthKey] || { workouts: [], meals: [], waterLiters: 0, recoveryDone: [] };
  function updateTodayHealth(update: Partial<HealthDayLog>) {
    setHealthLogs(previous => {
      const current = previous[todayHealthKey] || { workouts: [], meals: [], waterLiters: 0, recoveryDone: [] };
      return { ...previous, [todayHealthKey]: { ...current, ...update } };
    });
  }
  function addHealthWorkout() {
    if (!workoutForm.exercise.trim()) { alert(language === 'en' ? 'Enter an exercise or workout name first.' : 'Scrie mai întâi numele exercițiului sau antrenamentului.'); return; }
    updateTodayHealth({ workouts: [...todayHealth.workouts, { ...workoutForm, id: String(Date.now()) }] });
    setWorkoutForm(previous => ({ ...previous, exercise: '', notes: '' }));
  }
  function selectFood(name: string, grams = mealForm.grams) {
    const food = foodCatalog.find(item => item.name.toLocaleLowerCase() === name.trim().toLocaleLowerCase());
    if (!food) { setMealForm(previous => ({ ...previous, name, grams, calories: '', protein: '', carbs: '', fat: '' })); return; }
    const factor = Math.max(0, Number(grams) || 0) / 100;
    setMealForm(previous => ({ ...previous, name, grams, calories: String(Math.round(food.calories * factor)), protein: String(Math.round(food.protein * factor * 10) / 10), carbs: String(Math.round(food.carbs * factor * 10) / 10), fat: String(Math.round(food.fat * factor * 10) / 10) }));
  }
  function changeFoodGrams(grams: string) { selectFood(mealForm.name, grams); }
  function addHealthMeal() {
    if (!mealForm.name.trim()) { alert(language === 'en' ? 'Choose a food or enter a custom meal first.' : 'Alege un aliment sau introdu mai întâi o masă personalizată.'); return; }
    const n = (value: string) => Math.max(0, Number(value) || 0);
    const matched = foodCatalog.some(item => item.name.toLocaleLowerCase() === mealForm.name.trim().toLocaleLowerCase());
    const name = matched && Number(mealForm.grams) > 0 ? mealForm.name.trim() + ' · ' + mealForm.grams + ' g' : mealForm.name.trim();
    updateTodayHealth({ meals: [...todayHealth.meals, { id: String(Date.now()), name, calories: n(mealForm.calories), protein: n(mealForm.protein), carbs: n(mealForm.carbs), fat: n(mealForm.fat) }] });
    setMealForm({ name: '', grams: '100', calories: '', protein: '', carbs: '', fat: '' });
  }
  function saveHealthSleep() {
    const hours = Number(sleepForm.hours);
    if (!Number.isFinite(hours) || hours < 0 || hours > 24) { alert(language === 'en' ? 'Enter sleep duration between 0 and 24 hours.' : 'Introdu un număr de ore de somn între 0 și 24.'); return; }
    updateTodayHealth({ sleep: { hours, bedtime: sleepForm.bedtime, wakeTime: sleepForm.wakeTime, quality: sleepForm.quality } });
  }
  function toggleRecoveryTip(tip: string) {
    const done = todayHealth.recoveryDone.includes(tip);
    updateTodayHealth({ recoveryDone: done ? todayHealth.recoveryDone.filter(item => item !== tip) : [...todayHealth.recoveryDone, tip] });
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
    return <header className="top"><div><div className="eyebrow">LIFE OS / WORKSPACE</div><h1>{title}</h1><p>{subtitle}</p></div><div className="date">{new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'ro-RO',{weekday:'short',day:'numeric',month:'short'})}</div></header>;
  }
  function sectionContent() {
    switch (activeSection) {
      case 'Daily planner':
        return <>{header('Daily planner','O zi bună se construiește din următoarea acțiune.') }
          <div className="stats"><article className="card"><label>PROGRESUL ZILEI</label><strong>{pct}%</strong><p>{completed} din {tasks.length} activități finalizate</p><div className="bar"><i style={{width:`${pct}%`}}/></div></article><article className="card"><label>FOCUS</label><strong>1 lucru</strong><p>Alege ce contează cel mai mult.</p></article></div>
          <article className="card"><div className="card-head"><div><h2>Lista de azi</h2><p>Bifează fiecare pas pe măsură ce îl termini.</p></div><span className="chip">DAILY EXECUTION</span></div><div className="tasks">{tasks.map(t=><label className={`task ${t.done?'done':''}`} key={t.id}><input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)}/><span><b>{t.title}</b><small>{t.category}</small></span></label>)}</div><button className="primary" onClick={addTask}>+ Adaugă activitate</button></article>
          <article className="card" style={{marginTop:14}}><h2>Obiceiuri zilnice</h2><p>Consecvență înainte de perfecțiune.</p>{['Mișcare / antrenament','Mese conform planului','10 minute de reflecție sau rugăciune','Pregătește ziua de mâine'].map(h=><label className={`task ${habits[h]?'done':''}`} key={h}><input type="checkbox" checked={!!habits[h]} onChange={()=>toggleHabit(h)}/><span><b>{h}</b></span></label>)}</article></>;
      case '90-day goals': {
        const plan = goalPlans[goalPeriod] || defaultGoalPlans[goalPeriod];
        const doneCount = plan.completed.filter(Boolean).length;
        const progress = plan.completed.length ? Math.round(doneCount / plan.completed.length * 100) : 0;
        const advice = goalAdvice(plan.goal, goalPeriod);
        return <>{header(language === 'en' ? 'Goal planner' : 'Planificator de obiective', language === 'en' ? 'Turn a clear outcome into a realistic execution plan.' : 'Transformă un rezultat clar într-un plan realist de execuție.')}
          <div className="goal-period-tabs">{(['30','60','90'] as const).map(period=><button key={period} className={goalPeriod===period?'active':''} onClick={()=>setGoalPeriod(period)}><strong>{period}</strong><span>{language==='en'?'DAY GOAL':'DE ZILE'}</span></button>)}</div>
          <article className="card">
            <div className="card-head"><div><span className="eyebrow">{language==='en'?'YOUR NEXT MILESTONE':'URMĂTORUL TĂU REPER'}</span><h2>{language==='en'?`${goalPeriod}-day goal`:`Obiectiv pe ${goalPeriod} de zile`}</h2><p>{language==='en'?'One horizon at a time. Keep it specific and measurable.':'Un orizont de timp pe rând. Fă obiectivul concret și măsurabil.'}</p></div><span className="chip">{doneCount}/{plan.completed.length} {language==='en'?'STEPS':'PAȘI'}</span></div>
            <label>{language==='en'?'WHAT DO YOU WANT TO ACHIEVE?':'CE VREI SĂ OBȚII?'}</label>
            <textarea className="email" rows={3} value={plan.goal} onChange={e=>updateGoalPlan(goalPeriod,{goal:e.target.value})} placeholder={language==='en'?'Example: Reach €2,000 in monthly revenue or complete a 10K race':'Exemplu: Ajung la 5.000 RON venit lunar sau termin o cursă de 10 km'} aria-label={language==='en'?'Goal description':'Descrierea obiectivului'}/>
            <div className="goal-progress"><div className="area-label"><span>{language==='en'?'Action progress':'Progresul acțiunilor'}</span><b>{progress}%</b></div><div className="bar"><i style={{width:progress+'%'}}/></div></div>
            <h3>{language==='en'?'Execution checklist':'Lista de execuție'}</h3>
            <p className="muted">{language==='en'?'Check actions off as you complete them. Edit them to fit your goal.':'Bifează acțiunile când le finalizezi. Le poți modifica pentru obiectivul tău.'}</p>
            <div className="tasks">{plan.actions.map((action,index)=><label className={`task ${plan.completed[index]?'done':''}`} key={goalPeriod+'-'+index}><input type="checkbox" checked={!!plan.completed[index]} onChange={e=>{const completed=[...plan.completed];completed[index]=e.target.checked;updateGoalPlan(goalPeriod,{completed});}}/><span><b>{action}</b><small>{language==='en'?`STEP ${String(index+1).padStart(2,'0')}`:`PASUL ${String(index+1).padStart(2,'0')}`}</small></span></label>)}</div>
            <div className="goal-edit-actions"><button className="secondary" onClick={()=>{const text=prompt(language==='en'?'Write a new action':'Scrie o acțiune nouă');if(text?.trim())updateGoalPlan(goalPeriod,{actions:[...plan.actions,text.trim()],completed:[...plan.completed,false]});}}>{language==='en'?'+ Add action':'+ Adaugă acțiune'}</button><button className="secondary" onClick={()=>{const next={...defaultGoalPlans[goalPeriod],goal:plan.goal};updateGoalPlan(goalPeriod,next);}}>{language==='en'?'Reset checklist':'Resetează pașii'}</button></div>
            <p className="muted">{language==='en'?'Each time horizon is saved in this browser. Cloud sync is not enabled yet.':'Fiecare orizont se salvează în browserul acestui dispozitiv. Sincronizarea online nu este activă încă.'}</p>
          </article>
          <article className="card advice-card"><div className="card-head"><div><span className="eyebrow">{language==='en'?'GOAL-SPECIFIC PLAYBOOK':'PLAN ADAPTAT OBIECTIVULUI'}</span><h2>{language==='en'?'Recommended strategy':'Strategie recomandată'}</h2><p>{language==='en'?'Suggestions adapt to the words in your goal. Use them as a starting point, then validate against your real situation.':'Sugestiile se adaptează la formularea obiectivului. Folosește-le ca punct de plecare și ajustează-le la situația ta reală.'}</p></div><span className="chip">{language==='en'?'SMART ACTIONS':'ACȚIUNI CONCRETE'}</span></div><ol className="advice-list">{advice.map((item,index)=><li key={index}><span>{String(index+1).padStart(2,'0')}</span><p>{item}</p></li>)}</ol><p className="muted tiny">{language==='en'?'Note: these are rule-based suggestions, not a personalized professional assessment.':'Notă: acestea sunt recomandări bazate pe reguli și cuvinte-cheie, nu o evaluare profesională personalizată.'}</p></article>
        </>;
      }
      case 'Business & money':
        return <>{header('Business & money',descriptions[activeSection])}<div className="stats"><article className="card"><label>VENIT LUNAR ESTIMAT</label><strong>{(language === 'en' ? income / 5 : income).toLocaleString(language === 'en' ? 'en-IE' : 'ro-RO',{maximumFractionDigits:0})} <small>{language === 'en'?'EUR':'RON'}</small></strong><p>{language==='en'?'Target: €1,000':'Țintă: 5.000 RON'}</p><input aria-label="Venit lunar" type="range" min="0" max="10000" step="100" value={income} onChange={e=>setIncome(Number(e.target.value))}/></article><article className="card"><label>CLIENȚI ACTIVI</label><strong>{clients}</strong><p>Țintă: 11 clienți</p><input aria-label="Clienți activi" type="range" min="0" max="20" value={clients} onChange={e=>setClients(Number(e.target.value))}/></article></div><article className="card"><h2>Priorități pentru business</h2>{['Contactează potențiali clienți','Publică un clip educativ','Revino la lead-urile existente','Verifică progresul clienților'].map((h)=><label className={`task ${habits[h]?'done':''}`} key={h}><input type="checkbox" checked={!!habits[h]} onChange={()=>toggleHabit(h)}/><span><b>{h}</b></span></label>)}</article></>;
      case 'Clients':
        return <>{header('Clienții mei','Ține evidența pachetelor și marchează fiecare ședință încheiată.')}
          <article className="card"><h2>Adaugă un client</h2><p className="muted">Alege pachetul cumpărat. Fiecare ședință bifată scade automat din sold.</p><div className="content-grid" style={{gridTemplateColumns:'minmax(0,1fr) 160px',marginTop:14,marginBottom:0}}><input className="email" aria-label="Numele clientului" placeholder="Numele clientului" value={newClientName} onChange={e=>setNewClientName(e.target.value)}/><select className="email" aria-label="Pachet de ședințe" value={newClientPackage} onChange={e=>setNewClientPackage(Number(e.target.value) as 8|12|16)}><option value={16}>16 ședințe</option><option value={12}>12 ședințe</option><option value={8}>8 ședințe</option></select></div><button className="primary" onClick={addClient}>+ Adaugă client</button></article>
          <div className="stats" style={{marginTop:14}}><article className="card"><label>TOTAL CLIENȚI</label><strong>{clientsList.length}</strong></article><article className="card"><label>ȘEDINȚE RĂMASE</label><strong>{clientsList.reduce((sum,c)=>sum+c.remaining,0)}</strong></article><article className="card"><label>ȘEDINȚE EFECTUATE</label><strong>{clientsList.reduce((sum,c)=>sum+c.sessions.length,0)}</strong></article><article className="card"><label>PACHETE EPUIZATE</label><strong>{clientsList.filter(c=>c.remaining===0).length}</strong></article></div>
          {clientsList.length ? <div className="content-grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))'}}>{clientsList.map(client=><article className="card" key={client.id}><div className="card-head"><div><h2>{client.name}</h2><p>Pachet inițial: {client.packageSize} ședințe</p></div><button className="secondary" onClick={()=>removeClient(client.id)} aria-label={'Șterge clientul '+client.name}>Șterge</button></div><div className="area-label"><span>Ședințe rămase</span><b>{client.remaining} / {client.packageSize}</b></div><div className="bar"><i style={{width:(client.remaining/client.packageSize*100)+'%'}}/></div><button className="primary" disabled={client.remaining===0} onClick={()=>completeSession(client.id)}>{client.remaining===0?'Pachet finalizat':'✓ Marchează ședința ca efectuată'}</button><p className="muted">{client.sessions.length} ședințe efectuate înregistrate</p>{client.sessions.length>0 && <details><summary>Istoric ședințe</summary><div className="milestones">{[...client.sessions].reverse().map((session,index)=><span key={client.id+'-'+index}>{session.date}</span>)}</div></details>}</article>)}</div> : <article className="card" style={{marginTop:14}}><h2>Lista ta de clienți va apărea aici</h2><p className="muted">Adaugă primul client, selectează 8, 12 sau 16 ședințe și apoi marchează fiecare ședință după antrenament.</p></article>}
          <p className="muted">Lista și istoricul sunt salvate în browserul acestui dispozitiv. Pentru acces de pe alte dispozitive, trebuie configurată sincronizarea prin cont.</p></>;
      case 'Health & performance': {
        const hText = (ro: string, en: string) => language === 'en' ? en : ro;
        const totals = todayHealth.meals.reduce((sum, m) => ({ calories:sum.calories+m.calories, protein:sum.protein+m.protein, carbs:sum.carbs+m.carbs, fat:sum.fat+m.fat }), {calories:0,protein:0,carbs:0,fat:0});
        const weekKeys = Array.from({length:7}, (_,i) => { const d=new Date(); d.setDate(d.getDate()-i); return localDateKey(d); });
        const recentWorkouts = weekKeys.reduce((sum,key)=>sum+(healthLogs[key]?.workouts.length||0),0);
        const sleepHours = todayHealth.sleep?.hours;
        const sleepAdvice = sleepHours === undefined ? hText('Introdu durata somnului pentru recomandări mai potrivite.','Enter your sleep duration for tailored recommendations.') : sleepHours < 6 ? hText('Ai înregistrat sub 6 ore. Prioritizează o noapte mai lungă și redu intensitatea dacă ești obosit.','You logged under 6 hours. Prioritize a longer night and reduce intensity if tired.') : sleepHours < 7 ? hText('Somnul este sub intervalul recomandat pentru majoritatea adulților. Încearcă să adaugi 30–60 de minute.','Sleep is below the range recommended for most adults. Try adding 30–60 minutes.') : sleepHours <= 9 ? hText('Durata este în general potrivită. Păstrează ore de culcare și trezire constante.','This duration is generally suitable. Keep bedtime and wake time consistent.') : hText('Peste 9 ore poate fi normal după efort sau deficit de somn. Dacă nevoia persistă ori te trezești epuizat, discută cu un medic.','Over 9 hours can be normal after hard training or sleep debt. If it persists or you wake exhausted, speak with a clinician.');
        const nutritionAdvice = totals.calories === 0 ? hText('Adaugă mesele și valorile de pe etichete sau dintr-o sursă de încredere. Estimările sunt orientative.','Log meals using labels or a reliable food database. Estimates are approximate.') : totals.protein < 100 ? hText('Ai înregistrat sub 100 g proteine. Verifică dacă ai introdus toate mesele și include o sursă de proteine la mesele principale.','You logged under 100 g protein. Check that all meals are entered and include protein in main meals.') : hText('Compară totalul cu obiectivul tău și urmărește media pe mai multe zile, nu o singură zi.','Compare totals with your personal target and track the multi-day average, not just one day.');
        const tabs = [{id:'workout',ro:'Antrenament',en:'Workout'},{id:'nutrition',ro:'Mese & apă',en:'Meals & water'},{id:'recovery',ro:'Recuperare',en:'Recovery'},{id:'sleep',ro:'Somn',en:'Sleep'}] as const;
        return <>{header('Health & performance',descriptions[activeSection])}
          <div className="health-summary-grid">
            <article className="card health-stat"><label>{hText('ANTRENAMENTE AZI','WORKOUTS TODAY')}</label><strong>{todayHealth.workouts.length}</strong><p>{hText('În ultimele 7 zile:','Last 7 days:')} {recentWorkouts}</p></article>
            <article className="card health-stat"><label>{hText('CALORII ÎNREGISTRATE','CALORIES LOGGED')}</label><strong>{Math.round(totals.calories).toLocaleString()} <small>kcal</small></strong><p>{Math.round(totals.protein)} g {hText('proteine','protein')}</p></article>
            <article className="card health-stat"><label>{hText('APĂ','WATER')}</label><strong>{todayHealth.waterLiters.toFixed(2)} <small>L</small></strong><p>{hText('înregistrat azi','logged today')}</p></article>
            <article className="card health-stat"><label>{hText('SOMN','SLEEP')}</label><strong>{sleepHours === undefined ? '—' : sleepHours.toLocaleString()} <small>h</small></strong><p>{hText('durata introdusă manual','manually logged duration')}</p></article>
          </div>
          <div className="health-tabs" role="tablist" aria-label={hText('Jurnal sănătate','Health log')}>{tabs.map(tab=><button key={tab.id} role="tab" aria-selected={healthTab===tab.id} className={healthTab===tab.id?'active':''} onClick={()=>setHealthTab(tab.id)}>{hText(tab.ro,tab.en)}</button>)}</div>
          {healthTab === 'workout' && <div className="health-layout">
            <article className="card"><div className="card-head"><div><h2>{hText('Înregistrează antrenamentul','Log a workout')}</h2><p>{hText('Salvează exercițiile și urmărește progresul în timp.','Save exercises and track progress over time.')}</p></div></div>
              <label className="health-field">{hText('Tip de antrenament','Workout type')}<select className="email" value={workoutForm.category} onChange={e=>setWorkoutForm({...workoutForm,category:e.target.value})}><option value="Strength">{hText('Forță / sală','Strength / gym')}</option><option value="Cardio">Cardio</option><option value="Zone 2">Zone 2</option><option value="Mobility">{hText('Mobilitate','Mobility')}</option><option value="Sport">Sport</option></select></label>
              <label className="health-field">{hText('Caută sau alege exercițiul','Search or choose exercise')}<input className="email" list="life-os-exercise-options" placeholder={hText('Ex. Back squat, Pull-ups, Bench press…','E.g. Back squat, Pull-ups, Bench press…')} value={workoutForm.exercise} onChange={e=>setWorkoutForm({...workoutForm,exercise:e.target.value})}/><datalist id="life-os-exercise-options">{exerciseCatalog.map(exercise=><option key={exercise} value={exercise}/>)}</datalist><small className="muted">{hText('Lista include exerciții de forță, cardio și mobilitate. Poți scrie și un exercițiu personalizat.','Includes strength, cardio and mobility exercises. You can also type a custom exercise.')}</small></label>
              <div className="health-form-grid"></label>
              <div className="health-form-grid"><label className="health-field">{hText('Seturi','Sets')}<input className="email" type="number" min="0" value={workoutForm.sets} onChange={e=>setWorkoutForm({...workoutForm,sets:e.target.value})}/></label><label className="health-field">{hText('Repetări','Reps')}<input className="email" type="number" min="0" value={workoutForm.reps} onChange={e=>setWorkoutForm({...workoutForm,reps:e.target.value})}/></label><label className="health-field">{hText('Greutate (kg)','Weight (kg)')}<input className="email" type="number" min="0" step="0.5" value={workoutForm.weight} onChange={e=>setWorkoutForm({...workoutForm,weight:e.target.value})}/></label><label className="health-field">{hText('Durată (min)','Duration (min)')}<input className="email" type="number" min="0" value={workoutForm.duration} onChange={e=>setWorkoutForm({...workoutForm,duration:e.target.value})}/></label></div>
              <label className="health-field">{hText('Note / cum te-ai simțit','Notes / how you felt')}<textarea className="email" rows={2} placeholder={hText('Energie, efort perceput, dureri...','Energy, effort, discomfort...')} value={workoutForm.notes} onChange={e=>setWorkoutForm({...workoutForm,notes:e.target.value})}/></label><button className="primary" onClick={addHealthWorkout}>{hText('+ Salvează antrenamentul','+ Save workout')}</button>
              <div className="health-advice"><b>{hText('Recomandări pentru antrenament','Workout guidance')}</b><p>{todayHealth.workouts.length===0 ? hText('Alege sesiunea în funcție de plan și energie. Notează exercițiile, seturile, repetările și greutatea pentru a compara următoarea sesiune.','Choose a session based on your plan and energy. Log exercises, sets, reps and load to compare next time.') : hText('Ai înregistrat deja antrenament azi. Hidratează-te, mănâncă suficient și nu adăuga volum doar ca să faci mai mult.','You have already logged a workout today. Hydrate, eat enough, and do not add volume just to do more.')}</p></div>
            </article>
            <article className="card"><h2>{hText('Antrenamentele de azi','Today’s workouts')}</h2>{todayHealth.workouts.length===0 ? <p className="muted">{hText('Încă nu ai adăugat un antrenament pentru azi.','No workout logged today yet.')}</p> : <div className="health-log-list">{todayHealth.workouts.map(w=><div className="health-log-item" key={w.id}><div><b>{w.exercise}</b><small>{w.category} · {w.sets} {hText('seturi','sets')} × {w.reps} · {w.weight ? w.weight+' kg · ' : ''}{w.duration} min</small>{w.notes && <p>{w.notes}</p>}</div><button className="secondary" onClick={()=>updateTodayHealth({workouts:todayHealth.workouts.filter(item=>item.id!==w.id)})}>{hText('Șterge','Delete')}</button></div>)}</div>}
              <div className="health-advice"><b>{hText('Cum urmărești progresul','How to track progress')}</b><p>{hText('Compară aceeași mișcare de la o săptămână la alta. Progresul poate însemna o repetare în plus, tehnică mai bună sau același efort simțit mai ușor — nu doar greutate mai mare.','Compare the same movement week to week. Progress can mean one extra rep, better technique, or the same work feeling easier—not only more weight.')}</p></div>
            </article>
          </div>}
          {healthTab === 'nutrition' && <div className="health-layout">
            <article className="card"><h2>{hText('Adaugă o masă sau un aliment','Add a meal or food')}</h2><p className="muted">{hText('Caută în baza de date cu alimente uzuale. Selectează un aliment și schimbă gramajul; valorile se calculează automat pentru porția introdusă.','Search the common-food database. Select a food and change the grams; nutrition values update automatically for your portion.')}</p>
              <label className="health-field">{hText('Caută aliment','Search food')}<input className="email" list="life-os-food-options" placeholder={hText('Ex. Ovăz, piept de pui, banană…','E.g. Oats, chicken breast, banana…')} value={mealForm.name} onChange={e=>selectFood(e.target.value)}/><datalist id="life-os-food-options">{foodCatalog.map(food=><option key={food.name} value={food.name}/>)}</datalist></label>
              <label className="health-field">{hText('Cantitate (grame)','Amount (grams)')}<input className="email" type="number" min="1" max="5000" step="1" value={mealForm.grams} onChange={e=>changeFoodGrams(e.target.value)}/></label>
              <div className="health-form-grid"><label className="health-field">{hText('Calorii (kcal)','Calories (kcal)')}<input className="email" type="number" min="0" placeholder="0" value={mealForm.calories} onChange={e=>setMealForm({...mealForm,calories:e.target.value})}/></label><label className="health-field">{hText('Proteine (g)','Protein (g)')}<input className="email" type="number" min="0" placeholder="0" value={mealForm.protein} onChange={e=>setMealForm({...mealForm,protein:e.target.value})}/></label><label className="health-field">{hText('Carbohidrați (g)','Carbs (g)')}<input className="email" type="number" min="0" placeholder="0" value={mealForm.carbs} onChange={e=>setMealForm({...mealForm,carbs:e.target.value})}/></label><label className="health-field">{hText('Grăsimi (g)','Fat (g)')}<input className="email" type="number" min="0" placeholder="0" value={mealForm.fat} onChange={e=>setMealForm({...mealForm,fat:e.target.value})}/></label></div><button className="primary" onClick={addHealthMeal}>{hText('+ Adaugă în jurnal','+ Add to log')}</button>
              <div className="health-advice"><b>{hText('Recomandare nutriție','Nutrition guidance')}</b><p>{nutritionAdvice}</p><p>{hText('Țintele de calorii și macronutrienți trebuie adaptate obiectivului, greutății, activității și contextului medical. Valorile introduse manual pot fi inexacte.','Calorie and macro targets should fit your goal, body size, activity and medical context. Manually entered values may be inaccurate.')}</p></div>
            </article>
            <article className="card"><h2>{hText('Totalul zilei','Daily totals')}</h2><div className="health-nutrient-grid"><div><span>kcal</span><b>{Math.round(totals.calories)}</b></div><div><span>{hText('Proteine','Protein')}</span><b>{Math.round(totals.protein)} g</b></div><div><span>{hText('Carbohidrați','Carbs')}</span><b>{Math.round(totals.carbs)} g</b></div><div><span>{hText('Grăsimi','Fat')}</span><b>{Math.round(totals.fat)} g</b></div></div>
              <div className="health-water"><div><h3>{hText('Hidratare','Hydration')}</h3><strong>{todayHealth.waterLiters.toFixed(2)} L</strong></div><div className="water-quick-add"><button className="secondary" onClick={()=>updateTodayHealth({waterLiters:Math.round((todayHealth.waterLiters+0.25)*100)/100})}>+250 ml</button><button className="secondary" onClick={()=>updateTodayHealth({waterLiters:Math.round((todayHealth.waterLiters+0.5)*100)/100})}>+500 ml</button><button className="secondary" onClick={()=>updateTodayHealth({waterLiters:Math.round((todayHealth.waterLiters+1)*100)/100})}>+1 L</button></div><label className="health-field">{hText('Altă cantitate (litri)','Custom amount (litres)')}<input className="email" type="number" min="0.05" max="5" step="0.05" value={waterInput} onChange={e=>setWaterInput(e.target.value)}/></label><button className="secondary" onClick={()=>updateTodayHealth({waterLiters:Math.round((todayHealth.waterLiters+Math.max(0,Number(waterInput)||0))*100)/100})}>{hText('+ Înregistrează cantitatea','+ Log amount')}</button></div>
              <div className="health-log-list">{todayHealth.meals.map(m=><div className="health-log-item" key={m.id}><div><b>{m.name}</b><small>{m.calories} kcal · P {m.protein} g · C {m.carbs} g · G {m.fat} g</small></div><button className="secondary" onClick={()=>updateTodayHealth({meals:todayHealth.meals.filter(item=>item.id!==m.id)})}>{hText('Șterge','Delete')}</button></div>)}</div>
            </article>
          </div>}
          {healthTab === 'recovery' && <div className="health-layout">
            <article className="card"><h2>{hText('Plan de recuperare','Recovery plan')}</h2><p className="muted">{hText('Alege intervențiile potrivite pentru energia și efortul de azi. Recuperarea nu trebuie să devină încă un antrenament greu.','Choose activities that fit today’s energy and training load. Recovery should not become another hard workout.')}</p>
              {[{ro:'Cardio ușor în zona 2 — 20–40 min',en:'Easy Zone 2 cardio — 20–40 min',dr:'Ritm la care poți vorbi în propoziții. Redu durata sau sari peste sesiune dacă ești epuizat, bolnav ori amețit.',de:'A pace where you can speak in full sentences. Reduce duration or skip if exhausted, ill, or dizzy.'},{ro:'Stretching blând — 5–10 min',en:'Gentle stretching — 5–10 min',dr:'Respiră normal, fără balans și fără durere; nu forța amplitudinea.',de:'Breathe normally, avoid bouncing and pain; do not force range.'},{ro:'Plimbare relaxată — 10–20 min',en:'Easy walk — 10–20 min',dr:'Mișcare lejeră pentru a te dezmorți, fără să urmărești pace sau calorii.',de:'Gentle movement without chasing pace or calories.'},{ro:'Hidratare și masă completă',en:'Hydration and a balanced meal',dr:'Bea regulat după sete și include proteine, carbohidrați și alimente variate.',de:'Drink to thirst and include protein, carbohydrates and varied foods.'}].map(t=><div className="recovery-tip" key={t.ro}><label className="task"><input type="checkbox" checked={todayHealth.recoveryDone.includes(t.ro)} onChange={()=>toggleRecoveryTip(t.ro)}/><span><b>{hText(t.ro,t.en)}</b><small>{hText(t.dr,t.de)}</small></span></label></div>)}
              <div className="health-advice"><b>{hText('Regulă de siguranță','Safety rule')}</b><p>{hText('Dacă ai durere neobișnuită, amețeală, greață, slăbiciune pronunțată sau simptome care se agravează, oprește efortul. Nu face cardio ca obligație când ai nevoie de odihnă; cere sfat medical pentru simptome persistente sau severe.','If you have unusual pain, dizziness, nausea, marked weakness, or worsening symptoms, stop exercising. Do not force cardio when you need rest; seek medical advice for persistent or severe symptoms.')}</p></div>
            </article>
            <article className="card"><h2>{hText('Recomandări după activitatea recentă','Guidance based on recent activity')}</h2><p className="muted">{recentWorkouts===0 ? hText('Nu ai înregistrat antrenamente în ultimele 7 zile. Dacă revii după o pauză, începe ușor și crește treptat.','No workouts logged in the last 7 days. If returning after a break, start easy and build gradually.') : recentWorkouts>=6 ? hText('Ai înregistrat multe sesiuni în ultimele 7 zile. Verifică dacă ai suficient somn și energie; nu crește volumul automat.','You logged many sessions in the last 7 days. Check sleep and energy; do not automatically increase volume.') : hText('Păstrează alternanța dintre efort și recuperare. Folosește energia, somnul și performanța ca semnale, nu doar calendarul.','Balance training and recovery. Use energy, sleep and performance as signals, not just the calendar.')}</p></article>
          </div>}
          {healthTab === 'sleep' && <div className="health-layout">
            <article className="card"><h2>{hText('Înregistrează somnul','Log sleep')}</h2><p className="muted">{hText('Introdu manual durata și orele de culcare/trezire. Somnul nu este măsurat automat în această versiune.','Manually enter duration and bedtime/wake time. Sleep is not measured automatically in this version.')}</p>
              <div className="health-form-grid"><label className="health-field">{hText('Ore dormite','Hours slept')}<input className="email" type="number" min="0" max="24" step="0.25" value={sleepForm.hours} onChange={e=>setSleepForm({...sleepForm,hours:e.target.value})}/></label><label className="health-field">{hText('Calitatea somnului','Sleep quality')}<select className="email" value={sleepForm.quality} onChange={e=>setSleepForm({...sleepForm,quality:e.target.value})}><option value="poor">{hText('Slabă','Poor')}</option><option value="fair">{hText('Acceptabilă','Fair')}</option><option value="good">{hText('Bună','Good')}</option></select></label><label className="health-field">{hText('Ora de culcare','Bedtime')}<input className="email" type="time" value={sleepForm.bedtime} onChange={e=>setSleepForm({...sleepForm,bedtime:e.target.value})}/></label><label className="health-field">{hText('Ora de trezire','Wake time')}<input className="email" type="time" value={sleepForm.wakeTime} onChange={e=>setSleepForm({...sleepForm,wakeTime:e.target.value})}/></label></div><button className="primary" onClick={saveHealthSleep}>{hText('Salvează somnul de azi','Save today’s sleep')}</button>
              <div className="health-advice"><b>{hText('Sfat în funcție de durata introdusă','Advice based on logged duration')}</b><p>{sleepAdvice}</p><p>{hText('Majoritatea adulților au nevoie de aproximativ 7–9 ore. Contează și calitatea, regularitatea și cum te simți ziua. Dacă rămâi epuizat sau ai probleme persistente, discută cu un profesionist medical.','Most adults need around 7–9 hours. Quality, regularity and daytime functioning matter too. If you remain exhausted or have persistent problems, speak with a healthcare professional.')}</p></div>
            </article>
            <article className="card"><h2>{hText('Ultimele 7 zile','Last 7 days')}</h2><div className="health-log-list">{weekKeys.map(key=>({key,entry:healthLogs[key]?.sleep})).map(({key,entry})=><div className="health-log-item" key={key}><div><b>{key===todayHealthKey?hText('Astăzi','Today'):key}</b><small>{entry ? entry.hours+' h · '+entry.bedtime+' → '+entry.wakeTime+' · '+(language==='en'?entry.quality:entry.quality==='good'?'bună':entry.quality==='fair'?'acceptabilă':'slabă') : hText('Nicio înregistrare','No entry')}</small></div></div>)}</div></article>
          </div>}
          <p className="health-storage-note">{hText('Datele se salvează automat în browserul acestui dispozitiv, nu în cloud. Baza include alimente uzuale cu valori generice per 100 g; produsele de marcă și prepararea pot schimba valorile. Pentru alimente care lipsesc, introdu valorile de pe etichetă.','Data is saved in this device’s browser, not the cloud. The list contains common foods with generic per-100 g values; brands and preparation can change values. For missing foods, enter the nutrition label values.')}</p>
        </>;
      }
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
        return <>{header('Settings & backup',descriptions[activeSection])}<article className="card"><h2>Starea aplicației</h2><p className="muted">Versiune demonstrativă. Taskurile și obiceiurile sunt păstrate local în browserul acestui dispozitiv. Sincronizarea între dispozitive nu este activă până la configurarea Supabase.</p><button className="secondary" onClick={()=>{const backup={tasks,habits,income,clients,goal,dailyFocus,goalSteps,goalPlans,journalEntries,weeklyReviews,clientsList,healthLogs,exportedAt:new Date().toISOString()};const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='life-os-backup.json';a.click();URL.revokeObjectURL(url);}}>Descarcă backup JSON</button><div style={{marginTop:18}}><h2>Autentificare prin email</h2><input className="email" type="email" placeholder="Adresa ta de email" value={email} onChange={e=>setEmail(e.target.value)}/><button className="primary" onClick={signIn}>Trimite link de autentificare</button><p className="status">{status}</p></div></article></>;
      default:
        return <>{header('Construiește-ți următorul nivel.','Nu ai nevoie de încă o listă. Ai nevoie să știi ce contează acum.')}<article className="focus-panel"><div className="focus-kicker"><span className="focus-pulse"/> INTENȚIA ZILEI <span className="focus-date">{new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'ro-RO',{day:'numeric',month:'long'})}</span></div><h2>Care este singurul lucru care ar face ziua de azi un succes?</h2><p>Nu ce e urgent pentru toată lumea. Ce contează cu adevărat pentru tine.</p><input className="focus-input" aria-label="Prioritatea principală a zilei" placeholder="Ex. Vorbesc cu 3 potențiali clienți..." value={dailyFocus} onChange={e=>{setDailyFocus(e.target.value);try{localStorage.setItem(`life-os-focus-${localDateKey()}`,e.target.value);}catch{}}}/><div className="focus-foot"><span>O intenție clară. Următorul pas concret.</span><span className="saved-mark">● Se salvează automat</span></div></article><div className="notice"><b>Principiul LIFE OS:</b> mai puțin zgomot, mai multă intenție. Alege, acționează, revizuiește.</div><div className="stats"><article className="card"><label>VENIT LUNAR</label><strong>{(language === 'en' ? income / 5 : income).toLocaleString(language === 'en' ? 'en-IE' : 'ro-RO',{maximumFractionDigits:0})} <small>{language === 'en'?'EUR':'RON'}</small></strong><p>{language==='en'?'Target: €1,000':'Țintă: 5.000 RON'}</p><input aria-label="Venit lunar" type="range" min="0" max="10000" step="100" value={income} onChange={e=>setIncome(Number(e.target.value))}/></article><article className="card"><label>CLIENȚI ACTIVI</label><strong>{clients}</strong><p>Țintă: 11 clienți</p><input aria-label="Clienți activi" type="range" min="0" max="20" value={clients} onChange={e=>setClients(Number(e.target.value))}/></article><article className="card"><label>PLAN ZILNIC</label><strong>{pct}%</strong><p>{completed} din {tasks.length} activități</p><div className="bar"><i style={{width:`${pct}%`}}/></div></article><article className="card"><label>SPRINT</label><strong>90 <small>zile</small></strong><p>Revizuire în fiecare duminică</p></article></div><div className="content-grid"><article className="card"><div className="card-head"><div><h2>Prioritățile de astăzi</h2><p>Acțiuni care duc la rezultate.</p></div><span className="chip">DAILY EXECUTION</span></div><div className="tasks">{tasks.map(t=><label className={`task ${t.done?'done':''}`} key={t.id}><input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)}/><span><b>{t.title}</b><small>{t.category}</small></span></label>)}</div><button className="secondary" onClick={addTask}>+ Adaugă activitate</button></article><article className="card"><div className="card-head"><div><h2>Roata vieții</h2><p>Scoruri orientative din autoevaluarea ta.</p></div></div>{areas.map(a=><div className="area" key={a.name}><div className="area-label"><span>{a.name}</span><b>{a.score}/10</b></div><div className="bar"><i style={{width:`${a.score*10}%`}}/></div></div>)}</article></div><div className="content-grid lower"><article className="card"><div className="card-head"><div><h2>90-day mission</h2><p>Un rezultat clar, măsurat săptămânal.</p></div></div><h3>{goal}</h3><p className="muted">Ținte inițiale: creșterea venitului de la 3.000 la 5.000 RON și de la 7 la aproximativ 11 clienți, fără să sacrifici sănătatea și relațiile.</p><div className="milestones"><span>01 · Lead-uri</span><span>02 · Conversie</span><span>03 · Retenție</span><span>04 · Venit</span></div></article><article className="card"><div className="card-head"><div><h2>Activează sincronizarea</h2><p>Conectează autentificarea prin email.</p></div></div><input className="email" type="email" placeholder="Adresa ta de email" value={email} onChange={e=>setEmail(e.target.value)}/><button className="primary" onClick={signIn}>Trimite link de autentificare</button><p className="status">{status}</p><p className="muted tiny">Va funcționa după configurarea variabilelor Supabase și a URL-urilor de redirect.</p></article></div></>;
    }
  }
  return <main className="shell">
    <aside className="sidebar"><div className="brand"><div className="logo">L</div><div><b>LIFE OS</b><small>PERSONAL COMMAND CENTER</small></div></div><div className="language-switch" aria-label="Language selector"><span>{language === 'ro' ? 'LIMBĂ' : 'LANGUAGE'}</span><button className={language === 'ro' ? 'selected' : ''} onClick={() => changeLanguage('ro')}>RO</button><button className={language === 'en' ? 'selected' : ''} onClick={() => changeLanguage('en')}>EN</button></div><div className="navlabel">{language === 'ro' ? 'SPAȚIU DE LUCRU' : 'WORKSPACE'}</div><nav>{navItems.map((x,i)=><a href={`#${x.toLowerCase().replaceAll(' ','-')}`} onClick={e=>{e.preventDefault();setActiveSection(x);}} className={activeSection===x?'active':''} key={x}><span>{icons[i]}</span>{(language === 'ro' ? ({'Overview':'Prezentare','Daily planner':'Plan zilnic','90-day goals':'Obiective pe 90 de zile','Business & money':'Business și bani','Clients':'Clienți','Health & performance':'Sănătate și performanță','Relationships':'Relații','Faith & mind':'Credință și minte','Analytics':'Analiză','Settings & backup':'Setări și backup'} as Record<string,string>)[x] : x)}</a>)}</nav><div className="sidebar-note"><small>90-DAY FOCUS</small><b>Grow the coaching business.</b><p>Consistență, nu perfecțiune.</p></div></aside>
    <section className="main">{localizeNode(sectionContent())}<footer>{language === 'ro' ? 'LIFE OS · Creat pentru consecvență, nu perfecțiune.' : 'LIFE OS · Built for consistency, not perfection.'}</footer></section>
  </main>;
}
