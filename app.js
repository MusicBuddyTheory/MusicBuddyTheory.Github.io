// Mel's AI brain. Paste your Worker URL between the quotes (see README, "Make Mel a real AI chatbot").
// Leave it empty and Mel still works with built-in answers and the teach-me notebook.
const MEL_API='';

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const fm=s=>s.replace(/([A-G])#/g,'$1♯').replace(/([A-G])b(?![a-z])/g,'$1♭');
const rnd=n=>Math.floor(Math.random()*n),pick=a=>a[rnd(a.length)],shuf=a=>[...a].sort(()=>Math.random()-.5);
const ls=(k,v)=>{try{return v==null?localStorage.getItem(k):localStorage.setItem(k,v)}catch(e){}};

/* ---------- Guides ---------- */
const T=['Assembly','Posture','Hand position','Breath and tone'];
const TIP={flute:'No sound? Nine times out of ten it is headjoint alignment, not you.',clarinet:'Keep a spare reed in your case. Reeds die at the worst possible moment.',sax:'Never leave a reed on the mouthpiece in a hot car. It warps.',trumpet:'Valve oil is cheap. A stuck valve mid-concert is not.',trombone:'Lock the slide before you carry it. Dented slides are the sad kind of dented.',horn:'Horn notes sit close together, so your ear matters more than your fingers. Sing it first.',tuba:'Breathe like you are filling a balloon in your stomach. The tuba does the rest.',perc:'Practice with a metronome. You are the pulse of the band. No pressure.',strings:'Loosen the bow when you are done. A tight bow warps over time.'};
const G={
flute:['Flute',['Hold the body by the plain tube, not the keys. Twist the headjoint in gently, then add the foot joint. Line the hole in the lip plate up with the middle of the first key.','Stand or sit tall, feet shoulder-width. The flute points out to your right, a little downward. Turn your head left, keep shoulders loose.','Left thumb on the B♭ lever, right thumb under the body for balance. Fingers curved like you are holding a small ball, pads (not tips) on keys.','Say "poo" so your lips relax. Aim the air across the hole like blowing over a bottle. Roll the headjoint slightly in or out until it sounds full.']],
clarinet:['Clarinet',['Wet the reed in your mouth. Reed tip lines up with the mouthpiece tip, ligature a hair below the reed edge. Cork grease, then barrel, upper joint, lower joint (bridge keys lined up), bell.','Sit on the front half of the chair. The clarinet comes out about 35 degrees from your body, not straight down.','Left thumb covers the thumb hole, right thumb under the rest. Curve fingers and cover holes with the pads. Keep fingers close to the keys.','Top teeth on the mouthpiece, lower lip over your teeth like saying "oo", corners firm. Squeaks usually mean too much reed in your mouth, biting, or a finger not fully covering a hole.']],
sax:['Saxophone',['Strap on first. Slide the neck onto the body and tighten the screw. Reed flat side down, ligature on, mouthpiece onto the cork about a third of the way. Check the reed tip lines up.','The sax hangs at your right side. Adjust the strap so the mouthpiece reaches you without craning your neck.','Left hand on top, right hand below. Thumbs on the hook and rest. Fingers curved over the pearl keys.','Top teeth on the mouthpiece, lower lip cushioned over your teeth like saying "too". Use warm, steady air, like fogging a window.']],
trumpet:['Trumpet',['Hold the horn by the valve casings. Push the mouthpiece in with a gentle twist, never a smack. Oil valves with a few drops, then drop each one back in with its number facing the mouthpiece.','Sit or stand tall, horn out level with the floor, elbows relaxed and away from your body.','Left hand wraps the valve casings, ring finger in the third slide ring. Right thumb under the leadpipe, three fingertips on valves.','Breathe low into your belly, say "tah", and buzz your lips like a bee with firm corners. Do not puff your cheeks. If you feel dizzy, stop and sit down. Short breaths in, slow air out.']],
trombone:['Trombone',['Fit the bell section onto the slide section, tighten the nut, and lock the slide before you pick it up. Mouthpiece in with a gentle twist. Spray the slide with water or slide cream.','Stand or sit tall, the horn rests on your left shoulder. Keep the bell up and level, not drooping.','Left hand holds the brace and mouthpiece area. Right hand uses light fingertips on the slide. Move the slide with your wrist and arm, not your whole body.','Buzz with a relaxed "doh". Your slide positions are targets, but your ears decide the tuning. Use fast, even air.']],
horn:['French horn',['Put the mouthpiece in with a light twist. Rest the bell on your right leg, and handle the horn by the valves, not the delicate tubing.','Sit tall. Bell rests on your right thigh, and the mouthpiece comes to you, so you do not lean into it.','Right hand rests in the bell like a soft handshake. Left fingers on the levers, thumb on the trigger.','Use warm air and a small, centered buzz on "toh". Aim carefully, because horn notes are close together.']],
tuba:['Baritone / tuba',['Oil valves and put the mouthpiece in. Set the tuba securely on your lap or stand. A baritone rests on your lap with the bell up.','Sit tall at the front of the chair. The instrument should come to you, so you can breathe without hunching.','Fingers curved on the valves, thumbs relaxed. A light touch is enough.','Big, relaxed air is the secret. Take a deep belly breath, say "tuh", and keep the sound steady and round.']],
perc:['Percussion',['Set the snare stand at waist height. Put the keyboard at hip height. Check the pad and the sticks before you play.','Stand or sit tall, feet flat, shoulders loose. Both hands start at the same height.','Matched grip: pinch the stick at the fulcrum between thumb and first finger. The other fingers wrap lightly so the stick can bounce.','Let the stick rebound and do not push into the head. Count out loud and keep a relaxed pulse.']],
strings:['Violin / cello',['Loosen the bow hair to about a pencil width from the stick, then rosin it. Violin: set the shoulder rest. Cello: set the endpin so the C string peg sits near your left ear.','Violin: tuck under your chin, left foot slightly forward. Cello: feet flat, instrument rests on your chest and knees.','Left hand: curved fingers, thumb across from the first finger. Right hand: bent, relaxed bow hold with a rounded thumb.','Keep the bow straight and parallel to the bridge. Use slow, even bow strokes, and remember to breathe.']]
};
let cur='flute';const seen=new Set();
const AB={flute:'Fl',clarinet:'Cl',sax:'Sx',trumpet:'Tp',trombone:'Tb',horn:'Hn',tuba:'Tu',perc:'Pc',strings:'Vn'};
$('#stories').innerHTML=Object.entries(G).map(([k,v])=>`<button class="story" data-k="${k}" aria-label="${v[0]} guide"><span class="ring"><span class="av">${AB[k]}</span></span>${v[0].split(' ')[0]}</button>`).join('');
const car=$('#car'),dots=i=>$('#dots').innerHTML=T.map((_,n)=>`<i class="${n==i?'on':''}"></i>`).join('');
function guide(){const c=cur,g=G[c];
  $$('.story').forEach(b=>{b.classList.toggle('on',b.dataset.k===c);b.classList.toggle('seen',seen.has(b.dataset.k)&&b.dataset.k!==c)});
  $('#gt').textContent=g[0]+' setup guide';
  car.innerHTML=g[1].map((t,i)=>`<div class="slide" role="group" aria-label="Step ${i+1} of 4"><span class="num">Step ${i+1} of 4</span><h3>${T[i]}</h3><p>${t}</p></div>`).join('');
  car.scrollLeft=0;dots(0);$('#cap').innerHTML=`<b>mel</b> ${TIP[c]}`}
car.onscroll=()=>dots(Math.round(car.scrollLeft/car.clientWidth));
$('#cprev').onclick=()=>car.scrollBy({left:-car.clientWidth,behavior:'smooth'});
$('#cnext').onclick=()=>car.scrollBy({left:car.clientWidth,behavior:'smooth'});
$('#stories').onclick=e=>{const b=e.target.closest('.story');if(!b)return;seen.add(cur);cur=b.dataset.k;guide();$('#guides').scrollIntoView({behavior:'smooth'})};

/* ---------- Music engine ---------- */
const L='CDEFGAB',N=[0,2,4,5,7,9,11],ST=[[0,2,4,5,7,9,11],[0,2,3,5,7,8,10]];
const MAJ='C Db D Eb E F F# G Ab A Bb B'.split(' '),MIN='C C# D Eb E F F# G G# A Bb B'.split(' ');
const I=[['Flute',0,72,'flute'],['Oboe',0,67,'oboe'],['Clarinet (B♭)',2,60,'clarinet'],['Trumpet (B♭)',2,62,'trumpet'],['Alto sax (E♭)',9,60,'alto_sax'],['Tenor sax (B♭)',2,52,'tenor_sax'],['Bari sax (E♭)',9,48,'baritone_sax'],['Trombone',0,48,'trombone'],['French horn (F)',7,55,'french_horn'],['Tuba',0,36,'tuba'],['Violin',0,72,'violin'],['Cello',0,48,'cello'],['Mallet percussion',0,60,'marimba']];
function scale(p,m){const t=(m?MIN:MAJ)[p],li=L.indexOf(t[0]);
  return ST[m].map((s,k)=>{const l=L[(li+k)%7],d=((p+s-N[L.indexOf(l)])%12+18)%12-6;return l+(d>0?'#'.repeat(d):'b'.repeat(-d))})}
const acc=s=>s.filter(n=>n.length>1);
const ct=s=>{const a=acc(s);return a.length?a.length+(a[0][1]=='#'?' sharp':' flat')+(a.length>1?'s':''):'No sharps or flats'};
const sig=s=>{const a=acc(s);return a.length?ct(s)+': '+a.map(fm).join(' '):ct(s)};
let mode=0;
function keys(){const v=$('#key').value||0;$('#key').innerHTML=(mode?MIN:MAJ).map((n,i)=>`<option value="${i}">${fm(n)} ${mode?'minor':'major'}</option>`).join('');$('#key').value=v}
function scales(){const r=+$('#key').value,sh=I[+$('#inst').value][1],w=(r+sh)%12,c=scale(r,mode),x=scale(w,mode),nm=mode?MIN:MAJ;
  $('#concert').innerHTML=c.map(n=>`<span>${fm(n)}</span>`).join('');
  $('#written').innerHTML=x.map(n=>`<span>${fm(n)}</span>`).join('');
  $('#sigc').textContent=`Concert ${fm(nm[r])} ${mode?'minor':'major'}. ${sig(c)}`;
  $('#sigw').textContent=sh?`You read ${fm(nm[w])} ${mode?'minor':'major'}. ${sig(x)}`:'Concert pitch instruments read the same notes the band hears.'}
$('#inst').innerHTML=I.map((x,i)=>`<option value="${i}">${x[0]}</option>`).join('');
$('#mode').onchange=()=>{mode=+$('#mode').value;keys();scales()};
$('#key').onchange=$('#inst').onchange=scales;keys();scales();

let ac;const cx=()=>{ac=ac||new(window.AudioContext||window.webkitAudioContext)();ac.resume();return ac};
const hz=m=>440*2**((m-69)/12);
function tone(f,t,d,v=.2,ty='triangle'){const c=cx(),o=c.createOscillator(),g=c.createGain();o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.05)}
const mark=i=>$$('#concert span,#written span').forEach((e,j)=>e.classList.toggle('on',i>=0&&j%7==i));
function synth(f,t,d){const c=cx(),o=c.createOscillator(),l=c.createBiquadFilter(),g=c.createGain();o.type='sawtooth';o.frequency.value=f;l.type='lowpass';l.frequency.setValueAtTime(f*2,t);l.frequency.linearRampToValueAtTime(f*5,t+.08);l.frequency.linearRampToValueAtTime(f*3,t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.18,t+.04);g.gain.setValueAtTime(.18,t+Math.max(.05,d-.08));g.gain.linearRampToValueAtTime(0,t+d);o.connect(l);l.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.02)}
let libP;const SF={},SFL={};
/* MusyngKite is a richer sample set than FluidR3_GM. If it fails to load, fall back to FluidR3_GM. */
const BANKS=['MusyngKite','FluidR3_GM'];
function lib(){return libP||(libP=new Promise(res=>{
  const urls=['https://cdn.jsdelivr.net/npm/soundfont-player@0.12.0/dist/soundfont-player.min.js','https://unpkg.com/soundfont-player@0.12.0/dist/soundfont-player.min.js'];
  const next=()=>{const u=urls.shift();if(!u)return res(false);const e=document.createElement('script');e.src=u;e.onload=()=>res(!!window.Soundfont);e.onerror=next;document.head.append(e)};next()}))}
