const sb=supabase.createClient(NOVA.URL,NOVA.KEY),A=document.getElementById('app');
const E=s=>String(s??'').replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const v=i=>document.getElementById(i).value;
async function start(){const{data:{session}}=await sb.auth.getSession();if(!session)return login();
 const{data}=await sb.from('profiles').select('is_admin').eq('id',session.user.id).single();
 if(!data?.is_admin){await sb.auth.signOut();return login()}panel()}
function login(){A.innerHTML=`<div class=card style="max-width:340px;margin:12vh auto"><h3>Nova</h3><input id=e type=email placeholder="email"><input id=p type=password placeholder="password"><button onclick="go()">→</button></div>`}
async function go(){const{error}=await sb.auth.signInWithPassword({email:v('e'),password:v('p')});if(error)return alert('✗');start()}
async function panel(){const[t,pl]=await Promise.all([sb.from('tickets').select('*').order('created_at',{ascending:false}),sb.from('plans').select('*').order('points')]);
 A.innerHTML=`<button onclick="sb.auth.signOut().then(start)">خروج</button><h1>لوحة الإدارة</h1>
 <h2>رسائل الدعم</h2><div class=grid>${(t.data||[]).map(x=>`<div class=card><b>${E(x.subject)}</b><p>${E(x.body)}</p><textarea id=r${x.id} placeholder="الرد">${E(x.reply||'')}</textarea><button onclick="rep(${x.id})">إرسال الرد</button></div>`).join('')}</div>
 <h2>الباقات</h2><div class=grid>${(pl.data||[]).map(p=>`<div class=card><b>${E(p.name)}</b> — ${E(p.points)} نقطة — ${E(p.price)}<br><small>${E(p.pay_url)}</small><br><button onclick="del(${p.id})">حذف</button></div>`).join('')}</div>
 <div class=card style="max-width:420px"><h3>إضافة باقة</h3><input id=n placeholder="الاسم"><input id=pt type=number placeholder="عدد النقاط"><input id=pr placeholder="السعر مثل $5"><input id=u placeholder="رابط الدفع https://... (PayPal / Payoneer / أي موقع)"><button onclick="add()">إضافة</button></div>
 <div class=card style="max-width:420px"><h3>إضافة نقاط لمستخدم بعد الدفع</h3><input id=ge type=email placeholder="بريد المستخدم"><input id=gn type=number placeholder="النقاط"><button onclick="grant()">منح</button></div>`}
async function rep(i){await sb.rpc('admin_reply',{i,r:v('r'+i)});panel()}
async function add(){if(!/^https:\/\//.test(v('u')))return alert('الرابط يجب أن يبدأ بـ https://');await sb.from('plans').insert({name:v('n'),points:+v('pt'),price:v('pr'),pay_url:v('u')});panel()}
async function del(id){await sb.from('plans').delete().eq('id',id);panel()}
async function grant(){const{error}=await sb.rpc('admin_grant',{em:v('ge'),n:+v('gn')});alert(error?error.message:'تم')}
start();
