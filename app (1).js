const OK=/^https:\/\/.+\.supabase\.co/.test(NOVA.URL),sb=OK?supabase.createClient(NOVA.URL,NOVA.KEY):null,$=s=>document.querySelector(s);
const WARN='<div class=card><h3>السيرفر غير مربوط بعد</h3><p>ضع رابط مشروع Supabase والمفتاح داخل ملف config.js ثم أعد تحميل الصفحة.</p></div>';
let me=null,P=null,Q='',K='';
const E=s=>String(s??'').replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const COST={offer:10,market:30};
async function init(){addEventListener('hashchange',route);
 if(OK){const{data}=await sb.auth.getSession();me=data.session?.user||null;await prof();
  sb.auth.onAuthStateChange(async(_,s)=>{me=s?.user||null;await prof();route();bell()})}
 route();bell()}
async function prof(){P=null;if(me){await sb.rpc('refill');P=(await sb.from('profiles').select('*').eq('id',me.id).single()).data}
 $('#pts').textContent=P?P.daily+P.bonus:'—';$('#auth').textContent=me?'خروج':'دخول'}
function authBtn(){if(!OK)return alert('اربط Supabase أولًا في config.js');me?sb.auth.signOut():dlg.showModal()}
af.onsubmit=async e=>{const f=()=>({email:em.value,password:pw.value});const{error}=await sb.auth.signInWithPassword(f());if(error)alert('بيانات غير صحيحة')};
su.onclick=async()=>{const{error}=await sb.auth.signUp({email:em.value,password:pw.value});alert(error?error.message:'تم! تحقق من بريدك إن طُلب التأكيد');dlg.close()};
const steps=`<div class=grid><div class=card><h3>1) سجّل</h3>احصل على 30 نقطة مجانية كل يوم.</div><div class=card><h3>2) انشر</h3>عرض بـ10 نقاط، مزاد من 30، أو سوق بـ30.</div><div class=card><h3>3) تواصل</h3>نحن الوسيط الآمن بين العميل والمستقل.</div><div class=card><h3>4) زد رصيدك</h3>اشترِ نقاطًا من صفحة الباقات.</div></div>`;
const V={
home:()=>`<section class=hero><h1>نوفا — وسيطك الآمن للعمل الحر</h1><p>اعرض مهاراتك، ادخل المزادات، وافتح سوقك الخاص.</p><form onsubmit="Q=s.value;location.hash='offers';return false"><input id=s placeholder="ابحث عن خدمة أو عرض..."><button>بحث</button></form></section><h2>كيف تعمل نوفا؟</h2>${steps}`,
about:()=>`<h1>من نحن</h1><p>نوفا منصة وسيطة تربط أصحاب المهارات بالعملاء. نضمن وضوح الاتفاق وسهولة الدفع ونوفر دعمًا مباشرًا.</p><h2>قيمنا</h2>${steps}`,
offers:async()=>{let r=sb.from('offers').select('*').order('created_at',{ascending:false}).limit(60);if(Q)r=r.ilike('title','%'+Q+'%');if(K)r=r.eq('kind',K);const{data}=await r;
 const L={offer:'عرض',auction:'مزاد',market:'سوق'};
 return`<h1>استكشف العروض</h1><div style="display:flex;gap:8px"><input id=q value="${E(Q)}" placeholder="بحث في العروض..." oninput="Q=this.value;clearTimeout(window.t);window.t=setTimeout(route,300)"><select onchange="K=this.value;route()"><option value="">الكل</option>${Object.entries(L).map(([k,v])=>`<option value=${k} ${K==k?'selected':''}>${v}</option>`)}</select></div>
 ${me?`<details class=card><summary><b>+ إنشاء جديد</b></summary><select id=k onchange="h.style.display=this.value=='auction'?'':'none'"><option value=offer>عرض (10 نقاط)</option><option value=auction>مزاد (30 نقطة لـ10 ساعات، +2 لكل ساعة إضافية)</option><option value=market>سوق (30 نقطة)</option></select><input id=t placeholder="العنوان"><textarea id=d placeholder="الوصف"></textarea><input id=p type=number placeholder="السعر"><input id=h type=number placeholder="مدة المزاد بالساعات" value=10 style="display:none"><button onclick="mk()">نشر</button></details>`:'<p>سجّل الدخول لنشر العروض.</p>'}
 <div class=grid>${(data||[]).map(o=>`<div class=card><span class=tag>${L[o.kind]}</span><h3>${E(o.title)}</h3><p>${E(o.descr)}</p><b>${o.price?E(o.price)+' $':''}</b>${o.ends_at?`<br><small>ينتهي: ${new Date(o.ends_at).toLocaleString('ar')}</small>`:''}</div>`).join('')||'<p>لا نتائج.</p>'}</div>`},
support:async()=>{if(!me)return'<h1>الدعم الفني</h1><p>سجّل الدخول لإرسال رسالة.</p>';const{data}=await sb.from('tickets').select('*').eq('user_id',me.id).order('created_at',{ascending:false});
 return`<h1>الدعم الفني</h1><div class=card><input id=sj placeholder="الموضوع"><textarea id=bd placeholder="رسالتك"></textarea><button onclick="snd()">إرسال</button></div>${(data||[]).map(x=>`<div class=card><h3>${E(x.subject)}</h3><p>${E(x.body)}</p>${x.reply?`<p style="background:var(--l);padding:8px;border-radius:8px"><b>رد الإدارة:</b> ${E(x.reply)}</p>`:'<small>بانتظار الرد...</small>'}</div>`).join('')}`},
plans:async()=>{const{data}=await sb.from('plans').select('*').order('points');
 return`<h1>الباقات</h1><p>اشترِ نقاطًا لنشر المزيد من العروض والمزادات. بعد الدفع تُضاف النقاط لحسابك من الإدارة (اذكر بريدك في الدفع).</p><div class=grid>${(data||[]).map(p=>`<div class=card><h3>${E(p.name)}</h3><p>${E(p.points)} نقطة</p><b>${E(p.price)}</b><br><br><a class=btn target=_blank rel=noopener href="${/^https:\/\//.test(p.pay_url)?E(p.pay_url):'#'}">اشترِ الآن</a></div>`).join('')||'<p>لا توجد باقات بعد.</p>'}</div>`}};
