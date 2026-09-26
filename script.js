
const METRIKA_ID=112936089;
let metrikaReady=false;

function loadMetrika(){
  if(metrikaReady || window.ym) return;
  (function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for(let j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r)return;}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
  })(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');

  ym(METRIKA_ID,'init',{
    clickmap:true,
    trackLinks:true,
    accurateTrackBounce:true,
    webvisor:true
  });
  metrikaReady=true;
}

function getUtm(){
  const p=new URLSearchParams(location.search);
  return {
    utm_source:p.get('utm_source')||'',
    utm_medium:p.get('utm_medium')||'',
    utm_campaign:p.get('utm_campaign')||'',
    utm_content:p.get('utm_content')||'',
    utm_term:p.get('utm_term')||''
  };
}
const utm=getUtm();
if(Object.values(utm).some(Boolean)) localStorage.setItem('elsys_utm',JSON.stringify(utm));

function goal(name,params={}){
  if(window.ym && metrikaReady){
    ym(METRIKA_ID,'reachGoal',name,{...params,...state,...utm});
  }
}

function setupAnalyticsConsent(){
  const banner=document.getElementById('cookieBanner');
  const decision=localStorage.getItem('elsys_analytics_consent');
  if(decision==='yes'){ loadMetrika(); }
  else if(decision!=='no'){ banner.hidden=false; }

  document.getElementById('cookieAccept').addEventListener('click',()=>{
    localStorage.setItem('elsys_analytics_consent','yes');
    banner.hidden=true;
    loadMetrika();
    setTimeout(()=>goal('analytics_consent'),250);
  });
  document.getElementById('cookieDecline').addEventListener('click',()=>{
    localStorage.setItem('elsys_analytics_consent','no');
    banner.hidden=true;
  });
}


const state={kind:'',concept:'',fixture:''};
const map={
 'Светлая|Ванна|Светлая фурнитура':['assets/bath_1.jpg','559 000 ₽'],
 'Светлая|Ванна|Тёмная фурнитура':['assets/bath_2.jpg','559 000 ₽'],
 'Светлая|Душ|Светлая фурнитура':['assets/shower_1.jpg','599 000 ₽'],
 'Светлая|Душ|Тёмная фурнитура':['assets/shower_2.jpg','599 000 ₽'],
 'Тёплая|Ванна|Светлая фурнитура':['assets/bath_3.jpg','559 000 ₽'],
 'Тёплая|Ванна|Тёмная фурнитура':['assets/bath_4.jpg','559 000 ₽'],
 'Тёплая|Душ|Светлая фурнитура':['assets/shower_3.jpg','599 000 ₽'],
 'Тёплая|Душ|Тёмная фурнитура':['assets/shower_4.jpg','599 000 ₽'],
 'Тёмная|Ванна|Светлая фурнитура':['assets/bath_5.jpg','559 000 ₽'],
 'Тёмная|Ванна|Тёмная фурнитура':['assets/bath_6.jpg','559 000 ₽'],
 'Тёмная|Душ|Светлая фурнитура':['assets/shower_5.jpg','599 000 ₽'],
 'Тёмная|Душ|Тёмная фурнитура':['assets/shower_6.jpg','599 000 ₽']
};
function showStep(n){
 document.querySelectorAll('.quiz-step').forEach(x=>x.classList.remove('active'));
 const el=document.querySelector(`.quiz-step[data-step="${n}"]`);
 if(el) el.classList.add('active');
 document.getElementById('progressBar').style.width=(n*33.33)+'%';
}
function finish(){
 goal('quiz_complete');
 document.querySelectorAll('.quiz-step').forEach(x=>x.classList.remove('active'));
 document.getElementById('progressBar').style.width='100%';
 const key=`${state.concept}|${state.kind}|${state.fixture}`;
 const [img,price]=map[key];
 document.getElementById('resultImage').src=img;
 document.getElementById('resultPrice').textContent=price;
 document.getElementById('resultTitle').textContent=`${state.concept} · ${state.kind} · ${state.fixture}`;
 document.getElementById('quizResult').classList.add('active');
 const summary=`${state.concept} · ${state.kind} · ${state.fixture} · ${price}`;
 document.getElementById('bookingSummary').textContent='Выбрано: '+summary;
 document.getElementById('remoteSummary').textContent='Выбрано: '+summary;
}
document.querySelectorAll('.choice').forEach(btn=>{
 btn.addEventListener('click',()=>{
   const k=btn.dataset.key,v=btn.dataset.value; state[k]=v;
   const parent=btn.closest('.quiz-step');
   parent.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));
   btn.classList.add('selected');
   const step=Number(parent.dataset.step);
   if(step===1) goal('quiz_kind',{choice:v});
   if(step===2) goal('quiz_style',{choice:v});
   if(step===3) goal('quiz_fixture',{choice:v});
   if(step<3) setTimeout(()=>showStep(step+1),120); else setTimeout(finish,120);
 });
});
document.getElementById('restartQuiz').onclick=()=>{
 state.kind=state.concept=state.fixture='';
 document.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));
 document.getElementById('quizResult').classList.remove('active'); showStep(1);
};
document.getElementById('bookVisit').onclick=()=>document.getElementById('booking').scrollIntoView({behavior:'smooth'});
document.getElementById('remoteOffer').onclick=()=>document.getElementById('remote').scrollIntoView({behavior:'smooth'});
const d=document.getElementById('visitDate');
const now=new Date(),min=new Date(now),max=new Date(now); min.setDate(min.getDate()+1); max.setDate(max.getDate()+30);
const iso=x=>x.toISOString().slice(0,10); d.min=iso(min); d.max=iso(max);