async function loadSF(n){if(SF[n])return SF[n];if(!(await lib()))return null;
  return SFL[n]||(SFL[n]=(async()=>{for(const b of BANKS){try{const p=await Soundfont.instrument(cx(),n,{soundfont:b});if(p)return SF[n]=p}catch(e){}}delete SFL[n];return null})())}
async function noteSeq(snd,seq,dur,gap){const c=cx(),p=await loadSF(snd),t0=c.currentTime+.1;
  seq.forEach(([i,m],k)=>{const t=t0+k*gap;
    if(p)p.play(m,t,{duration:dur,gain:1.6,adsr:[.03,.1,.85,.2]});else synth(hz(m),t,dur);
    setTimeout(()=>mark(i),Math.max(0,(t-c.currentTime)*1000))});
  await new Promise(r=>setTimeout(r,seq.length*gap*1000+300));mark(-1)}
$('#play').onclick=async()=>{const b=$('#play'),lab=b.textContent,x=I[+$('#inst').value],p=+$('#key').value,st=ST[mode],r=x[2]+(p>6?p-12:p),up=st.map((s,i)=>[i,r+s]),seq=[...up,[0,r+12],...[...up].reverse()];
  b.disabled=true;b.textContent='Loading '+x[0].replace(/ \(.*\)/,'').toLowerCase()+'…';
  await noteSeq(x[3],seq,.5,.42);b.disabled=false;b.textContent=lab};