async function route(){const r=(location.hash||'#home').slice(1);if(!OK&&!['home','about'].includes(r)){$('#v').innerHTML=WARN;return}document.querySelectorAll('aside a').forEach(a=>a.classList.toggle('on',a.hash=='#'+r));
 const a=document.activeElement?.id,pos=document.activeElement?.selectionStart;$('#v').innerHTML=await(V[r]||V.home)();if(a&&$('#'+a)){$('#'+a).focus();try{$('#'+a).setSelectionRange(pos,pos)}catch{}}}
async function mk(){const k=$('#k').value,{error}=await sb.rpc('create_offer',{k,t:t.value,d:d.value,p:+p.value||null,h:+h.value||null});if(error)return alert(error.message.includes('no points')?'رصيد النقاط غير كافٍ، اشترِ باقة':error.message);await prof();route()}
async function snd(){if(!sj.value||!bd.value)return;await sb.from('tickets').insert({subject:sj.value,body:bd.value});route()}
async function bell(){if(!me){cnt.hidden=true;nt.innerHTML='';return}
 const{data}=await sb.from('tickets').select('*').eq('user_id',me.id).not('reply','is',null).order('replied_at',{ascending:false}).limit(8);
 const n=(data||[]).filter(x=>!x.seen).length;cnt.hidden=!n;cnt.textContent=n;nt.innerHTML=(data||[]).map(x=>`<p><b>${E(x.subject)}</b><br>${E(x.reply)}</p>`).join('')||'لا إشعارات';
 sb.channel('tk'+me.id).on('postgres_changes',{event:'UPDATE',schema:'public',table:'tickets',filter:'user_id=eq.'+me.id},()=>bell()).subscribe()}
async function seen(){if(nt.classList.contains('show')){await sb.rpc('mark_seen');cnt.hidden=true}}
init();