const LEAD_ENDPOINT='https://script.google.com/macros/s/AKfycbwA7H2xlUhZ5lPc2hO2zXVVP8jqRdIhUDNDClCH6RBYhWS0SM6Sz2TKmFel5hoYwVls9A/exec';

function getStoredUtm(){
  try {
    return JSON.parse(localStorage.getItem('elsys_utm') || '{}');
  } catch(e) {
    return {};
  }
}

async function fileToBase64(file){
  if(!file) return null;
  return await new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve(String(reader.result).split(',')[1] || '');
    reader.onerror=reject;
    reader.readAsDataURL(file);
  });
}

async function sendLead(formId,noteId,type){
 const form=document.getElementById(formId);
 form.addEventListener('submit',async e=>{
   e.preventDefault();

   const note=document.getElementById(noteId);
   const submit=form.querySelector('button[type="submit"]');
   submit.disabled=true;
   note.textContent='Отправляем заявку…';

   try {
     const fd=new FormData(form);
     const storedUtm=getStoredUtm();
     const obj={
       type,
       kind:state.kind || '',
       style:state.concept || '',
       fixture:state.fixture || '',
       price:state.kind==='Ванна' ? '559000' : state.kind==='Душ' ? '599000' : '',
       phone:String(fd.get('phone') || '').trim(),
       contact:String(fd.get('contact') || ''),
       visit_date:String(fd.get('visit_date') || ''),
       dimensions:String(fd.get('size') || ''),
       utm_source:utm.utm_source || storedUtm.utm_source || '',
       utm_medium:utm.utm_medium || storedUtm.utm_medium || '',
       utm_campaign:utm.utm_campaign || storedUtm.utm_campaign || '',
       utm_content:utm.utm_content || storedUtm.utm_content || '',
       utm_term:utm.utm_term || storedUtm.utm_term || '',
       page_url:location.href,
       submitted_at:new Date().toISOString()
     };

     const photo=fd.get('photo');
     if(photo && photo instanceof File && photo.size>0){
       // Сейчас серверная часть сохраняет основные данные заявки.
       // Имя файла передаём в таблицу; сам файл подключим отдельным шагом.
       obj.photo_name=photo.name;
     }

     await fetch(LEAD_ENDPOINT,{
       method:'POST',
       mode:'no-cors',
       headers:{'Content-Type':'text/plain;charset=utf-8'},
       body:JSON.stringify(obj)
     });

     goal(type==='booking'?'survey_submit':'remote_submit',{
       contact:obj.contact,
       visit_date:obj.visit_date
     });

     note.textContent=type==='booking'
       ? 'Заявка отправлена. Свяжемся, чтобы согласовать точное время замера.'
       : 'Заявка отправлена. Свяжемся для предварительного разбора.';
     form.reset();
   } catch(err) {
     console.error(err);
     note.textContent='Не удалось отправить заявку. Позвоните +7 982 495-92-48 или напишите в MAX.';
   } finally {
     submit.disabled=false;
   }
 });
}
sendLead('bookingForm','bookingNote','booking');
sendLead('remoteForm','remoteNote','remote');


let quizStarted=false;
function markQuizStart(){
  if(quizStarted) return;
  quizStarted=true;
  goal('quiz_start');
}
document.querySelectorAll('a[href="#quiz"], .choice').forEach(el=>el.addEventListener('click',markQuizStart,{once:true}));

document.getElementById('bookVisit').addEventListener('click',()=>goal('survey_click'));
document.getElementById('remoteOffer').addEventListener('click',()=>goal('remote_click'));

document.querySelectorAll('a[href^="tel:"]').forEach(a=>a.addEventListener('click',()=>goal('phone_click')));
document.querySelectorAll('a[href*="max.ru/u/"]').forEach(a=>a.addEventListener('click',()=>goal('max_click')));
document.querySelectorAll('a[href*="max.ru/channel_"]').forEach(a=>a.addEventListener('click',()=>goal('max_channel_click')));

document.getElementById('visitDate').addEventListener('change',e=>goal('date_selected',{date:e.target.value}));

setupAnalyticsConsent();