const KEYS=['a','s','d','f'];/* keyboard keys for valves 1 to 4. Q and W change register. B or Space blows air. Trombone uses 1 to 7. */
const VS={1:2,2:1,3:3,4:5},F3={0:[],1:[2],2:[1],3:[1,2],4:[2,3],5:[1,3],6:[1,2,3]},F4={...F3,5:[4],6:[2,4],7:[1,4],8:[3,4],9:[2,3,4],10:[1,3,4],11:[1,2,3,4]};
/* p = open-note partials in concert pitch for the first variant. s = how many half-steps a variant shifts them up.
   off = half-steps from the sounding note to the note you read (written = sounding + off). vals = valve counts you can choose. */
const FI={
trumpet:{n:'Trumpet',ab:'Tp',sf:'trumpet',v:3,p:[58,65,70,74,77,82],vars:[
 {l:'B♭ trumpet',s:0,off:2,t:'Written pitch. A B♭ trumpet sounds a major 2nd lower.'},
 {l:'C trumpet',s:2,off:0,t:'Written pitch. A C trumpet sounds exactly as written.'},
 {l:'D trumpet',s:4,off:-2,t:'Written pitch. A D trumpet sounds a major 2nd higher.'},
 {l:'E♭ trumpet',s:5,off:-3,t:'Written pitch. An E♭ trumpet sounds a minor 3rd higher.'}]},
euph:{n:'Euphonium / baritone',ab:'Eu',sf:'trombone',v:4,vals:[4,3],p:[46,53,58,62,65,70],vars:[
 {l:'B♭, bass clef (concert pitch)',s:0,off:0,t:'Concert pitch, as read in bass clef.'},
 {l:'B♭, treble clef',s:0,off:14,t:'Written pitch, as read in treble clef. It sounds a major 9th lower.'}]},
tuba:{n:'Tuba',ab:'Tu',sf:'tuba',v:4,vals:[4,3],p:[34,41,46,50,53,58,62],vars:[
 {l:'BB♭ tuba',s:0,off:0,t:'Concert pitch. The most common school band tuba.'},
 {l:'CC tuba',s:2,off:0,t:'Concert pitch. Pitched a whole step above BB♭.'},
 {l:'E♭ tuba',s:5,off:0,t:'Concert pitch. Smaller, pitched a perfect 4th above BB♭.'},
 {l:'F tuba',s:7,off:0,t:'Concert pitch. Pitched a perfect 5th above BB♭.'}]},
horn:{n:'French horn',ab:'Hn',sf:'french_horn',v:3,p:[41,48,53,57,60,65,69,72],vars:[
 {l:'Double horn, F side',s:0,off:7,t:'Written pitch, F side of a double horn. Horn sounds a perfect 5th lower.'},
 {l:'Double horn, B♭ side',s:5,off:7,t:'Written pitch, B♭ side of a double horn (thumb trigger down). Same written notes, different fingerings. Sounds a perfect 5th lower.'}]},
trombone:{n:'Trombone',ab:'Tb',sf:'trombone',v:0,p:[46,53,58,62,65,70,74],vars:[
 {l:'Tenor trombone (B♭)',s:0,off:0,t:'Concert pitch. Slide positions 1 to 7.'},
 {l:'Alto trombone (E♭)',s:5,off:0,t:'Concert pitch. Slide positions 1 to 7 on an E♭ alto.'}]}};
