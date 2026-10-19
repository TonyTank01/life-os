'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Task = { id: string; title: string; done: boolean; category: string };
type HealthWorkout = { id: string; category: string; exercise: string; sets: string; reps: string; weight: string; duration: string; notes: string; sessionId?: string };
type HealthWorkoutSession = { id: string; category: string; duration: string; averageHeartRate: string; maxHeartRate: string; exerciseCount: number };
type HealthMeal = { id: string; name: string; calories: number; protein: number; carbs: number; fat: number };
type HealthSleep = { hours: number; bedtime: string; wakeTime: string; quality: string };
type HealthDayLog = { workouts: HealthWorkout[]; workoutSessions?: HealthWorkoutSession[]; meals: HealthMeal[]; waterLiters: number; sleep?: HealthSleep; recoveryDone: string[] };
type FoodItem = { name: string; calories: number; protein: number; carbs: number; fat: number };
type MeasurementEntry = { date: string; chest?: number; waist?: number; thigh?: number; arms?: number };
const foodCatalog: FoodItem[] = [
{name:'Ovăz',calories:389,protein:16.9,carbs:66.3,fat:6.9},{name:'Orez alb fiert',calories:130,protein:2.7,carbs:28.2,fat:0.3},{name:'Paste fierte',calories:157,protein:5.8,carbs:30.9,fat:0.9},{name:'Cartofi fierți',calories:87,protein:1.9,carbs:20.1,fat:0.1},{name:'Pâine integrală',calories:247,protein:13,carbs:41,fat:4.2},
{name:'Piept de pui gătit',calories:165,protein:31,carbs:0,fat:3.6},{name:'Piept de pui crud',calories:120,protein:22.5,carbs:0,fat:2.6},{name:'Pulpe de pui gătite',calories:209,protein:26,carbs:0,fat:10.9},{name:'Carne tocată vită 10% grăsime',calories:176,protein:20,carbs:0,fat:10},{name:'Somon gătit',calories:206,protein:22,carbs:0,fat:12.4},{name:'Ton în suc propriu scurs',calories:116,protein:25.5,carbs:0,fat:0.8},{name:'Ou întreg',calories:143,protein:12.6,carbs:0.7,fat:9.5},{name:'Albuș de ou',calories:52,protein:10.9,carbs:0.7,fat:0.2},
{name:'Iaurt grecesc 2%',calories:73,protein:10,carbs:3.9,fat:2},{name:'Iaurt grecesc 10%',calories:133,protein:6.4,carbs:3.9,fat:10},{name:'Skyr simplu',calories:63,protein:11,carbs:4,fat:0.2},{name:'Lapte 1.5%',calories:46,protein:3.4,carbs:4.8,fat:1.5},{name:'Brânză de vaci slabă',calories:98,protein:11.1,carbs:3.4,fat:4.3},{name:'Cașcaval',calories:356,protein:25,carbs:1.5,fat:27},{name:'Mozzarella',calories:280,protein:28,carbs:3.1,fat:17},{name:'Whey protein pudră',calories:400,protein:80,carbs:8,fat:6},
{name:'Banană',calories:89,protein:1.1,carbs:22.8,fat:0.3},{name:'Măr',calories:52,protein:0.3,carbs:13.8,fat:0.2},{name:'Portocală',calories:47,protein:0.9,carbs:11.8,fat:0.1},{name:'Afine',calories:57,protein:0.7,carbs:14.5,fat:0.3},{name:'Căpșuni',calories:32,protein:0.7,carbs:7.7,fat:0.3},{name:'Avocado',calories:160,protein:2,carbs:8.5,fat:14.7},{name:'Roșii',calories:18,protein:0.9,carbs:3.9,fat:0.2},{name:'Castravete',calories:15,protein:0.7,carbs:3.6,fat:0.1},{name:'Broccoli',calories:34,protein:2.8,carbs:6.6,fat:0.4},{name:'Legume mixte',calories:65,protein:3.2,carbs:12,fat:0.5},
{name:'Migdale',calories:579,protein:21.2,carbs:21.6,fat:49.9},{name:'Nuci',calories:654,protein:15.2,carbs:13.7,fat:65.2},{name:'Unt de arahide',calories:588,protein:25,carbs:20,fat:50},{name:'Ulei de măsline',calories:884,protein:0,carbs:0,fat:100},{name:'Fasole fiartă',calories:127,protein:8.7,carbs:22.8,fat:0.5},{name:'Năut fiert',calories:164,protein:8.9,carbs:27.4,fat:2.6},{name:'Linte fiartă',calories:116,protein:9,carbs:20.1,fat:0.4},{name:'Tofu',calories:144,protein:17.3,carbs:2.8,fat:8.7},{name:'Ciocolată neagră 70%',calories:598,protein:7.8,carbs:45.9,fat:42.6},{name:'Miere',calories:304,protein:0.3,carbs:82.4,fat:0},
{name:'Orez brun fiert',calories:123,protein:2.7,carbs:25.6,fat:1},{name:'Quinoa fiartă',calories:120,protein:4.4,carbs:21.3,fat:1.9},{name:'Mămăligă',calories:70,protein:1.5,carbs:15.6,fat:0.3},{name:'Lipie',calories:275,protein:9,carbs:55,fat:2.5},{name:'Covrigi simpli',calories:330,protein:10,carbs:68,fat:2.5},{name:'Fulgi de porumb',calories:357,protein:7.5,carbs:84,fat:0.4},{name:'Granola',calories:471,protein:10,carbs:64,fat:20},{name:'Cartofi dulci copți',calories:90,protein:2,carbs:20.7,fat:0.2},{name:'Curcan gătit',calories:135,protein:29,carbs:0,fat:1.6},{name:'Mușchi de porc gătit',calories:195,protein:29,carbs:0,fat:7},{name:'Mușchi de vită gătit',calories:217,protein:26,carbs:0,fat:12},{name:'Creveți gătiți',calories:99,protein:24,carbs:0.2,fat:0.3},{name:'Cod gătit',calories:105,protein:23,carbs:0,fat:0.9},{name:'Sardine conservă',calories:208,protein:24.6,carbs:0,fat:11.5},{name:'Brânză feta',calories:265,protein:14,carbs:4,fat:21},{name:'Telemea',calories:280,protein:17,carbs:2,fat:22},{name:'Parmezan',calories:431,protein:38,carbs:4.1,fat:29},{name:'Kefir',calories:52,protein:3.5,carbs:4.7,fat:2},{name:'Lapte 3.5%',calories:64,protein:3.3,carbs:4.8,fat:3.5},{name:'Pere',calories:57,protein:0.4,carbs:15.2,fat:0.1},{name:'Struguri',calories:69,protein:0.7,carbs:18.1,fat:0.2},{name:'Kiwi',calories:61,protein:1.1,carbs:14.7,fat:0.5},{name:'Zmeură',calories:52,protein:1.2,carbs:11.9,fat:0.7},{name:'Morcovi',calories:41,protein:0.9,carbs:9.6,fat:0.2},{name:'Spanac',calories:23,protein:2.9,carbs:3.6,fat:0.4},{name:'Ciuperci',calories:22,protein:3.1,carbs:3.3,fat:0.3},{name:'Porumb fiert',calories:96,protein:3.4,carbs:21,fat:1.5},{name:'Mazăre fiartă',calories:84,protein:5.4,carbs:15,fat:0.2},{name:'Edamame',calories:121,protein:12,carbs:9,fat:5.2},{name:'Lapte de soia neîndulcit',calories:33,protein:3.3,carbs:0.7,fat:1.8},{name:'Nuci caju',calories:553,protein:18.2,carbs:30.2,fat:43.9},{name:'Fistic',calories:562,protein:20.2,carbs:27.2,fat:45.3},{name:'Semințe de chia',calories:486,protein:16.5,carbs:42.1,fat:30.7},{name:'Semințe de dovleac',calories:559,protein:30.2,carbs:10.7,fat:49.1},{name:'Tahini',calories:595,protein:17,carbs:21,fat:54},{name:'Maioneză',calories:680,protein:1,carbs:1,fat:75},{name:'Ketchup',calories:112,protein:1.3,carbs:26,fat:0.1}
];
const exerciseCatalog = [
'Back squat','Front squat','Goblet squat','Smith machine squat','Hack squat','Leg press','Bulgarian split squat','Walking lunges','Reverse lunges','Leg extension','Seated leg curl','Lying leg curl','Romanian deadlift','Conventional deadlift','Sumo deadlift','Hip thrust','Glute bridge','Cable kickback','Hip abduction machine','Standing calf raise','Seated calf raise',
'Pull-ups','Chin-ups','Assisted pull-ups','Lat pulldown','Close-grip lat pulldown','Barbell row','Chest-supported row','One-arm dumbbell row','Seated cable row','Straight-arm pulldown','Face pull','Dumbbell shrug','Barbell curl','EZ-bar curl','Dumbbell curl','Hammer curl','Preacher curl','Cable curl',
'Barbell bench press','Incline barbell bench press','Dumbbell bench press','Incline dumbbell press','Machine chest press','Push-ups','Chest dips','Cable chest fly','Pec deck','Overhead press','Dumbbell shoulder press','Arnold press','Dumbbell lateral raise','Cable lateral raise','Reverse pec deck','Rear delt fly','Close-grip bench press','Triceps pushdown','Overhead triceps extension','Skull crushers',
'Plank','Side plank','Hanging leg raise','Lying leg raise','Cable crunch','Ab wheel rollout','Back extension','Treadmill run','Incline treadmill walk','Outdoor run','Walking','Stationary bike','Outdoor cycling','Elliptical','Rowing machine','Swimming','Stair climber','Zone 2 cardio','Jump rope','Hip flexor stretch','Hamstring stretch','Quad stretch','Calf stretch','Thoracic rotation','Cat-cow','Foam rolling','Dumbbell Romanian deadlift','Cable pull-through','Good morning','Step-ups','Nordic hamstring curl','Sissy squat','Pendulum squat','Cable row wide grip','T-bar row','Meadows row','Machine high row','Dumbbell pullover','Incline cable fly','Low-to-high cable fly','High-to-low cable fly','Machine shoulder press','Upright row','Cable external rotation','Wrist curl','Reverse wrist curl','Concentration curl','Bayesian cable curl','Spider curl','Rope hammer curl','Single-arm triceps pushdown','Close-grip push-up','Diamond push-up','Decline push-up','Single-leg Romanian deadlift','Pallof press','Dead bug','Bird dog','Russian twist','Woodchop cable','Farmer carry','Suitcase carry','Sled push','Sled pull','Battle ropes','Assault bike','Spin bike','Ski erg','Easy jog','Tempo run','Intervals running','Hiking','Jumping jacks','Burpees','Box jump','Medicine ball slam','Downward dog','World greatest stretch','Couch stretch','Pigeon stretch','Ankle mobility drill'
];
const splitExerciseCatalog: Record<string, string[]> = {
  'Push': ['Barbell bench press','Incline barbell bench press','Decline barbell bench press','Dumbbell bench press','Incline dumbbell press','Decline dumbbell press','Machine chest press','Smith machine bench press','Push-ups','Weighted push-ups','Chest dips','Weighted chest dips','Cable chest fly','Pec deck','Incline cable fly','Low-to-high cable fly','High-to-low cable fly','Landmine press','Overhead press','Seated barbell shoulder press','Dumbbell shoulder press','Arnold press','Machine shoulder press','Dumbbell lateral raise','Cable lateral raise','Leaning cable lateral raise','Upright row','Reverse pec deck','Rear delt fly','Cable rear delt fly','Close-grip bench press','Triceps pushdown','Rope triceps pushdown','Overhead triceps extension','Dumbbell overhead triceps extension','Skull crushers','Single-arm triceps pushdown','Close-grip push-up','Diamond push-up'],
  'Pull': ['Pull-ups','Weighted pull-ups','Chin-ups','Weighted chin-ups','Assisted pull-ups','Neutral-grip pull-ups','Lat pulldown','Wide-grip lat pulldown','Close-grip lat pulldown','Underhand lat pulldown','Single-arm lat pulldown','Barbell row','Pendlay row','Chest-supported row','One-arm dumbbell row','Kroc row','Seated cable row','Single-arm cable row','Straight-arm pulldown','Face pull','Dumbbell shrug','Barbell shrug','Cable shrug','Cable row wide grip','T-bar row','Meadows row','Machine high row','Machine low row','Inverted row','Dumbbell pullover','Barbell curl','EZ-bar curl','Dumbbell curl','Incline dumbbell curl','Hammer curl','Cross-body hammer curl','Preacher curl','Cable curl','Concentration curl','Bayesian cable curl','Spider curl','Rope hammer curl','Reverse curl','Wrist curl','Reverse wrist curl','Farmer carry'],
  'Legs': ['Back squat','Paused back squat','Front squat','Goblet squat','Smith machine squat','Hack squat','Pendulum squat','Belt squat','Safety bar squat','Leg press','Single-leg leg press','Bulgarian split squat','Walking lunges','Dumbbell walking lunges','Barbell walking lunges','Reverse lunges','Forward lunges','Lateral lunges','Deficit reverse lunges','Step-ups','Weighted step-ups','Leg extension','Single-leg leg extension','Seated leg curl','Lying leg curl','Standing leg curl','Single-leg curl','Romanian deadlift','Dumbbell Romanian deadlift','Conventional deadlift','Sumo deadlift','Stiff-leg deadlift','Good morning','Hip thrust','Barbell hip thrust','Glute bridge','Cable kickback','Hip abduction machine','Hip adduction machine','Cable pull-through','Back extension','Single-leg Romanian deadlift','Nordic hamstring curl','Glute-ham raise','Sissy squat','Standing calf raise','Seated calf raise','Leg press calf raise','Donkey calf raise','Single-leg calf raise','Tibialis raise'],
  'Upper': ['Barbell bench press','Incline barbell bench press','Dumbbell bench press','Incline dumbbell press','Machine chest press','Push-ups','Chest dips','Cable chest fly','Pec deck','Overhead press','Dumbbell shoulder press','Arnold press','Dumbbell lateral raise','Cable lateral raise','Pull-ups','Chin-ups','Lat pulldown','Barbell row','Chest-supported row','One-arm dumbbell row','Seated cable row','Face pull','Dumbbell shrug','Barbell curl','EZ-bar curl','Dumbbell curl','Hammer curl','Triceps pushdown','Overhead triceps extension'],
  'Lower': ['Back squat','Front squat','Goblet squat','Smith machine squat','Hack squat','Leg press','Bulgarian split squat','Walking lunges','Reverse lunges','Leg extension','Seated leg curl','Lying leg curl','Romanian deadlift','Conventional deadlift','Hip thrust','Glute bridge','Cable kickback','Hip abduction machine','Standing calf raise','Seated calf raise','Step-ups','Nordic hamstring curl','Pendulum squat','Single-leg Romanian deadlift'],
  'Full Body': exerciseCatalog,
  'Arnold — Piept & spate': ['Barbell bench press','Incline barbell bench press','Dumbbell bench press','Incline dumbbell press','Machine chest press','Cable chest fly','Pec deck','Incline cable fly','Low-to-high cable fly','High-to-low cable fly','Pull-ups','Chin-ups','Lat pulldown','Barbell row','Chest-supported row','One-arm dumbbell row','Seated cable row','T-bar row','Machine high row','Dumbbell pullover'],
  'Arnold — Umeri & brațe': ['Overhead press','Dumbbell shoulder press','Arnold press','Machine shoulder press','Dumbbell lateral raise','Cable lateral raise','Reverse pec deck','Rear delt fly','Upright row','Barbell curl','EZ-bar curl','Dumbbell curl','Hammer curl','Preacher curl','Cable curl','Concentration curl','Bayesian cable curl','Spider curl','Triceps pushdown','Overhead triceps extension','Skull crushers','Single-arm triceps pushdown'],
  'Bro split — Piept': ['Barbell bench press','Incline barbell bench press','Dumbbell bench press','Incline dumbbell press','Machine chest press','Push-ups','Chest dips','Cable chest fly','Pec deck','Incline cable fly','Low-to-high cable fly','High-to-low cable fly'],
  'Bro split — Spate': ['Pull-ups','Chin-ups','Lat pulldown','Close-grip lat pulldown','Barbell row','Chest-supported row','One-arm dumbbell row','Seated cable row','Straight-arm pulldown','Cable row wide grip','T-bar row','Meadows row','Machine high row','Dumbbell pullover'],
  'Bro split — Umeri': ['Overhead press','Dumbbell shoulder press','Arnold press','Machine shoulder press','Dumbbell lateral raise','Cable lateral raise','Reverse pec deck','Rear delt fly','Upright row','Cable external rotation','Dumbbell shrug'],
  'Bro split — Brațe': ['Barbell curl','EZ-bar curl','Dumbbell curl','Hammer curl','Preacher curl','Cable curl','Concentration curl','Bayesian cable curl','Spider curl','Rope hammer curl','Close-grip bench press','Triceps pushdown','Overhead triceps extension','Skull crushers','Single-arm triceps pushdown','Close-grip push-up','Diamond push-up','Wrist curl','Reverse wrist curl'],
  'Bro split — Picioare': ['Back squat','Front squat','Goblet squat','Smith machine squat','Hack squat','Leg press','Bulgarian split squat','Walking lunges','Reverse lunges','Leg extension','Seated leg curl','Lying leg curl','Romanian deadlift','Conventional deadlift','Hip thrust','Glute bridge','Cable kickback','Hip abduction machine','Standing calf raise','Seated calf raise','Step-ups','Nordic hamstring curl','Pendulum squat']
};
const romanianExerciseNames: Record<string,string> = {
'Back squat':'Genuflexiuni cu bara pe spate','Paused back squat':'Genuflexiuni cu bara cu pauză','Front squat':'Genuflexiuni frontale','Goblet squat':'Genuflexiuni tip goblet','Smith machine squat':'Genuflexiuni la Smith','Hack squat':'Genuflexiuni la hack squat','Pendulum squat':'Genuflexiuni la pendulum','Belt squat':'Genuflexiuni cu centură','Safety bar squat':'Genuflexiuni cu bara de siguranță','Leg press':'Presa pentru picioare','Single-leg leg press':'Presa pentru picioare unilaterală','Bulgarian split squat':'Genuflexiuni bulgărești','Walking lunges':'Fandări din mers','Dumbbell walking lunges':'Fandări din mers cu gantere','Barbell walking lunges':'Fandări din mers cu bara','Reverse lunges':'Fandări înapoi','Forward lunges':'Fandări înainte','Lateral lunges':'Fandări laterale','Deficit reverse lunges':'Fandări înapoi de pe platformă','Step-ups':'Urcări pe bancă','Weighted step-ups':'Urcări pe bancă cu greutăți','Leg extension':'Extensii pentru cvadricepși','Single-leg leg extension':'Extensii pentru cvadricepși, unilateral','Seated leg curl':'Flexii pentru femurali din șezut','Lying leg curl':'Flexii pentru femurali din culcat','Standing leg curl':'Flexii pentru femurali din picioare','Single-leg curl':'Flexii pentru femurali, unilateral','Romanian deadlift':'Îndreptări românești','Dumbbell Romanian deadlift':'Îndreptări românești cu gantere','Conventional deadlift':'Îndreptări clasice','Sumo deadlift':'Îndreptări sumo','Stiff-leg deadlift':'Îndreptări cu picioarele aproape întinse','Good morning':'Aplecări cu bara (good morning)','Hip thrust':'Împingeri de șold','Barbell hip thrust':'Împingeri de șold cu bara','Glute bridge':'Podul fesier','Cable kickback':'Extensii pentru fesieri la cablu','Hip abduction machine':'Abducții de șold la aparat','Hip adduction machine':'Adducții de șold la aparat','Cable pull-through':'Extensii de șold la cablu','Back extension':'Extensii pentru spate','Single-leg Romanian deadlift':'Îndreptări românești pe un picior','Nordic hamstring curl':'Flexii nordice pentru femurali','Glute-ham raise':'Ridicări pentru femurali și fesieri','Sissy squat':'Genuflexiuni sissy','Standing calf raise':'Ridicări pe vârfuri din picioare','Seated calf raise':'Ridicări pe vârfuri din șezut','Leg press calf raise':'Ridicări pe vârfuri la presa pentru picioare','Donkey calf raise':'Ridicări pe vârfuri aplecat','Single-leg calf raise':'Ridicări pe vârfuri pe un picior','Tibialis raise':'Ridicări pentru tibial anterior',
'Barbell bench press':'Împins cu bara din culcat','Incline barbell bench press':'Împins înclinat cu bara','Decline barbell bench press':'Împins declinat cu bara','Dumbbell bench press':'Împins cu gantere din culcat','Incline dumbbell press':'Împins înclinat cu gantere','Decline dumbbell press':'Împins declinat cu gantere','Machine chest press':'Împins la aparat pentru piept','Smith machine bench press':'Împins la Smith din culcat','Push-ups':'Flotări','Weighted push-ups':'Flotări cu greutate','Chest dips':'Dips pentru piept','Weighted chest dips':'Dips pentru piept cu greutate','Cable chest fly':'Fluturări la cabluri','Pec deck':'Fluturări la aparat','Incline cable fly':'Fluturări la cabluri pe bancă înclinată','Low-to-high cable fly':'Fluturări la cabluri de jos în sus','High-to-low cable fly':'Fluturări la cabluri de sus în jos','Landmine press':'Împins la landmine','Overhead press':'Împins deasupra capului','Seated barbell shoulder press':'Împins cu bara pentru umeri din șezut','Dumbbell shoulder press':'Împins cu gantere pentru umeri','Arnold press':'Împins Arnold','Machine shoulder press':'Împins pentru umeri la aparat','Dumbbell lateral raise':'Ridicări laterale cu gantere','Cable lateral raise':'Ridicări laterale la cablu','Leaning cable lateral raise':'Ridicări laterale la cablu cu înclinare','Upright row':'Ramat vertical','Reverse pec deck':'Fluturări inverse la aparat','Rear delt fly':'Fluturări pentru deltoidul posterior','Cable rear delt fly':'Fluturări pentru deltoidul posterior la cablu','Close-grip bench press':'Împins cu priză îngustă','Triceps pushdown':'Extensii pentru triceps la scripete','Rope triceps pushdown':'Extensii pentru triceps cu frânghia','Overhead triceps extension':'Extensii pentru triceps deasupra capului','Dumbbell overhead triceps extension':'Extensii pentru triceps cu gantera deasupra capului','Skull crushers':'Extensii pentru triceps din culcat','Single-arm triceps pushdown':'Extensii pentru triceps la cablu, cu un braț','Close-grip push-up':'Flotări cu priză îngustă','Diamond push-up':'Flotări diamant',
'Pull-ups':'Tracțiuni','Weighted pull-ups':'Tracțiuni cu greutate','Chin-ups':'Tracțiuni cu priză supinată','Weighted chin-ups':'Tracțiuni cu priză supinată și greutate','Assisted pull-ups':'Tracțiuni asistate','Neutral-grip pull-ups':'Tracțiuni cu priză neutră','Lat pulldown':'Tracțiuni la helcometru','Wide-grip lat pulldown':'Tracțiuni la helcometru cu priză largă','Close-grip lat pulldown':'Tracțiuni la helcometru cu priză îngustă','Underhand lat pulldown':'Tracțiuni la helcometru cu priză supinată','Single-arm lat pulldown':'Tracțiuni la helcometru cu un braț','Barbell row':'Ramat cu bara','Pendlay row':'Ramat Pendlay','Chest-supported row':'Ramat cu pieptul sprijinit','One-arm dumbbell row':'Ramat cu gantera, cu un braț','Kroc row':'Ramat Kroc','Seated cable row':'Ramat la cablu din șezut','Single-arm cable row':'Ramat la cablu cu un braț','Straight-arm pulldown':'Tracțiuni la scripete cu brațele întinse','Face pull':'Tracțiuni la față cu frânghia','Dumbbell shrug':'Ridicări din umeri cu gantere','Barbell shrug':'Ridicări din umeri cu bara','Cable shrug':'Ridicări din umeri la cablu','Cable row wide grip':'Ramat la cablu cu priză largă','T-bar row':'Ramat la T-bar','Meadows row':'Ramat Meadows','Machine high row':'Ramat la aparat din unghi înalt','Machine low row':'Ramat la aparat din unghi jos','Inverted row':'Ramat inversat','Dumbbell pullover':'Pullover cu gantera','Barbell curl':'Flexii pentru biceps cu bara','EZ-bar curl':'Flexii pentru biceps cu bara EZ','Dumbbell curl':'Flexii pentru biceps cu gantere','Incline dumbbell curl':'Flexii pentru biceps cu gantere pe bancă înclinată','Hammer curl':'Flexii tip ciocan','Cross-body hammer curl':'Flexii tip ciocan în diagonală','Preacher curl':'Flexii pentru biceps la banca Scott','Cable curl':'Flexii pentru biceps la cablu','Concentration curl':'Flexii concentrate pentru biceps','Bayesian cable curl':'Flexii Bayesian la cablu','Spider curl':'Flexii Spider','Rope hammer curl':'Flexii tip ciocan cu frânghia','Reverse curl':'Flexii inverse','Wrist curl':'Flexii pentru încheietura mâinii','Reverse wrist curl':'Extensii pentru încheietura mâinii','Farmer carry':'Mersul fermierului'
};
function exerciseLabel(exercise: string, language: string) { return language === 'en' ? exercise : (romanianExerciseNames[exercise] || exercise); }

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
  "Principiul DINCA METHOD:": "The DINCA METHOD principle:",
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
  "PERSONAL PERFORMANCE SYSTEM": "CENTRU PERSONAL DE COMANDĂ",
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
  "The DINCA METHOD principle:": "Principiul DINCA METHOD:",
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
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [welcomeGoal, setWelcomeGoal] = useState<'fitness'|'discipline'|'work'|'balance'>('discipline');
  const [welcomeBlocker, setWelcomeBlocker] = useState<'procrastination'|'overwhelmed'|'energy'|'unclear'>('procrastination');
  useEffect(() => { try { if (localStorage.getItem('life-os-onboarding-v1') !== 'done') setWelcomeOpen(true); } catch {} }, []);
  const starterPlans = { fitness: 'Fă 5 minute de mișcare ușoară sau pregătește echipamentul pentru antrenament.', discipline: 'Alege un singur lucru important și lucrează la el doar 2 minute.', work: 'Fă primul pas pentru un rezultat profesional: trimite un mesaj sau deschide documentul de lucru.', balance: 'Alege un lucru mic care îți va face ziua mai bună și începe cu 2 minute.' };
  const welcomeGoalLabels = { fitness: 'Forma fizică', discipline: 'Disciplină', work: 'Carieră și bani', balance: 'Viața per total' };
  const blockerAdvice = { procrastination: 'Nu aștepta să apară cheful. Micșorăm sarcina până devine ușor să începi.', overwhelmed: 'Nu rezolvăm totul acum. Alegem un singur pas și ignorăm restul pentru moment.', energy: 'Azi adaptăm planul la energia ta. Un pas mic sau odihna potrivită valorează mai mult decât forțarea.', unclear: 'Nu trebuie să ai tot planul. Alegem următoarea acțiune, nu toată viața.' };
  function getWelcomeFirstStep() {
    return welcomeBlocker === 'energy' ? 'Adaptează planul la energia ta: fă o plimbare ușoară de 5 minute sau odihnește-te dacă nu te simți bine.' : welcomeBlocker === 'overwhelmed' ? 'Scrie un singur lucru important și fă doar primul pas timp de 2 minute.' : welcomeBlocker === 'unclear' ? 'Scrie ce rezultat vrei și alege o acțiune pe care o poți face în 2 minute.' : starterPlans[welcomeGoal];
  }
  function beginFromWelcome() {
    const firstStep = getWelcomeFirstStep();
    const destination: Record<typeof welcomeGoal, string> = {
      fitness: 'Health & performance',
      discipline: 'Daily planner',
      work: 'Business & money',
      balance: '90-day goals'
    };
    const category = welcomeGoalLabels[welcomeGoal];
    setDailyFocus(firstStep);
    setTasks(previous => [{id:'start-'+localDateKey(),title:'START 2 MIN: '+firstStep,done:false,category},...previous.filter(task=>!task.id.startsWith('start-'))]);
    try {
      localStorage.setItem('life-os-onboarding-v1','done');
      localStorage.setItem('life-os-focus-'+localDateKey(),firstStep);
      localStorage.setItem('life-os-primary-goal',welcomeGoal);
      localStorage.setItem('life-os-primary-blocker',welcomeBlocker);
    } catch {}
    setActiveSection(destination[welcomeGoal]);
    setWelcomeOpen(false);
  }

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
  type WeightEntry = { date: string; weight: number };
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [weightLoaded, setWeightLoaded] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [measurementEntries, setMeasurementEntries] = useState<MeasurementEntry[]>([]);
  const [measurementsLoaded, setMeasurementsLoaded] = useState(false);
  const [measurementForm, setMeasurementForm] = useState({ chest:'', waist:'', thigh:'', arms:'' });
  const [healthJournalDate, setHealthJournalDate] = useState(localDateKey());
  const [waterGoal, setWaterGoal] = useState(2.5);
  const [waterGoalLoaded, setWaterGoalLoaded] = useState(false);
  const [healthTab, setHealthTab] = useState<'workout'|'nutrition'|'recovery'|'sleep'|'goals'|'fasting'|'weight'|'journal'|'supplements'>('goals');
  type FastingTracker = { startedAt: number | null; targetHours: number; lastEndedAt: number | null; lastDurationHours: number | null; completedCount: number };
  const [fastingTracker, setFastingTracker] = useState<FastingTracker>({ startedAt: null, targetHours: 12, lastEndedAt: null, lastDurationHours: null, completedCount: 0 });
  const [fastingLoaded, setFastingLoaded] = useState(false);
  const [fastingNow, setFastingNow] = useState(Date.now());
  type NutritionProfile = { weight: string; height: string; age: string; sex: 'male'|'female'; activity: string; objective: 'gain'|'maintain'|'lose'; proteinFactor: string; fatFactor: string; calorieOverride: string };
  const defaultNutritionProfile: NutritionProfile = { weight: '80', height: '181', age: '25', sex: 'male', activity: '1.55', objective: 'gain', proteinFactor: '2', fatFactor: '0.95', calorieOverride: '' };
  const [nutritionProfile, setNutritionProfile] = useState<NutritionProfile>(defaultNutritionProfile);
  const [nutritionProfileLoaded, setNutritionProfileLoaded] = useState(false);
  const [workoutForm, setWorkoutForm] = useState({category:'Strength', exercise:'', sets:'3', reps:'10', weight:'', duration:'', notes:''});
  const [workoutSplit, setWorkoutSplit] = useState('Push');
  const [pendingWorkoutExercises, setPendingWorkoutExercises] = useState<HealthWorkout[]>([]);
  const [workoutSessionForm, setWorkoutSessionForm] = useState({duration:'', averageHeartRate:'', maxHeartRate:''});
  const [dailyVerdict, setDailyVerdict] = useState<{date:string; score:number; title:string; good:string[]; improve:string[]; tomorrow:string; details:{name:string;score:number;max:number;explanation:string}[]} | null>(null);
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
      const savedFastingTracker = localStorage.getItem('dinca-method-fasting');
      if (savedFastingTracker) setFastingTracker({ startedAt: null, targetHours: 12, lastEndedAt: null, lastDurationHours: null, completedCount: 0, ...JSON.parse(savedFastingTracker) });
      const savedWeights = localStorage.getItem('dinca-method-weight-entries');
      if (savedWeights) setWeightEntries(JSON.parse(savedWeights));
      const savedMeasurements = localStorage.getItem('dinca-method-measurement-entries');
      if (savedMeasurements) setMeasurementEntries(JSON.parse(savedMeasurements));
      setMeasurementsLoaded(true);
      const savedWaterGoal = localStorage.getItem('dinca-method-water-goal');
      if (savedWaterGoal) setWaterGoal(Math.min(6, Math.max(0.5, Number(savedWaterGoal) || 2.5)));
      setWeightLoaded(true);
      setWaterGoalLoaded(true);
      setFastingLoaded(true);
      const savedNutritionProfile = localStorage.getItem('life-os-nutrition-profile');
      if (savedNutritionProfile) setNutritionProfile({ ...defaultNutritionProfile, ...JSON.parse(savedNutritionProfile) });
      setNutritionProfileLoaded(true);
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
  useEffect(() => {
    if (!weightLoaded) return;
    try { localStorage.setItem('dinca-method-weight-entries', JSON.stringify(weightEntries)); } catch {}
  }, [weightEntries, weightLoaded]);
  useEffect(() => {
    if (!measurementsLoaded) return;
    try { localStorage.setItem('dinca-method-measurement-entries', JSON.stringify(measurementEntries)); } catch {}
  }, [measurementEntries, measurementsLoaded]);
  useEffect(() => {
    if (!waterGoalLoaded) return;
    try { localStorage.setItem('dinca-method-water-goal', String(waterGoal)); } catch {}
  }, [waterGoal, waterGoalLoaded]);
  useEffect(() => {
    if (!fastingLoaded) return;
    try { localStorage.setItem('dinca-method-fasting', JSON.stringify(fastingTracker)); } catch {}
  }, [fastingTracker, fastingLoaded]);
  useEffect(() => {
    const timer = setInterval(() => setFastingNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!nutritionProfileLoaded) return;
    try { localStorage.setItem('life-os-nutrition-profile', JSON.stringify(nutritionProfile)); } catch {}
  }, [nutritionProfile, nutritionProfileLoaded]);
  const todayHealthKey = localDateKey();
  const todayHealth: HealthDayLog = healthLogs[todayHealthKey] || { workouts: [], meals: [], waterLiters: 0, recoveryDone: [] };
  function updateTodayHealth(update: Partial<HealthDayLog>) {
    setHealthLogs(previous => {
      const current = previous[todayHealthKey] || { workouts: [], meals: [], waterLiters: 0, recoveryDone: [] };
      return { ...previous, [todayHealthKey]: { ...current, ...update } };
    });
  }
  function addHealthWorkout() {
    if (!workoutForm.exercise.trim()) { alert(language === 'en' ? 'Choose an exercise or type a custom one first.' : 'Alege un exercițiu sau scrie unul personalizat.'); return; }
    const item: HealthWorkout = { ...workoutForm, duration: '', category: workoutSplit, id: `${Date.now()}-${pendingWorkoutExercises.length}` };
    setPendingWorkoutExercises(previous => [...previous, item]);
    setWorkoutForm(previous => ({ ...previous, exercise: '', notes: '' }));
  }
  function saveWorkoutSession() {
    if (!pendingWorkoutExercises.length) { alert(language === 'en' ? 'Add at least one exercise to the session first.' : 'Adaugă cel puțin un exercițiu în sesiune.'); return; }
    const sessionId = `session-${Date.now()}`;
    const session: HealthWorkoutSession = { id: sessionId, category: workoutSplit, duration: workoutSessionForm.duration, averageHeartRate: workoutSessionForm.averageHeartRate, maxHeartRate: workoutSessionForm.maxHeartRate, exerciseCount: pendingWorkoutExercises.length };
    updateTodayHealth({ workouts: [...todayHealth.workouts, ...pendingWorkoutExercises.map((item, index) => ({ ...item, id: `${sessionId}-${index}`, sessionId }))], workoutSessions: [...(todayHealth.workoutSessions || []), session] });
    setPendingWorkoutExercises([]);
    setWorkoutSessionForm({duration:'', averageHeartRate:'', maxHeartRate:''});
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
  function saveWeightEntry() {
    const weight = Number(weightInput);
    if (!Number.isFinite(weight) || weight < 25 || weight > 350) { alert(language === 'en' ? 'Enter a weight between 25 and 350 kg.' : 'Introdu o greutate între 25 și 350 kg.'); return; }
    const today = localDateKey();
    setWeightEntries(previous => [...previous.filter(entry => entry.date !== today), { date: today, weight }].sort((a,b)=>a.date.localeCompare(b.date)));
    setWeightInput('');
  }
  function saveMeasurementEntry() {
    const values = { chest: Number(measurementForm.chest), waist: Number(measurementForm.waist), thigh: Number(measurementForm.thigh), arms: Number(measurementForm.arms) };
    const entry: MeasurementEntry = { date: localDateKey() };
    for (const key of Object.keys(values) as Array<keyof typeof values>) { const raw = measurementForm[key]; if (raw.trim()) { if (!Number.isFinite(values[key]) || values[key] < 5 || values[key] > 250) { alert(language === 'en' ? 'Measurements must be between 5 and 250 cm.' : 'Măsurătorile trebuie să fie între 5 și 250 cm.'); return; } entry[key] = values[key]; } }
    if (Object.keys(entry).length === 1) { alert(language === 'en' ? 'Enter at least one measurement.' : 'Introdu cel puțin o măsurătoare.'); return; }
    setMeasurementEntries(previous => [...previous.filter(item => item.date !== entry.date), entry].sort((a,b)=>a.date.localeCompare(b.date)));
    setMeasurementForm({ chest:'', waist:'', thigh:'', arms:'' });
  }
  function startFasting() {
    if (fastingTracker.startedAt !== null) return;
    setFastingTracker(previous => ({ ...previous, startedAt: Date.now() }));
    setFastingNow(Date.now());
  }
  function endFasting() {
    if (fastingTracker.startedAt === null) return;
    const duration = Math.max(0, (Date.now() - fastingTracker.startedAt) / 3600000);
    setFastingTracker(previous => ({ ...previous, startedAt: null, lastEndedAt: Date.now(), lastDurationHours: duration, completedCount: previous.completedCount + (duration >= previous.targetHours ? 1 : 0) }));
    setFastingNow(Date.now());
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
    return <header className="top"><div><div className="eyebrow">DINCA METHOD / WORKSPACE</div><h1>{title}</h1><p>{subtitle}</p></div><div className="date">{new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'ro-RO',{weekday:'short',day:'numeric',month:'short'})}</div></header>;
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
        const tabs = [{id:'goals',ro:'Obiective nutriționale',en:'Nutrition goals'},{id:'workout',ro:'Antrenament',en:'Workout'},{id:'nutrition',ro:'Mese & apă',en:'Meals & water'},{id:'recovery',ro:'Recuperare',en:'Recovery'},{id:'sleep',ro:'Somn',en:'Sleep'},{id:'fasting',ro:'Fasting',en:'Fasting'},{id:'weight',ro:'Greutate',en:'Weight'},{id:'journal',ro:'Jurnal zilnic',en:'Daily journal'},{id:'supplements',ro:'Suplimente',en:'Supplements'}] as const;
        return <>{header('Health & performance',descriptions[activeSection])}
          <div className="health-summary-grid">
            <article className="card health-stat"><label>{hText('ANTRENAMENTE AZI','WORKOUTS TODAY')}</label><strong>{todayHealth.workoutSessions?.length ?? (todayHealth.workouts.length ? 1 : 0)}</strong><p>{hText('În ultimele 7 zile:','Last 7 days:')} {recentWorkouts}</p></article>
            <article className="card health-stat"><label>{hText('CALORII ÎNREGISTRATE','CALORIES LOGGED')}</label><strong>{Math.round(totals.calories).toLocaleString()} <small>kcal</small></strong><p>{Math.round(totals.protein)} g {hText('proteine','protein')}</p></article>
            <article className="card health-stat"><label>{hText('APĂ','WATER')}</label><strong>{todayHealth.waterLiters.toFixed(2)} <small>L</small></strong><p>{hText('înregistrat azi','logged today')}</p></article>
            <article className="card health-stat"><label>{hText('SOMN','SLEEP')}</label><strong>{sleepHours === undefined ? '—' : sleepHours.toLocaleString()} <small>h</small></strong><p>{hText('durata introdusă manual','manually logged duration')}</p></article>
          </div>
          <div className="health-tabs" role="tablist" aria-label={hText('Jurnal sănătate','Health log')}>{tabs.map(tab=><button key={tab.id} role="tab" aria-selected={healthTab===tab.id} className={healthTab===tab.id?'active':''} onClick={()=>setHealthTab(tab.id)}>{hText(tab.ro,tab.en)}</button>)}</div>
          {healthTab === 'weight' && <div className="health-layout">
            <article className="card"><h2>{hText('Urmărește-ți greutatea','Track your weight')}</h2><p className="muted">{hText('Înregistrează greutatea aproximativ în aceleași condiții, de preferat dimineața. Uită-te la tendința pe mai multe săptămâni, nu la o singură zi.','Log your weight under similar conditions, preferably in the morning. Look at the trend over several weeks, not a single day.')}</p>
              <label className="health-field">{hText('Greutate (kg)','Weight (kg)')}<input className="email" type="number" min="25" max="350" step="0.1" placeholder={hText('Ex. 80.5','e.g. 80.5')} value={weightInput} onChange={e=>setWeightInput(e.target.value)} /></label>
              <button className="primary" onClick={saveWeightEntry}>{hText('Salvează greutatea de azi','Save today’s weight')}</button>
              {weightEntries.length > 0 ? <><div className="health-summary-grid" style={{marginTop:16}}><article className="card health-stat"><label>{hText('ULTIMA GREUTATE','LATEST WEIGHT')}</label><strong>{weightEntries[weightEntries.length-1].weight.toFixed(1)} <small>kg</small></strong><p>{weightEntries[weightEntries.length-1].date}</p></article><article className="card health-stat"><label>{hText('ÎNREGISTRĂRI','ENTRIES')}</label><strong>{weightEntries.length}</strong><p>{hText('zile înregistrate','days logged')}</p></article></div><h3>{hText('Istoric recent','Recent history')}</h3><div className="health-log-list">{[...weightEntries].reverse().slice(0,14).map(entry=><div className="health-log-item" key={entry.date}><div><b>{entry.date===todayHealthKey?hText('Astăzi','Today'):entry.date}</b><small>{entry.weight.toFixed(1)} kg</small></div><button className="secondary" onClick={()=>setWeightEntries(previous=>previous.filter(item=>item.date!==entry.date))}>{hText('Șterge','Delete')}</button></div>)}</div></> : <p className="muted" style={{marginTop:16}}>{hText('Prima înregistrare va apărea aici. Nu este nevoie să te cântărești zilnic dacă nu te ajută.','Your first entry will appear here. You do not need to weigh yourself daily if that is not helpful for you.')}</p>}
            </article>
            <article className="card"><h2>{hText('Măsurători corporale','Body measurements')}</h2><div className="health-form-grid" style={{margin:'14px 0'}}><div className="health-advice"><svg viewBox="0 0 100 90" width="100%" height="88" role="img" aria-label="Bandă de măsurare la nivelul pieptului"><circle cx="50" cy="13" r="9" fill="#64748b"/><path d="M38 25 Q50 20 62 25 L70 52 L62 55 L60 42 L62 80 L52 80 L50 54 L48 80 L38 80 L40 42 L38 55 L30 52 Z" fill="#475569"/><path d="M25 37 Q50 30 75 37" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round"/><path d="M28 33 L28 41 M72 33 L72 41" stroke="#fecaca" strokeWidth="2"/></svg><b>{hText('Piept','Chest')}</b><p className="muted">{hText('Stai drept, relaxează brațele și trece banda în jurul pieptului, pe linia mameloanelor. Banda să fie dreaptă, nu strânsă.','Stand tall, relax your arms and wrap the tape around your chest at nipple level. Keep it level, not tight.')}</p></div><div className="health-advice"><svg viewBox="0 0 100 90" width="100%" height="88" role="img" aria-label="Bandă de măsurare în jurul taliei"><circle cx="50" cy="13" r="9" fill="#64748b"/><path d="M38 25 Q50 20 62 25 L70 52 L62 55 L60 42 L62 80 L52 80 L50 54 L48 80 L38 80 L40 42 L38 55 L30 52 Z" fill="#475569"/><path d="M32 45 Q50 50 68 45" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round"/><path d="M35 41 L35 49 M65 41 L65 49" stroke="#fecaca" strokeWidth="2"/></svg><b>{hText('Talie','Waist')}</b><p className="muted">{hText('Nu trage burta. Măsoară la jumătatea distanței dintre ultima coastă și osul șoldului, după ce expiri normal.','Do not suck in your stomach. Measure halfway between the lowest rib and hip bone after a normal exhale.')}</p></div><div className="health-advice"><svg viewBox="0 0 100 90" width="100%" height="88" role="img" aria-label="Bandă de măsurare în jurul coapsei"><path d="M30 12 L48 12 L48 42 L43 82 L31 82 L34 43 Z M52 12 L70 12 L66 43 L69 82 L57 82 L52 42 Z" fill="#475569"/><path d="M27 47 Q50 42 73 47" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round"/><path d="M30 43 L30 51 M70 43 L70 51" stroke="#fecaca" strokeWidth="2"/></svg><b>{hText('Coapsă','Thigh')}</b><p className="muted">{hText('Măsoară în jurul mijlocului coapsei. Folosește același picior de fiecare dată.','Measure around the middle of your thigh. Use the same leg each time.')}</p></div><div className="health-advice"><svg viewBox="0 0 100 90" width="100%" height="88" role="img" aria-label="Bandă de măsurare în jurul brațului"><circle cx="50" cy="12" r="8" fill="#64748b"/><path d="M40 23 L60 23 L65 35 L73 50 L65 55 L56 39 L58 81 L47 81 L45 51 L42 81 L31 81 L35 39 L26 55 L18 50 L30 35 Z" fill="#475569"/><path d="M28 36 Q38 42 47 36" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round"/><path d="M30 32 L30 40 M45 32 L45 40" stroke="#fecaca" strokeWidth="2"/></svg><b>{hText('Braț','Arm')}</b><p className="muted">{hText('Lasă brațul relaxat pe lângă corp și măsoară la mijlocul dintre umăr și cot.','Keep your arm relaxed by your side and measure halfway between shoulder and elbow.')}</p></div></div><p className="muted">{hText('Măsoară o dată la 2–4 săptămâni, în condiții similare, cu banda orizontală și lipită de piele fără să strângă. Poți salva doar valorile pe care vrei să le urmărești.','Measure every 2–4 weeks under similar conditions, with the tape level and touching the skin without squeezing. Save only the values you want to track.')}</p><div className="health-form-grid"><label className="health-field">{hText('Piept (cm)','Chest (cm)')}<input className="email" type="number" min="5" max="250" step="0.1" value={measurementForm.chest} onChange={e=>setMeasurementForm({...measurementForm,chest:e.target.value})} placeholder="Ex. 102"/></label><label className="health-field">{hText('Stomac / talie (cm)','Stomach / waist (cm)')}<input className="email" type="number" min="5" max="250" step="0.1" value={measurementForm.waist} onChange={e=>setMeasurementForm({...measurementForm,waist:e.target.value})} placeholder="Ex. 82"/></label><label className="health-field">{hText('Coapsă (cm)','Thigh (cm)')}<input className="email" type="number" min="5" max="250" step="0.1" value={measurementForm.thigh} onChange={e=>setMeasurementForm({...measurementForm,thigh:e.target.value})} placeholder="Ex. 58"/></label><label className="health-field">{hText('Braț (cm)','Arm (cm)')}<input className="email" type="number" min="5" max="250" step="0.1" value={measurementForm.arms} onChange={e=>setMeasurementForm({...measurementForm,arms:e.target.value})} placeholder="Ex. 36"/></label></div><button className="primary" onClick={saveMeasurementEntry}>{hText('Salvează măsurătorile','Save measurements')}</button><div className="health-advice"><b>{hText('Unde măsori exact','Where to measure')}</b><ul className="muted" style={{lineHeight:1.8,paddingLeft:20}}><li>{hText('Piept: banda trece orizontal în jurul toracelui, la nivelul mameloanelor; brațele relaxate, după o expirație normală.','Chest: wrap the tape level around the torso at nipple line; arms relaxed, after a normal exhale.')}</li><li>{hText('Stomac/talie: măsoară la jumătatea distanței dintre ultima coastă palpabilă și partea de sus a osului șoldului, după o expirație normală, fără să tragi burta.','Stomach/waist: measure halfway between the lowest palpable rib and the top of the hip bone, after a normal exhale, without sucking in.')}</li><li>{hText('Coapsă: măsoară în jurul coapsei la jumătatea distanței dintre pliul inghinal și partea de sus a rotulei; folosește același picior de fiecare dată.','Thigh: measure around the midpoint between the groin crease and the top of the kneecap; use the same leg each time.')}</li><li>{hText('Braț: brațul relaxat pe lângă corp; banda în jurul mijlocului dintre umăr și cot. Folosește aceeași poziție de fiecare dată.','Arm: keep the arm relaxed at your side; wrap the tape around the midpoint between shoulder and elbow. Use the same position each time.')}</li></ul></div>{measurementEntries.length>0 && <><h3>{hText('Istoric măsurători','Measurement history')}</h3><div className="health-log-list">{[...measurementEntries].reverse().slice(0,12).map(entry=><div className="health-log-item" key={entry.date}><div><b>{entry.date}</b><small>{[entry.chest!==undefined?`${hText('Piept','Chest')} ${entry.chest} cm`:null,entry.waist!==undefined?`${hText('Talie','Waist')} ${entry.waist} cm`:null,entry.thigh!==undefined?`${hText('Coapsă','Thigh')} ${entry.thigh} cm`:null,entry.arms!==undefined?`${hText('Braț','Arm')} ${entry.arms} cm`:null].filter(Boolean).join(' · ')}</small></div><button className="secondary" onClick={()=>setMeasurementEntries(previous=>previous.filter(item=>item.date!==entry.date))}>{hText('Șterge','Delete')}</button></div>)}</div></>}</article><article className="card"><h2>{hText('Cum interpretezi progresul','How to read progress')}</h2><p>{hText('Greutatea fluctuează din cauza apei, digestiei, sării și antrenamentelor. Compară mediile săptămânale și ajustează planul după 2–3 săptămâni, nu după o singură măsurătoare. Circumferințele pot varia și ele; urmărește tendința, nu o valoare izolată.','Weight fluctuates with water, digestion, sodium and training. Compare weekly averages and adjust your plan after 2–3 weeks, not after one reading. Circumferences also vary; track the trend, not one isolated value.')}</p></article>
          </div>}
          {healthTab === 'fasting' && <div className="health-layout">
            <article className="card">
              <span className="eyebrow">DINCA METHOD · FASTING</span>
              <h2>{hText('Tracker de fasting','Fasting tracker')}</h2>
              <p className="muted">{hText('Urmărește o fereastră de post alimentară simplă, fără extreme. Alege o țintă realistă și oprește postul dacă te simți rău.','Track a simple eating fast without extremes. Choose a realistic target and stop if you feel unwell.')}</p>
              <label className="health-field">{hText('Ținta ta','Your target')}<select className="email" value={fastingTracker.targetHours} disabled={fastingTracker.startedAt !== null} onChange={e=>setFastingTracker(previous=>({...previous,targetHours:Number(e.target.value)}))}><option value={12}>12 {hText('ore','hours')}</option><option value={14}>14 {hText('ore','hours')}</option><option value={16}>16 {hText('ore','hours')}</option><option value={24}>24 {hText('ore — o zi','hours — one day')}</option><option value={36}>36 {hText('ore','hours')}</option><option value={48}>48 {hText('ore — 2 zile','hours — 2 days')}</option><option value={72}>72 {hText('ore — 3 zile','hours — 3 days')}</option><option value={168}>168 {hText('ore — 7 zile','hours — 7 days')}</option></select></label>
              <label className="health-field">{hText('Sau setează o țintă personalizată (ore)','Or set a custom target (hours)')}<input className="email" type="number" min="1" max="168" step="1" disabled={fastingTracker.startedAt !== null} value={fastingTracker.targetHours} onChange={e=>setFastingTracker(previous=>({...previous,targetHours:Math.min(168,Math.max(1,Number(e.target.value)||1))}))}/><small className="muted">{hText('Țintele de 24+ ore sunt posturi prelungite și nu sunt recomandări medicale. Nu încerca 3 sau 7 zile fără supraveghere medicală. Pentru majoritatea oamenilor, începe cu 12–16 ore sau discută cu un clinician.','Fasts of 24+ hours are prolonged fasts, not medical recommendations. Do not attempt 3 or 7 days without medical supervision. For most people, start with 12–16 hours or consult a clinician.')}</small></label>
              <div style={{margin:'22px 0',padding:22,borderRadius:16,border:'1px solid #374151',background:'#0b1220',textAlign:'center'}}>
                <small className="eyebrow">{fastingTracker.startedAt !== null ? hText('POST ÎN DESFĂȘURARE','FAST IN PROGRESS') : hText('DURATA ULTIMULUI POST','LAST FAST DURATION')}</small>
                <div style={{fontSize:38,fontWeight:800,letterSpacing:1,margin:'8px 0'}}>{fastingTracker.startedAt !== null ? `${Math.floor((fastingNow-fastingTracker.startedAt)/3600000)}h ${String(Math.floor(((fastingNow-fastingTracker.startedAt)%3600000)/60000)).padStart(2,'0')}m` : fastingTracker.lastDurationHours !== null ? `${fastingTracker.lastDurationHours.toFixed(1)} h` : '—'}</div>
                {fastingTracker.startedAt !== null && <p className="muted">{Math.min(100,Math.round(((fastingNow-fastingTracker.startedAt)/3600000/fastingTracker.targetHours)*100))}% {hText('din ținta aleasă','of selected target')}</p>}
                {fastingTracker.startedAt !== null && <div className="bar"><i style={{width:`${Math.min(100,Math.max(0,((fastingNow-fastingTracker.startedAt)/3600000/fastingTracker.targetHours)*100))}%`}}/></div>}
              </div>
              {fastingTracker.startedAt === null ? <button className="primary" onClick={startFasting}>{hText('Începe postul acum','Start fast now')}</button> : <button className="primary" onClick={endFasting}>{hText('Încheie postul','End fast')}</button>}
              <div className="stats" style={{marginTop:18}}><article className="card"><label>{hText('POSTURI CU ȚINTA ATINSĂ','TARGETS REACHED')}</label><strong>{fastingTracker.completedCount}</strong></article><article className="card"><label>{hText('ȚINTĂ CURENTĂ','CURRENT TARGET')}</label><strong>{fastingTracker.targetHours} <small>h</small></strong></article></div>
            </article>
            <article className="card"><h2>{hText('Reguli de bun-simț','Safety first')}</h2><ul className="muted" style={{lineHeight:1.8,paddingLeft:20}}><li>{hText('Începe cu 12 ore; nu este nevoie să urmărești postul de 16 ore dacă nu ți se potrivește.','Start with 12 hours; you do not need to pursue 16 hours if it does not suit you.')}</li><li>{hText('Hidratează-te și nu folosi fasting-ul ca pedeapsă pentru ce ai mâncat.','Stay hydrated and never use fasting as punishment for what you ate.')}</li><li>{hText('Sarea celtică și cea roz de Himalaya sunt în principal clorură de sodiu, nu un amestec complet de electroliți. Nu adăuga sare în apă în mod automat; prea mult sodiu poate fi dăunător. Pentru post prelungit, medicamente sau probleme de sănătate, cere sfatul unui clinician.','Celtic and pink Himalayan salt are mostly sodium chloride, not a complete electrolyte mix. Do not automatically add salt to water; too much sodium can be harmful. For prolonged fasting, medications or health conditions, ask a clinician.')}</li><li>{hText('Încheie postul dacă apar amețeală, tremur, slăbiciune sau greață.','End the fast if you develop dizziness, shaking, weakness or nausea.')}</li><li>{hText('Cere sfatul medicului înainte de fasting dacă ai diabet, istoric de tulburări alimentare, iei medicamente influențate de mese sau ai o afecțiune relevantă.','Ask a clinician before fasting if you have diabetes, a history of eating disorders, medications affected by meals, or a relevant medical condition.')}</li></ul><p className="muted">{hText('Tracker-ul salvează datele local în acest browser. Nu este un instrument medical și nu sincronizează încă datele între dispozitive.','The tracker saves data locally in this browser. It is not a medical tool and does not yet sync across devices.')}</p></article>
          </div>}
          {healthTab === 'goals' && <div className="health-layout">
            <article className="card">
              <h2>{hText('Calculator de calorii și macronutrienți','Calorie and macro calculator')}</h2>
              <p className="muted">{hText('Introdu datele tale și alege obiectivul. Estimarea folosește formula Mifflin–St Jeor și nivelul de activitate; urmărește media greutății 2–3 săptămâni și ajustează în funcție de rezultate.','Enter your details and choose a goal. The estimate uses the Mifflin–St Jeor equation and activity level; track average weight for 2–3 weeks and adjust based on results.')}</p>
              <div className="health-form-grid">
                <label className="health-field">{hText('Greutate (kg)','Weight (kg)')}<input className="email" type="number" min="30" max="350" step="0.1" value={nutritionProfile.weight} onChange={e=>setNutritionProfile({...nutritionProfile,weight:e.target.value,calorieOverride:''})}/></label>
                <label className="health-field">{hText('Înălțime (cm)','Height (cm)')}<input className="email" type="number" min="100" max="250" value={nutritionProfile.height} onChange={e=>setNutritionProfile({...nutritionProfile,height:e.target.value,calorieOverride:''})}/></label>
                <label className="health-field">{hText('Vârstă','Age')}<input className="email" type="number" min="18" max="100" value={nutritionProfile.age} onChange={e=>setNutritionProfile({...nutritionProfile,age:e.target.value,calorieOverride:''})}/></label>
                <label className="health-field">{hText('Formula metabolică','Metabolic equation')}<select className="email" value={nutritionProfile.sex} onChange={e=>setNutritionProfile({...nutritionProfile,sex:e.target.value as 'male'|'female',calorieOverride:''})}><option value="male">{hText('Bărbat','Male')}</option><option value="female">{hText('Femeie','Female')}</option></select></label>
                <label className="health-field">{hText('Nivel de activitate','Activity level')}<select className="email" value={nutritionProfile.activity} onChange={e=>setNutritionProfile({...nutritionProfile,activity:e.target.value,calorieOverride:''})}><option value="1.2">{hText('Sedentar — puțină mișcare','Sedentary — little exercise')}</option><option value="1.375">{hText('Ușor activ — 1–3 zile/săptămână','Lightly active — 1–3 days/week')}</option><option value="1.55">{hText('Moderat activ — 3–5 zile/săptămână','Moderately active — 3–5 days/week')}</option><option value="1.725">{hText('Foarte activ — 6–7 zile/săptămână','Very active — 6–7 days/week')}</option><option value="1.9">{hText('Activitate foarte ridicată / muncă fizică','Extra active / physical job')}</option></select></label>
                <label className="health-field">{hText('Obiectiv','Goal')}<select className="email" value={nutritionProfile.objective} onChange={e=>setNutritionProfile({...nutritionProfile,objective:e.target.value as 'gain'|'maintain'|'lose',calorieOverride:''})}><option value="gain">{hText('Masă musculară','Muscle gain')}</option><option value="maintain">{hText('Menținere','Maintenance')}</option><option value="lose">{hText('Scădere în greutate','Fat loss')}</option></select></label>
                <label className="health-field">{hText('Proteine (g/kg)','Protein (g/kg)')}<select className="email" value={nutritionProfile.proteinFactor} onChange={e=>setNutritionProfile({...nutritionProfile,proteinFactor:e.target.value})}><option value="1.6">1,6 g/kg</option><option value="1.7">1,7 g/kg</option><option value="1.8">1,8 g/kg</option><option value="1.9">1,9 g/kg</option><option value="2">2,0 g/kg</option><option value="2.1">2,1 g/kg</option><option value="2.2">2,2 g/kg</option></select></label>
                <label className="health-field">{hText('Grăsimi (g/kg)','Fat (g/kg)')}<select className="email" value={nutritionProfile.fatFactor} onChange={e=>setNutritionProfile({...nutritionProfile,fatFactor:e.target.value})}><option value="0.9">0,9 g/kg</option><option value="0.95">0,95 g/kg</option><option value="1">1,0 g/kg</option></select></label>
              </div>
              {(() => {
                const weight = Number(nutritionProfile.weight);
                const height = Number(nutritionProfile.height);
                const age = Number(nutritionProfile.age);
                const valid = weight > 0 && height > 0 && age >= 18;
                const bmr = valid ? 10*weight + 6.25*height - 5*age + (nutritionProfile.sex === 'male' ? 5 : -161) : 0;
                const maintenance = Math.round(bmr * Number(nutritionProfile.activity));
                const calories = Math.max(0, Math.round(Number(nutritionProfile.calorieOverride) > 0 ? Number(nutritionProfile.calorieOverride) : maintenance + (nutritionProfile.objective === 'gain' ? 300 : nutritionProfile.objective === 'lose' ? -400 : 0)));
                const protein = Math.round(weight * Number(nutritionProfile.proteinFactor));
                const fat = Math.round(weight * Number(nutritionProfile.fatFactor));
                const carbs = Math.max(0, Math.round((calories - protein*4 - fat*9) / 4));
                return <>{valid ? <><div className="health-summary-grid" style={{marginTop:18}}>
                  <article className="card health-stat"><label>{hText('MENȚINERE ESTIMATĂ','ESTIMATED MAINTENANCE')}</label><strong>{maintenance.toLocaleString()} <small>kcal</small></strong><p>{hText('estimare, nu măsurare directă','estimate, not a direct measurement')}</p></article>
                  <article className="card health-stat"><label>{hText('ȚINTĂ ZILNICĂ','DAILY TARGET')}</label><strong>{calories.toLocaleString()} <small>kcal</small></strong><p>{hText(nutritionProfile.objective==='gain'?'Surplus estimat +300 kcal':nutritionProfile.objective==='lose'?'Deficit estimat −400 kcal':'Menținere estimată',nutritionProfile.objective==='gain'?'Estimated +300 kcal surplus':nutritionProfile.objective==='lose'?'Estimated −400 kcal deficit':'Estimated maintenance')}</p></article>
                </div>
                <div className="health-form-grid" style={{marginTop:12}}>
                  <article className="card health-stat"><label>{hText('PROTEINE','PROTEIN')}</label><strong>{protein} <small>g</small></strong><p>{nutritionProfile.proteinFactor} g/kg · {protein*4} kcal</p></article>
                  <article className="card health-stat"><label>{hText('GRĂSIMI','FAT')}</label><strong>{fat} <small>g</small></strong><p>{nutritionProfile.fatFactor} g/kg · {fat*9} kcal</p></article>
                  <article className="card health-stat"><label>{hText('CARBOHIDRAȚI','CARBS')}</label><strong>{carbs} <small>g</small></strong><p>{hText('caloriile rămase','remaining calories')} · {carbs*4} kcal</p></article>
                </div>
                <label className="health-field" style={{marginTop:16}}>{hText('Calorii personalizate (opțional)','Custom calories (optional)')}<input className="email" type="number" min="1" max="10000" placeholder={String(calories)} value={nutritionProfile.calorieOverride} onChange={e=>setNutritionProfile({...nutritionProfile,calorieOverride:e.target.value})}/><small className="muted">{hText('Lasă gol pentru calculul automat. Exemplu: pentru 3.200 kcal, 180 g proteine și 80 g grăsimi rezultă 440 g carbohidrați.','Leave blank for automatic calculation. Example: at 3,200 kcal, 180 g protein and 80 g fat, carbs are 440 g.')}</small></label>
                <div className="health-advice"><b>{hText('Cum sunt calculate valorile','How values are calculated')}</b><p>{hText('Proteine: 1,6–2,2 g/kg. Grăsimi: 0,9–1 g/kg. Carbohidrații acoperă caloriile rămase. Pentru masă folosim un surplus inițial de 300 kcal, pentru slăbire un deficit de 400 kcal, iar pentru menținere nicio ajustare. Caloriile sunt un punct de pornire și trebuie ajustate după evoluția reală.','Protein: 1.6–2.2 g/kg. Fat: 0.9–1 g/kg. Carbs fill the remaining calories. Muscle gain starts with a 300 kcal surplus, fat loss with a 400 kcal deficit, and maintenance with no adjustment. Calories are a starting point and should be adjusted based on actual progress.')}</p></div>
                </> : <p className="muted">{hText('Introdu greutate, înălțime și vârstă valide pentru calcul.','Enter valid weight, height and age to calculate targets.')}</p>}</>;
              })()}
            </article>
            <article className="card"><h2>{hText('Ținta versus consumul de azi','Today’s target vs intake')}</h2><p className="muted">{hText('Compară mesele înregistrate cu obiectivul calculat. Valorile se actualizează pe măsură ce adaugi alimente în fila „Mese & apă”.','Compare logged meals with the calculated target. Values update as you add food in the “Meals & water” tab.')}</p>
              {(() => {
                const totals = todayHealth.meals.reduce((sum,m)=>({calories:sum.calories+m.calories,protein:sum.protein+m.protein,carbs:sum.carbs+m.carbs,fat:sum.fat+m.fat}),{calories:0,protein:0,carbs:0,fat:0});
                const weight=Number(nutritionProfile.weight), height=Number(nutritionProfile.height), age=Number(nutritionProfile.age);
                const valid=weight>0&&height>0&&age>=18;
                const maintenance=valid?Math.round((10*weight+6.25*height-5*age+(nutritionProfile.sex==='male'?5:-161))*Number(nutritionProfile.activity)):0;
                const calories=Math.max(0,Math.round(Number(nutritionProfile.calorieOverride)>0?Number(nutritionProfile.calorieOverride):maintenance+(nutritionProfile.objective==='gain'?300:nutritionProfile.objective==='lose'?-400:0)));
                const protein=Math.round(weight*Number(nutritionProfile.proteinFactor)), fat=Math.round(weight*Number(nutritionProfile.fatFactor)), carbs=Math.max(0,Math.round((calories-protein*4-fat*9)/4));
                const row=(label:string, current:number, target:number, unit:string) => <div className="area" key={label}><div className="area-label"><span>{label}</span><b>{Math.round(current)} / {target} {unit}</b></div><div className="bar"><i style={{width:`${target>0?Math.min(100,current/target*100):0}%`}}/></div></div>;
                return valid ? <>{row(hText('Calorii','Calories'),totals.calories,calories,'kcal')}{row(hText('Proteine','Protein'),totals.protein,protein,'g')}{row(hText('Grăsimi','Fat'),totals.fat,fat,'g')}{row(hText('Carbohidrați','Carbs'),totals.carbs,carbs,'g')}<p className="muted">{hText('Progres orientativ pe baza alimentelor înregistrate. Nu trebuie să nimerești fiecare gram perfect în fiecare zi.','Indicative progress based on logged food. You do not need to hit every gram perfectly every day.')}</p></> : null;
              })()}
            </article>
          </div>}
          {healthTab === 'workout' && <div className="health-layout">
            <article className="card"><div className="card-head"><div><h2>{hText('Înregistrează antrenamentul','Log a workout')}</h2><p>{hText('Salvează exercițiile și urmărește progresul în timp.','Save exercises and track progress over time.')}</p></div></div>
              <label className="health-field">{hText('Tip de antrenament','Workout type')}<select className="email" value={workoutForm.category} onChange={e=>setWorkoutForm({...workoutForm,category:e.target.value})}><option value="Strength">{hText('Forță / sală','Strength / gym')}</option><option value="Cardio">Cardio</option><option value="Zone 2">Zone 2</option><option value="Mobility">{hText('Mobilitate','Mobility')}</option><option value="Sport">Sport</option></select></label>
              <label className="health-field">{hText('Split / grupă de antrenament','Workout split / muscle group')}<select className="email" value={workoutSplit} onChange={e=>{setWorkoutSplit(e.target.value);setWorkoutForm(previous=>({...previous,exercise:''}));}}><option value="Push">Push — {hText('piept, umeri, triceps','chest, shoulders, triceps')}</option><option value="Pull">Pull — {hText('spate, biceps, trapez','back, biceps, traps')}</option><option value="Legs">Legs — {hText('tot trenul inferior','full lower body')}</option><option value="Upper">Upper — {hText('tot trenul superior','full upper body')}</option><option value="Lower">Lower — {hText('tot trenul inferior','full lower body')}</option><option value="Full Body">Full Body — {hText('tot corpul','whole body')}</option><option value="Arnold — Piept & spate">Arnold split — {hText('piept și spate','chest and back')}</option><option value="Arnold — Umeri & brațe">Arnold split — {hText('umeri și brațe','shoulders and arms')}</option><option value="Bro split — Piept">Bro split — {hText('piept','chest')}</option><option value="Bro split — Spate">Bro split — {hText('spate','back')}</option><option value="Bro split — Umeri">Bro split — {hText('umeri','shoulders')}</option><option value="Bro split — Brațe">Bro split — {hText('brațe','arms')}</option><option value="Bro split — Picioare">Bro split — {hText('picioare','legs')}</option></select><small className="muted">{hText('Alege split-ul, apoi vei vedea exercițiile potrivite. Poți adăuga exercițiile unul câte unul și să notezi seturile, repetările și greutatea fiecăruia.','Choose a split to filter the exercise list. Add exercises one by one and record sets, reps and weight for each.')}</small></label>
              <label className="health-field">{hText('Alege sau caută exercițiul','Choose or search exercise')}<input className="email" list="life-os-exercise-options" placeholder={hText('Ex. Genuflexiuni cu bara, fandări, gambe…','E.g. Barbell squat, lunges, calf raises…')} value={workoutForm.exercise} onChange={e=>setWorkoutForm({...workoutForm,exercise:e.target.value})}/><datalist id="life-os-exercise-options">{(splitExerciseCatalog[workoutSplit] || exerciseCatalog).map(exercise=><option key={exercise} value={exerciseLabel(exercise,language)}/>)}</datalist><small className="muted">{hText('Poți adăuga câte exerciții vrei în aceeași sesiune. Fiecare păstrează separat seturile, repetările și greutatea.','Add as many exercises as you want to the same session. Each keeps its own sets, reps and weight.')}</small></label>
              <div className="health-form-grid"><label className="health-field">{hText('Seturi','Sets')}<input className="email" type="number" min="0" value={workoutForm.sets} onChange={e=>setWorkoutForm({...workoutForm,sets:e.target.value})}/></label><label className="health-field">{hText('Repetări','Reps')}<input className="email" type="number" min="0" value={workoutForm.reps} onChange={e=>setWorkoutForm({...workoutForm,reps:e.target.value})}/></label><label className="health-field">{hText('Greutate (kg)','Weight (kg)')}<input className="email" type="number" min="0" step="0.5" value={workoutForm.weight} onChange={e=>setWorkoutForm({...workoutForm,weight:e.target.value})}/></label></div>
              <div className="health-advice" style={{marginTop:12}}><b>{hText('Detalii pentru întreaga sesiune','Whole-session details')}</b><div className="health-form-grid"><label className="health-field">{hText('Durata antrenamentului (minute)','Workout duration (minutes)')}<input className="email" type="number" min="1" placeholder="60" value={workoutSessionForm.duration} onChange={e=>setWorkoutSessionForm({...workoutSessionForm,duration:e.target.value})}/></label><label className="health-field">{hText('Puls mediu (bpm)','Average heart rate (bpm)')}<input className="email" type="number" min="30" max="240" placeholder="135" value={workoutSessionForm.averageHeartRate} onChange={e=>setWorkoutSessionForm({...workoutSessionForm,averageHeartRate:e.target.value})}/></label><label className="health-field">{hText('Puls maxim (bpm)','Maximum heart rate (bpm)')}<input className="email" type="number" min="30" max="240" placeholder="175" value={workoutSessionForm.maxHeartRate} onChange={e=>setWorkoutSessionForm({...workoutSessionForm,maxHeartRate:e.target.value})}/></label></div><small className="muted">{hText('Poți copia valorile din WHOOP, Garmin sau alt ceas; nu sunt necesare pentru salvare.','You can copy values from WHOOP, Garmin or another watch; these are optional.')}</small></div><label className="health-field">{hText('Note pentru acest exercițiu','Notes for this exercise')}<textarea className="email" rows={2} placeholder={hText('Energie, efort perceput, dureri...','Energy, effort, discomfort...')} value={workoutForm.notes} onChange={e=>setWorkoutForm({...workoutForm,notes:e.target.value})}/></label><button className="secondary" onClick={addHealthWorkout}>{hText('+ Adaugă exercițiul în sesiune','+ Add exercise to session')}</button>
              {pendingWorkoutExercises.length > 0 && <div className="health-advice" style={{marginTop:12}}><b>{hText('Exerciții pregătite','Exercises in this session')} ({pendingWorkoutExercises.length})</b><div className="health-log-list" style={{marginTop:10}}>{pendingWorkoutExercises.map((item,index)=><div className="health-log-item" key={item.id}><div><b>{index+1}. {item.exercise}</b><small>{item.sets} {hText('seturi','sets')} × {item.reps} · {item.weight ? item.weight+' kg' : ''}</small>{item.notes && <small>{item.notes}</small>}</div><button className="secondary" onClick={()=>setPendingWorkoutExercises(previous=>previous.filter(entry=>entry.id!==item.id))}>{hText('Elimină','Remove')}</button></div>)}</div><button className="primary" style={{marginTop:12}} onClick={saveWorkoutSession}>{hText('Salvează sesiunea completă','Save full session')} ({pendingWorkoutExercises.length})</button></div>}
              <div className="health-advice"><b>{hText('Recomandări pentru antrenament','Workout guidance')}</b><p>{todayHealth.workouts.length===0 ? hText('Alege sesiunea în funcție de plan și energie. Notează exercițiile, seturile, repetările și greutatea pentru a compara următoarea sesiune.','Choose a session based on your plan and energy. Log exercises, sets, reps and load to compare next time.') : hText('Ai înregistrat deja antrenament azi. Hidratează-te, mănâncă suficient și nu adăuga volum doar ca să faci mai mult.','You have already logged a workout today. Hydrate, eat enough, and do not add volume just to do more.')}</p></div>
            </article>
            <article className="card"><h2>{hText('Antrenamentele de azi','Today’s workouts')}</h2>{todayHealth.workouts.length===0 ? <p className="muted">{hText('Încă nu ai adăugat un antrenament pentru azi.','No workout logged today yet.')}</p> : <div className="health-log-list">{todayHealth.workouts.map(w=><div className="health-log-item" key={w.id}><div><b>{w.exercise}</b><small>{w.category} · {w.sets} {hText('seturi','sets')} × {w.reps} · {w.weight ? w.weight+' kg' : ''}</small>{w.notes && <p>{w.notes}</p>}</div><button className="secondary" onClick={()=>updateTodayHealth({workouts:todayHealth.workouts.filter(item=>item.id!==w.id)})}>{hText('Șterge','Delete')}</button></div>)}</div>}
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
              <div className="health-water"><div><h3>{hText('Hidratare','Hydration')}</h3><strong>{todayHealth.waterLiters.toFixed(2)} / {waterGoal.toFixed(1)} L</strong><p className="muted">{hText('Ținta ta zilnică','Your daily target')}</p><div className="bar"><i style={{width:`${Math.min(100,todayHealth.waterLiters/waterGoal*100)}%`}}/></div><label className="health-field">{hText('Ajustează ținta (litri)','Adjust target (litres)')}<input className="email" type="number" min="0.5" max="6" step="0.25" value={waterGoal} onChange={e=>setWaterGoal(Math.min(6,Math.max(0.5,Number(e.target.value)||0.5)))}/></label></div><div className="water-quick-add"><button className="secondary" onClick={()=>updateTodayHealth({waterLiters:Math.round((todayHealth.waterLiters+0.25)*100)/100})}>+250 ml</button><button className="secondary" onClick={()=>updateTodayHealth({waterLiters:Math.round((todayHealth.waterLiters+0.5)*100)/100})}>+500 ml</button><button className="secondary" onClick={()=>updateTodayHealth({waterLiters:Math.round((todayHealth.waterLiters+1)*100)/100})}>+1 L</button></div><label className="health-field">{hText('Altă cantitate (litri)','Custom amount (litres)')}<input className="email" type="number" min="0.05" max="5" step="0.05" value={waterInput} onChange={e=>setWaterInput(e.target.value)}/></label><button className="secondary" onClick={()=>updateTodayHealth({waterLiters:Math.round((todayHealth.waterLiters+Math.max(0,Number(waterInput)||0))*100)/100})}>{hText('+ Înregistrează cantitatea','+ Log amount')}</button></div>
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
          {healthTab === 'supplements' && <div className="health-layout">
            <article className="card"><h2>{hText('Ghid de suplimente','Supplement guide')}</h2><p className="muted">{hText('Suplimentele completează alimentația, nu înlocuiesc somnul, mesele sau antrenamentul. Mai jos găsești ce să verifici pe etichetă, când le poți lua și ce merită evitat. Nu este obligatoriu să le iei pe toate.','Supplements complement nutrition; they do not replace sleep, meals or training. Below are label checks, timing and what to avoid. You do not need to take all of them.')}</p>
              <div className="health-advice"><b>{hText('1. Creatină monohidrat','1. Creatine monohydrate')}</b><p><b>{hText('Când: ','When: ')}</b>{hText('oricând în zi, la o oră pe care o poți respecta zilnic. Poți să o iei cu apă sau împreună cu o masă/shake. Momentul exact contează mai puțin decât consecvența.','Any time of day, at a time you can stick to daily. Take with water or alongside a meal/shake. Exact timing matters less than consistency.')}</p><p><b>{hText('Ce să alegi: ','What to choose: ')}</b>{hText('100% creatină monohidrat, ideal cu un singur ingredient și fără amestecuri proprietare. O doză uzuală pentru adulți sănătoși este 3–5 g pe zi; faza de încărcare nu este obligatorie.','100% creatine monohydrate, ideally a single ingredient without proprietary blends. A common dose for healthy adults is 3–5 g daily; loading is not required.')}</p><p>{hText('Poate crește greutatea prin apă reținută în mușchi. Dacă ai boală renală, ești investigat pentru probleme renale sau iei medicamente relevante, discută cu medicul înainte.','It can increase scale weight due to water stored in muscle. If you have kidney disease, are being evaluated for kidney problems or take relevant medication, consult a clinician first.')}</p></div>
              <div className="health-advice"><b>{hText('2. Magneziu bisglicinat','2. Magnesium bisglycinate')}</b><p><b>{hText('Când: ','When: ')}</b>{hText('poate fi luat seara sau înainte de culcare dacă îți este mai comod; nu există o regulă universală că trebuie luat fix înainte de somn și nu este un somnifer. Dacă îți deranjează stomacul, ia-l cu mâncare.','It can be taken in the evening or before bed if convenient; there is no universal rule that it must be taken right before sleep, and it is not a sleeping pill. If it upsets your stomach, take it with food.')}</p><p><b>{hText('Ce să verifici: ','What to check: ')}</b>{hText('eticheta trebuie să indice clar cantitatea de magneziu elementar per porție, nu doar greutatea compusului bisglicinat. Evită dozele mari fără recomandare; excesul din suplimente poate provoca diaree și poate interacționa cu unele antibiotice, levotiroxină și alte medicamente.','The label should clearly state elemental magnesium per serving, not only the weight of the bisglycinate compound. Avoid high doses without guidance; supplemental magnesium can cause diarrhea and interact with some antibiotics, levothyroxine and other medicines.')}</p></div>
              <div className="health-advice"><b>{hText('3. Omega-3','3. Omega-3')}</b><p><b>{hText('Când: ','When: ')}</b>{hText('în timpul unei mese, ideal una care conține grăsimi, pentru toleranță mai bună. Nu există o oră obligatorie.','With a meal, ideally one containing fat, for better tolerance. No specific hour is required.')}</p><p><b>{hText('Ce să verifici: ','What to check: ')}</b>{hText('uită-te la cantitatea de EPA + DHA per doză, nu doar la „1000 mg ulei de pește”. Alege un produs cu doză transparentă, control al contaminanților și testare independentă dacă este disponibilă. Algele pot fi o alternativă pentru DHA/EPA.','Check the amount of EPA + DHA per serving, not just “1000 mg fish oil”. Choose transparent dosing, contaminant controls and independent testing when available. Algae oil can provide DHA/EPA as an alternative.')}</p><p>{hText('Dacă mănânci pește gras regulat, suplimentul poate să nu fie necesar. Dacă iei anticoagulante, ai tulburări de coagulare sau vrei doze mari, discută cu medicul.','If you eat oily fish regularly, a supplement may not be necessary. If you take anticoagulants, have a bleeding disorder or want high doses, consult a clinician.')}</p></div>
              <div className="health-advice"><b>{hText('4. Vitamina D3 + K2 (MK-7)','4. Vitamin D3 + K2 (MK-7)')}</b><p><b>{hText('Când: ','When: ')}</b>{hText('cu o masă care conține grăsimi. Nu trebuie neapărat dimineața sau seara.','With a meal containing fat. It does not have to be morning or evening.')}</p><p><b>{hText('Ce să verifici: ','What to check: ')}</b>{hText('cantitatea de D3 exprimată clar în µg sau UI și cantitatea de K2 MK-7 exprimată în µg. Nu presupune că toată lumea are nevoie de combinație sau de doze mari; ideal, doza de D3 se alege în funcție de alimentație, expunere, factori de risc și, când este indicat, analize/recomandare medicală.','Clearly stated D3 amount in mcg or IU and K2 MK-7 amount in mcg. Do not assume everyone needs the combination or high doses; D3 dosing should reflect diet, sun exposure, risk factors and, when appropriate, lab tests/clinical advice.')}</p><p>{hText('Important: vitamina K poate interacționa serios cu warfarina și anticoagulante similare. Nu le combina fără acordul medicului.','Important: vitamin K can significantly interact with warfarin and similar anticoagulants. Do not combine without medical advice.')}</p></div>
              <div className="health-advice"><b>{hText('5. Whey protein','5. Whey protein')}</b><p><b>{hText('Când: ','When: ')}</b>{hText('oricând îți este practic, de exemplu la micul dejun sau după antrenament. Nu este obligatoriu să o bei imediat după ultima repetare; contează mai ales proteina totală zilnică și alimentația generală.','Whenever practical, for example at breakfast or after training. You do not have to drink it immediately after your last rep; total daily protein and overall diet matter most.')}</p><p><b>{hText('Ce să verifici: ','What to check: ')}</b>{hText('cantitatea reală de proteine per porție, lista scurtă de ingrediente, zaharurile și alergenii. Concentratul whey este de obicei mai ieftin; izolatul poate avea mai puțină lactoză. Alege un produs testat independent când poți și evită „proprietary blends” sau promisiuni de tip miraculos.','Actual protein per serving, a short ingredient list, sugars and allergens. Whey concentrate is usually cheaper; isolate may contain less lactose. Choose independently tested products when possible and avoid proprietary blends or miracle claims.')}</p><p>{hText('Folosește-l doar dacă te ajută să atingi necesarul de proteine din zi. Dacă ai alergie la lapte, whey nu este potrivit; intoleranța la lactoză poate necesita izolat sau o alternativă.','Use it only if it helps meet your daily protein needs. Whey is not suitable for a milk allergy; lactose intolerance may require isolate or an alternative.')}</p></div>
            </article>
            <article className="card"><h2>{hText('Checklist pentru un produs bun','Checklist for a good product')}</h2><ul className="muted" style={{lineHeight:1.8,paddingLeft:20}}><li>{hText('Ingredientul activ și cantitatea per porție sunt scrise clar.','The active ingredient and amount per serving are clearly stated.')}</li><li>{hText('Nu există amestecuri proprietare care ascund dozele.','No proprietary blends hide ingredient amounts.')}</li><li>{hText('Lotul, termenul de valabilitate și producătorul sunt identificabile.','The batch, expiry date and manufacturer are identifiable.')}</li><li>{hText('Caută testare independentă precum NSF Certified for Sport sau Informed Sport, mai ales pentru sport competitiv.','Look for independent testing such as NSF Certified for Sport or Informed Sport, especially for competitive sport.')}</li><li>{hText('Nu cumpăra doar după influencer, aromă, ambalaj sau promisiuni exagerate.','Do not choose based only on influencers, flavour, packaging or exaggerated claims.')}</li></ul><p className="muted">{hText('Precauții: dacă ai afecțiuni renale/hepatice, iei medicamente, ai o intervenție planificată sau simptome inexplicabile, verifică suplimentele cu medicul/farmacistul. Mai multe suplimente nu înseamnă automat rezultate mai bune.','Caution: if you have kidney/liver conditions, take medication, have planned surgery or unexplained symptoms, review supplements with a clinician/pharmacist. More supplements do not automatically mean better results.')}</p><small className="muted">{hText('Ghid informativ, nu recomandare individuală. Referințe: NIH Office of Dietary Supplements — exercițiu și performanță, magneziu și omega-3; NSF — certificarea suplimentelor.','Educational guide, not individualized advice. References: NIH Office of Dietary Supplements — exercise/performance, magnesium and omega-3; NSF — supplement certification.')}</small></article>
          </div>}
          {healthTab === 'journal' && <div className="health-layout">
            {(() => {
              const day: HealthDayLog = healthLogs[healthJournalDate] || { workouts: [], meals: [], waterLiters: 0, recoveryDone: [] };
              const dayTotals = day.meals.reduce((sum,m)=>({calories:sum.calories+m.calories,protein:sum.protein+m.protein,carbs:sum.carbs+m.carbs,fat:sum.fat+m.fat}),{calories:0,protein:0,carbs:0,fat:0});
              const targetWeight=Number(nutritionProfile.weight), targetHeight=Number(nutritionProfile.height), targetAge=Number(nutritionProfile.age);
              const validProfile=targetWeight>0&&targetHeight>0&&targetAge>=18;
              const maintenance=validProfile?Math.round((10*targetWeight+6.25*targetHeight-5*targetAge+(nutritionProfile.sex==='male'?5:-161))*Number(nutritionProfile.activity)):0;
              const calorieTarget=Math.max(0,Math.round(Number(nutritionProfile.calorieOverride)>0?Number(nutritionProfile.calorieOverride):maintenance+(nutritionProfile.objective==='gain'?300:nutritionProfile.objective==='lose'?-400:0)));
              const proteinTarget=Math.round(targetWeight*Number(nutritionProfile.proteinFactor));
              const advice:string[]=[];
              if(!day.sleep) advice.push(hText('Nu ai salvat somnul pentru această zi. Înregistrează-l ca să obții recomandări mai potrivite.','Sleep is not logged for this day. Add it for more relevant guidance.'));
              else if(day.sleep.hours<7) advice.push(hText('Somnul a fost sub 7 ore. Dacă te simți obosit, prioritizează odihna și redu intensitatea antrenamentului.','Sleep was under 7 hours. If tired, prioritize rest and reduce workout intensity.'));
              else if(day.sleep.hours<=9) advice.push(hText('Durata somnului este într-un interval potrivit pentru majoritatea adulților. Păstrează un program regulat.','Sleep duration is within a range suitable for most adults. Keep a regular schedule.'));
              if(day.meals.length===0) advice.push(hText('Nu ai înregistrat alimente. Adaugă tot ce ai mâncat pentru ca totalul nutrițional să fie util.','No food is logged. Add everything you ate so the nutrition total is useful.'));
              else if(validProfile&&dayTotals.calories<calorieTarget*0.75) advice.push(hText('Caloriile înregistrate sunt mult sub ținta estimată. Verifică dacă ai introdus toate mesele; nu trage concluzii dintr-o zi incompletă.','Logged calories are well below the estimated target. Check whether all meals are entered; do not draw conclusions from an incomplete day.'));
              else if(validProfile&&dayTotals.calories>calorieTarget*1.2) advice.push(hText('Ai depășit ținta calorică estimată. O singură zi nu definește progresul; revino mâine la rutina normală, fără compensări extreme.','You exceeded the estimated calorie target. One day does not define progress; return to your normal routine tomorrow without extreme compensation.'));
              if(validProfile&&dayTotals.protein<proteinTarget*0.75) advice.push(hText('Proteinele înregistrate sunt sub ținta calculată. Verifică dacă ai introdus toate mesele și include o sursă de proteine la mesele principale.','Logged protein is below your calculated target. Check all meals are entered and include a protein source at main meals.'));
              if(day.waterLiters<1.5) advice.push(hText('Ai înregistrat mai puțin de 1,5 L de apă. Verifică dacă ai uitat să notezi lichidele și hidratează-te regulat, în funcție de sete și efort.','You logged under 1.5 L of water. Check whether you forgot to log fluids and hydrate regularly according to thirst and activity.'));
              if(day.workouts.length===0) advice.push(hText('Nu apare niciun antrenament înregistrat. O zi de odihnă poate fi potrivită; contează echilibrul pe termen lung.','No workout is logged. A rest day can be appropriate; long-term balance matters.'));
              else if(day.workouts.length>=3) advice.push(hText('Ai înregistrat mai multe sesiuni. Verifică dacă ai timp suficient pentru recuperare și nu forța dacă apar simptome neobișnuite.','You logged several sessions. Check that you have enough recovery time and do not push through unusual symptoms.'));
              if(day.recoveryDone.length>0) advice.push(hText('Ai completat '+day.recoveryDone.length+' activități de recuperare. Bifele sunt salvate pentru această zi.','You completed '+day.recoveryDone.length+' recovery activities. Checkmarks are saved for this day.'));
              if(advice.length===0) advice.push(hText('Nu sunt suficiente date pentru recomandări specifice. Continuă să înregistrezi somnul, mesele, apa și activitatea.','There is not enough data for specific guidance. Keep logging sleep, meals, water and activity.'));
              return <article className="card">
                <h2>{hText('Jurnalul tău zilnic','Your daily journal')}</h2>
                <p className="muted">{hText('Tot ce salvezi în Antrenament, Mese & apă, Recuperare și Somn se adună aici automat, pe zile. Nu trebuie să introduci nimic de două ori.','Everything you save in Workout, Meals & water, Recovery and Sleep is collected here automatically by day. No duplicate entry is needed.')}</p>
                <label className="health-field">{hText('Alege ziua','Choose a day')}<input className="email" type="date" value={healthJournalDate} max={todayHealthKey} onChange={e=>setHealthJournalDate(e.target.value||todayHealthKey)}/></label>
                <div className="health-summary-grid" style={{marginTop:16}}>
                  <article className="card health-stat"><label>{hText('CALORII','CALORIES')}</label><strong>{Math.round(dayTotals.calories)}</strong><p>kcal</p></article>
                  <article className="card health-stat"><label>{hText('PROTEINE','PROTEIN')}</label><strong>{Math.round(dayTotals.protein)} <small>g</small></strong></article>
                  <article className="card health-stat"><label>{hText('APĂ','WATER')}</label><strong>{day.waterLiters.toFixed(2)} <small>L</small></strong></article>
                  <article className="card health-stat"><label>{hText('ANTRENAMENTE','WORKOUTS')}</label><strong>{(day.workoutSessions?.length ?? (day.workouts.length ? 1 : 0))}</strong></article>
                </div>
                <div className="health-advice" style={{marginTop:16}}><b>{hText('Recomandări pentru această zi','Recommendations for this day')}</b><ul className="muted" style={{lineHeight:1.8,paddingLeft:20}}>{advice.map((item,i)=><li key={i}>{item}</li>)}</ul><small className="muted">{hText('Recomandările sunt orientative și folosesc doar datele introduse. Valorile lipsă nu înseamnă automat că nu ai făcut activitatea.','Guidance is informational and uses only entered data. Missing entries do not necessarily mean you did not do the activity.')}</small></div>
                <div className="health-advice" style={{marginTop:16}}><b>{hText('Verdictul zilei','Daily verdict')}</b><p className="muted">{hText('O evaluare structurată a somnului, alimentației, hidratării, mișcării și completitudinii jurnalului. Scorul este orientativ: nu măsoară direct energia și nu înlocuiește felul în care te simți.','A structured review of sleep, nutrition, hydration, movement and journal completeness. The score is indicative: it does not directly measure energy or replace how you feel.')}</p><button className="primary" onClick={() => {
                  const sleepScore = !day.sleep ? 0 : (day.sleep.hours>=7&&day.sleep.hours<=9?25:((day.sleep.hours>=6&&day.sleep.hours<7)||(day.sleep.hours>9&&day.sleep.hours<=10)?18:((day.sleep.hours>=5&&day.sleep.hours<6)||(day.sleep.hours>10&&day.sleep.hours<=11)?10:4)));
                  const caloriesScore = day.meals.length===0 ? 0 : (!validProfile ? 12 : (dayTotals.calories>=calorieTarget*0.9&&dayTotals.calories<=calorieTarget*1.1?20:(dayTotals.calories>=calorieTarget*0.8&&dayTotals.calories<=calorieTarget*1.2?15:9)));
                  const proteinScore = day.meals.length===0 ? 0 : (!validProfile ? 8 : (dayTotals.protein>=proteinTarget*0.9?15:(dayTotals.protein>=proteinTarget*0.75?10:5)));
                  const hydrationScore = day.waterLiters===0 ? 0 : (day.waterLiters>=waterGoal?10:(day.waterLiters>=waterGoal*0.8?7:(day.waterLiters>=waterGoal*0.6?4:2)));
                  const movementScore = day.workouts.length>0 ? 15 : day.recoveryDone.length>0 ? 12 : 7;
                  const loggedItems = [!!day.sleep,day.meals.length>0,day.waterLiters>0,day.workouts.length>0||day.recoveryDone.length>0].filter(Boolean).length;
                  const completenessScore = Math.round(loggedItems/4*15);
                  const details = [
                    {name:hText('Somn','Sleep'),score:sleepScore,max:25,explanation:!day.sleep?hText('Nu ai introdus durata somnului; nu putem evalua recuperarea.','Sleep duration is missing, so recovery cannot be assessed.'):hText('Ai înregistrat '+day.sleep.hours+' ore. Pentru majoritatea adulților, 7–9 ore este un reper util; contează și regularitatea și calitatea.','You logged '+day.sleep.hours+' hours. For most adults, 7–9 hours is a useful guide; consistency and quality matter too.')},
                    {name:hText('Calorii','Calories'),score:caloriesScore,max:20,explanation:!day.meals.length?hText('Nu ai înregistrat mesele. Scorul nu presupune că nu ai mâncat, ci că lipsesc datele.','No meals are logged. This does not assume you did not eat; the data is missing.'):!validProfile?hText('Ai înregistrat '+Math.round(dayTotals.calories)+' kcal, dar nu există o țintă personală validă pentru comparație.','You logged '+Math.round(dayTotals.calories)+' kcal, but there is no valid personal target for comparison.'):hText('Ai înregistrat '+Math.round(dayTotals.calories)+' kcal față de ținta estimată de '+Math.round(calorieTarget)+' kcal.','You logged '+Math.round(dayTotals.calories)+' kcal against an estimated target of '+Math.round(calorieTarget)+' kcal.')},
                    {name:hText('Proteine','Protein'),score:proteinScore,max:15,explanation:!day.meals.length?hText('Înregistrează mesele pentru a evalua aportul de proteine.','Log meals to assess protein intake.'):!validProfile?hText('Ai înregistrat '+Math.round(dayTotals.protein)+' g; completează profilul pentru o țintă personalizată.','You logged '+Math.round(dayTotals.protein)+' g; complete your profile for a personalized target.'):hText('Ai înregistrat '+Math.round(dayTotals.protein)+' g față de ținta estimată de '+Math.round(proteinTarget)+' g.','You logged '+Math.round(dayTotals.protein)+' g against an estimated target of '+Math.round(proteinTarget)+' g.')},
                    {name:hText('Hidratare','Hydration'),score:hydrationScore,max:10,explanation:day.waterLiters===0?hText('Nu ai înregistrat apă; completează cantitatea pentru o evaluare corectă.','No water is logged; enter the amount for a fair assessment.'):hText('Ai înregistrat '+day.waterLiters.toFixed(1)+' L față de reperul tău de '+waterGoal+' L. Necesarul real variază cu efortul, căldura și alimentația.','You logged '+day.waterLiters.toFixed(1)+' L against your '+waterGoal+' L guide. Actual needs vary with exercise, heat and diet.')},
                    {name:hText('Mișcare și recuperare','Movement and recovery'),score:movementScore,max:15,explanation:day.workouts.length>0?hText('Ai înregistrat o sesiune cu '+day.workouts.length+' exerciții. Un jurnal complet ar trebui să înregistreze sesiunea o singură dată.','You logged a session with '+day.workouts.length+' exercises. A complete journal should count the session once.'):day.recoveryDone.length>0?hText('Ai înregistrat activități de recuperare. Acestea pot fi valoroase chiar și fără antrenament.','You logged recovery activities, which can be valuable even without a workout.'):hText('Nu apare antrenament sau recuperare în jurnal. O zi de odihnă poate fi potrivită; notează intenția ca să nu confundăm odihna cu datele lipsă.','No workout or recovery is logged. A rest day can be appropriate; note the intention so rest is not confused with missing data.')},
                    {name:hText('Completitudinea jurnalului','Journal completeness'),score:completenessScore,max:15,explanation:hText('Ai completat '+loggedItems+' din 4 categorii principale: somn, mese, apă și mișcare/recuperare. Un scor mai precis începe cu date consecvente.','You completed '+loggedItems+' of 4 key categories: sleep, meals, water and movement/recovery. More consistent data makes the score more meaningful.')}
                  ];
                  const score = details.reduce((sum,item)=>sum+item.score,0);
                  const good = details.filter(item=>item.score/item.max>=0.8).map(item=>hText(item.name+': punct forte înregistrat.',''+item.name+': a logged strength.'));
                  const improve = details.filter(item=>item.score/item.max<0.6).map(item=>item.name+': '+item.explanation);
                  const title = loggedItems<2 ? hText('Avem nevoie de mai multe date pentru un verdict corect','More data is needed for a fair verdict') : score>=85?hText('Zi foarte bine gestionată','Very well-managed day'):score>=70?hText('Zi bună, cu câteva ajustări posibile','Good day, with a few possible adjustments'):score>=50?hText('Zi mixtă: câteva obiceiuri merită consolidate','Mixed day: some habits need strengthening'):hText('Zi cu priorități clare pentru îmbunătățire','A day with clear areas to improve');
                  const tomorrow = details.filter(item=>item.score/item.max<0.6).sort((a,b)=>a.score/a.max-b.score/b.max)[0]?.name || hText('Păstrează rutina și urmărește consecvența','Keep the routine and focus on consistency');
                  setDailyVerdict({date:healthJournalDate,score,title,good,improve,tomorrow,details});
                }}>{hText('Calculează verdictul zilei','Calculate daily verdict')}</button>
                {dailyVerdict?.date===healthJournalDate && <div style={{marginTop:14}}><h3>{dailyVerdict.score}/100 — {dailyVerdict.title}</h3><p>{dailyVerdict.score>=85?hText('Datele introduse sugerează o zi solidă. Scopul nu este perfecțiunea, ci repetarea obiceiurilor care te ajută și păstrarea unui ritm sustenabil.','Your logged data suggests a solid day. The goal is not perfection, but repeating helpful habits at a sustainable pace.'):dailyVerdict.score>=70?hText('Ai o bază bună. Uită-te la punctele de mai jos și alege o singură schimbare realistă pentru mâine, în loc să încerci să repari totul simultan.','You have a good base. Review the points below and choose one realistic change for tomorrow rather than trying to fix everything at once.'):hText('Nu interpreta scorul ca pe o notă pentru valoarea ta sau ca pe un verdict medical. Verifică întâi dacă ai uitat să introduci date; apoi alege un singur pas util.','Do not treat the score as a grade of your worth or a medical verdict. First check whether you forgot to log data, then choose one useful next step.')}</p><h4>{hText('Analiza pe categorii','Category-by-category review')}</h4><div className="health-log-list">{dailyVerdict.details.map((item,index)=><div className="health-log-item" key={index}><div><b>{item.name} — {item.score}/{item.max}</b><small>{item.explanation}</small></div></div>)}</div><h4>{hText('Ce ai făcut bine','What went well')}</h4><ul className="muted" style={{lineHeight:1.7,paddingLeft:20}}>{(dailyVerdict.good.length?dailyVerdict.good:[hText('Încă nu există suficiente date pentru a confirma puncte forte.','There is not enough data yet to confirm strengths.')]).map((item,index)=><li key={index}>{item}</li>)}</ul><h4>{hText('Ce poți face mai bine','What you could improve')}</h4><ul className="muted" style={{lineHeight:1.7,paddingLeft:20}}>{(dailyVerdict.improve.length?dailyVerdict.improve:[hText('Nu apare o problemă clară în datele introduse. Continuă să urmărești consecvența.','No clear issue stands out in the logged data. Keep tracking consistency.')]).map((item,index)=><li key={index}>{item}</li>)}</ul><p><b>{hText('Prioritatea pentru mâine: ','Tomorrow’s priority: ')}</b>{dailyVerdict.tomorrow}. {hText('Alege un pas concret, de exemplu să pregătești mesele din timp sau să stabilești o oră realistă de culcare.','Choose one concrete action, such as preparing meals ahead or setting a realistic bedtime.')}</p><small className="muted">{hText('Scor orientativ, bazat pe datele introduse, cu ponderi transparente. Nu măsoară direct starea psihică, energia, stresul sau recuperarea fiziologică și nu ar trebui să încurajeze antrenamentul când ești bolnav sau epuizat.','Indicative score based on logged data, with transparent weights. It does not directly measure mood, energy, stress or physiological recovery and should not encourage training when ill or exhausted.')}</small></div>}
                </div>
                <h3>{hText('Rezumatul zilei','Daily summary')}</h3>
                <div className="health-log-list">
                  <div className="health-log-item"><div><b>{hText('Somn','Sleep')}</b><small>{day.sleep ? `${day.sleep.hours} h · ${day.sleep.bedtime} → ${day.sleep.wakeTime} · ${day.sleep.quality}` : hText('Nicio înregistrare','No entry')}</small></div></div>
                  <div className="health-log-item"><div><b>{hText('Mese înregistrate','Meals logged')}</b><small>{day.meals.length ? day.meals.map(m=>m.name).join(' · ') : hText('Nicio masă înregistrată','No meals logged')}</small><small>{Math.round(dayTotals.calories)} kcal · P {Math.round(dayTotals.protein)} g · C {Math.round(dayTotals.carbs)} g · G {Math.round(dayTotals.fat)} g</small></div></div>
                  <div className="health-log-item"><div><b>{hText('Antrenamente','Workouts')}</b>{(day.workoutSessions?.length ? day.workoutSessions : day.workouts.length ? [{id:'legacy-session',category:day.workouts[0].category,duration:'',averageHeartRate:'',maxHeartRate:'',exerciseCount:day.workouts.length}] : []).map((session,index)=><small key={session.id}>{hText('Sesiunea','Session')} {index+1} · {session.category} · {session.exerciseCount} {hText('exerciții','exercises')}{session.duration ? ` · ${session.duration} min` : ''}{session.averageHeartRate ? ` · ${hText('puls mediu','avg HR')} ${session.averageHeartRate}` : ''}{session.maxHeartRate ? ` · ${hText('puls maxim','max HR')} ${session.maxHeartRate}` : ''}</small>)}{day.workouts.length>0 && <small>{day.workouts.map(w=>w.exercise).join(' · ')}</small>}{day.workouts.length===0 && <small>{hText('Niciun antrenament înregistrat','No workouts logged')}</small>}</div></div>
                  <div className="health-log-item"><div><b>{hText('Recuperare','Recovery')}</b><small>{day.recoveryDone.length ? day.recoveryDone.join(' · ') : hText('Nicio activitate bifată','No activity checked')}</small></div></div>
                </div>
                <p className="muted tiny" style={{marginTop:14}}>{hText('Datele sunt salvate în browserul acestui dispozitiv. Pentru această versiune, înregistrările sunt pe zile calendaristice locale.','Data is saved in this device’s browser. In this version, entries use local calendar days.')}</p>
              </article>;
            })()}
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
        const healthWeekKeys = Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-i);return localDateKey(d);});
        const weekWorkoutCount = healthWeekKeys.reduce((sum,key)=>sum+(healthLogs[key]?.workouts.length||0),0);
        const sleepEntries = healthWeekKeys.map(key=>healthLogs[key]?.sleep?.hours).filter((hours):hours is number=>typeof hours==='number');
        const averageSleep = sleepEntries.length ? sleepEntries.reduce((sum,hours)=>sum+hours,0)/sleepEntries.length : null;
        return <>{header('Analytics & weekly review','Nu poți îmbunătăți ce nu ești dispus să privești cu sinceritate.')}
          <article className="card" style={{marginBottom:14}}><div className="card-head"><div><span className="eyebrow">{language==='en'?'YOUR WEEK':'SĂPTĂMÂNA TA'}</span><h2>{language==='en'?'A simple progress check':'Verificare simplă a progresului'}</h2><p>{language==='en'?'Look for patterns, not perfection.':'Caută tipare, nu perfecțiune.'}</p></div></div><div className="stats"><article className="card"><label>{language==='en'?'WORKOUTS · 7 DAYS':'ANTRENAMENTE · 7 ZILE'}</label><strong>{weekWorkoutCount}</strong><p>{language==='en'?'logged sessions':'sesiuni înregistrate'}</p></article><article className="card"><label>{language==='en'?'AVERAGE SLEEP':'SOMN MEDIU'}</label><strong>{averageSleep===null?'—':averageSleep.toFixed(1)} <small>{averageSleep===null?'': 'h'}</small></strong><p>{language==='en'?'based on logged nights':'din nopțile înregistrate'}</p></article><article className="card"><label>{language==='en'?'WEIGHT LOGS':'MĂSURĂTORI GREUTATE'}</label><strong>{weightEntries.filter(entry=>healthWeekKeys.includes(entry.date)).length}</strong><p>{language==='en'?'entries this week':'înregistrări săptămâna aceasta'}</p></article></div></article>
          <div className="stats"><article className="card"><label>TASKURI FINALIZATE</label><strong>{completed}/{tasks.length}</strong><p>Progresul listei curente</p></article><article className="card"><label>RATA DE FINALIZARE</label><strong>{pct}%</strong><div className="bar"><i style={{width:`${pct}%`}}/></div></article><article className="card"><label>OBICEIURI BIFATE</label><strong>{Object.values(habits).filter(Boolean).length}</strong><p>Înregistrări locale</p></article><article className="card"><label>JURNAL</label><strong>{Object.values(journalEntries).filter(value=>value.trim()).length}</strong><p>Zile cu reflecție salvată</p></article></div>
          <article className="card review-card"><div className="card-head"><div><span className="eyebrow">WEEKLY RESET</span><h2 style={{marginTop:7}}>Revizuirea săptămânii</h2><p>Fii sincer, nu perfect. Scopul este să înveți și să ajustezi.</p></div><span className="chip">SALVARE AUTOMATĂ</span></div><label htmlFor="review-week">SĂPTĂMÂNA ÎNCEPUTĂ LA</label><input id="review-week" className="email" type="date" value={reviewWeek} onChange={e=>setReviewWeek(e.target.value)} style={{marginTop:8,marginBottom:18}}/><div className="review-grid"><label className="review-field"><span>01 / Ce a mers bine?</span><textarea className="email" rows={3} placeholder="Rezultate, acțiuni și momente de care ești mândru..." value={review.wins} onChange={e=>updateWeeklyReview('wins',e.target.value)}/></label><label className="review-field"><span>02 / Ce m-a blocat?</span><textarea className="email" rows={3} placeholder="Ce ai evitat? Ce ți-a consumat energia?" value={review.blockers} onChange={e=>updateWeeklyReview('blockers',e.target.value)}/></label><label className="review-field"><span>03 / Ce am învățat?</span><textarea className="email" rows={3} placeholder="Ce ai înțeles despre tine sau despre planul tău?" value={review.lesson} onChange={e=>updateWeeklyReview('lesson',e.target.value)}/></label><label className="review-field"><span>04 / Care este prioritatea următoare?</span><textarea className="email" rows={3} placeholder="Alege un rezultat clar pentru săptămâna următoare..." value={review.next} onChange={e=>updateWeeklyReview('next',e.target.value)}/></label></div><p className="review-save"><span className="saved-mark">●</span> Se salvează automat în acest browser</p>{savedReviewWeeks.length>0 && <><h3>Revizuiri anterioare</h3><div className="milestones">{savedReviewWeeks.map(week=><button key={week} className={reviewWeek===week?'primary':'secondary'} style={{width:'auto',marginTop:0}} onClick={()=>setReviewWeek(week)}>{week}</button>)}</div></>}</article>
          <article className="card"><h2>Scoruri orientative — Roata vieții</h2><p className="muted">Folosește scorurile ca punct de pornire pentru reflecție, nu ca verdict despre viața ta.</p>{areas.map(a=><div className="area" key={a.name}><div className="area-label"><span>{a.name}</span><b>{a.score}/10</b></div><div className="bar"><i style={{width:`${a.score*10}%`}}/></div></div>)}</article></>;
      }
      case 'Settings & backup':
        return <>{header('Settings & backup',descriptions[activeSection])}<article className="card"><h2>Starea aplicației</h2><p className="muted">Versiune demonstrativă. Taskurile și obiceiurile sunt păstrate local în browserul acestui dispozitiv. Sincronizarea între dispozitive nu este activă până la configurarea Supabase.</p><button className="secondary" onClick={()=>{const backup={tasks,habits,income,clients,goal,dailyFocus,goalSteps,goalPlans,journalEntries,weeklyReviews,clientsList,healthLogs,nutritionProfile,weightEntries,measurementEntries,waterGoal,fastingTracker,exportedAt:new Date().toISOString()};const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='life-os-backup.json';a.click();URL.revokeObjectURL(url);}}>Descarcă backup JSON</button><div style={{marginTop:18}}><h2>Autentificare prin email</h2><input className="email" type="email" placeholder="Adresa ta de email" value={email} onChange={e=>setEmail(e.target.value)}/><button className="primary" onClick={signIn}>Trimite link de autentificare</button><p className="status">{status}</p></div></article></>;
      default:
        return <>{header('Construiește-ți următorul nivel.','Nu ai nevoie de încă o listă. Ai nevoie să știi ce contează acum.')}<article className="focus-panel"><div className="focus-kicker"><span className="focus-pulse"/> INTENȚIA ZILEI <span className="focus-date">{new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'ro-RO',{day:'numeric',month:'long'})}</span></div><h2>Care este singurul lucru care ar face ziua de azi un succes?</h2><p>Nu ce e urgent pentru toată lumea. Ce contează cu adevărat pentru tine.</p><input className="focus-input" aria-label="Prioritatea principală a zilei" placeholder="Ex. Vorbesc cu 3 potențiali clienți..." value={dailyFocus} onChange={e=>{setDailyFocus(e.target.value);try{localStorage.setItem(`life-os-focus-${localDateKey()}`,e.target.value);}catch{}}}/><div className="focus-foot"><span>O intenție clară. Următorul pas concret.</span><span className="saved-mark">● Se salvează automat</span></div></article><article className="card" style={{marginTop:14}}><div className="card-head"><div><span className="eyebrow">{language==='en'?'START HERE':'ÎNCEPE DE AICI'}</span><h2>{language==='en'?'Your next small step':'Următorul tău pas'}</h2><p>{language==='en'?'You do not need to do everything. Start with one clear action.':'Nu trebuie să le faci pe toate. Începe cu o singură acțiune clară.'}</p></div><span className="chip">2 MIN</span></div><p style={{fontSize:16,lineHeight:1.65}}>{dailyFocus.trim() || (language==='en'?'Choose one useful action and work on it for two minutes.':'Alege o acțiune utilă și lucrează la ea timp de două minute.')}</p><button className="primary" onClick={()=>setActiveSection('Daily planner')}>{language==='en'?'Open today’s plan':'Deschide planul de azi'} →</button><p className="muted tiny">{language==='en'?'Tip: if you feel overwhelmed, make the task smaller—not the goal bigger.':'Sfat: dacă te simți copleșit, micșorează sarcina, nu mări presiunea.'}</p></article><div className="notice"><b>Principiul DINCA METHOD:</b> mai puțin zgomot, mai multă intenție. Alege, acționează, revizuiește.</div><div className="stats"><article className="card"><label>VENIT LUNAR</label><strong>{(language === 'en' ? income / 5 : income).toLocaleString(language === 'en' ? 'en-IE' : 'ro-RO',{maximumFractionDigits:0})} <small>{language === 'en'?'EUR':'RON'}</small></strong><p>{language==='en'?'Target: €1,000':'Țintă: 5.000 RON'}</p><input aria-label="Venit lunar" type="range" min="0" max="10000" step="100" value={income} onChange={e=>setIncome(Number(e.target.value))}/></article><article className="card"><label>CLIENȚI ACTIVI</label><strong>{clients}</strong><p>Țintă: 11 clienți</p><input aria-label="Clienți activi" type="range" min="0" max="20" value={clients} onChange={e=>setClients(Number(e.target.value))}/></article><article className="card"><label>PLAN ZILNIC</label><strong>{pct}%</strong><p>{completed} din {tasks.length} activități</p><div className="bar"><i style={{width:`${pct}%`}}/></div></article><article className="card"><label>SPRINT</label><strong>90 <small>zile</small></strong><p>Revizuire în fiecare duminică</p></article></div><div className="content-grid"><article className="card"><div className="card-head"><div><h2>Prioritățile de astăzi</h2><p>Acțiuni care duc la rezultate.</p></div><span className="chip">DAILY EXECUTION</span></div><div className="tasks">{tasks.map(t=><label className={`task ${t.done?'done':''}`} key={t.id}><input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)}/><span><b>{t.title}</b><small>{t.category}</small></span></label>)}</div><button className="secondary" onClick={addTask}>+ Adaugă activitate</button></article><article className="card"><div className="card-head"><div><h2>Roata vieții</h2><p>Scoruri orientative din autoevaluarea ta.</p></div></div>{areas.map(a=><div className="area" key={a.name}><div className="area-label"><span>{a.name}</span><b>{a.score}/10</b></div><div className="bar"><i style={{width:`${a.score*10}%`}}/></div></div>)}</article></div><div className="content-grid lower"><article className="card"><div className="card-head"><div><h2>90-day mission</h2><p>Un rezultat clar, măsurat săptămânal.</p></div></div><h3>{goal}</h3><p className="muted">Ținte inițiale: creșterea venitului de la 3.000 la 5.000 RON și de la 7 la aproximativ 11 clienți, fără să sacrifici sănătatea și relațiile.</p><div className="milestones"><span>01 · Lead-uri</span><span>02 · Conversie</span><span>03 · Retenție</span><span>04 · Venit</span></div></article><article className="card"><div className="card-head"><div><h2>Activează sincronizarea</h2><p>Conectează autentificarea prin email.</p></div></div><input className="email" type="email" placeholder="Adresa ta de email" value={email} onChange={e=>setEmail(e.target.value)}/><button className="primary" onClick={signIn}>Trimite link de autentificare</button><p className="status">{status}</p><p className="muted tiny">Va funcționa după configurarea variabilelor Supabase și a URL-urilor de redirect.</p></article></div></>;
    }
  }
  return <main className="shell">
    {welcomeOpen && <div role="dialog" aria-modal="true" style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(5,10,20,.84)',display:'grid',placeItems:'center',padding:16,overflowY:'auto'}}>
      <section style={{width:'100%',maxWidth:640,background:'#111827',color:'#f9fafb',borderRadius:22,padding:24,border:'1px solid #374151'}}>
        <p style={{color:'#fb7185',fontWeight:800,letterSpacing:2,fontSize:12}}>DINCA METHOD · START HERE</p>
        <h1 style={{fontSize:36,lineHeight:1.1,margin:'8px 0 12px'}}>Nu trebuie să-ți schimbi toată viața astăzi.</h1>
        <p style={{lineHeight:1.6,opacity:.8}}>Te ghidăm pas cu pas. Alege ce vrei să îmbunătățești și ce te blochează cel mai des. Apoi îți dăm un singur pas mic, concret.</p>
        <h3>Ce vrei să îmbunătățești?</h3>
        <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
          {([{id:'fitness',label:'Forma fizică'},{id:'discipline',label:'Disciplină'},{id:'work',label:'Carieră și bani'},{id:'balance',label:'Viața per total'}] as const).map(o=><button key={o.id} onClick={()=>setWelcomeGoal(o.id)} style={{padding:12,borderRadius:12,border:welcomeGoal===o.id?'2px solid #fb7185':'1px solid #4b5563',background:welcomeGoal===o.id?'#4c1d35':'#1f2937',color:'white'}}>{o.label}</button>)}
        </div>
        <div style={{marginTop:14,background:'#1f2937',border:'1px solid #7f1d3d',padding:14,borderRadius:14}}>
          <small style={{color:'#fb7185',fontWeight:800,letterSpacing:1}}>PRIMUL TĂU PAS · {welcomeGoalLabels[welcomeGoal].toUpperCase()}</small>
          <p style={{margin:'8px 0 0',lineHeight:1.6}}>{starterPlans[welcomeGoal]}</p>
          <small style={{display:'block',marginTop:8,opacity:.75}}>Când alegi alt obiectiv, recomandarea se schimbă automat. La final, pasul ales va fi adăugat în planul tău de azi.</small>
        </div>
        <h3>Ce te blochează cel mai des?</h3>
        <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
          {([{id:'procrastination',label:'Amân și nu încep'},{id:'overwhelmed',label:'Am prea multe în cap'},{id:'energy',label:'N-am energie'},{id:'unclear',label:'Nu știu de unde să încep'}] as const).map(o=><button key={o.id} onClick={()=>setWelcomeBlocker(o.id)} style={{padding:12,borderRadius:12,border:welcomeBlocker===o.id?'2px solid #fb7185':'1px solid #4b5563',background:welcomeBlocker===o.id?'#4c1d35':'#1f2937',color:'white'}}>{o.label}</button>)}
        </div>
        <p style={{marginTop:18,background:'#1f2937',padding:14,borderRadius:12,lineHeight:1.5}}>{blockerAdvice[welcomeBlocker]}</p>
        <button onClick={beginFromWelcome} style={{width:'100%',padding:15,border:0,borderRadius:12,background:'#e11d48',color:'white',fontWeight:800,fontSize:15}}>Adaugă pasul în planul meu de azi →</button>
        <button onClick={()=>{try{localStorage.setItem('life-os-onboarding-v1','done')}catch{}setWelcomeOpen(false)}} style={{width:'100%',padding:12,marginTop:8,background:'transparent',border:0,color:'#d1d5db'}}>Vreau să explorez singur</button>
        <small style={{opacity:.6}}>Ghidul de început este interactiv; Coach AI conversațional va necesita o integrare separată.</small>
      </section>
    </div>}

    <aside className="sidebar"><div className="brand"><div className="logo">D</div><div><b>DINCA METHOD</b><small>PERSONAL COMMAND CENTER</small></div></div><div className="language-switch" aria-label="Language selector"><span>{language === 'ro' ? 'LIMBĂ' : 'LANGUAGE'}</span><button className={language === 'ro' ? 'selected' : ''} onClick={() => changeLanguage('ro')}>RO</button><button className={language === 'en' ? 'selected' : ''} onClick={() => changeLanguage('en')}>EN</button></div><div className="navlabel">{language === 'ro' ? 'SPAȚIU DE LUCRU' : 'WORKSPACE'}</div><nav>{navItems.map((x,i)=><a href={`#${x.toLowerCase().replaceAll(' ','-')}`} onClick={e=>{e.preventDefault();setActiveSection(x);}} className={activeSection===x?'active':''} key={x}><span>{icons[i]}</span>{(language === 'ro' ? ({'Overview':'Prezentare','Daily planner':'Plan zilnic','90-day goals':'Obiective pe 90 de zile','Business & money':'Business și bani','Clients':'Clienți','Health & performance':'Sănătate și performanță','Relationships':'Relații','Faith & mind':'Credință și minte','Analytics':'Analiză','Settings & backup':'Setări și backup'} as Record<string,string>)[x] : x)}</a>)}</nav><div className="sidebar-note"><small>YOUR GOALS.</small><b>MY JOB.</b><p>{language === 'ro' ? 'Consecvență, nu perfecțiune.' : 'Consistency over perfection.'}</p></div></aside>
    <section className="main">{localizeNode(sectionContent())}<footer>{language === 'ro' ? 'DINCA METHOD · Creat pentru consecvență, nu perfecțiune.' : 'DINCA METHOD · Built for consistency, not perfection.'}</footer></section>
  </main>;
}
