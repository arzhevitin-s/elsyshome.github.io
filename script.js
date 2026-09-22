
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
function saveDemo(formId,noteId,type){
 const form=document.getElementById(formId);
 form.addEventListener('submit',e=>{
   e.preventDefault();
   const fd=new FormData(form),obj={type,...state};
   for(const [k,v] of fd.entries()) obj[k]=(v && typeof v==='object' && 'name' in v)?v.name:v;
   localStorage.setItem('elsys_'+type+'_'+Date.now(),JSON.stringify(obj));
   document.getElementById(noteId).textContent='Демо-заявка сохранена. В боевой версии данные уйдут в CRM/обработчик.';
 });
}
saveDemo('bookingForm','bookingNote','booking');
saveDemo('remoteForm','remoteNote','remote');