let fk='trumpet',vi=0,nv=3,pi=1,pos=1,fview=false,pre=false,tkey='';
const dn=new Set(),hd=new Set();let tdn=false,br=false,tap=false,tapT=0;
/* dn = valves shown as pressed. hd = valves physically held right now. tdn = trombone position held. br = air button held. tap = chart tap. */
const cfg=()=>{const b=FI[fk],x=b.vars[vi]||b.vars[0];return {...b,...x,v:b.vals?nv:b.v,p:b.p.map(a=>a+x.s)}};
const isT=()=>cfg().v==0,tbl=()=>cfg().v==4?F4:F3;
const depth=()=>isT()?pos-1:[...dn].reduce((a,v)=>a+VS[v],0);
const nm=m=>fm(MAJ[((m%12)+12)%12]+(Math.floor(m/12)-1));

/* ----- held notes ----- */
function synthHold(f){const c=cx(),t=c.currentTime,o=c.createOscillator(),l=c.createBiquadFilter(),g=c.createGain();
  o.type='sawtooth';o.frequency.value=f;l.type='lowpass';l.frequency.value=f*3;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.18,t+.05);
  o.connect(l);l.connect(g);g.connect(c.destination);o.start(t);
  return{stop(){const u=c.currentTime;g.gain.cancelScheduledValues(u);g.gain.setValueAtTime(g.gain.value,u);g.gain.linearRampToValueAtTime(0,u+.1);o.stop(u+.12)}}}
/* Recorded notes are finite, so a held note re-triggers a fresh copy every 1.9 seconds and crossfades it in under the old one. */
function holdStart(p,m){const c=cx(),h={on:true,nodes:[],tm:0,syn:null};
  const fire=first=>{if(!h.on)return;
    h.nodes.push(p.play(m,c.currentTime,{duration:2,gain:1.6,adsr:first?[.04,.1,.9,.5]:[.6,.1,.9,.5]}));
    if(h.nodes.length>3)h.nodes.shift();
    h.tm=setTimeout(()=>fire(false),1900)};
  if(p)fire(true);else h.syn=synthHold(hz(m));
  h.stop=()=>{h.on=false;clearTimeout(h.tm);const t=c.currentTime;h.nodes.forEach(n=>{try{n.stop(t+.12)}catch(e){}});if(h.syn)h.syn.stop()};
  return h}
let voice=null,vk=null,vtok=0;
const active=()=>isT()?(tdn||br||tap):(hd.size>0||br||tap);
function sound(){const f=cfg(),want=active()?f.p[pi]-depth():null,key=want==null?null:f.sf+':'+want;
  if(key===vk)return;
  vk=key;const tok=++vtok;
  if(voice){voice.stop();voice=null}
  if(want==null)return;
  if(SF[f.sf]){voice=holdStart(SF[f.sf],want);return}
  stat('Loading '+f.n.split(' ')[0].toLowerCase()+' sound…');
  loadSF(f.sf).then(p=>{if(tok!==vtok)return;stat();voice=holdStart(p,want)})}
function stat(t){$('#fstat').textContent=t||(SF[cfg().sf]?'Sound ready':'')}
function preload(){if(!pre)return;const f=cfg();if(SF[f.sf]){stat();return}
  stat('Loading '+f.n.split(' ')[0].toLowerCase()+' sound…');
  loadSF(f.sf).then(p=>{if(f.sf==cfg().sf)stat(p?'':'Could not load the recorded sound, using a simple tone.')})}
function allUp(){hd.clear();dn.clear();tdn=false;br=false;tap=false;tkey='';clearTimeout(tapT);fUpd()}

/* ----- drawing the chart ----- */
function fRender(){const f=cfg(),b=FI[fk];$('#ddav').textContent=f.ab;$('#ddn').textContent=f.n;
  $('#fnote').textContent=f.t+(b.vals?' '+f.v+' valves.':'');
  $('#fvar').innerHTML=b.vars.map((x,i)=>`<option value="${i}"${i==vi?' selected':''}>${x.l}</option>`).join('');
  $('#fnvl').style.display=b.vals?'':'none';
  if(b.vals)$('#fnv').innerHTML=b.vals.map(n=>`<option value="${n}"${n==nv?' selected':''}>${n} valves</option>`).join('');
  $('#fctl').innerHTML=isT()?[1,2,3,4,5,6,7].map(n=>`<button class="vb pos" data-pos="${n}" aria-pressed="false" aria-label="Position ${n}">${n}</button>`).join(''):Array.from({length:f.v},(_,i)=>`<button class="vb" data-v="${i+1}" aria-pressed="false" aria-label="Valve ${i+1}"><b>${i+1}</b><small>${KEYS[i].toUpperCase()}</small></button>`).join('');
  $('#fhint').textContent=isT()?'Hold a position (tap and hold, or hold keys 1 to 7) and the note keeps sounding. Q and W change register. Hold B or Space to blow on the current position.':`Hold the valves (tap and hold, or hold ${KEYS.slice(0,f.v).join(' ').toUpperCase()}) and the note keeps sounding. Q and W change register. For the open note, hold the button below, or hold B or Space.`;
  fUpd();preload()}
