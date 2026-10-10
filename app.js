(function(){
'use strict';
/* ---------- helpers ---------- */
var DAY=864e5, KEY='communect:v1';
function $(s,r){return (r||document).querySelector(s)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function pad(n,l){n=String(n);while(n.length<(l||2))n='0'+n;return n}
function fmtDate(t){return new Date(t).toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'})}
function fmtDay(t){return new Date(t).toLocaleDateString('en-PH',{weekday:'short',month:'short',day:'numeric'})}
function fmtDT(t){return new Date(t).toLocaleString('en-PH',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}
function dayAt(n,h){var d=new Date();d.setHours(0,0,0,0);return d.getTime()+n*DAY+h*36e5}
function ago(t){var d=Math.floor((Date.now()-t)/DAY);if(d<=0)return 'today';if(d===1)return 'yesterday';return d+' days ago'}
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function wpick(arr,w,r){var s=0,i;for(i=0;i<w.length;i++)s+=w[i];var x=r()*s;for(i=0;i<w.length;i++){x-=w[i];if(x<0)return arr[i]}return arr[arr.length-1]}
function pick(a,r){return a[Math.floor(r()*a.length)]}
function stat(c){return c.status==='In progress'?'Progress':c.status}
function statusTag(c){return '<span class="status '+stat(c)+'">'+esc(c.status)+'</span>'}

/* ---------- constants ---------- */
var CATS=['Road & drainage','Garbage & sanitation','Street lighting','Water supply','Peace & order','Noise & nuisance','Stray animals'];
var CCOL=['#0E7C86','#2B7A4C','#F4B63E','#2A8FC4','#C23B2F','#8A5BB5','#8C6A4A'];
var AREAS=['Purok Centro','Purok Riverside','Purok Sampaguita','Purok Mabuhay','Purok Bagong Pag-asa','Purok Dulo'];
var SERVICES=['Concern handling','Barangay clearance & certificates','Health center services','Peace and order (tanod)','Waste collection','Events & programs','Water service'];
var TEAMS={'Road & drainage':'the barangay maintenance crew','Garbage & sanitation':'the solid waste committee','Street lighting':'the electrical volunteer team','Water supply':'the water committee','Peace & order':'the barangay tanod','Noise & nuisance':'the barangay tanod','Stray animals':'the health and veterinary desk'};
var TITLES={
 'Road & drainage':['Clogged canal beside the main road','Pothole near the elementary school','Street floods after light rain','Broken drainage cover','Damaged footpath near the chapel'],
 'Garbage & sanitation':['Garbage not collected this week','Overflowing bins near the market','Illegal dumping beside the creek','Foul smell from an uncovered pit'],
 'Street lighting':['Street light out on the alley','Flickering lamp near the basketball court','Dark stretch along the footbridge'],
 'Water supply':['Low water pressure in the morning','Leaking pipe by the corner store','No water since yesterday'],
 'Peace & order':['Drinking and shouting past curfew','Suspicious persons loitering at night','Minors riding without helmets at night'],
 'Noise & nuisance':['Loud karaoke past 10 PM','Construction noise at dawn','Barking and noise from a repair shop'],
 'Stray animals':['Stray dogs near the school gate','Cats and rats around the food stalls','Loose goats on the road']
};
var FN=['Maria','Jose','Ana','Ramon','Liza','Carlo','Teresita','Mark','Josefina','Paolo','Gina','Edgar','Rowena','Dennis'];
var LN=['Santos','Reyes','Dela Cruz','Garcia','Mendoza','Ramos','Bautista','Aquino','Villanueva','Castillo'];
var COMMENTS={5:['Fixed within two days. Thank you, kapitan and tanod!','Very responsive desk staff.','The updates on this site made it easy to follow.','Clean-up crew arrived early and finished fast.'],4:['Good service, a little wait at the hall.','Problem solved, but the first reply took a day.','Staff were polite and helpful.'],3:['Resolved, but it took longer than we were told.','Okay service. Please post clearer schedules.'],2:['Still waiting on a follow-up for our earlier report.','Long queue and unclear requirements.'],1:['The same problem came back after a week.']};

/* ---------- seed ---------- */
function seed(){
  var r=rng(2026), now=Date.now(), S={v:1,counter:0,concerns:[],feedback:[],announcements:[],events:[],assistance:[],lostfound:[],applications:[],myIds:[],myRegs:[],lastSeen:Date.now()-2*DAY};
  var list=[],i;
  for(i=0;i<58;i++){
    var cat,area,roll=r();
    if(roll<.18){cat=CATS[0];area=AREAS[1]}else if(roll<.33){cat=CATS[1];area=AREAS[0]}
    else if(roll<.42){cat=CATS[2];area=AREAS[5]}else if(roll<.50){cat=CATS[3];area=AREAS[3]}
    else{cat=wpick(CATS,[8,8,6,6,5,4,3],r);area=wpick(AREAS,[4,3,3,3,3,2],r)}
    var age=r()*158+0.2, created=now-age*DAY, st, p=r();
    if(age>14)st=p<.88?'Resolved':p<.96?'In progress':'Pending';
    else if(age>4)st=p<.5?'Resolved':p<.8?'In progress':'Pending';
    else st=p<.7?'Pending':'In progress';
    var rg={'Road & drainage':[3,11],'Garbage & sanitation':[1,4],'Street lighting':[2,7],'Water supply':[1,5],'Peace & order':[1,3],'Noise & nuisance':[1,3],'Stray animals':[2,6]}[cat];
    var dur=rg[0]+r()*(rg[1]-rg[0]);
    if(st==='Resolved'&&created+dur*DAY>now)st='In progress';
    var nm=pick(FN,r)+' '+pick(LN,r), title=pick(TITLES[cat],r);
    var ups=[{t:created,s:'Pending',x:'Report received by the barangay desk.'}];
    if(st!=='Pending'){var it=created+Math.min(dur*.3,1.5)*DAY;if(it>now)it=now-3600000;ups.push({t:it,s:'In progress',x:'Assigned to '+TEAMS[cat]+'. Site visit scheduled.'})}
    var rs=null;
    if(st==='Resolved'){rs=created+dur*DAY;ups.push({t:rs,s:'Resolved',x:'Work completed and checked by the barangay. Thank you for reporting.'})}
    list.push({id:'',category:cat,area:area,title:title,desc:title+'. Reported by a resident of '+area+'. Please check and address as soon as possible.',name:nm,contact:'',created:created,status:st,updates:ups,resolvedAt:rs,pub:true,rated:false});
  }
  list.sort(function(a,b){return a.created-b.created});
  list.forEach(function(c){S.counter++;c.id='CN-'+new Date(c.created).getFullYear()+'-'+pad(S.counter,4)});
  S.concerns=list;
  for(i=0;i<40;i++){
    var tp=r(),rt=wpick([1,2,3,4,5],[1,2,6,14,16],r),ft;
    ft=tp<.82?'rating':tp<.91?'feedback':'suggestion';
    var o={id:'F'+i,type:ft,service:pick(SERVICES,r),rating:ft==='suggestion'?0:rt,comment:'',name:r()<.4?'Anonymous':pick(FN,r)+' '+pick(LN,r).charAt(0)+'.',ts:now-r()*150*DAY};
    if(ft==='suggestion')o.comment=pick(['Add a weekend schedule for the health center.','Please install more street lights near the footbridge.','A text alert for water interruptions would help.','Have a composting program for each purok.'],r);
    else o.comment=r()<.75?pick(COMMENTS[rt],r):'';
    S.feedback.push(o);
  }
  S.announcements=[
   {id:'A1',title:'Heavy rain and flood advisory: prepare your household now',category:'Disaster',urgent:true,ts:now-3*36e5,body:'The weather bureau expects continuous heavy rain over the next 48 hours.\n\nWhat to do:\n• Prepare a go-bag: IDs, medicines, water, flashlight, power bank.\n• Move appliances and documents to higher ground.\n• Families in Purok Riverside should be ready to move to the Barangay Gym or the Maligaya Elementary School evacuation center.\n• Do not cross flooded roads or the creek footbridge.\n\nCall the tanod desk at 0917 555 0143 if you need help leaving your home.'},
   {id:'A2',title:'Water interruption on Thursday: Purok Centro and Riverside',category:'Water',urgent:false,ts:now-1*DAY,body:'The water committee will replace a damaged main pipe on Thursday, 8:00 AM to 5:00 PM. Households in Purok Centro and Purok Riverside will have no water during these hours.\n\nPlease store water ahead of time. A water truck will be stationed at the Barangay Hall from 9:00 AM.'},
   {id:'A3',title:'Garbage collection: new schedule starts Monday',category:'Garbage',urgent:false,ts:now-2*DAY,body:'Please follow the collection days per purok shown on this page. Segregate biodegradable and non-biodegradable waste in separate bags. Unsegregated waste will not be collected. Recyclables are collected on Saturdays.'},
   {id:'A4',title:'Scheduled power interruption this Sunday, 8 AM to 3 PM',category:'Electricity',urgent:false,ts:now-2*DAY-4*36e5,body:'The electric cooperative will do line maintenance. Affected areas: Purok Sampaguita, Purok Mabuhay and Purok Dulo. Charge your devices and unplug appliances before the outage.'},
   {id:'A5',title:'Water bill schedule for October',category:'Water',urgent:false,ts:now-4*DAY,body:'Meter reading: Oct 25 to 27.\nBills delivered: Oct 30 to Nov 3.\nPayment due: Nov 10 at the Barangay Water Desk (Mon–Fri, 8 AM–4 PM).\n\nA 10% surcharge applies to payments after the due date. Report meter problems to the water desk.'},
   {id:'A6',title:'Quarterly earthquake and fire drill',category:'Disaster',urgent:false,ts:now-5*DAY,body:'The barangay will hold its quarterly earthquake and fire drill in six days at 9:00 AM. Sirens will sound. All households are encouraged to take part. Drill assembly point: Barangay Gym.'},
   {id:'A7',title:'Barangay hall now open on Saturday mornings',category:'Official',urgent:false,ts:now-8*DAY,body:'To serve working residents, clearances, certificates and the water desk will be open on Saturdays from 8:00 AM to 12:00 NN. Bring a valid ID.'},
   {id:'A8',title:'Reminder: curfew for minors is 10 PM',category:'Official',urgent:false,ts:now-12*DAY,body:'Under the barangay ordinance, minors must be accompanied by a guardian after 10:00 PM. Parents are asked to cooperate with tanod visits.'},
   {id:'A9',title:'Free anti-rabies vaccination for dogs and cats',category:'Official',urgent:false,ts:now-16*DAY,body:'Bring your pets to the Barangay Gym on the first Saturday of the month, 8 AM to 11 AM. Pets must be leashed or in a carrier.'}
  ];
  function ev(id,title,type,d,h,time,venue,desc,cap,reg,vol,volReg,att){return {id:id,title:title,type:type,date:dayAt(d,h),time:time,venue:venue,desc:desc,capacity:cap,registered:reg,volSlots:vol,volunteers:volReg,attended:att==null?null:att}}
  S.events=[
   ev('E1','Clean-up drive along the creek','Clean-up',3,7,'7:00 AM – 11:00 AM','Purok Riverside footbridge','Gloves and sacks provided. Wear boots and bring a hat. Light snacks after the drive.',80,41,30,16),
   ev('E2','Feeding program: volunteer serving day','Program',5,9,'9:00 AM – 12:00 NN','Barangay Gym','Help prepare and serve meals for children under five and senior citizens.',60,22,25,11),
   ev('E3','Quarterly barangay assembly','Meeting',9,17,'5:00 PM – 7:00 PM','Barangay Gym','Review of the barangay budget, project updates, and open forum with officials.',250,97,0,0),
   ev('E4','Inter-purok volleyball league: opening','Sports',14,15,'3:00 PM – 6:00 PM','Maligaya covered court','Six teams, one per purok. Register your team captain at the barangay hall.',120,58,10,4),
   ev('E5','Tree planting with the youth council','Clean-up',21,6,'6:30 AM – 10:00 AM','Riverbank buffer zone','Seedlings and tools provided. Volunteers get a certificate of participation.',70,19,40,13),
   ev('E6','Parol-making workshop for families','Program',32,14,'2:00 PM – 5:00 PM','Barangay Hall, 2nd floor','Materials provided. Open to residents of all ages.',50,8,6,2),
   ev('E7','Barangay assembly (Q3)','Meeting',-20,17,'5:00 PM – 7:00 PM','Barangay Gym','Mid-year review and open forum.',200,130,0,0,118),
   ev('E8','Inter-purok basketball finals','Sports',-34,16,'4:00 PM – 8:00 PM','Maligaya covered court','Championship games and awarding.',200,150,12,10,96),
   ev('E9','Creek clean-up drive','Clean-up',-12,7,'7:00 AM – 11:00 AM','Purok Riverside','Volunteers collected 62 sacks of waste.',90,88,40,35,74),
   ev('E10','Free medical and dental mission','Program',-55,8,'8:00 AM – 3:00 PM','Barangay Gym','Check-ups, dental extraction, medicine distribution.',200,176,20,18,142),
   ev('E11','Livelihood skills seminar','Program',-75,9,'9:00 AM – 3:00 PM','Barangay Hall','Food processing and small business basics.',80,66,5,4,58)
  ];
  function as(id,t,type,desc,el,docs,dl,slots,ap,prov){return {id:id,title:t,type:type,desc:desc,eligibility:el,docs:docs,deadline:dl,slots:slots,applicants:ap,provider:prov}}
  S.assistance=[
   as('S1','Barangay Scholarship Grant','Scholarship','Tuition and allowance support for college and senior high school students from low-income households. Includes ₱5,000 per semester.',['Resident of the barangay for at least 1 year','Enrolled in college or Grades 11–12','General average of 85% or higher','Household income below ₱20,000 a month'],['Certificate of enrollment','Barangay residency certificate','Latest report card or grades'],dayAt(18,17),25,14,'Office of the Punong Barangay'),
   as('S2','Emergency Cash Aid for Flood-Affected Families','Financial','One-time ₱3,000 for households whose homes or income were affected by flooding this season.',['Resident with a household record in the barangay','Home or livelihood damaged by flooding','Not receiving the same aid from another agency'],['Valid ID','Photos of damage (if available)','Household head signature'],dayAt(25,17),150,62,'Social Welfare Committee'),
   as('S3','Livelihood Starter Kit','Livelihood','Starter kits for small food stalls, sewing, and sari-sari stores, with a one-day business training.',['18 years old and above','Unemployed or with irregular income','Willing to attend the training'],['Valid ID','Short business plan (template at the hall)'],dayAt(12,17),40,33,'Livelihood Committee'),
   as('S4','Supplemental Feeding for Children 0–5','Feeding','Daily hot meals and monthly weight monitoring at the Barangay Health Center.',['Child aged 6 months to 5 years','Child is underweight or at risk, as checked by a health worker'],['Child health card','Parent or guardian ID'],null,120,81,'Barangay Nutrition Committee'),
   as('S5','Senior Citizens Monthly Food Packs','Feeding','Rice, canned goods and vitamins delivered to qualified seniors every month.',['Aged 60 and above','Registered in the senior citizens list'],['Senior citizen ID or birth certificate'],dayAt(7,17),90,52,'Senior Citizens Association'),
   as('S6','Back-to-School Supplies Drive','Scholarship','School supplies for elementary and high school students.',['Enrolled in a public school in the barangay'],['School enrollment form'],dayAt(-10,17),200,200,'Youth Council')
  ];
  S.lostfound=[
   {id:'L1',kind:'lost',title:'Black leather wallet',category:'Wallet or bag',place:'Basketball court, Purok Centro',date:dayAt(-1,18),desc:'Contains IDs and a small amount of cash. Reward offered.',name:'Ramon S.',status:'Open',verified:true},
   {id:'L2',kind:'found',title:'Set of keys with blue keychain',category:'Keys',place:'Outside the barangay hall',date:dayAt(-2,10),desc:'Three keys and a motorcycle key. Kept at the desk.',name:'Desk officer',status:'Open',verified:true},
   {id:'L3',kind:'lost',title:'Brown aspin dog, "Choco"',category:'Pet',place:'Purok Mabuhay',date:dayAt(-3,6),desc:'Wearing a red collar. Friendly, answers to his name.',name:'Gina R.',status:'Open',verified:true},
   {id:'L4',kind:'found',title:'Student ID card',category:'ID or documents',place:'Footbridge, Purok Riverside',date:dayAt(-4,15),desc:'Name withheld for privacy. Claim at the desk with proof of identity.',name:'Desk officer',status:'Open',verified:true},
   {id:'L5',kind:'lost',title:'Blue Samsung phone with clear case',category:'Phone or electronics',place:'Public market',date:dayAt(-6,9),desc:'Cracked lower-left corner. Lock screen shows a beach photo.',name:'Mark D.',status:'Open',verified:true},
   {id:'L6',kind:'found',title:'Folding umbrella, green',category:'Other',place:'Chapel steps',date:dayAt(-9,17),desc:'Left after Sunday mass.',name:'Desk officer',status:'Returned',verified:true}
  ];
  return S;
}
var S=null;
function load(){try{var r=localStorage.getItem(KEY);if(r){var s=JSON.parse(r);if(s&&s.v===1)return s}}catch(e){}return null}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
S=load()||seed();save();

var isOfficial=false;
try{isOfficial=sessionStorage.getItem('communect:official')==='1'}catch(e){}
var UI={annCat:'All',annQ:'',evType:'All',evWhen:'upcoming',asType:'All',lfKind:'All',lfQ:'',cTab:'submit',trackId:'',boardF:'All',fTab:'rate',dTab:'overview',repStatus:'All',repCat:'All',repQ:'',lastConcern:null};

/* ---------- derived ---------- */
function weekdayToday(){return new Date().toLocaleDateString('en-US',{weekday:'short'})}
var COLLECT=[
 ['Purok Centro','Mon, Thu','Tue, Fri','Sat (1st, 3rd)'],
 ['Purok Riverside','Tue, Fri','Wed','Sat (2nd, 4th)'],
 ['Purok Sampaguita','Mon, Thu','Wed','Sat (1st, 3rd)'],
 ['Purok Mabuhay','Tue, Fri','Thu','Sat (2nd, 4th)'],
 ['Purok Bagong Pag-asa','Mon, Thu','Tue','Sat (1st, 3rd)'],
 ['Purok Dulo','Wed, Sat','Fri','Sat (2nd, 4th)']
];
function upcomingEvents(){return S.events.filter(function(e){return e.date>=Date.now()-6*36e5}).sort(function(a,b){return a.date-b.date})}
function pastEvents(){return S.events.filter(function(e){return e.date<Date.now()-6*36e5}).sort(function(a,b){return b.date-a.date})}
function annSorted(){return S.announcements.slice().sort(function(a,b){return b.ts-a.ts})}
function avg(a){return a.length?a.reduce(function(x,y){return x+y},0)/a.length:0}
function resolvedDays(list){return list.filter(function(c){return c.resolvedAt}).map(function(c){return (c.resolvedAt-c.created)/DAY})}
function ratings(){return S.feedback.filter(function(f){return f.type==='rating'&&f.rating>0})}
function stars(n){var s='';for(var i=1;i<=5;i++)s+=i<=Math.round(n)?'★':'☆';return s}

/* ---------- notifications ---------- */
function notifs(){
  var out=[];
  S.concerns.forEach(function(c){if(S.myIds.indexOf(c.id)>-1){var u=c.updates[c.updates.length-1];out.push({ts:u.t,title:c.id+': '+u.s,text:u.x,href:'#/concerns',track:c.id})}});
  S.announcements.forEach(function(a){if(a.urgent||Date.now()-a.ts<5*DAY)out.push({ts:a.ts,title:(a.urgent?'Urgent: ':'')+a.title,text:a.category+' advisory',href:'#/announcements',ann:a.id})});
  S.events.forEach(function(e){var d=e.date-Date.now();if(d>0&&d<7*DAY)out.push({ts:e.date-7*DAY+1,title:'Coming up: '+e.title,text:fmtDay(e.date)+' · '+e.venue,href:'#/events'})});
  return out.sort(function(a,b){return b.ts-a.ts}).slice(0,12);
}
function renderNotifs(){
  var n=notifs(),unread=n.filter(function(x){return x.ts>S.lastSeen}).length,b=$('#nbadge');
  b.hidden=!unread;b.textContent=unread;
  $('#notif').innerHTML='<h4>Notifications</h4>'+(n.length?n.map(function(x){return '<a class="n-item'+(x.ts>S.lastSeen?' new':'')+'" href="'+x.href+'" '+(x.track?'data-act="go-track" data-id="'+esc(x.track)+'"':x.ann?'data-act="open-ann" data-id="'+esc(x.ann)+'"':'')+'><b>'+esc(x.title)+'</b>'+esc(x.text)+'<br><span class="muted small">'+ago(x.ts)+'</span></a>'}).join(''):'<p class="muted" style="padding:0 16px 16px">No notifications yet. Updates to reports you submit will show up here.</p>');
}

/* ---------- shell ---------- */
var NAV=[['home','Home'],['announcements','Announcements'],['concerns','Concerns'],['events','Events'],['assistance','Assistance'],['lost-found','Lost & Found'],['feedback','Feedback']];
function renderNav(cur){
  $('#nav').innerHTML=NAV.map(function(n){return '<a href="#/'+n[0]+'"'+(cur===n[0]?' aria-current="page"':'')+'>'+n[1]+'</a>'}).join('')+'<a class="off" href="#/officials"'+(cur==='officials'?' aria-current="page"':'')+'>'+(isOfficial?'Dashboard':'Officials')+'</a>';
}
function toast(m){var t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(function(){t.hidden=true},3600)}
function modal(html){var d=$('#modal');d.innerHTML='<div class="m-in">'+html+'</div>';if(!d.open)d.showModal()}
function closeModal(){var d=$('#modal');if(d.open)d.close()}
function mhead(t){return '<div class="m-head"><h2 style="margin-bottom:12px">'+t+'</h2><button class="m-close" data-act="close" aria-label="Close">×</button></div>'}

/* ---------- views ---------- */
function annRow(a){
  var d=new Date(a.ts);
  return '<button class="ann '+a.category+'" data-act="open-ann" data-id="'+a.id+'"><div class="datebox"><b>'+d.getDate()+'</b><span>'+d.toLocaleDateString('en',{month:'short'})+'</span></div><div><div class="meta"><span class="tag '+a.category+'">'+a.category+'</span>'+(a.urgent?'<span class="tag coral">Urgent</span>':'')+'<span class="verified">✔ Verified by barangay</span></div><h3>'+esc(a.title)+'</h3><p>'+esc(a.body.split('\n')[0]).slice(0,150)+(a.body.split('\n')[0].length>150?'…':'')+'</p></div></button>';
}
function ticket(e){
  var past=e.date<Date.now()-6*36e5,d=new Date(e.date),reg=S.myRegs.filter(function(m){return m.eventId===e.id}),full=e.registered>=e.capacity,pct=Math.min(100,Math.round(e.registered/e.capacity*100));
  var myP=reg.some(function(m){return m.role==='Participant'}),myV=reg.some(function(m){return m.role==='Volunteer'});
  return '<article class="ticket'+(past?' past':'')+'"><div class="stub"><span>'+d.toLocaleDateString('en',{month:'short'}).toUpperCase()+'</span><b>'+d.getDate()+'</b><span>'+d.toLocaleDateString('en',{weekday:'short'})+'</span></div><div class="t-body"><span class="tag sun">'+e.type+'</span><h3>'+esc(e.title)+'</h3><div class="facts"><span>🕒 '+esc(e.time)+'</span><span>📍 '+esc(e.venue)+'</span></div><p>'+esc(e.desc)+'</p>'
   +'<div class="bar" aria-hidden="true"><i style="width:'+pct+'%"></i></div><div class="small muted" style="margin-top:5px">'+(past?(e.attended!=null?e.attended+' attended · ':'')+e.registered+' registered':e.registered+' of '+e.capacity+' spots taken'+(e.volSlots?' · '+e.volunteers+' of '+e.volSlots+' volunteers':''))+'</div>'
   +(past?'':'<div class="t-actions">'+(myP?'<span class="tag leaf">✔ You are registered</span>':'<button class="btn sm" data-act="reg" data-id="'+e.id+'" data-role="Participant"'+(full?' disabled':'')+'>'+(full?'Event is full':'Register to join')+'</button>')+(e.volSlots?(myV?'<span class="tag leaf">✔ Volunteer signed up</span>':'<button class="btn sm sun" data-act="reg" data-id="'+e.id+'" data-role="Volunteer"'+(e.volunteers>=e.volSlots?' disabled':'')+'>'+(e.volunteers>=e.volSlots?'Volunteers full':'Volunteer')+'</button>'):'')+'</div>')
   +'</div></article>';
}
function vHome(){
  var pin=S.announcements.filter(function(a){return a.urgent})[0]||annSorted()[0];
  var res30=S.concerns.filter(function(c){return c.resolvedAt&&Date.now()-c.resolvedAt<30*DAY}).length;
  var rd=avg(resolvedDays(S.concerns));
  var open=S.concerns.filter(function(c){return c.status!=='Resolved'}).length;
  return '<section class="hero"><div class="container hero-grid"><div><h1>Barangay Maligaya, today.</h1><p class="lead">Verified notices from the barangay hall, concerns you can follow until they are fixed, and programs you can join, all in one place.</p>'
   +'<form class="track-box" data-form="hero-track"><label class="sr" for="ht">Report number</label><input id="ht" type="text" placeholder="Track a report, e.g. CN-2026-0012" autocomplete="off"><button class="btn sun" type="submit">Track report</button></form>'
   +'<div class="hero-cta"><a class="btn" href="#/concerns" data-act="to-submit">Report a concern</a><a class="btn ghost" href="#/announcements">Read announcements</a></div></div>'
   +(pin?'<aside class="notice" aria-label="Pinned advisory"><span class="tag">Pinned · '+pin.category+' advisory</span><h3>'+esc(pin.title)+'</h3><p>'+esc(pin.body.split('\n')[0])+'</p><button class="btn sm" data-act="open-ann" data-id="'+pin.id+'">Read what to do</button></aside>':'')
   +'</div></section>'
   +'<div class="container section" style="padding-top:8px"><div class="overview"><div><b style="font-size:1.25rem">About the barangay</b><p class="small muted" style="margin:.3em 0 0">A coastal community of about 2,400 households in six puroks. Hall open Mon–Fri 8 AM–5 PM, Sat 8 AM–12 NN.</p></div>'
   +'<div><b>'+res30+'</b><span class="small muted">concerns resolved in the last 30 days</span></div><div><b>'+rd.toFixed(1)+' days</b><span class="small muted">average time to resolve</span></div><div><b>'+open+'</b><span class="small muted">concerns being handled now</span></div></div></div>'
   +'<div class="container section"><div class="grid2"><div><div class="sec-title"><h2>Latest announcements</h2><a href="#/announcements">See all</a></div>'+annSorted().slice(0,4).map(annRow).join('')+'</div>'
   +'<div><div class="sec-title"><h2>Coming up</h2><a href="#/events">All events</a></div>'+upcomingEvents().slice(0,3).map(ticket).join('')+'</div></div></div>'
   +'<div class="container section"><div class="panel"><h2>How a concern gets resolved</h2><ol class="how" style="padding:0;margin:18px 0 0"><li><b>Submit</b><span class="small muted">Describe the problem and where it is.</span></li><li><b>Receive a number</b><span class="small muted">Keep your tracking number.</span></li><li><b>Barangay acts</b><span class="small muted">Officials assign it and post updates.</span></li><li><b>Resolved</b><span class="small muted">You are notified when work is done.</span></li><li><b>Rate it</b><span class="small muted">Tell us how we did.</span></li></ol></div></div>'
   +'<div class="container section"><div class="row2" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))"><a class="panel" href="#/assistance" style="text-decoration:none;color:inherit"><h3>Assistance and opportunities</h3><p class="muted small">Scholarships, cash aid, livelihood kits and feeding programs with deadlines.</p></a><a class="panel" href="#/lost-found" style="text-decoration:none;color:inherit"><h3>Lost and found</h3><p class="muted small">Report or browse lost belongings and arrange a safe return through the desk.</p></a><a class="panel" href="#/feedback" style="text-decoration:none;color:inherit"><h3>Feedback and suggestions</h3><p class="muted small">Rate a service or send an idea straight to the barangay council.</p></a></div></div>';
}
function vAnnouncements(){
  var cats=['All','Official','Water','Electricity','Garbage','Disaster'];
  var q=UI.annQ.toLowerCase(),list=annSorted().filter(function(a){return (UI.annCat==='All'||a.category===UI.annCat)&&(!q||(a.title+a.body).toLowerCase().indexOf(q)>-1)});
  var wd=weekdayToday(),today=COLLECT.map(function(c){var bits=[];if(c[1].indexOf(wd)>-1)bits.push('biodegradable');if(c[2].indexOf(wd)>-1)bits.push('non-biodegradable');return bits.length?c[0]+': '+bits.join(' and '):null}).filter(Boolean);
  return '<div class="container"><div class="page-head"><h1 style="font-size:clamp(1.9rem,4vw,2.6rem)">Announcements</h1><p>Official notices from the barangay hall, including water bills and interruptions, power advisories, garbage schedules and emergency alerts.</p></div>'
   +'<div class="grid2"><div><div class="field"><label class="sr" for="aq">Search announcements</label><input id="aq" type="search" data-live="annQ" placeholder="Search announcements" value="'+esc(UI.annQ)+'"></div><div class="chips" role="group" aria-label="Filter by type">'+cats.map(function(c){return '<button class="chip" data-act="chip" data-k="annCat" data-v="'+c+'" aria-pressed="'+(UI.annCat===c)+'">'+c+'</button>'}).join('')+'</div>'
   +(list.length?list.map(annRow).join(''):'<div class="empty">No announcements match. Try another type or clear the search.</div>')+'</div>'
   +'<aside class="panel"><h3>Garbage collection days</h3>'+(today.length?'<p class="tag leaf" style="display:block;margin-bottom:10px;padding:8px 10px">Collecting today · '+esc(today.join(' · '))+'</p>':'<p class="small muted">No biodegradable or non-biodegradable pickups today.</p>')+'<div class="tbl-wrap"><table><thead><tr><th>Purok</th><th>Bio</th><th>Non-bio</th><th>Recycle</th></tr></thead><tbody>'+COLLECT.map(function(c){return '<tr><td>'+c[0].replace('Purok ','')+'</td><td>'+c[1]+'</td><td>'+c[2]+'</td><td>'+c[3]+'</td></tr>'}).join('')+'</tbody></table></div><p class="small muted" style="margin-top:12px">Put bags out by 6 AM on collection day.</p></aside></div></div>';
}
function concernForm(){
  return '<form class="panel" data-form="concern"><h2>Submit a concern</h2><p class="muted">Tell us what is wrong and where. You will get a tracking number right away.</p>'
   +'<div class="row2"><div class="field"><label for="cc">Category</label><select id="cc" name="category" required>'+CATS.map(function(c){return '<option>'+esc(c)+'</option>'}).join('')+'</select></div><div class="field"><label for="ca">Area</label><select id="ca" name="area" required>'+AREAS.map(function(c){return '<option>'+c+'</option>'}).join('')+'</select></div></div>'
   +'<div class="field"><label for="ct">Short title</label><input id="ct" name="title" type="text" required maxlength="90" placeholder="e.g. Clogged canal beside the chapel"></div>'
   +'<div class="field"><label for="cd">What is happening?</label><textarea id="cd" name="desc" required placeholder="Describe the problem, the exact spot and how long it has been going on."></textarea></div>'
   +'<div class="row2"><div class="field"><label for="cn">Your name</label><input id="cn" name="name" type="text" required autocomplete="name"></div><div class="field"><label for="cp">Mobile number (optional)</label><input id="cp" name="contact" type="tel" autocomplete="tel" placeholder="09xx xxx xxxx"><div class="hint">Only barangay officials can see this.</div></div></div>'
   +'<div class="field"><label class="check"><input type="checkbox" name="pub" checked><span>Show this report on the community board (your name stays hidden)</span></label></div><button class="btn" type="submit">Submit concern</button></form>';
}
function detail(c,opt){
  var si=c.status==='Pending'?0:c.status==='In progress'?1:2;
  var h='<div class="meta"><span class="tag">'+esc(c.category)+'</span><span class="tag">'+esc(c.area)+'</span>'+statusTag(c)+'</div><h3 style="margin-top:10px">'+esc(c.id)+' · '+esc(c.title)+'</h3><p class="muted">'+esc(c.desc)+'</p><p class="small muted">Submitted '+fmtDate(c.created)+(opt&&opt.official?' by '+esc(c.name)+(c.contact?' · '+esc(c.contact):''):'')+'</p>'
   +'<div class="stepper" aria-label="Progress">'+['Received','In progress','Resolved'].map(function(s,i){return '<div class="step'+(i<=si?' done':'')+'">'+s+'</div>'}).join('')+'</div>'
   +'<h4>Updates from the barangay</h4><ul class="timeline">'+c.updates.slice().reverse().map(function(u){return '<li><b>'+esc(u.s)+'</b><br>'+esc(u.x)+'<br><time>'+fmtDT(u.t)+(u.by?' · '+esc(u.by):'')+'</time></li>'}).join('')+'</ul>';
  if(c.status==='Resolved'&&!(opt&&opt.official)){
    h+=c.rated?'<p class="tag leaf">✔ Thanks, you rated this service.</p>':'<form class="panel" style="margin-top:8px;background:var(--surface2)" data-form="rate-concern"><input type="hidden" name="id" value="'+esc(c.id)+'"><h4>This concern was marked resolved. How did we do?</h4><div class="stars" role="radiogroup" aria-label="Rating">'+[5,4,3,2,1].map(function(n){return '<label><input type="radio" name="rating" value="'+n+'" required><span aria-hidden="true">★</span><span class="sr">'+n+' stars</span></label>'}).join('')+'</div><div class="field" style="margin-top:10px"><label for="rc">Comment (optional)</label><textarea id="rc" name="comment" style="min-height:70px"></textarea></div><button class="btn sm" type="submit">Send rating</button></form>';
  }
  return h;
}
function vConcerns(){
  var tabs=[['submit','Submit a concern'],['track','Track a report'],['board','Community board']];
  var body='';
  if(UI.cTab==='submit')body='<div class="grid2">'+concernForm()+'<aside class="panel"><h3>Before you submit</h3><ul style="padding-left:18px;margin:0"><li>For emergencies call the tanod desk: 0917 555 0143.</li><li>Include the nearest landmark.</li><li>One concern per report, so we can assign it correctly.</li></ul><h3 style="margin-top:18px">Your reports on this device</h3>'+myList()+'</aside></div>';
  else if(UI.cTab==='track'){
    var c=UI.trackId?S.concerns.filter(function(x){return x.id===UI.trackId.toUpperCase()})[0]:null;
    body='<div class="grid2"><div><form class="panel" data-form="track" style="margin-bottom:20px"><h2>Track a report</h2><div class="field"><label for="ti">Tracking number</label><input id="ti" type="text" name="id" value="'+esc(UI.trackId)+'" placeholder="CN-2026-0001" required autocomplete="off"></div><button class="btn" type="submit">Show progress</button></form>'
     +(UI.trackId?(c?'<div class="panel">'+detail(c)+'</div>':'<div class="empty">No report found for “'+esc(UI.trackId)+'”. Check the number and try again. It looks like CN-2026-0001.</div>'):'')+'</div><aside class="panel"><h3>Your reports on this device</h3>'+myList()+'</aside></div>';
  } else {
    var st=['All','Pending','In progress','Resolved'],l=S.concerns.filter(function(c){return c.pub&&(UI.boardF==='All'||c.status===UI.boardF)}).sort(function(a,b){return b.created-a.created}).slice(0,25);
    body='<div class="chips">'+st.map(function(s){return '<button class="chip" data-act="chip" data-k="boardF" data-v="'+s+'" aria-pressed="'+(UI.boardF===s)+'">'+s+'</button>'}).join('')+'</div><div class="panel">'+(l.length?l.map(function(c){return '<div class="crow"><div><h4>'+esc(c.title)+'</h4><div class="small muted">'+esc(c.category)+' · '+esc(c.area)+' · '+fmtDate(c.created)+' · '+esc(c.id)+'</div></div><div style="display:flex;gap:8px;align-items:center">'+statusTag(c)+'<button class="btn sm ghost" data-act="go-track" data-id="'+c.id+'">View updates</button></div></div>'}).join(''):'<div class="empty">No reports with this status.</div>')+'</div>';
  }
  return '<div class="container"><div class="page-head"><h1 style="font-size:clamp(1.9rem,4vw,2.6rem)">Community concerns</h1><p>Report problems in your purok, follow each step until it is resolved, and see what neighbors have reported.</p></div><div class="tabs" role="tablist">'+tabs.map(function(t){return '<button class="tab" role="tab" data-act="ctab" data-v="'+t[0]+'" aria-selected="'+(UI.cTab===t[0])+'">'+t[1]+'</button>'}).join('')+'</div>'+body+'</div>';
}
function myList(){
  var l=S.concerns.filter(function(c){return S.myIds.indexOf(c.id)>-1}).sort(function(a,b){return b.created-a.created});
  return l.length?l.map(function(c){return '<div class="crow"><div><b>'+esc(c.id)+'</b><div class="small muted">'+esc(c.title)+'</div></div><div>'+statusTag(c)+'<br><button class="btn sm ghost" style="margin-top:6px" data-act="go-track" data-id="'+c.id+'">Open</button></div></div>'}).join(''):'<p class="muted small">Concerns you submit here will be listed so you can follow them.</p>';
}
function vEvents(){
  var types=['All','Meeting','Sports','Clean-up','Program'];
  var src=UI.evWhen==='upcoming'?upcomingEvents():pastEvents();
  var list=src.filter(function(e){return UI.evType==='All'||e.type===UI.evType});
  return '<div class="container"><div class="page-head"><h1 style="font-size:clamp(1.9rem,4vw,2.6rem)">Events and activities</h1><p>Meetings, sports, clean-up drives and community programs. Register to join or sign up as a volunteer.</p></div><div class="tabs" role="tablist"><button class="tab" role="tab" data-act="chip" data-k="evWhen" data-v="upcoming" aria-selected="'+(UI.evWhen==='upcoming')+'">Upcoming</button><button class="tab" role="tab" data-act="chip" data-k="evWhen" data-v="past" aria-selected="'+(UI.evWhen==='past')+'">Past events</button></div>'
   +'<div class="chips">'+types.map(function(t){return '<button class="chip" data-act="chip" data-k="evType" data-v="'+t+'" aria-pressed="'+(UI.evType===t)+'">'+t+'</button>'}).join('')+'</div><div style="max-width:820px">'+(list.length?list.map(ticket).join(''):'<div class="empty">No '+UI.evWhen+' events of this type.</div>')+'</div></div>';
}
function vAssistance(){
  var types=['All','Scholarship','Financial','Livelihood','Feeding'];
  var list=S.assistance.filter(function(a){return UI.asType==='All'||a.type===UI.asType}).sort(function(a,b){return (a.deadline||9e15)-(b.deadline||9e15)});
  return '<div class="container"><div class="page-head"><h1 style="font-size:clamp(1.9rem,4vw,2.6rem)">Assistance and opportunities</h1><p>Check who qualifies, what to bring and when applications close. Submit your interest here and the barangay desk will contact you.</p></div><div class="chips">'+types.map(function(t){return '<button class="chip" data-act="chip" data-k="asType" data-v="'+t+'" aria-pressed="'+(UI.asType===t)+'">'+t+'</button>'}).join('')+'</div>'
   +list.map(function(a){
    var closed=a.deadline&&a.deadline<Date.now(),days=a.deadline?Math.ceil((a.deadline-Date.now())/DAY):null,left=Math.max(0,a.slots-a.applicants),done=S.applications.some(function(x){return x.assistId===a.id&&x.mine});
    return '<article class="assist"><div><div class="meta"><span class="tag sun">'+a.type+'</span><span class="small muted">'+esc(a.provider)+'</span></div><h3 style="margin-top:8px;font-size:1.3rem">'+esc(a.title)+'</h3><p>'+esc(a.desc)+'</p><h4>Who can apply</h4><ul>'+a.eligibility.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul><h4>Bring or submit</h4><ul>'+a.docs.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></div>'
     +'<div class="deadline">'+(a.deadline?(closed?'<b class="big" style="color:var(--coral)">Closed</b><span class="small muted">Deadline was '+fmtDate(a.deadline)+'</span>':'<b class="big">'+days+' day'+(days===1?'':'s')+' left</b><span class="small muted">Deadline: '+fmtDay(a.deadline)+'</span>'):'<b class="big">Open all year</b><span class="small muted">Rolling enrollment</span>')
     +'<div class="bar sun" style="margin:14px 0 4px"><i style="width:'+Math.min(100,Math.round(a.applicants/a.slots*100))+'%"></i></div><div class="small muted">'+(left?left+' of '+a.slots+' slots left':'All slots taken, join the waitlist')+'</div>'
     +(done?'<p class="tag leaf" style="margin-top:14px">✔ Your interest was sent</p>':'<button class="btn" style="margin-top:14px;width:100%" data-act="apply" data-id="'+a.id+'"'+(closed?' disabled':'')+'>'+(closed?'Applications closed':left?'Apply or ask about this':'Join waitlist')+'</button>')+'</div></article>';
   }).join('')+'</div>';
}
function vLostFound(){
  var q=UI.lfQ.toLowerCase(),list=S.lostfound.filter(function(i){return (UI.lfKind==='All'||i.kind===UI.lfKind.toLowerCase())&&(!q||(i.title+i.desc+i.place+i.category).toLowerCase().indexOf(q)>-1)}).sort(function(a,b){return (a.status==='Returned')-(b.status==='Returned')||b.date-a.date});
  return '<div class="container"><div class="page-head"><h1 style="font-size:clamp(1.9rem,4vw,2.6rem)">Lost and found</h1><p>Lost something or found something? Post it here. To protect everyone, claims and returns go through the authorized desk officer at the barangay hall.</p></div>'
   +'<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:end;margin-bottom:18px"><div style="flex:1;min-width:220px"><label class="sr" for="lq">Search items</label><input id="lq" type="search" data-live="lfQ" placeholder="Search items, e.g. wallet, keys" value="'+esc(UI.lfQ)+'"></div><div class="chips" style="margin:0">'+['All','Lost','Found'].map(function(k){return '<button class="chip" data-act="chip" data-k="lfKind" data-v="'+k+'" aria-pressed="'+(UI.lfKind===k)+'">'+k+'</button>'}).join('')+'</div><button class="btn" data-act="lf-report">Report an item</button></div>'
   +(list.length?'<div class="lf-grid">'+list.map(function(i){return '<article class="lf '+i.kind+(i.status==='Returned'?' returned':'')+'"><div class="meta"><span class="tag '+(i.kind==='lost'?'coral':'leaf')+'">'+(i.kind==='lost'?'Lost':'Found')+'</span><span class="tag">'+esc(i.category)+'</span>'+(i.status==='Returned'?'<span class="tag">Returned to owner</span>':!i.verified?'<span class="tag sun">Awaiting desk check</span>':'')+'</div><h3>'+esc(i.title)+'</h3><div class="small muted">📍 '+esc(i.place)+'<br>🗓 '+fmtDate(i.date)+'</div><p class="small">'+esc(i.desc)+'</p>'+(i.status==='Returned'?'':'<button class="btn ghost sm" data-act="lf-contact" data-id="'+i.id+'">'+(i.kind==='lost'?'I found this':'This is mine')+'</button>')+'</article>'}).join('')+'</div>':'<div class="empty">No items match. Post a lost or found item to help your neighbors.</div>')+'</div>';
}
function feedbackSummary(){
  var r=ratings(),a=avg(r.map(function(x){return x.rating}));
  var dist=[5,4,3,2,1].map(function(n){var c=r.filter(function(x){return x.rating===n}).length;return '<div class="hbar" style="grid-template-columns:34px 1fr 36px"><span>'+n+' ★</span><div class="bar sun"><i style="width:'+(r.length?c/r.length*100:0)+'%"></i></div><span>'+c+'</span></div>'}).join('');
  return '<div style="display:flex;gap:16px;align-items:center;margin-bottom:12px"><b style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:2.6rem;line-height:1">'+a.toFixed(1)+'</b><div><div class="starline">'+stars(a)+'</div><span class="small muted">'+r.length+' ratings</span></div></div>'+dist;
}
function vFeedback(){
  var tabs=[['rate','Rate a service'],['feedback','Share feedback'],['suggest','Suggest an idea']],f='';
  var svc='<div class="field"><label for="fs">Service</label><select id="fs" name="service">'+SERVICES.map(function(s){return '<option>'+esc(s)+'</option>'}).join('')+'</select></div>';
  var nm='<div class="field"><label for="fn">Your name (optional)</label><input id="fn" name="name" type="text" placeholder="Leave blank to stay anonymous"></div>';
  var starsIn='<div class="field"><span class="lbl" id="rl">Your rating</span><div class="stars" role="radiogroup" aria-labelledby="rl">'+[5,4,3,2,1].map(function(n){return '<label><input type="radio" name="rating" value="'+n+'" required><span aria-hidden="true">★</span><span class="sr">'+n+' stars</span></label>'}).join('')+'</div></div>';
  if(UI.fTab==='rate')f='<form class="panel" data-form="fb-rate"><h2>Rate a completed service</h2><p class="muted">Rate a service you used recently. To rate a resolved concern, open it from the Concerns page.</p>'+svc+starsIn+'<div class="field"><label for="fc">Comment (optional)</label><textarea id="fc" name="comment"></textarea></div>'+nm+'<button class="btn" type="submit">Send rating</button></form>';
  if(UI.fTab==='feedback')f='<form class="panel" data-form="fb-feedback"><h2>Share feedback</h2><p class="muted">Tell the barangay what worked and what did not.</p>'+svc+'<div class="field"><label for="fc">Your feedback</label><textarea id="fc" name="comment" required></textarea></div>'+nm+'<button class="btn" type="submit">Send feedback</button></form>';
  if(UI.fTab==='suggest')f='<form class="panel" data-form="fb-suggest"><h2>Suggest an improvement</h2><p class="muted">Have an idea for a project, policy or service? Send it to the council.</p><div class="field"><label for="fc">Your idea</label><textarea id="fc" name="comment" required placeholder="What should change, and how would it help?"></textarea></div>'+nm+'<button class="btn" type="submit">Send suggestion</button></form>';
  var rec=S.feedback.filter(function(x){return x.comment&&x.type!=='suggestion'}).sort(function(a,b){return b.ts-a.ts}).slice(0,3);
  return '<div class="container"><div class="page-head"><h1 style="font-size:clamp(1.9rem,4vw,2.6rem)">Feedback and suggestions</h1><p>Your ratings show officials which services work and which need attention.</p></div><div class="tabs" role="tablist">'+tabs.map(function(t){return '<button class="tab" role="tab" data-act="ftab" data-v="'+t[0]+'" aria-selected="'+(UI.fTab===t[0])+'">'+t[1]+'</button>'}).join('')+'</div><div class="grid2">'+f+'<aside class="panel"><h3>How residents rate us</h3>'+feedbackSummary()+'<h4 style="margin-top:18px">Recent comments</h4>'+rec.map(function(x){return '<p class="small" style="border-top:1px solid var(--line);padding-top:8px"><span class="starline">'+stars(x.rating)+'</span><br>“'+esc(x.comment)+'”<br><span class="muted">'+esc(x.service)+'</span></p>'}).join('')+'</aside></div></div>';
}

/* ---------- officials ---------- */
function vOfficials(){
  if(!isOfficial)return '<div class="container" style="max-width:520px"><div class="page-head"><h1 style="font-size:2.2rem">Officials sign-in</h1><p>For barangay officials and staff. Residents do not need to sign in to use CommuNect.</p></div><form class="panel" data-form="signin"><div class="field"><label for="pin">Access PIN</label><input id="pin" name="pin" type="password" inputmode="numeric" autocomplete="off" required></div><button class="btn" type="submit">Sign in</button><p class="hint" style="margin-top:12px">Demo access PIN: <b>1234</b></p></form></div>';
  var tabs=[['overview','Overview'],['reports','Manage reports'],['analytics','Analytics'],['content','Content and inbox']];
  var b={overview:dOverview,reports:dReports,analytics:dAnalytics,content:dContent}[UI.dTab]();
  return '<div class="container"><div class="dash"><nav class="side" role="tablist" aria-label="Dashboard">'+tabs.map(function(t){return '<button role="tab" data-act="dtab" data-v="'+t[0]+'" aria-selected="'+(UI.dTab===t[0])+'">'+t[1]+'</button>'}).join('')+'<button data-act="signout" style="margin-top:10px">Sign out</button></nav><div id="dbody">'+b+'</div></div></div>';
}
function dOverview(){
  var c=S.concerns,tot=c.length,pe=c.filter(function(x){return x.status==='Pending'}).length,ip=c.filter(function(x){return x.status==='In progress'}).length,re=c.filter(function(x){return x.status==='Resolved'}).length,up=upcomingEvents();
  var attn=c.filter(function(x){return x.status==='Pending'}).sort(function(a,b){return a.created-b.created}).slice(0,6);
  return '<h1 style="font-size:2rem">Overview</h1><div class="kpis"><div><b>'+tot+'</b>Total reports</div><div class="k-pend"><b>'+pe+'</b>Pending concerns<div class="small muted">+'+ip+' in progress</div></div><div class="k-res"><b>'+re+'</b>Resolved concerns</div><div><b>'+up.length+'</b>Upcoming activities</div><div class="propbar" title="Pending, in progress, resolved"><i style="width:'+pe/tot*100+'%;background:var(--coral)"></i><i style="width:'+ip/tot*100+'%;background:var(--sun)"></i><i style="width:'+re/tot*100+'%;background:var(--leaf)"></i></div></div>'
   +'<div class="cards2"><div class="panel"><h3>Waiting the longest</h3>'+(attn.length?attn.map(function(x){return '<div class="crow"><div><b>'+esc(x.title)+'</b><div class="small muted">'+esc(x.area)+' · '+esc(x.category)+' · waiting '+Math.max(0,Math.floor((Date.now()-x.created)/DAY))+' days</div></div><button class="btn sm" data-act="rep" data-id="'+x.id+'">Update</button></div>'}).join(''):'<div class="empty">Nothing is waiting. Every report has been picked up.</div>')+'</div>'
   +'<div class="panel"><h3>Upcoming activities</h3>'+up.slice(0,5).map(function(e){return '<div class="crow"><div><b>'+esc(e.title)+'</b><div class="small muted">'+fmtDay(e.date)+' · '+esc(e.venue)+'</div></div><div class="small muted" style="text-align:right">'+e.registered+'/'+e.capacity+'<br>registered</div></div>'}).join('')+'</div></div>'
   +'<div class="cards2"><div class="panel"><h3>Inbox</h3><p class="small muted" style="margin:0">'+S.applications.filter(function(a){return !a.reviewed}).length+' assistance requests to review · '+S.lostfound.filter(function(i){return !i.verified}).length+' lost and found posts to verify</p><button class="btn sm ghost" style="margin-top:10px" data-act="dtab" data-v="content">Open inbox</button></div><div class="panel"><h3>Resident satisfaction</h3><div class="starline" style="font-size:1.4rem">'+stars(avg(ratings().map(function(x){return x.rating})))+'</div><span class="small muted">'+avg(ratings().map(function(x){return x.rating})).toFixed(1)+' average from '+ratings().length+' ratings</span></div></div>';
}
function dReports(){
  var q=UI.repQ.toLowerCase(),l=S.concerns.filter(function(c){return (UI.repStatus==='All'||c.status===UI.repStatus)&&(UI.repCat==='All'||c.category===UI.repCat)&&(!q||(c.id+c.title+c.area+c.name).toLowerCase().indexOf(q)>-1)}).sort(function(a,b){return b.created-a.created});
  return '<h1 style="font-size:2rem">Manage reports</h1><div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px"><div style="flex:2;min-width:180px"><label class="sr" for="rq">Search reports</label><input id="rq" type="search" data-live="repQ" placeholder="Search by number, title, area or name" value="'+esc(UI.repQ)+'"></div><div style="flex:1;min-width:140px"><label class="sr" for="rs">Status</label><select id="rs" data-sel="repStatus">'+['All','Pending','In progress','Resolved'].map(function(s){return '<option'+(UI.repStatus===s?' selected':'')+'>'+s+'</option>'}).join('')+'</select></div><div style="flex:1;min-width:150px"><label class="sr" for="rcat">Category</label><select id="rcat" data-sel="repCat">'+['All'].concat(CATS).map(function(s){return '<option'+(UI.repCat===s?' selected':'')+'>'+esc(s)+'</option>'}).join('')+'</select></div></div>'
   +'<div class="panel tbl-wrap" style="padding:8px 14px"><table><thead><tr><th>No.</th><th>Concern</th><th>Area</th><th>Filed</th><th>Status</th><th></th></tr></thead><tbody>'+(l.slice(0,60).map(function(c){return '<tr><td>'+esc(c.id)+'</td><td><b>'+esc(c.title)+'</b><div class="small muted">'+esc(c.category)+'</div></td><td>'+esc(c.area)+'</td><td>'+fmtDate(c.created)+'</td><td>'+statusTag(c)+'</td><td><button class="btn sm ghost" data-act="rep" data-id="'+c.id+'">Open</button></td></tr>'}).join('')||'<tr><td colspan="6"><div class="empty">No reports match these filters.</div></td></tr>')+'</tbody></table></div>'+(l.length>60?'<p class="small muted">Showing the 60 newest of '+l.length+'. Narrow the filters to see more.</p>':'');
}
function monthsList(){var out=[],d=new Date();d.setDate(1);for(var i=5;i>=0;i--){var x=new Date(d.getFullYear(),d.getMonth()-i,1);out.push({y:x.getFullYear(),m:x.getMonth(),label:x.toLocaleDateString('en',{month:'short'})})}return out}
function stacked(){
  var ms=monthsList(),W=640,H=270,L=34,B=28,T=18,R=8,data=ms.map(function(m){return CATS.map(function(c){return S.concerns.filter(function(x){var d=new Date(x.created);return x.category===c&&d.getFullYear()===m.y&&d.getMonth()===m.m}).length})});
  var tots=data.map(function(r){return r.reduce(function(a,b){return a+b},0)}),mx=Math.max(5,Math.ceil(Math.max.apply(null,tots)/5)*5),ph=H-B-T,bw=(W-L-R)/ms.length,s='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Stacked bar chart of concerns by category per month" style="width:100%;height:auto">';
  for(var g=0;g<=4;g++){var y=T+ph-ph*g/4;s+='<line class="gl" x1="'+L+'" x2="'+(W-R)+'" y1="'+y+'" y2="'+y+'"/><text class="ax" x="'+(L-6)+'" y="'+(y+4)+'" text-anchor="end">'+Math.round(mx*g/4)+'</text>'}
  ms.forEach(function(m,i){var x=L+i*bw+bw*.18,w=bw*.64,y0=T+ph;data[i].forEach(function(v,k){if(!v)return;var h=ph*v/mx;y0-=h;s+='<rect x="'+x+'" y="'+y0+'" width="'+w+'" height="'+h+'" fill="'+CCOL[k]+'"><title>'+m.label+' · '+CATS[k]+': '+v+'</title></rect>'});s+='<text class="tt" x="'+(x+w/2)+'" y="'+(y0-5)+'" text-anchor="middle">'+tots[i]+'</text><text class="ax" x="'+(x+w/2)+'" y="'+(H-8)+'" text-anchor="middle">'+m.label+'</text>'});
  return s+'</svg><div class="legend">'+CATS.map(function(c,i){return '<span><i style="background:'+CCOL[i]+'"></i>'+esc(c)+'</span>'}).join('')+'</div>';
}
function hb(label,val,max,txt,col){return '<div class="hbar"><span>'+esc(label)+'</span><div class="bar"><i style="width:'+(max?Math.min(100,val/max*100):0)+'%;'+(col?'background:'+col:'')+'"></i></div><b>'+txt+'</b></div>'}
function dAnalytics(){
  var c=S.concerns,rd=resolvedDays(c),rate=c.length?Math.round(c.filter(function(x){return x.status==='Resolved'}).length/c.length*100):0;
  var heat=AREAS.map(function(a){return CATS.map(function(k){return c.filter(function(x){return x.area===a&&x.category===k}).length})}),hm=Math.max.apply(null,[].concat.apply([],heat));
  var rec=[];AREAS.forEach(function(a,i){CATS.forEach(function(k,j){if(heat[i][j]>=3){var last=c.filter(function(x){return x.area===a&&x.category===k&&Date.now()-x.created<60*DAY}).length;rec.push({a:a,k:k,n:heat[i][j],last:last})}})});rec.sort(function(x,y){return y.n-x.n});
  var byCat=CATS.map(function(k,i){var l=c.filter(function(x){return x.category===k}),d=resolvedDays(l);return {k:k,col:CCOL[i],avg:avg(d),rate:l.length?Math.round(l.filter(function(x){return x.status==='Resolved'}).length/l.length*100):0}});
  var maxD=Math.max.apply(null,byCat.map(function(x){return x.avg}).concat([1]));
  var rt=ratings(),svcs=SERVICES.map(function(s){var l=rt.filter(function(x){return x.service===s});return {s:s,a:avg(l.map(function(x){return x.rating})),n:l.length}}).filter(function(x){return x.n}).sort(function(a,b){return b.a-a.a});
  var past=pastEvents(),totAtt=past.reduce(function(a,e){return a+(e.attended||0)},0),totReg=past.reduce(function(a,e){return a+e.registered},0),vols=S.events.reduce(function(a,e){return a+e.volunteers},0);
  var sugg=S.feedback.filter(function(f){return f.type==='suggestion'}).sort(function(a,b){return b.ts-a.ts}).slice(0,4);
  var worst=rec[0];
  return '<h1 style="font-size:2rem">Analytics and reports</h1>'
   +(worst?'<div class="panel" style="border-left:6px solid var(--coral);margin-bottom:20px"><b>Biggest repeat problem:</b> '+esc(worst.k.toLowerCase())+' in '+esc(worst.a)+' has been reported '+worst.n+' times ('+worst.last+' in the last 60 days). Consider a lasting fix instead of another one-off repair.</div>':'')
   +'<div class="panel"><h3>Common concerns by category and month</h3>'+stacked()+'</div>'
   +'<div class="cards2"><div class="panel"><h3>Resolution performance</h3><div style="display:flex;gap:20px;align-items:center;margin-bottom:16px"><div class="donut" style="background:conic-gradient(var(--leaf) '+rate*3.6+'deg,var(--surface2) 0)" role="img" aria-label="Resolution rate '+rate+' percent"><div>'+rate+'%</div></div><div><b style="font-size:1.6rem;font-family:\'Bricolage Grotesque\',sans-serif">'+avg(rd).toFixed(1)+' days</b><div class="small muted">average resolution time</div><div class="small muted">'+c.filter(function(x){return x.status==='Resolved'}).length+' of '+c.length+' resolved</div></div></div><h4>Average days to resolve, by category</h4>'+byCat.map(function(x){return hb(x.k,x.avg,maxD,x.avg.toFixed(1)+' d',x.col)}).join('')+'</div>'
   +'<div class="panel"><h3>Resident feedback summary</h3>'+feedbackSummary()+'<h4 style="margin-top:16px">Average rating by service</h4>'+svcs.map(function(x){return hb(x.s,x.a,5,x.a.toFixed(1)+' ★','var(--sun)')}).join('')+'</div></div>'
   +'<div class="panel" style="margin-top:20px"><h3>Areas with recurring problems</h3><p class="small muted">Number of reports per area and category over the past six months. Combinations with 3 or more are marked as recurring.</p><div class="tbl-wrap"><table class="heat"><thead><tr><th>Area</th>'+CATS.map(function(k){return '<th class="v">'+esc(k)+'</th>'}).join('')+'</tr></thead><tbody>'+AREAS.map(function(a,i){return '<tr><th scope="row" style="color:var(--ink)">'+a.replace('Purok ','')+'</th>'+heat[i].map(function(v){return '<td class="c" style="background:'+(v?'color-mix(in srgb,var(--coral) '+Math.round(12+v/hm*60)+'%,transparent)':'transparent')+'">'+(v||'·')+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>'
   +(rec.length?'<h4 style="margin-top:16px">Recurring problems</h4>'+rec.slice(0,6).map(function(x){return '<div class="crow"><div><b>'+esc(x.k)+'</b> · '+esc(x.a)+'</div><span class="tag coral">'+x.n+' reports'+(x.last?' · '+x.last+' recent':'')+'</span></div>'}).join(''):'')+'</div>'
   +'<div class="panel" style="margin-top:20px"><h3>Event participation</h3><div class="kpis" style="margin-bottom:16px;grid-template-columns:repeat(3,1fr)"><div><b>'+past.length+'</b>events held</div><div><b>'+totAtt+'</b>residents attended</div><div><b>'+(totReg?Math.round(totAtt/totReg*100):0)+'%</b>of registrants showed up</div></div>'
   +past.map(function(e){return hb(e.title,e.attended||0,e.capacity,(e.attended||0)+' / '+e.registered)}).join('')+'<h4 style="margin-top:16px">Upcoming sign-ups</h4>'+upcomingEvents().map(function(e){return hb(e.title,e.registered,e.capacity,e.registered+' / '+e.capacity,'var(--sea)')}).join('')+'<p class="small muted">Volunteers signed up across all events: '+vols+'</p></div>'
   +'<div class="panel" style="margin-top:20px"><h3>Latest suggestions</h3>'+sugg.map(function(s){return '<div class="crow"><div>“'+esc(s.comment)+'”<div class="small muted">'+esc(s.name)+' · '+fmtDate(s.ts)+'</div></div></div>'}).join('')+'</div>';
}
function dContent(){
  var apps=S.applications.slice().sort(function(a,b){return b.ts-a.ts}),pend=S.lostfound.filter(function(i){return !i.verified});
  return '<h1 style="font-size:2rem">Content and inbox</h1><div class="cards2" style="margin-top:0">'
   +'<form class="panel" data-form="post-ann"><h3>Post an announcement</h3><div class="field"><label for="pt">Title</label><input id="pt" name="title" type="text" required></div><div class="field"><label for="pc">Type</label><select id="pc" name="category">'+['Official','Water','Electricity','Garbage','Disaster'].map(function(x){return '<option>'+x+'</option>'}).join('')+'</select></div><div class="field"><label for="pb">Message</label><textarea id="pb" name="body" required></textarea></div><div class="field"><label class="check"><input type="checkbox" name="urgent"><span>Mark as urgent and pin on the home page</span></label></div><button class="btn" type="submit">Publish announcement</button></form>'
   +'<form class="panel" data-form="add-event"><h3>Add an event</h3><div class="field"><label for="et">Title</label><input id="et" name="title" type="text" required></div><div class="row2"><div class="field"><label for="ety">Type</label><select id="ety" name="type">'+['Meeting','Sports','Clean-up','Program'].map(function(x){return '<option>'+x+'</option>'}).join('')+'</select></div><div class="field"><label for="ed">Date</label><input id="ed" name="date" type="date" required></div></div><div class="row2"><div class="field"><label for="eti">Time</label><input id="eti" name="time" type="text" placeholder="8:00 AM – 12:00 NN" required></div><div class="field"><label for="ev">Venue</label><input id="ev" name="venue" type="text" required></div></div><div class="row2"><div class="field"><label for="ec">Capacity</label><input id="ec" name="cap" type="number" min="1" value="100" required></div><div class="field"><label for="evo">Volunteer slots</label><input id="evo" name="vol" type="number" min="0" value="0"></div></div><div class="field"><label for="ede">Details</label><textarea id="ede" name="desc" style="min-height:70px"></textarea></div><button class="btn" type="submit">Add event</button></form></div>'
   +'<div class="panel" style="margin-top:20px"><h3>Assistance requests</h3>'+(apps.length?'<div class="tbl-wrap"><table><thead><tr><th>Program</th><th>Resident</th><th>Household</th><th>Note</th><th></th></tr></thead><tbody>'+apps.map(function(a){return '<tr><td>'+esc(a.program)+'</td><td>'+esc(a.name)+'<div class="small muted">'+esc(a.contact)+' · '+esc(a.purok)+'</div></td><td>'+a.size+'</td><td>'+esc(a.note)+'</td><td>'+(a.reviewed?'<span class="tag leaf">Reviewed</span>':'<button class="btn sm" data-act="app-ok" data-id="'+a.id+'">Mark reviewed</button>')+'</td></tr>'}).join('')+'</tbody></table></div>':'<div class="empty">No assistance requests yet. Requests residents submit from the Assistance page appear here.</div>')+'</div>'
   +'<div class="panel" style="margin-top:20px"><h3>Lost and found desk</h3>'+S.lostfound.map(function(i){return '<div class="crow"><div><span class="tag '+(i.kind==='lost'?'coral':'leaf')+'">'+i.kind+'</span> <b>'+esc(i.title)+'</b><div class="small muted">'+esc(i.place)+' · posted by '+esc(i.name)+(i.contact?' · '+esc(i.contact):'')+' · '+i.status+(i.verified?'':' · not yet verified')+'</div></div><div style="display:flex;gap:6px;flex-wrap:wrap">'+(i.verified?'':'<button class="btn sm" data-act="lf-verify" data-id="'+i.id+'">Verify</button>')+(i.status==='Open'?'<button class="btn sm ghost" data-act="lf-return" data-id="'+i.id+'">Mark returned</button>':'')+'<button class="btn sm ghost" data-act="lf-del" data-id="'+i.id+'">Remove</button></div></div>'}).join('')+'</div>'
   +'<p style="margin-top:20px"><button class="btn sm ghost" data-act="reset">Reset demo data</button></p>';
}

/* ---------- router ---------- */
var VIEWS={home:vHome,announcements:vAnnouncements,concerns:vConcerns,events:vEvents,assistance:vAssistance,'lost-found':vLostFound,feedback:vFeedback,officials:vOfficials};
var TITLES2={home:'Home',announcements:'Announcements',concerns:'Community concerns',events:'Events and activities',assistance:'Assistance and opportunities','lost-found':'Lost and found',feedback:'Feedback and suggestions',officials:'Officials'};
function cur(){var h=(location.hash||'#/home').replace(/^#\/?/,'').split('/')[0];return VIEWS[h]?h:'home'}
function render(keepScroll){
  var a=document.activeElement,id=a&&a.id,ss=a&&a.selectionStart,y=window.scrollY,c=cur();
  $('#app').innerHTML=VIEWS[c]();
  renderNav(c);renderNotifs();
  document.title=TITLES2[c]+' – CommuNect';
  if(id){var n=document.getElementById(id);if(n&&(n.tagName==='INPUT'||n.tagName==='TEXTAREA')){n.focus();try{n.setSelectionRange(ss,ss)}catch(e){}}}
  if(keepScroll)window.scrollTo(0,y)
}
window.addEventListener('hashchange',function(){$('#nav').classList.remove('open');$('#notif').hidden=true;render();window.scrollTo(0,0);$('#app').focus({preventScroll:true})});

/* ---------- actions ---------- */
function openAnn(id){
  var a=S.announcements.filter(function(x){return x.id===id})[0];if(!a)return;
  modal(mhead(esc(a.title))+'<div class="meta" style="margin-bottom:14px"><span class="tag '+a.category+'">'+a.category+'</span>'+(a.urgent?'<span class="tag coral">Urgent</span>':'')+'<span class="verified">✔ Verified by Office of the Punong Barangay</span><span class="small muted">'+fmtDate(a.ts)+'</span></div>'+a.body.split('\n').map(function(l){return l?'<p>'+esc(l)+'</p>':''}).join(''));
}
function goTrack(id){UI.cTab='track';UI.trackId=id;closeModal();if(cur()==='concerns')render();else location.hash='#/concerns'}
function regModal(id,role){
  var e=S.events.filter(function(x){return x.id===id})[0];if(!e)return;
  modal(mhead((role==='Volunteer'?'Volunteer for ':'Register for ')+esc(e.title))+'<p class="muted">'+fmtDay(e.date)+' · '+esc(e.time)+' · '+esc(e.venue)+'</p><form data-form="register"><input type="hidden" name="id" value="'+e.id+'"><input type="hidden" name="role" value="'+role+'"><div class="field"><label for="rn">Full name</label><input id="rn" name="name" type="text" required autocomplete="name"></div><div class="row2"><div class="field"><label for="rc2">Mobile number</label><input id="rc2" name="contact" type="tel" required></div><div class="field"><label for="rp">Purok</label><select id="rp" name="purok">'+AREAS.map(function(a){return '<option>'+a+'</option>'}).join('')+'</select></div></div>'+(role==='Participant'?'<div class="field"><label for="rg">Number of people joining</label><input id="rg" name="n" type="number" min="1" max="'+Math.max(1,e.capacity-e.registered)+'" value="1"></div>':'')+'<button class="btn" type="submit">'+(role==='Volunteer'?'Sign up as volunteer':'Confirm registration')+'</button></form>');
}
function applyModal(id){
  var a=S.assistance.filter(function(x){return x.id===id})[0];if(!a)return;
  modal(mhead('Apply: '+esc(a.title))+'<p class="muted">The barangay desk will review your request and contact you about next steps and documents.</p><form data-form="apply"><input type="hidden" name="id" value="'+a.id+'"><div class="field"><label for="an">Full name</label><input id="an" name="name" type="text" required></div><div class="row2"><div class="field"><label for="ac">Mobile number</label><input id="ac" name="contact" type="tel" required></div><div class="field"><label for="ap">Purok</label><select id="ap" name="purok">'+AREAS.map(function(x){return '<option>'+x+'</option>'}).join('')+'</select></div></div><div class="field"><label for="as2">Household members</label><input id="as2" name="size" type="number" min="1" value="4" required></div><div class="field"><label for="ano">Anything we should know? (optional)</label><textarea id="ano" name="note" style="min-height:70px"></textarea></div><button class="btn" type="submit">Send request</button></form>');
}
function lfModal(){
  modal(mhead('Report a lost or found item')+'<form data-form="lf"><div class="field"><span class="lbl">This item was</span><label class="check" style="margin-bottom:6px"><input type="radio" name="kind" value="lost" checked><span>Lost by me or someone I know</span></label><label class="check"><input type="radio" name="kind" value="found"><span>Found by me</span></label></div><div class="row2"><div class="field"><label for="lt">Item</label><input id="lt" name="title" type="text" required placeholder="e.g. Black umbrella"></div><div class="field"><label for="lcat">Type</label><select id="lcat" name="category">'+['Wallet or bag','Keys','Phone or electronics','ID or documents','Pet','Other'].map(function(x){return '<option>'+x+'</option>'}).join('')+'</select></div></div><div class="row2"><div class="field"><label for="lp">Where</label><input id="lp" name="place" type="text" required></div><div class="field"><label for="ld">When</label><input id="ld" name="date" type="date" required value="'+new Date().toISOString().slice(0,10)+'"></div></div><div class="field"><label for="lde">Description</label><textarea id="lde" name="desc" style="min-height:70px" placeholder="Color, brand, marks. Leave out details only the owner would know."></textarea></div><div class="row2"><div class="field"><label for="ln">Your name</label><input id="ln" name="name" type="text" required></div><div class="field"><label for="lc">Mobile number</label><input id="lc" name="contact" type="tel" required><div class="hint">Shared only with the desk officer.</div></div></div><button class="btn" type="submit">Post item</button></form>');
}
function lfContact(id){
  var i=S.lostfound.filter(function(x){return x.id===id})[0];if(!i)return;
  modal(mhead(i.kind==='lost'?'Found this item?':'Is this yours?')+'<p><b>'+esc(i.title)+'</b> · '+esc(i.place)+'</p><div class="panel" style="background:var(--surface2)"><h4>Authorized contact</h4><p style="margin:0"><b>Barangay Desk Officer</b><br>Barangay Hall · Mon–Fri 8 AM–5 PM, Sat 8 AM–12 NN<br>Hotline: 0917 555 0142</p></div><h4 style="margin-top:16px">Safe return</h4><ul style="padding-left:18px"><li>Go through the desk officer instead of meeting a stranger alone.</li><li>'+(i.kind==='lost'?'Bring the item to the desk, or call and the desk will contact the owner.':'Bring a valid ID and describe the item. The desk checks details before handing it over.')+'</li><li>If meeting in person, do it at the barangay hall during office hours.</li></ul>');
}
function repModal(id){
  var c=S.concerns.filter(function(x){return x.id===id})[0];if(!c)return;
  modal(mhead('Report '+esc(c.id))+detail(c,{official:true})+'<form data-form="rep-update" class="panel" style="background:var(--surface2)"><input type="hidden" name="id" value="'+c.id+'"><h4>Post an update</h4><div class="row2"><div class="field"><label for="us">Status</label><select id="us" name="status">'+['Pending','In progress','Resolved'].map(function(s){return '<option'+(c.status===s?' selected':'')+'>'+s+'</option>'}).join('')+'</select></div></div><div class="field"><label for="ux">Message to the resident</label><textarea id="ux" name="note" required style="min-height:70px" placeholder="e.g. Crew scheduled for tomorrow morning."></textarea></div><button class="btn" type="submit">Save update</button></form>');
}
var ACT={
 menu:function(t){var n=$('#nav');var o=n.classList.toggle('open');t.setAttribute('aria-expanded',o)},
 notif:function(t){var p=$('#notif');p.hidden=!p.hidden;t.setAttribute('aria-expanded',!p.hidden);if(!p.hidden){S.lastSeen=Date.now();save();setTimeout(function(){$('#nbadge').hidden=true},50)}},
 close:closeModal,
 'open-ann':function(t,e){e.preventDefault();$('#notif').hidden=true;openAnn(t.dataset.id)},
 'go-track':function(t,e){e.preventDefault();$('#notif').hidden=true;goTrack(t.dataset.id)},
 'to-submit':function(){UI.cTab='submit'},
 chip:function(t){UI[t.dataset.k]=t.dataset.v;render(true)},
 ctab:function(t){UI.cTab=t.dataset.v;render(true)},
 ftab:function(t){UI.fTab=t.dataset.v;render(true)},
 dtab:function(t){UI.dTab=t.dataset.v;closeModal();render();window.scrollTo(0,0)},
 reg:function(t){regModal(t.dataset.id,t.dataset.role)},
 apply:function(t){applyModal(t.dataset.id)},
 'lf-report':lfModal,
 'lf-contact':function(t){lfContact(t.dataset.id)},
 rep:function(t){repModal(t.dataset.id)},
 signout:function(){isOfficial=false;try{sessionStorage.removeItem('communect:official')}catch(e){}location.hash='#/home';render()},
 'app-ok':function(t){S.applications.forEach(function(a){if(a.id===t.dataset.id)a.reviewed=true});save();render(true)},
 'lf-verify':function(t){S.lostfound.forEach(function(i){if(i.id===t.dataset.id)i.verified=true});save();render(true);toast('Item verified and now visible without a warning.')},
 'lf-return':function(t){S.lostfound.forEach(function(i){if(i.id===t.dataset.id)i.status='Returned'});save();render(true);toast('Marked as returned.')},
 'lf-del':function(t){S.lostfound=S.lostfound.filter(function(i){return i.id!==t.dataset.id});save();render(true);toast('Item removed.')},
 reset:function(){if(confirm('Reset all demo data? Your own reports and sign-ups in this browser will be removed.')){S=seed();save();render();toast('Demo data reset.')}}
};
document.addEventListener('click',function(e){
  var t=e.target.closest('[data-act]');
  if(t&&ACT[t.dataset.act]&&!t.disabled){ACT[t.dataset.act](t,e)}
  if(!e.target.closest('.hdr-tools')){var n=$('#notif');if(!n.hidden){n.hidden=true;$('[data-act="notif"]').setAttribute('aria-expanded','false')}}
  if(e.target===$('#modal'))closeModal();
});
document.addEventListener('input',function(e){var k=e.target.dataset&&e.target.dataset.live;if(k){UI[k]=e.target.value;render(true)}});
document.addEventListener('change',function(e){var k=e.target.dataset&&e.target.dataset.sel;if(k){UI[k]=e.target.value;render(true)}});

function fd(f){var o={},d=new FormData(f);d.forEach(function(v,k){o[k]=typeof v==='string'?v.trim():v});o._f=f;return o}
var FORMS={
 'hero-track':function(f){var v=$('#ht').value.trim();if(!v)return;UI.cTab='track';UI.trackId=v;location.hash='#/concerns';if(cur()==='concerns')render()},
 concern:function(f){
  var d=fd(f),now=Date.now();S.counter++;
  var c={id:'CN-'+new Date().getFullYear()+'-'+pad(S.counter,4),category:d.category,area:d.area,title:d.title,desc:d.desc,name:d.name,contact:d.contact||'',created:now,status:'Pending',updates:[{t:now,s:'Pending',x:'Report received by the barangay desk.'}],resolvedAt:null,pub:!!d.pub,rated:false};
  S.concerns.push(c);S.myIds.push(c.id);save();UI.cTab='track';UI.trackId=c.id;render();renderNotifs();
  modal(mhead('Concern submitted')+'<p>Your tracking number is</p><p style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:2.2rem;font-weight:800;margin:0 0 10px">'+c.id+'</p><p class="muted">Write it down. It is also saved on this device under “Your reports”. You will get a notification here whenever the barangay posts an update.</p><button class="btn" data-act="close">View my report</button>');
 },
 track:function(f){UI.trackId=fd(f).id;render(true)},
 'rate-concern':function(f){
  var d=fd(f),c=S.concerns.filter(function(x){return x.id===d.id})[0];if(!c)return;
  c.rated=true;S.feedback.push({id:'F'+Date.now(),type:'rating',service:'Concern handling',rating:+d.rating,comment:d.comment||'',name:'Anonymous',ts:Date.now(),concern:c.id});save();render(true);toast('Thank you. Your rating was sent to the barangay.');
 },
 register:function(f){
  var d=fd(f),e=S.events.filter(function(x){return x.id===d.id})[0];if(!e)return;
  if(d.role==='Volunteer'){if(e.volunteers>=e.volSlots){toast('Volunteer slots are full.');return}e.volunteers++}
  else{var n=Math.max(1,+d.n||1);if(e.registered+n>e.capacity){toast('Only '+(e.capacity-e.registered)+' spots left.');return}e.registered+=n}
  S.myRegs.push({eventId:e.id,role:d.role});save();closeModal();render(true);toast(d.role==='Volunteer'?'You are signed up as a volunteer. See you there!':'You are registered. See you there!');
 },
 apply:function(f){
  var d=fd(f),a=S.assistance.filter(function(x){return x.id===d.id})[0];if(!a)return;
  a.applicants++;S.applications.push({id:'AP'+Date.now(),assistId:a.id,program:a.title,name:d.name,contact:d.contact,purok:d.purok,size:d.size,note:d.note||'',ts:Date.now(),reviewed:false,mine:true});save();closeModal();render(true);toast('Request sent. The barangay desk will contact you.');
 },
 lf:function(f){
  var d=fd(f);S.lostfound.unshift({id:'L'+Date.now(),kind:d.kind,title:d.title,category:d.category,place:d.place,date:new Date(d.date+'T12:00:00').getTime(),desc:d.desc||'No further description.',name:d.name,contact:d.contact,status:'Open',verified:false});save();closeModal();render(true);toast('Item posted. The desk will verify it shortly.');
 },
 'fb-rate':function(f){var d=fd(f);S.feedback.push({id:'F'+Date.now(),type:'rating',service:d.service,rating:+d.rating,comment:d.comment||'',name:d.name||'Anonymous',ts:Date.now()});save();render(true);toast('Thanks for rating this service.')},
 'fb-feedback':function(f){var d=fd(f);S.feedback.push({id:'F'+Date.now(),type:'feedback',service:d.service,rating:0,comment:d.comment,name:d.name||'Anonymous',ts:Date.now()});save();f.reset();toast('Feedback sent to the barangay council.')},
 'fb-suggest':function(f){var d=fd(f);S.feedback.push({id:'F'+Date.now(),type:'suggestion',service:'Suggestion',rating:0,comment:d.comment,name:d.name||'Anonymous',ts:Date.now()});save();f.reset();toast('Suggestion sent. Thank you!')},
 signin:function(f){var d=fd(f);if(d.pin==='1234'){isOfficial=true;try{sessionStorage.setItem('communect:official','1')}catch(e){}UI.dTab='overview';render()}else{toast('That PIN is not correct. Try again.');f.reset()}},
 'rep-update':function(f){
  var d=fd(f),c=S.concerns.filter(function(x){return x.id===d.id})[0];if(!c)return;
  c.status=d.status;c.updates.push({t:Date.now(),s:d.status,x:d.note,by:'Barangay officials'});
  if(d.status==='Resolved')c.resolvedAt=c.resolvedAt||Date.now();else c.resolvedAt=null;
  save();closeModal();render(true);toast('Update posted. The resident will be notified.');
 },
 'post-ann':function(f){var d=fd(f);if(d.urgent)S.announcements.forEach(function(a){a.urgent=false});S.announcements.push({id:'A'+Date.now(),title:d.title,category:d.category,urgent:!!d.urgent,ts:Date.now(),body:d.body});save();f.reset();renderNotifs();toast('Announcement published.')},
 'add-event':function(f){var d=fd(f),dt=new Date(d.date+'T00:00:00').getTime();S.events.push({id:'E'+Date.now(),title:d.title,type:d.type,date:dt+8*36e5,time:d.time,venue:d.venue,desc:d.desc||'',capacity:+d.cap||50,registered:0,volSlots:+d.vol||0,volunteers:0,attended:null});save();f.reset();renderNotifs();toast('Event added.')}
};
document.addEventListener('submit',function(e){
  var f=e.target.closest('form[data-form]');if(!f)return;e.preventDefault();
  var fn=FORMS[f.dataset.form];if(fn)fn(f);
});

render();
})();