function fUpd(){const f=cfg(),d=depth(),m=f.p[pi]-d,dm=isT()||f.v==3?7:12,gap=Math.min(pi?f.p[pi]-f.p[pi-1]:dm,dm);
  $$('#fctl .vb').forEach(b=>{const on=isT()?+b.dataset.pos==pos:dn.has(+b.dataset.v);b.classList.toggle('down',on);b.setAttribute('aria-pressed',on)});
  $('#rn').textContent=nm(m+f.off);
  $('#rs').textContent=(f.off?'Sounds '+nm(m)+' · ':'')+'Fingering: '+(isT()?'position '+pos:dn.size?[...dn].sort().join(' + '):'open');
  $('#fchart').innerHTML=Array.from({length:gap},(_,k)=>`<button class="fc${k==d?' on':''}" data-d="${k}"><b>${nm(f.p[pi]-k+f.off)}</b><small>${isT()?'pos '+(k+1):(tbl()[k]||[]).join('·')||'open'}</small></button>`).join('');
  $('#rg').textContent=`Register ${pi+1} of ${f.p.length}`;
  $('#breath').setAttribute('aria-pressed',br);
  sound()}
function reg(x){pi=Math.max(0,Math.min(cfg().p.length-1,pi+x));fUpd()}

/* ----- controls ----- */
$('#ddl').innerHTML=Object.entries(FI).map(([k,f])=>`<li><button data-k="${k}"><span class="av sm">${f.ab}</span>${f.n}</button></li>`).join('');
const dd=o=>{$('#ddl').hidden=!o;$('#ddb').setAttribute('aria-expanded',o)};
$('#ddb').onclick=()=>dd($('#ddl').hidden);
$('#ddl').onclick=e=>{const b=e.target.closest('button');if(!b)return;allUp();fk=b.dataset.k;vi=0;nv=FI[fk].vals?FI[fk].vals[0]:FI[fk].v;pi=1;pos=1;dd(false);fRender();$('#ddb').focus()};
$('#fvar').onchange=()=>{allUp();vi=+$('#fvar').value;fRender()};
$('#fnv').onchange=()=>{allUp();nv=+$('#fnv').value;fRender()};
document.addEventListener('click',e=>{if(!e.target.closest('.dd'))dd(false)});
const fc=$('#fctl');
fc.onpointerdown=e=>{const b=e.target.closest('.vb');if(!b)return;e.preventDefault();if(b.setPointerCapture)b.setPointerCapture(e.pointerId);
  if(b.dataset.pos){pos=+b.dataset.pos;tdn=true}else{if(!hd.size)dn.clear();hd.add(+b.dataset.v);dn.add(+b.dataset.v)}fUpd()};
fc.onpointerup=fc.onpointercancel=e=>{const b=e.target.closest('.vb');if(!b)return;
  if(b.dataset.v){hd.delete(+b.dataset.v);dn.delete(+b.dataset.v)}else tdn=false;fUpd()};
fc.onclick=e=>{if(e.detail)return;const b=e.target.closest('.vb');if(!b)return;/* keyboard activation (Enter or Space on a focused button) */
  if(b.dataset.pos){pos=+b.dataset.pos;tdn=true;fUpd();setTimeout(()=>{tdn=false;fUpd()},900)}
  else{const v=+b.dataset.v;if(hd.has(v)){hd.delete(v);dn.delete(v)}else{hd.add(v);dn.add(v)}fUpd()}};
$('#fchart').onclick=e=>{const b=e.target.closest('.fc');if(!b)return;const k=+b.dataset.d;
  if(isT())pos=k+1;else{dn.clear();hd.clear();(tbl()[k]||[]).forEach(v=>dn.add(v))}
  tap=true;clearTimeout(tapT);tapT=setTimeout(()=>{tap=false;fUpd()},1200);fUpd()};
const bt=$('#breath');
bt.onpointerdown=e=>{e.preventDefault();if(bt.setPointerCapture)bt.setPointerCapture(e.pointerId);br=true;fUpd()};
bt.onpointerup=bt.onpointercancel=()=>{br=false;fUpd()};
bt.onclick=e=>{if(e.detail)return;br=true;fUpd();setTimeout(()=>{br=false;fUpd()},900)};
$('#rdn').onclick=()=>reg(-1);$('#rup').onclick=()=>reg(1);
new IntersectionObserver(([x])=>{fview=x.isIntersecting;if(fview&&!pre){pre=true;preload()}if(!fview)allUp()},{threshold:.25}).observe($('#fingerings'));
window.addEventListener('blur',allUp);
document.addEventListener('visibilitychange',()=>{if(document.hidden)allUp()});
const typing=e=>/INPUT|SELECT|TEXTAREA/.test(e.target.tagName);
document.addEventListener('keydown',e=>{if(e.key=='Escape')dd(false);if(!fview||e.repeat||typing(e)||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key.toLowerCase(),i=KEYS.indexOf(k),f=cfg();
  if(i>=0&&!isT()&&i<f.v){if(!hd.size)dn.clear();hd.add(i+1);dn.add(i+1);fUpd()}
  else if(isT()&&/^[1-7]$/.test(k)){pos=+k;tdn=true;tkey=k;fUpd()}
  else if(k=='q')reg(-1);else if(k=='w')reg(1);
  else if(k=='b'||(k==' '&&e.target.tagName!='BUTTON')){e.preventDefault();br=true;fUpd()}});
document.addEventListener('keyup',e=>{const k=e.key.toLowerCase(),i=KEYS.indexOf(k);
  if(i>=0&&!isT()&&hd.has(i+1)){hd.delete(i+1);dn.delete(i+1);fUpd()}
  else if(isT()&&k==tkey){tdn=false;tkey='';fUpd()}
  if((k=='b'||k==' ')&&br){br=false;fUpd()}});
fRender();

/* ---------- Flip cards ---------- */
function wheel(){const M='C G D A E B F♯ D♭ A♭ E♭ B♭ F'.split(' '),m='Am Em Bm F♯m C♯m G♯m E♭m B♭m Fm Cm Gm Dm'.split(' '),a=['0','1♯','2♯','3♯','4♯','5♯','6','5♭','4♭','3♭','2♭','1♭'];
  return '<svg viewBox="-108 -108 216 216" width="200" role="img" aria-label="Circle of fifths" class="mx">'+M.map((k,i)=>{const t=i*Math.PI/6-Math.PI/2,c=Math.cos(t),d=Math.sin(t),p=(r,y)=>`x="${(c*r).toFixed(1)}" y="${(d*r+y).toFixed(1)}" text-anchor="middle"`;
    return `<text ${p(76,4)} font-size="13" font-weight="700" fill="currentColor">${k}</text><text ${p(50,3)} font-size="9" style="fill:var(--mut)">${m[i]}</text><text ${p(97,3)} font-size="8" font-weight="700" style="fill:var(--ct)">${a[i]}</text>`}).join('')+'</svg>'}
const kb='<svg viewBox="0 0 175 70" width="200" class="mx" role="img" aria-label="Piano keys C to B">'+[0,1,2,3,4,5,6].map(i=>`<rect x="${i*25}" y="0" width="25" height="70" fill="#fff" stroke="#3b3226"/><text x="${i*25+12}" y="64" text-anchor="middle" font-size="9" fill="#3b3226">${'CDEFGAB'[i]}</text>`).join('')+[1,2,4,5,6].map(i=>`<rect x="${i*25-7}" y="0" width="14" height="40" fill="#2b2218"/>`).join('')+'</svg>';
const CARDS=[
['Circle of Fifths','Key signatures','#F5C542',wheel()+'<p>Clockwise adds a sharp, counter-clockwise adds a flat. The small letters inside are relative minors, and they share the same key signature.</p>'],
['Interval math','By the numbers','#FFE27A','<p>Count half-steps. m2=1, M2=2, m3=3, M3=4, P4=5, tritone=6, P5=7, m6=8, M6=9, m7=10, M7=11, octave=12.</p><p>Major scale pattern: <b>W W H W W W H</b>. Minor third + major third stacks to a perfect fifth (3+4=7).</p>'],
['Color & mood','By feel','#E8761E','<p><b>C</b> plain and honest, <b>G</b> sunny, <b>D</b> bright and triumphant, <b>F</b> pastoral and calm, <b>B♭</b> warm and round, <b>E♭</b> heroic, <b>A minor</b> lonely, <b>D minor</b> serious and stormy.</p><p>Try it: play a scale, then write down the color you hear.</p>'],
['Keyboard map','By sight','#9A9A9A',kb+'<p>Black keys come in groups of 2 and 3. C is the white key just left of the two-black-key group. Every neighboring key is one half-step.</p>']];
$('#cards').innerHTML=CARDS.map(c=>`<button class="flip" aria-pressed="false" style="--c:${c[2]}"><div class="in"><div class="face front"><h4 class="hand">${c[0]}</h4><p>${c[1]}</p><p class="mut" style="margin-top:40px">Tap to flip</p></div><div class="face back">${c[3]}</div></div></button>`).join('');
$('#cards').onclick=e=>{const c=e.target.closest('.flip');if(c)c.setAttribute('aria-pressed',c.getAttribute('aria-pressed')!='true')};

/* ---------- Quiz (fresh questions every round) ---------- */
const rk=['C','G','D','A','E','F','Bb','Eb','Ab','Db'];
const SIGS=['No sharps or flats','1 sharp','2 sharps','3 sharps','4 sharps','1 flat','2 flats','3 flats','4 flats','5 flats'];
const IV=[['minor 2nd',1],['major 2nd',2],['minor 3rd',3],['major 3rd',4],['perfect 4th',5],['tritone',6],['perfect 5th',7],['minor 6th',8],['major 6th',9],['minor 7th',10],['major 7th',11],['octave',12]];
const S=[['What is the major scale pattern?','W W H W W W H',['W W H W W H W','W H W W H W W','H W W H W W W'],'Whole, whole, half, whole, whole, whole, half.'],
['What is the order of sharps?','F C G D A E B',['B E A D G C F','C G D A E B F','F B E A D G C'],'Father Charles Goes Down And Ends Battle.'],
['What is the order of flats?','B E A D G C F',['F C G D A E B','E B F C G D A','B F E A D C G'],'It is the order of sharps backwards.'],
['Going clockwise on the circle of fifths, each key adds a...','sharp',['flat','half-step','beat'],'Counter-clockwise adds flats.'],
['A flute in a cold room plays...','flat (low)',['sharp (high)','louder','exactly in tune'],'Cold air lowers the pitch. Warm up before you tune.'],
['In 4/4 time, how many beats are in a measure?','4',['3','2','6'],'The top number counts beats per measure.'],
['How many beats does a whole note get in 4/4?','4',['1','2','8'],'A whole note fills the whole measure.'],
['What does forte (f) mean?','Loud',['Soft','Fast','Slow'],'Piano (p) means soft.'],
['What does allegro mean?','Fast and lively',['Slow and sad','Gradually louder','Smooth and connected'],'Allegro is a fast tempo marking.'],
['What does a sharp (♯) do to a note?','Raises it a half-step',['Lowers it a half-step','Raises it a whole step','Makes it longer'],'A flat does the opposite.'],
['Which marking means gradually get louder?','Crescendo',['Diminuendo','Fermata','Staccato'],'Diminuendo gets softer.']];
const mkq=(q,a,pool,w)=>({q,a,w,o:shuf([a,...shuf(pool.filter(x=>x!=a)).slice(0,3)])});
const GEN=[
()=>{const k=pick(rk),s=scale(MAJ.indexOf(k),0);return mkq(`How many sharps or flats are in ${k} major?`,ct(s),SIGS,`${k} major: ${sig(s)}.`)},
()=>{const [n,s]=pick([['B♭ trumpet or clarinet',2],['E♭ alto sax',9],['French horn in F',7]]),c=pick(MAJ.filter(x=>x!='F#')),a=MAJ[(MAJ.indexOf(c)+s)%12];
  return mkq(`Concert ${c}. You play ${n}. What note do you read?`,a,MAJ,`${n} reads ${s==9?'a major 6th (9 half-steps)':s==2?'a major 2nd (2 half-steps)':'a perfect 5th (7 half-steps)'} higher than concert pitch.`)},
()=>{const k=pick(rk),a=MIN[(MAJ.indexOf(k)+9)%12]+' minor';return mkq(`What is the relative minor of ${k} major?`,a,MIN.map(x=>x+' minor'),`Go down 3 half-steps from the major tonic: ${a}.`)},
()=>{const [n,s]=pick(IV);return rnd(2)?mkq(`Which interval spans ${s} half-steps?`,n,IV.map(x=>x[0]),`${n} = ${s} half-steps.`):mkq(`How many half-steps are in a ${n}?`,''+s,IV.map(x=>''+x[1]),`${n} = ${s} half-steps.`)},
()=>{const [q,a,w,y]=pick(S);return {q,a,w:y,o:shuf([a,...w])}},
()=>{const [q,a,w,y]=pick(S);return {q,a,w:y,o:shuf([a,...w])}}];
let qf=false,qs,qn,sc,best=+ls('mb-best')||0;
function mk(n){const out=[],seen=new Set;while(out.length<n){const q=pick(GEN)();if(!seen.has(q.q)){seen.add(q.q);out.push(q)}}return out}
function qstart(){qs=mk(10);qn=0;sc=0;qshow()}
function qshow(){const q=qs[qn],z=$('#quiz');
  if(!q){if(sc>best){best=sc;ls('mb-best',sc)}
    z.innerHTML=`<h3 class="hand big" id="qq" tabindex="-1">You scored ${sc} / ${qs.length}</h3><p>${sc==10?'Perfect score.':sc>6?'Nice work. Another round will lock it in.':'Keep going. Review the explanations and try another round.'} Best score: ${best}.</p><button class="btn" id="again" style="margin-top:12px">Play again</button>`;if(qf)$('#qq').focus();return}
  z.innerHTML=`<div class="bar"><i style="width:${qn/qs.length*100}%"></i></div><p class="mut">Question ${qn+1} of ${qs.length} · Score ${sc}</p><h3 class="hand big" id="qq" tabindex="-1">${fm(q.q)}</h3><div class="opts">${q.o.map((o,i)=>`<button class="opt" data-i="${i}">${fm(o)}</button>`).join('')}</div><p id="fb" role="status"></p>`;if(qf)$('#qq').focus()}
$('#quiz').onclick=e=>{const b=e.target.closest('button');if(!b)return;
  if(b.id=='again')return qstart();if(b.id=='next'){qn++;return qshow()}
  if(!b.dataset.i||$('#fb').dataset.done)return;
  const q=qs[qn],ok=q.o[+b.dataset.i]==q.a;if(ok)sc++;
  $$('.opt').forEach(x=>{x.disabled=true;if(q.o[+x.dataset.i]==q.a)x.classList.add('good');else if(x===b)x.classList.add('bad')});
  $('#fb').dataset.done=1;$('#fb').innerHTML=`<b>${ok?'Correct.':'Not quite.'}</b> ${fm(q.w)} <button class="btn" id="next">${qn+1<qs.length?'Next':'See score'}</button>`;$('#next').focus()};
qstart();qf=true;

/* ---------- Metronome & tuning tones ---------- */
let mt=0,dr;
$('#bpm').oninput=()=>$('#bpmv').textContent=$('#bpm').value;
$('#met').onclick=e=>{const b=e.currentTarget;
  if(mt){clearInterval(mt);mt=0;b.textContent='Start';b.setAttribute('aria-pressed','false');$('#beat').textContent='–';return}
  const c=cx();let nx=c.currentTime+.05,n=0;b.textContent='Stop';b.setAttribute('aria-pressed','true');
  mt=setInterval(()=>{while(nx<c.currentTime+.15){const k=n%+$('#bpb').value;tone(k?800:1200,nx,.06,.35,'square');setTimeout(()=>{if(mt)$('#beat').textContent=k+1},Math.max(0,(nx-c.currentTime)*1000));nx+=60/+$('#bpm').value;n++}},25)};
$('#drone').onclick=e=>{const b=e.target.closest('button');if(!b)return;const was=b.getAttribute('aria-pressed')=='true';
  if(dr){dr.stop();dr=null}$$('#drone button').forEach(x=>x.setAttribute('aria-pressed','false'));if(was)return;
  const c=cx(),o=c.createOscillator(),g=c.createGain();o.frequency.value=+b.dataset.f;g.gain.value=.15;o.connect(g);g.connect(c.destination);o.start();dr=o;b.setAttribute('aria-pressed','true')};

/* ---------- Maestro Mel ---------- */
const A=[[/cold|temperature|winter/,'Cold air makes an instrument go flat. Warm it with your breath and play a few easy notes before you tune, or you will end up sharp once it warms up.'],
[/order.*flats|flats.*order/,'Flats: <b>B E A D G C F</b>. “Battle Ends And Down Goes Charles’ Father.”'],
[/order.*sharps|sharps.*order/,'Sharps: <b>F C G D A E B</b>. It is just the flats backwards, so you only memorize once.'],
[/out of tune|tun(e|ing)\b|\bflat\b|\bsharp\b|pitch/,'Match a concert B♭ or A. <b>Sharp</b>? Pull the tuning slide or mouthpiece out a little. <b>Flat</b>? Push in. Still off? Check your air and posture too. The tuning tones are in Practice tools.'],
[/squeak|reed|chirp/,'Squeaks usually mean too much reed in your mouth, too much bite, or a finger not fully covering a hole. Less mouthpiece, firm corners, check your pads.'],
[/dizz|light.?head|pass out|breath/,'If you feel dizzy, stop and sit down. Take slower, lower belly breaths and do not blow harder than the music needs.'],
[/circle|fifths?/,'Clockwise on the circle of fifths adds a sharp, counter-clockwise adds a flat. The first flashcard has the whole wheel.'],
[/transpos|concert|written/,'B♭ instruments read a major 2nd above concert, E♭ instruments a major 6th above, and F horn a perfect 5th above. Try it in the transposition explorer.'],
[/metronome|tempo|rhythm|rush|drag|count/,'Set the metronome slower than you think you need, play the passage cleanly three times, then raise it 4 BPM. Count out loud.'],
[/practi|warm.?up|routine/,'Short and focused beats long and tired. Try 5 minutes of long tones, 5 of scales, then your hardest 4 bars, slowly.'],
[/sight.?read|reading music|read notes/,'Before you play a note: key signature, time signature, then scan for the scariest bar. Keep the beat going even when you slip.'],
[/nervous|audition|perform|stage|solo/,'Nerves are normal. Practice the hard spots slowly, take one low breath before you start, and play it for a friend first.'],
[/clean|oil|grease|swab|maint|valve/,'Valve oil, cork grease, swab after playing. Cheap, quick, and much better than a repair bill. Ask your director for your instrument’s routine.'],
[/^(hi|hello|hey|yo)\b/,'Hi, I am Mel. Ask me about reeds, scales, tuning or practice.']];
const log=$('#log');
function say(t,c){log.insertAdjacentHTML('beforeend',`<div class="m ${c}">${t}</div>`);log.scrollTop=log.scrollHeight}
const esc=t=>t.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const fmtAI=t=>esc(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>');
let hist=[],busy=false,pend=null;
let KB=[];fetch('knowledge.json').then(r=>r.ok?r.json():[]).then(j=>{if(Array.isArray(j))KB=j}).catch(()=>{});
const taught=()=>{try{return JSON.parse(ls('mb-taught')||'[]')}catch(e){return[]}};
const words=t=>t.toLowerCase().match(/[a-z0-9♯♭#]+/g)||[];
function recall(l){const w=new Set(words(l));let best=null,bs=0;
  for(const [q,a] of [...KB.map(x=>[x.q,x.a]),...taught()]){const qw=words(q),n=qw.filter(x=>w.has(x)).length,sc=n/Math.max(qw.length,w.size,1);if(sc>bs){bs=sc;best=a}}
  return bs>=.6?best:null}
function local(t){const l=t.toLowerCase(),r=recall(l);
  if(r)return esc(r)+' <span class="mut">(you taught me this)</span>';
  const a=A.find(a=>a[0].test(l));if(a)return a[1];
  pend=t;return 'I do not know that one yet. If you know the answer, type it and I will save it on this device. Or say "skip".'}
async function ask(t){
  if(busy){say('One sec, still working on your last question.','bot');return}
  if(pend&&/\?\s*$/.test(t))pend=null;
  say(esc(t),'me');
  if(pend){const q=pend;pend=null;
    if(/^(no|nah|skip|nevermind|never mind)\b/i.test(t.trim())){say('No worries. Ask me anything else.','bot');return}
    const k=taught();k.push([q,t.slice(0,600)]);ls('mb-taught',JSON.stringify(k.slice(-50)));
    say('Got it, saved on this device. Ask me again and I will remember.','bot');return}
  if(!MEL_API){setTimeout(()=>say(local(t),'bot'),450);return}
  busy=true;hist.push({role:'user',content:t.slice(0,500)});hist=hist.slice(-12);
  while(hist.length&&hist[0].role!='user')hist.shift();
  const tp=document.createElement('div');tp.className='m';tp.textContent='Mel is thinking…';log.append(tp);log.scrollTop=log.scrollHeight;
  try{const r=await fetch(MEL_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:hist,notes:taught().slice(-10)})});
    if(!r.ok)throw 0;const d=await r.json();if(!d.reply)throw 0;
    hist.push({role:'assistant',content:d.reply});tp.innerHTML=fmtAI(d.reply)}
  catch(e){hist.pop();tp.innerHTML=local(t)}
  busy=false;log.scrollTop=log.scrollHeight}
$('#chips').innerHTML=['Why is my flute flat when it is cold?','Order of flats?','Clarinet squeaks'].map(t=>`<button class="chip" type="button">${t}</button>`).join('');
$('#chips').onclick=e=>{if(e.target.classList.contains('chip'))ask(e.target.textContent)};
function drawer(open){const d=$('#drawer');d.hidden=!open;$('#mel').setAttribute('aria-expanded',open);
  if(open){if(!log.children.length)say('Hi, I’m Mel. Ask me about instruments, scales, tuning or practice.','bot');$('#q').focus()}else $('#mel').focus()}
$('#mel').onclick=()=>drawer($('#drawer').hidden);$('#x').onclick=()=>drawer(false);
$('#drawer').onkeydown=e=>{if(e.key=='Escape')drawer(false)};
$('#f').onsubmit=e=>{e.preventDefault();const v=$('#q').value.trim();if(v){ask(v);$('#q').value=''}};
$('#poke').onclick=()=>drawer(true);
guide();
