window.MB_VER=4;
// Mel's AI brain. The Worker URL lives in config.js (see README, "Make Mel a real AI chatbot"), so updating this file never disconnects it.
// Left empty, Mel still works with the built-in answers in brain.js and the teach-me notebook.
const MEL_API=(window.MEL_API||'').trim();

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

const KEYS=['a','s','d','f'];/* keyboard keys for valves 1 to 4. Q and W jump register. B or Space blows air. Trombone uses 1 to 7. */
const VS={1:2,2:1,3:3,4:5},F3={0:[],1:[2],2:[1],3:[1,2],4:[2,3],5:[1,3],6:[1,2,3]},F4={...F3,5:[4],6:[2,4],7:[1,4],8:[3,4],9:[2,3,4],10:[1,3,4],11:[1,2,3,4]};
/* p = open-note partials in concert pitch for the first variant. s = how many half-steps a variant shifts them up.
   off = half-steps from the sounding note to the note you read (written = sounding + off). vals = valve counts you can choose. */
const FI={
trumpet:{n:'Trumpet',ab:'Tp',sf:'trumpet',clef:'t',v:3,p:[58,65,70,74,77,82],vars:[
 {l:'B♭ trumpet',s:0,off:2,t:'Written pitch. A B♭ trumpet sounds a major 2nd lower.'},
 {l:'C trumpet',s:2,off:0,t:'Written pitch. A C trumpet sounds exactly as written.'},
 {l:'D trumpet',s:4,off:-2,t:'Written pitch. A D trumpet sounds a major 2nd higher.'},
 {l:'E♭ trumpet',s:5,off:-3,t:'Written pitch. An E♭ trumpet sounds a minor 3rd higher.'}]},
euph:{n:'Euphonium / baritone',ab:'Eu',sf:'trombone',clef:'b',v:4,vals:[4,3],p:[46,53,58,62,65,70],vars:[
 {l:'B♭, bass clef (concert pitch)',s:0,off:0,clef:'b',t:'Concert pitch, as read in bass clef.'},
 {l:'B♭, treble clef',s:0,off:14,clef:'t',t:'Written pitch, as read in treble clef. It sounds a major 9th lower.'}]},
tuba:{n:'Tuba',ab:'Tu',sf:'tuba',clef:'b',v:4,vals:[4,3],p:[34,41,46,50,53,58,62],vars:[
 {l:'BB♭ tuba',s:0,off:0,t:'Concert pitch. The most common school band tuba.'},
 {l:'CC tuba',s:2,off:0,t:'Concert pitch. Pitched a whole step above BB♭.'},
 {l:'E♭ tuba',s:5,off:0,t:'Concert pitch. Smaller, pitched a perfect 4th above BB♭.'},
 {l:'F tuba',s:7,off:0,t:'Concert pitch. Pitched a perfect 5th above BB♭.'}]},
horn:{n:'French horn',ab:'Hn',sf:'french_horn',clef:'t',v:3,p:[41,48,53,57,60,65,69,72],vars:[
 {l:'Double horn, F side',s:0,off:7,t:'Written pitch, F side of a double horn. Horn sounds a perfect 5th lower.'},
 {l:'Double horn, B♭ side',s:5,off:7,t:'Written pitch, B♭ side of a double horn (thumb trigger down). Same written notes, different fingerings. Sounds a perfect 5th lower.'}]},
trombone:{n:'Trombone',ab:'Tb',sf:'trombone',clef:'b',v:0,p:[46,53,58,62,65,70,74],vars:[
 {l:'Tenor trombone (B♭)',s:0,off:0,t:'Concert pitch. Slide positions 1 to 7.'},
 {l:'Alto trombone (E♭)',s:5,off:0,t:'Concert pitch. Slide positions 1 to 7 on an E♭ alto.'}]}};
const SM=[['Major',ST[0]],['Natural minor',ST[1]],['Chromatic',[0,1,2,3,4,5,6,7,8,9,10,11]]];
let fk='trumpet',vi=0,nv=3,pi=0,pos=1,fview=false,pre=false,tkey='',auto=true,sty=0,ref=null,frc=null;
const dn=new Set(),hd=new Set();let tdn=false,br=false,tap=false,tapT=0;
/* dn = valves shown as pressed. hd = valves physically held right now. tdn = trombone position held. br = air button held. tap = chart tap.
   ref = the last note that sounded. Auto register picks the note closest to it, the way a player's ear does. frc = a note forced by Q/W or a chart tap. */
const cfg=()=>{const b=FI[fk],x=b.vars[vi]||b.vars[0];return {...b,...x,v:b.vals?nv:b.v,p:b.p.map(a=>a+x.s)}};
const isT=()=>cfg().v==0;
const dmax=f=>f.v==0||f.v==3?7:12;
const gapOf=(f,i)=>Math.min(i?f.p[i]-f.p[i-1]:dmax(f),dmax(f));
const depth=()=>isT()?pos-1:[...dn].reduce((a,v)=>a+VS[v],0);
const nm=m=>fm(MAJ[((m%12)+12)%12]+(Math.floor(m/12)-1));
const fmtC=(c,s='·')=>c.length?c.join(s):'open';
/* every valve combination that lowers the pitch by d half-steps, standard one first. Example: 5 half-steps is 4, or 1 and 3. */
function combos(d,f){const out=[],n=f.v,canon=(f.v==4?F4:F3)[d]||[];
  for(let s=0;s<(1<<n);s++){const c=[];let t=0;for(let k=0;k<n;k++)if(s>>k&1){c.push(k+1);t+=VS[k+1]}if(t==d)out.push(c)}
  const key=c=>String(c)==String(canon)?'0':'1'+c.length+c.join('');
  return out.sort((a,b)=>key(a)<key(b)?-1:1)}
function pickCombo(d,f){const l=combos(d,f);if(sty&&f.v==4){const w=l.find(c=>!c.includes(4));if(w)return w}return l[0]||[]}
/* which register and how far down the valves or slide go to reach midi note m */
function fingerFor(m,f){for(let i=0;i<f.p.length;i++){const d=f.p[i]-m;if(d>=0&&d<gapOf(f,i))return{i,d}}return null}
/* the note you get: in auto mode, of the notes this fingering can reach, the one closest to the last note you played */
function pitch(){const f=cfg(),d=depth();
  if(!auto)return{m:f.p[pi]-d,i:pi};
  /* while practicing, a fingering that can make the note on the page sounds that note (a player aims the pitch with the embouchure). Any other fingering sounds the closest note and counts as a mistake. */
  if(P.practice&&P.notes[P.idx]){const t=P.notes[P.idx].snd,k=f.p.findIndex((q,x)=>q-d==t&&d<gapOf(f,x));if(k>=0)return{m:t,i:k}}
  if(frc&&frc.d==d)return{m:frc.m,i:frc.i};
  let best=null;
  f.p.forEach((q,i)=>{if(d>=gapOf(f,i))return;const m=q-d,dist=Math.abs(m-(ref==null?f.p[pi]:ref));
    if(!best||dist<best.dist||(dist==best.dist&&m<best.m))best={m,i,dist}});
  return best?{m:best.m,i:best.i}:{m:f.p[pi]-d,i:pi}}

/* ----- held notes ----- */
function synthHold(f){const c=cx(),t=c.currentTime,o=c.createOscillator(),l=c.createBiquadFilter(),g=c.createGain();
  o.type='sawtooth';o.frequency.value=f;l.type='lowpass';l.frequency.value=f*3;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.18,t+.05);
  o.connect(l);l.connect(g);g.connect(c.destination);o.start(t);
  return{stop(){const u=c.currentTime;g.gain.cancelScheduledValues(u);g.gain.setValueAtTime(g.gain.value,u);g.gain.linearRampToValueAtTime(0,u+.1);o.stop(u+.12)}}}
/* Recorded notes are finite, so a held note re-triggers a fresh copy every 1.9 seconds and crossfades it in under the old one.
   Struck sounds (piano) just get struck again every 2.2 seconds. */
function holdStart(p,m,o={}){const c=cx(),h={on:true,nodes:[],tm:0,syn:null};
  const fire=first=>{if(!h.on)return;
    h.nodes.push(p.play(m,c.currentTime,o.perc?{duration:2.6,gain:1.5,adsr:[.005,.3,.6,.7]}:{duration:2,gain:1.6,adsr:first?[.04,.1,.9,.5]:[.6,.1,.9,.5]}));
    if(h.nodes.length>3)h.nodes.shift();
    h.tm=setTimeout(()=>fire(false),o.perc?2200:1900)};
  if(p)fire(true);else h.syn=synthHold(hz(m));
  h.stop=()=>{h.on=false;clearTimeout(h.tm);const t=c.currentTime;h.nodes.forEach(n=>{try{n.stop(t+(o.perc?.4:.12))}catch(e){}});if(h.syn)h.syn.stop()};
  return h}
let voice=null,vk=null,vtok=0,stimer=0;
const active=()=>isT()?(tdn||br||tap):(hd.size>0||br||tap);
function stopVoice(){if(voice){voice.stop();voice=null}vk=null;vtok++}
/* Valve and key changes within 35 ms count as one fingering, so rolling a chord like 1+3 does not play a wrong note first. */
function sound(){const w=active()?pitch():null;
  if(!w){clearTimeout(stimer);stimer=0;if(vk!==null||voice)stopVoice();return}
  if(cfg().sf+':'+w.m===vk&&!stimer)return;
  clearTimeout(stimer);stimer=setTimeout(()=>{stimer=0;commit()},35)}
function commit(){const w=active()?pitch():null;if(!w){stopVoice();return}
  const f=cfg(),key=f.sf+':'+w.m;if(key===vk)return;
  if(voice){voice.stop();voice=null}
  vk=key;ref=w.m;const tok=++vtok;pAttack(w.m);
  if(SF[f.sf]){voice=holdStart(SF[f.sf],w.m);return}
  stat('Loading '+f.n.split(' ')[0].toLowerCase()+' sound…');
  loadSF(f.sf).then(p=>{if(tok!==vtok)return;stat();voice=holdStart(p,w.m)})}
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
  $('#fstl').style.display=f.v==4?'':'none';$('#fstyle').value=sty;
  $('#fctl').innerHTML=isT()?[1,2,3,4,5,6,7].map(n=>`<button class="vb pos" data-pos="${n}" aria-pressed="false" aria-label="Position ${n}">${n}</button>`).join(''):Array.from({length:f.v},(_,i)=>`<button class="vb" data-v="${i+1}" aria-pressed="false" aria-label="Valve ${i+1}"><b>${i+1}</b><small>${KEYS[i].toUpperCase()}</small></button>`).join('');
  $('#fhint').textContent=isT()?'Hold a position (tap and hold, or hold keys 1 to 7) and the note keeps sounding. To play a scale, change positions: Auto register picks the closest note, like a real player. Q and W jump up or down a register. Hold B or Space to blow on the current position.':`Hold the valves (tap and hold, or hold ${KEYS.slice(0,f.v).join(' ').toUpperCase()}) and the note keeps sounding. To play a scale, change fingerings: Auto register picks the closest note, like a real player, and you can press valves together like 1+3. Q and W jump up or down a register. For the open note, hold the button, or hold B or Space.`;
  ref=f.p[pi];frc=null;
  pSync();fUpd();preload()}
function fUpd(){const f=cfg(),d=depth(),t=pitch(),m=t.m;if(auto)pi=t.i;
  const gap=gapOf(f,pi),cur=[...dn].sort(),alts=(!isT()&&d>0)?combos(d,f).filter(c=>String(c)!=String(cur)).map(c=>fmtC(c,'+')):[];
  $$('.vb').forEach(b=>{const on=isT()?+b.dataset.pos==pos:dn.has(+b.dataset.v);b.classList.toggle('down',on);b.setAttribute('aria-pressed',on)});
  $('#rn').textContent=nm(m+f.off);
  $('#rs').textContent=(f.off?'Sounds '+nm(m)+' · ':'')+'Fingering: '+(isT()?'position '+pos:cur.length?cur.join(' + '):'open')+(alts.length?' · also '+alts.join(', '):'');
  $('#fchart').innerHTML=Array.from({length:gap},(_,k)=>`<button class="fc${k==d?' on':''}" data-d="${k}"><b>${nm(f.p[pi]-k+f.off)}</b><small>${isT()?'pos '+(k+1):combos(k,f).map(c=>fmtC(c)).join(' / ')}</small></button>`).join('');
  $('#rg').textContent=`Register ${pi+1} of ${f.p.length}`;
  $('#pn').textContent=$('#rn').textContent;$('#ps').textContent=$('#rs').textContent;
  $('#breath').setAttribute('aria-pressed',br);$('#pbreath').setAttribute('aria-pressed',br);
  sound()}
function reg(x){const f=cfg(),d=depth();
  if(auto){const cur=pitch().m,l=f.p.map((q,i)=>({m:q-d,i})).sort((a,b)=>a.m-b.m),n=x>0?l.find(o=>o.m>cur):[...l].reverse().find(o=>o.m<cur);
    if(n){frc={m:n.m,i:n.i,d};ref=n.m}}
  else pi=Math.max(0,Math.min(f.p.length-1,pi+x));
  fUpd()}

/* ---------- Staff notation (drawn as SVG so it looks the same on every device) ---------- */
/* Every note has a "dia" number: octave*7 + letter (C=0 ... B=6). Treble clef bottom line is E4 (30), bass clef bottom line is G2 (18). */
const SHP=[38,35,39,36,33,37,34],FLT=[34,37,33,36,32,35,31];/* key signature positions in treble clef. Bass clef sits 14 steps lower. */
const CLEF_T='M-3 28C-4 35 7 36 7 28L3.5 -36C3.2 -44 8 -47 10.5 -42C13 -36 6 -28 -1 -20C-9 -11 -11 0 -7 6C-3 12 7 11 9 3C11 -5 5 -11 -1 -8C-6 -5 -4 3 2 3';
const CLEF_B='M-2 0C4 -9 17 -6 17 6C17 18 5 27 -13 33';
function keyInfo(r,m){const names=scale(r,m),a=acc(names);
  return{r,m,names,n:a.length,sharp:!!a.length&&a[0][1]=='#',sp:names.map(s=>({l:L.indexOf(s[0]),a:s.length>1?(s[1]=='#'?1:-1):0}))}}
/* degree n of the key (0 = tonic, 7 = the tonic an octave up) written in octave o: its midi number, staff position and name */
function spell(ki,o,n){const k=((n%7)+7)%7,s=ki.sp[k],step=ki.sp[0].l+n,oct=o+Math.floor(step/7);
  return{midi:12*(oct+1)+N[s.l]+s.a,dia:oct*7+s.l,l:s.l,a:s.a,name:fm(ki.names[k])}}
const sharpSym='<g class="ks"><path d="M-2.2 -8V9M2.4 -9V8" stroke-width="1.3"/><path d="M-5 -2.5L5 -4.5M-5 3.5L5 1.5" stroke-width="2.6"/></g>';
const flatSym='<g class="ks"><path d="M-3 -14V6" stroke-width="1.5"/><path d="M-3 6C9 -1 8 -9 -3 -4" stroke-width="1.7"/></g>';
function staffSVG(o){
  const bass=o.clef=='b',bd=bass?18:30,ki=o.ki,kn=ki?ki.n:0,x0=44+(kn?kn*9+8:0),ts=o.time?26:0,mw=o.mw||150,mpl=o.mpl||2,len=o.len||1,
    lines=Math.ceil(len/mpl),SY=o.labels?154:118,T=40,xs=x0+ts,W=xs+Math.min(mpl,len)*mw+8,H=lines*SY,
    yOf=(y0,d)=>y0+40-(d-bd)*5;
  let s='';
  for(let ln=0;ln<lines;ln++){const y0=ln*SY+T,nm_=Math.min(mpl,len-ln*mpl),xe=xs+nm_*mw,last=ln==lines-1;
    for(let i=0;i<5;i++)s+=`<line class="ln" x1="6" x2="${xe}" y1="${y0+i*10}" y2="${y0+i*10}"/>`;
    s+=`<line class="bar" x1="6" x2="6" y1="${y0}" y2="${y0+40}"/>`;
    for(let j=1;j<=nm_;j++){const x=xs+j*mw;
      if(j==nm_&&last&&ln*mpl+j>=len)s+=`<line class="bar" x1="${x-5}" x2="${x-5}" y1="${y0}" y2="${y0+40}"/><line class="bar" x1="${x-1}" x2="${x-1}" y1="${y0}" y2="${y0+40}" style="stroke-width:3.5"/>`;
      else s+=`<line class="bar" x1="${x}" x2="${x}" y1="${y0}" y2="${y0+40}"/>`}
    s+=bass?`<g transform="translate(16 ${y0+10})"><path class="clef" d="${CLEF_B}"/><circle class="cf" cx="-2" cy="0" r="3.4"/><circle class="cf" cx="23" cy="-5" r="1.9"/><circle class="cf" cx="23" cy="5" r="1.9"/></g>`
      :`<g transform="translate(16 ${y0+30})"><path class="clef" d="${CLEF_T}"/><circle class="cf" cx="-3" cy="28" r="2.6"/></g>`;
    for(let i=0;i<kn;i++){const d=(ki.sharp?SHP:FLT)[i]-(bass?14:0);s+=`<g transform="translate(${44+i*9} ${yOf(y0,d)})">${ki.sharp?sharpSym:flatSym}</g>`}
    if(o.time&&ln==0)s+=`<text class="ts" x="${x0+11}" y="${y0+19}">4</text><text class="ts" x="${x0+11}" y="${y0+39}">4</text>`}
  const ns=(o.notes||[]).map((n,i)=>{const m=Math.floor(n.beat/4+1e-6),ln=Math.floor(m/mpl),j=m%mpl,bm=n.beat-m*4;
    return{...n,i,ln,x:xs+j*mw+18+bm*(mw-30)/4,y:yOf(ln*SY+T,n.dia)}});
  ns.forEach((n,i)=>{const q=ns[i+1];if(n.dur=='e'&&!n.sk&&q&&q.dur=='e'&&q.ln==n.ln&&Math.abs(q.beat-n.beat-.5)<.01){n.pr=q;q.sk=1}});
  ns.forEach(n=>{const y0=n.ln*SY+T,k0=n.dia-bd;let g='';
    if(k0<0)for(let k=-2;k>=k0;k-=2)g+=`<line class="ld" x1="${n.x-10}" x2="${n.x+10}" y1="${y0+40-k*5}" y2="${y0+40-k*5}"/>`;
    if(k0>8)for(let k=10;k<=k0;k+=2)g+=`<line class="ld" x1="${n.x-10}" x2="${n.x+10}" y1="${y0+40-k*5}" y2="${y0+40-k*5}"/>`;
    g+=`<ellipse class="hd${n.dur=='h'||n.dur=='w'?' o':''}" cx="${n.x}" cy="${n.y}" rx="6" ry="4.4" transform="rotate(-20 ${n.x} ${n.y})"/>`;
    if(n.pr){const q=n.pr,up=(n.dia+q.dia)/2<bd+4,dx=up?5.6:-5.6,by=up?Math.min(n.y,q.y)-34:Math.max(n.y,q.y)+34;
      g+=`<line class="st" x1="${n.x+dx}" x2="${n.x+dx}" y1="${n.y}" y2="${by}"/><line class="st" x1="${q.x+dx}" x2="${q.x+dx}" y1="${q.y}" y2="${by}"/><line class="bm" x1="${n.x+dx-.8}" x2="${q.x+dx+.8}" y1="${by}" y2="${by}"/>`}
    else if(!n.sk&&n.dur!='w'){const up=n.dia<bd+4,dx=up?5.6:-5.6,ey=up?n.y-34:n.y+34;
      g+=`<line class="st" x1="${n.x+dx}" x2="${n.x+dx}" y1="${n.y}" y2="${ey}"/>`;
      if(n.dur=='e')g+=`<path class="st" fill="none" d="M${n.x+dx} ${ey}q8 ${up?6:-6} 6 ${up?15:-15}"/>`}
    if(o.labels&&n.lb)g+=`<text x="${n.x}" y="${y0+98+(n.sk?14:0)}">${n.lb}</text>`;
    s+=`<g class="nt ${n.state||''}" data-i="${n.i}">${g}</g>`});
  return `<svg class="stf" viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.alt||'Music staff'}">${s}</svg>`}

/* ---------- Play page: scales and random songs ---------- */
const P={mode:'scale',stage:'find',deck:[],di:0,song:null,notes:[],ki:null,clef:'t',len:4,idx:0,mis:0,practice:false,listening:false,cur:-1,flash:false,done:false};
let lTok=0,jt=0;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const fingTxt=(m,f,short)=>{const x=fingerFor(m,f);if(!x)return short?'–':'out of range';
  return isT()?(short?''+(x.d+1):'position '+(x.d+1)):combos(x.d,f).slice(0,short?1:9).map(c=>fmtC(c,'+')).join(' or ')};
/* a note is usable if the instrument can play it and it sits within three ledger lines of the staff, so it stays readable */
const pOk=(ki,o,n,f)=>{const sp=spell(ki,o,n),bd=(f.clef||'t')=='b'?18:30;return sp.dia>=bd-6&&sp.dia<=bd+14&&!!fingerFor(sp.midi-f.off,f)};
/* choose an octave where every note of the piece fits the instrument, and report how far down and up the key can go from the tonic */
function pPlan(r,m,song){const f=cfg(),ki=keyInfo(r,m),tgt=(f.p[0]+f.p[Math.min(1,f.p.length-1)])/2+2;let best=null;
  for(let o=0;o<=7;o++){if(!pOk(ki,o,0,f))continue;let lo=0,hi=0;
    while(lo>-3&&pOk(ki,o,lo-1,f))lo--;while(hi<9&&pOk(ki,o,hi+1,f))hi++;
    const sc=Math.abs(spell(ki,o,0).midi-f.off-tgt)+((song?hi-lo>=6:hi>=7)?0:100);
    if(!best||sc<best.sc)best={o,lo,hi:song?Math.min(hi,lo+10):hi,sc,ki}}
  return best||{o:3,lo:0,hi:7,sc:999,ki}}
function melody(n,lo,hi,S0){const S=S0||[1,1,1,1,-1,-1,-1,-1,2,2,-2,-2,3,-3,0],a=[0];let c=0;
  for(let i=1;i<n-1;i++){let x=c+pick(S);if(x<lo||x>hi)x=c-(x-c);if(x<lo||x>hi)x=c;if(i>=2&&a[i-1]==a[i-2]&&x==c)x=c+(c<hi?1:-1);a.push(x);c=x}
  const T=(c>=4&&hi>=7)?7:0;
  if(n>2){let pn=T+(rnd(2)?1:-1);if(pn<lo||pn>hi)pn=T+(pn>T?-1:1);a[n-2]=pn}
  a.push(T);return a.slice(0,n)}
const ADJ=['Sunny','Midnight','Golden','Quiet','Bouncy','Stormy','Lazy','Brave','Crimson','Marching','Dusty','Silver','Sleepy','Wild','Gentle','Rusty','Cosmic','Cheerful','Windy','Secret'];
const NOUN=['River','Parade','Echo','Lantern','Hallway','Sunrise','Rocket','Meadow','Harbor','Carousel','Canyon','Whistle','Lighthouse','Caravan','Trail','Fiddle','Puddle','Comet','Bridge','Orchard'];
/* each style changes how often notes are long or split into eighths, how far the melody jumps, and the speed */
const STY=[{n:'Steady',h:.3,e:.15,st:[1,1,1,1,-1,-1,-1,-1,2,-2,0],b:[70,92]},{n:'Bouncy',h:.1,e:.6,st:[1,1,-1,-1,2,2,-2,-2,3,-3],b:[92,120]},
  {n:'Flowing',h:.15,e:.45,st:[1,1,1,1,1,-1,-1,-1,-1,-1,2,-2],b:[80,104]},{n:'Leapy',h:.2,e:.3,st:[2,2,-2,-2,3,3,-3,-3,1,-1,4,-4],b:[76,100]},
  {n:'Lullaby',h:.45,e:.1,st:[1,1,1,-1,-1,-1,2,-2,0],b:[56,72]},{n:'March',h:.25,e:.1,st:[1,-1,2,-2,0,0,1,-1],b:[100,116]}];
function mkPiece(r,m,song,o={}){const f=cfg(),pl=pPlan(r,m,song),ki=pl.ki;let degs=[],durs=[];
  if(!song){const top=Math.min(7,pl.hi),up=[],dn=[];for(let i=0;i<=top;i++)up.push(i);for(let i=top-1;i>=1;i--)dn.push(i);
    degs=[...up,...dn,0];durs=[...up.map(()=>'q'),...dn.map(()=>'q'),'h']}
  else{const len=+$('#plen').value,H=o.h??.2,E=o.e??.45;
    for(let mm=0;mm<len;mm++){if(mm==len-1){durs.push('w');break}let b=0;
      while(b<4){if(b%2==0&&b<=2&&Math.random()<H){durs.push('h');b+=2}else if(Math.random()<E){durs.push('e','e');b+=1}else{durs.push('q');b+=1}}}
    degs=melody(durs.length,pl.lo,pl.hi,o.st)}
  let beat=0;
  const notes=degs.map((n,i)=>{const sp=spell(ki,pl.o,n),d=durs[i],x={n,dur:d,beat,dia:sp.dia,wr:sp.midi,snd:sp.midi-f.off,name:sp.name,miss:0};beat+=d=='w'?4:d=='h'?2:d=='q'?1:.5;return x});
  return{ki,clef:f.clef||'t',notes,len:Math.ceil(beat/4-1e-6),pl}}
const pSet=pc=>{P.ki=pc.ki;P.clef=pc.clef;P.notes=pc.notes;P.len=pc.len};
const pBuild=()=>pSet(mkPiece(+$('#pkey').value,+$('#pmode').value,false));
/* a batch of 12 different songs: random key, style, tempo and name, all playable on the chosen instrument */
function genDeck(){const out=[],names=new Set();
  for(const strict of [true,false]){let guard=0;
    while(out.length<12&&guard++<400){const m=rnd(4)==0?1:0,r=rnd(12);if(strict&&keyInfo(r,m).n>4)continue;const pl=pPlan(r,m,true);if(pl.sc>=100)continue;
      const st=pick(STY),pc=mkPiece(r,m,true,st);let nm_,t=0;do{nm_=pick(ADJ)+' '+pick(NOUN)}while(names.has(nm_)&&t++<50);names.add(nm_);
      out.push({name:nm_,pc,bpm:st.b[0]+rnd(st.b[1]-st.b[0]+1),style:st.n,key:fm(pc.ki.names[0])+(m?' minor':' major')})}
    if(out.length>=6)break}
  return out}
const show=(el,on)=>{el.style.display=on?'':'none'};
function pUI(){const sc=P.mode=='scale',st=P.stage;
  show($('#pkl'),sc);show($('#pml'),sc);show($('#plenl'),!sc);
  show($('#pfind'),!sc&&st=='find');show($('#pdeck'),!sc&&st=='browse');
  show($('#pbox'),sc||st!='find');show($('#pacts'),sc||st=='play');show($('#pnew'),!sc&&st=='play');
  show($('#plegend'),(sc||st=='play')&&P.notes.length>0)}
function pDraw(){const f=cfg(),hint=$('#phint').checked,N_=P.notes;
  /* green = played right the first time, red = missed at least once. Once a note is passed it keeps its color. */
  const st=i=>P.listening?(i==P.cur?'on':''):P.practice?(i<P.idx?(N_[i].miss?'bad':'ok'):i==P.idx?((P.flash||N_[i].miss)?'bad':'on'):''):(P.done?(N_[i].miss?'bad':'ok'):'');
  $('#pstaff').innerHTML=staffSVG({clef:P.clef,ki:P.ki,len:P.len||4,mpl:2,time:true,labels:hint,alt:'Music to play, '+N_.length+' notes',
    notes:N_.map((n,i)=>({...n,state:st(i),lb:hint?fingTxt(n.snd,f,true):''}))})}
function pMsg(t){$('#pmsg').innerHTML=t}
function pStatus(){const f=cfg(),n=P.notes[P.idx],hint=$('#phint').checked;
  if(P.listening)return pMsg('Listening… watch the valves below move.');
  if(P.practice&&n)return pMsg(`Note <b>${P.idx+1}</b> of ${P.notes.length}: play <b>${n.name}</b>${hint?' · '+fingTxt(n.snd,f):''} · Misses: ${P.mis}`);
  if(P.done){const N_=P.notes.length,g=P.notes.filter(x=>!x.miss).length;return pMsg(`<b>Done.</b> ${g} of ${N_} notes right on the first try (${Math.round(100*g/N_)}%). ${g==N_?'Clean run!':'The red notes are the ones to work on. Press Practice to go again.'}`)}
  if(P.mode=='song'){
    if(P.stage=='find')return pMsg('Tap <b>Find me a song</b> and I will line up 12 random songs for you to hear.');
    if(P.stage=='browse')return pMsg('Skip the ones you do not like. When one grabs you, tap <b>Play this one</b>.');
    return pMsg(`<b>${P.song.name}</b> · ${P.song.key}. Press <b>Practice</b> to play it, or <b>Listen</b> to hear it again.`)}
  const ki=P.ki;pMsg(`${fm(ki.names[0])} ${ki.m?'minor':'major'}: ${sig(ki.names)}. Press <b>Listen</b> to hear it, or <b>Practice</b> and play it yourself.`)}
function pBtns(){const g=$('#pgo'),l=$('#plisten');g.textContent=P.practice?'Stop practice':'Practice';g.setAttribute('aria-pressed',P.practice);l.textContent=P.listening?'Stop':'Listen';l.setAttribute('aria-pressed',P.listening);$('#dback').disabled=P.di<=0}
function pStopListen(){if(!P.listening)return;lTok++;P.listening=false;P.cur=-1;dn.clear();frc=null;fUpd()}
function pStopAll(){pStopListen();P.practice=false;clearTimeout(jt)}
function pRebuild(){pStopAll();P.done=false;P.idx=0;P.mis=0;
  if(P.mode=='scale')pBuild();else{P.deck=[];P.di=0;P.stage='find';P.song=null;P.notes=[]}
  pUI();pDraw();pStatus();pBtns()}
function pStart(){if(!P.notes.length)return;pStopAll();P.practice=true;P.done=false;P.idx=0;P.mis=0;P.flash=false;P.notes.forEach(n=>n.miss=0);allUp();ref=P.notes[0].snd;frc=null;cx();loadSF(cfg().sf);pUI();pDraw();pStatus();pBtns()}
function pFinish(){P.practice=false;P.done=true;pDraw();pStatus();pBtns()}
/* called by the sound engine each time a new note starts. The note has to stay put for a moment so a roll from valve 1 to 1+3 does not count as a wrong note. */
function pAttack(m){if(!P.practice)return;const key=vk;clearTimeout(jt);jt=setTimeout(()=>{if(vk===key&&P.practice)judge(m)},170)}
function judge(m){const n=P.notes[P.idx],f=cfg();
  if(m===n.snd){P.idx++;ref=m;P.flash=false;if(P.idx>=P.notes.length)return pFinish();pDraw();pStatus()}
  else{P.mis++;n.miss=(n.miss||0)+1;P.flash=true;pDraw();pMsg(`That was <b>${nm(m+f.off)}</b>. Looking for <b>${n.name}</b>${$('#phint').checked?' · '+fingTxt(n.snd,f):''}. Misses: ${P.mis}`);
    setTimeout(()=>{if(P.practice&&P.flash){P.flash=false;pDraw()}},500)}}
async function pListen(){if(P.listening){pStopListen();pDraw();pStatus();pBtns();return}
  if(!P.notes.length)return;
  pStopAll();const tok=++lTok;P.listening=true;P.cur=-1;allUp();pBtns();pStatus();stat('Loading sound…');
  const f=cfg(),p=await loadSF(f.sf);stat();if(tok!==lTok)return;
  const c=cx(),bt=60000/+$('#ptempo').value,t0=performance.now();
  for(const [i,n] of P.notes.entries()){const w=t0+n.beat*bt-performance.now();if(w>0)await sleep(w);if(tok!==lTok)return;
    const x=fingerFor(n.snd,f);P.cur=i;
    if(x){dn.clear();hd.clear();if(isT())pos=x.d+1;else pickCombo(x.d,f).forEach(v=>dn.add(v));ref=n.snd;frc={m:n.snd,i:x.i,d:x.d};pi=x.i;fUpd()}
    const d=(n.dur=='w'?4:n.dur=='h'?2:n.dur=='q'?1:.5)*bt/1000*.92;
    if(p)p.play(n.snd,c.currentTime,{duration:d,gain:1.6,adsr:[.03,.1,.85,.2]});else synth(hz(n.snd),c.currentTime,d);
    pDraw()}
  await sleep(bt*(P.notes.at(-1).dur=='w'?4:1)*.9);if(tok!==lTok)return;
  P.listening=false;P.cur=-1;dn.clear();frc=null;fUpd();pDraw();pStatus();pBtns()}
/* ----- the song picker: browse a batch of songs, skip, then play the one you like ----- */
function showSong(i,auto){pStopAll();P.di=i;const s=P.deck[i];P.song=s;pSet(s.pc);
  $('#ptempo').value=s.bpm;$('#ptv').textContent=s.bpm;
  $('#dcount').textContent=`Song ${i+1} of ${P.deck.length}`;$('#dname').textContent=s.name;$('#dmeta').textContent=`${s.key} · ${s.style} · ${s.bpm} BPM`;
  P.idx=0;P.mis=0;P.done=false;pUI();pDraw();pStatus();pBtns();if(auto)pListen()}
function newBatch(){P.deck=genDeck();if(!P.deck.length){pMsg('This instrument cannot play random songs right now. Try another type or key.');return false}P.stage='browse';return true}
function pKeys(){const v=$('#pkey').value||0,mn=+$('#pmode').value;$('#pkey').innerHTML=(mn?MIN:MAJ).map((n,i)=>`<option value="${i}">${fm(n)} ${mn?'minor':'major'}</option>`).join('');$('#pkey').value=v}
function pSync(){const b=FI[fk],f=cfg();
  $('#pinst').innerHTML=Object.entries(FI).map(([k,x])=>`<option value="${k}"${k==fk?' selected':''}>${x.n}</option>`).join('');
  $('#pvar').innerHTML=$('#fvar').innerHTML;
  $('#pnvl').style.display=b.vals?'':'none';$('#pnv').innerHTML=$('#fnv').innerHTML;
  $('#pstl').style.display=f.v==4?'':'none';$('#pstyle').value=sty;
  $('#pctl').innerHTML=$('#fctl').innerHTML;
  $('#phelp').textContent=isT()?'Hold a slide position (tap and hold, or keys 1 to 7) to play. Space or B blows on the current position.':`Hold the valves to play (tap and hold, or keys ${KEYS.slice(0,f.v).join(' ').toUpperCase()}). Press valves together for combinations like 1+3. Space or B blows the open note.`;
  pRebuild()}
pKeys();
$('#ptempo').oninput=()=>$('#ptv').textContent=$('#ptempo').value;
const pMode=m=>{P.mode=m;$('#pm-scale').setAttribute('aria-pressed',m=='scale');$('#pm-song').setAttribute('aria-pressed',m=='song');pRebuild()};
$('#pm-scale').onclick=e=>{pMode('scale');e.currentTarget.blur()};$('#pm-song').onclick=e=>{pMode('song');e.currentTarget.blur()};
$('#pmode').onchange=e=>{pKeys();pRebuild();e.target.blur()};
$('#pkey').onchange=$('#plen').onchange=e=>{pRebuild();e.target.blur()};
$('#dfind').onclick=e=>{cx();if(newBatch())showSong(0,true);e.currentTarget.blur()};
$('#dskip').onclick=e=>{cx();if(P.di+1>=P.deck.length){if(newBatch())showSong(0,true)}else showSong(P.di+1,true);e.currentTarget.blur()};
$('#dback').onclick=e=>{cx();if(P.di>0)showSong(P.di-1,true);e.currentTarget.blur()};
$('#dreplay').onclick=e=>{cx();pStopListen();pListen();e.currentTarget.blur()};
$('#dpick').onclick=e=>{cx();pStopAll();P.stage='play';pStart();e.currentTarget.blur()};
$('#pnew').onclick=e=>{cx();pStopAll();P.done=false;P.stage='browse';showSong(P.di,true);e.currentTarget.blur()};
$('#pgo').onclick=e=>{if(P.practice){pStopAll();P.done=false;pDraw();pStatus();pBtns()}else pStart();e.currentTarget.blur()};
$('#plisten').onclick=e=>{cx();pListen();e.currentTarget.blur()};
$('#phint').onchange=e=>{pDraw();pStatus();e.target.blur()};

/* ----- controls ----- */
$('#ddl').innerHTML=Object.entries(FI).map(([k,f])=>`<li><button data-k="${k}"><span class="av sm">${f.ab}</span>${f.n}</button></li>`).join('');
const dd=o=>{$('#ddl').hidden=!o;$('#ddb').setAttribute('aria-expanded',o)};
$('#ddb').onclick=()=>dd($('#ddl').hidden);
function setInst(k){allUp();fk=k;vi=0;nv=FI[fk].vals?FI[fk].vals[0]:FI[fk].v;pi=0;pos=1;fRender()}
$('#ddl').onclick=e=>{const b=e.target.closest('button');if(!b)return;setInst(b.dataset.k);dd(false);$('#ddb').focus()};
$('#pinst').onchange=e=>{setInst(e.target.value);e.target.blur()};
['#fvar','#pvar'].forEach(s=>$(s).onchange=e=>{allUp();vi=+e.target.value;fRender();e.target.blur()});
['#fnv','#pnv'].forEach(s=>$(s).onchange=e=>{allUp();nv=+e.target.value;fRender();e.target.blur()});
['#fstyle','#pstyle'].forEach(s=>$(s).onchange=e=>{sty=+e.target.value;$('#fstyle').value=$('#pstyle').value=sty;pDraw();pStatus();e.target.blur()});
['#fauto','#pauto'].forEach(s=>$(s).onchange=e=>{auto=e.target.checked;$('#fauto').checked=$('#pauto').checked=auto;frc=null;fUpd();e.target.blur()});
document.addEventListener('click',e=>{if(!e.target.closest('.dd'))dd(false)});
/* the valves (and slide positions) exist twice, in the Fingering chart and on the Play page, and both work the same way */
[$('#fctl'),$('#pctl')].forEach(fc=>{
fc.onpointerdown=e=>{const b=e.target.closest('.vb');if(!b)return;cx();e.preventDefault();if(b.setPointerCapture)b.setPointerCapture(e.pointerId);
  if(b.dataset.pos){pos=+b.dataset.pos;tdn=true}else{if(!hd.size)dn.clear();hd.add(+b.dataset.v);dn.add(+b.dataset.v)}fUpd()};
fc.onpointerup=fc.onpointercancel=e=>{const b=e.target.closest('.vb');if(!b)return;
  if(b.dataset.v){hd.delete(+b.dataset.v);dn.delete(+b.dataset.v)}else tdn=false;fUpd()};
fc.onclick=e=>{if(e.detail)return;const b=e.target.closest('.vb');if(!b)return;cx();/* keyboard activation (Enter or Space on a focused button) */
  if(b.dataset.pos){pos=+b.dataset.pos;tdn=true;fUpd();setTimeout(()=>{tdn=false;fUpd()},900)}
  else{const v=+b.dataset.v;if(hd.has(v)){hd.delete(v);dn.delete(v)}else{hd.add(v);dn.add(v)}fUpd()}}});
$('#fchart').onclick=e=>{const b=e.target.closest('.fc');if(!b)return;cx();const k=+b.dataset.d,f=cfg(),m=f.p[pi]-k;
  dn.clear();hd.clear();if(isT())pos=k+1;else pickCombo(k,f).forEach(v=>dn.add(v));
  ref=m;frc={m,i:pi,d:k};
  tap=true;clearTimeout(tapT);tapT=setTimeout(()=>{tap=false;fUpd()},1200);fUpd()};
[$('#breath'),$('#pbreath')].forEach(bt=>{
bt.onpointerdown=e=>{cx();e.preventDefault();if(bt.setPointerCapture)bt.setPointerCapture(e.pointerId);br=true;fUpd()};
bt.onpointerup=bt.onpointercancel=()=>{br=false;fUpd()};
bt.onclick=e=>{if(e.detail)return;cx();br=true;fUpd();setTimeout(()=>{br=false;fUpd()},900)}});
$('#rdn').onclick=()=>reg(-1);$('#rup').onclick=()=>reg(1);
const vis=new Set();
const io=new IntersectionObserver(es=>{es.forEach(x=>{x.isIntersecting?vis.add(x.target.id):vis.delete(x.target.id)});
  fview=vis.size>0;if(fview&&!pre){pre=true;preload()}if(!fview)allUp()},{threshold:.15});
io.observe($('#fingerings'));io.observe($('#playpage'));
window.addEventListener('blur',allUp);
document.addEventListener('visibilitychange',()=>{if(document.hidden)allUp()});
const typing=e=>{const t=e.target;return t.isContentEditable||/TEXTAREA|SELECT/.test(t.tagName)||(t.tagName=='INPUT'&&/text|search|email|number/.test(t.type||'text'))};
document.addEventListener('keydown',e=>{if(e.key=='Escape')dd(false);if(!fview||e.repeat||typing(e)||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key.toLowerCase(),i=KEYS.indexOf(k),f=cfg();
  if(i>=0||k=='b'||k==' '||k=='q'||k=='w'||/^[1-7]$/.test(k))cx();
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
['Circle of Fifths','Key signatures','#2b5fd9',wheel()+'<p>Clockwise adds a sharp, counter-clockwise adds a flat. The small letters inside are relative minors, and they share the same key signature.</p>'],
['Interval math','By the numbers','#7aa5ff','<p>Count half-steps. m2=1, M2=2, m3=3, M3=4, P4=5, tritone=6, P5=7, m6=8, M6=9, m7=10, M7=11, octave=12.</p><p>Major scale pattern: <b>W W H W W W H</b>. Minor third + major third stacks to a perfect fifth (3+4=7).</p>'],
['Color & mood','By feel','#1d4ed8','<p><b>C</b> plain and honest, <b>G</b> sunny, <b>D</b> bright and triumphant, <b>F</b> pastoral and calm, <b>B♭</b> warm and round, <b>E♭</b> heroic, <b>A minor</b> lonely, <b>D minor</b> serious and stormy.</p><p>Try it: play a scale, then write down the color you hear.</p>'],
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

/* ---------- Sight-reading quiz ---------- */
const SQM=['C','G','D','A','E','F','Bb','Eb','Ab','Db'].map(x=>MAJ.indexOf(x)),SQN=[9,4,11,6,2,7,0,5,10];/* major keys, and minor keys, to ask about */
const LN='CDEFGAB',sqName=(l,a)=>LN[l]+(a>0?'♯':a<0?'♭':'');
const MNEM={t:'Treble clef lines are E G B D F (Every Good Boy Does Fine) and the spaces spell FACE.',b:'Bass clef lines are G B D F A (Good Boys Do Fine Always) and the spaces are A C E G (All Cows Eat Grass).'};
const sqSvg=(clef,ki,dia,alt)=>`<div class="stfq">${staffSVG({clef,ki,len:1,mpl:1,mw:110,time:false,alt,notes:dia==null?[]:[{dur:'w',beat:0,dia,state:'on'}]})}</div>`;
function sqKey(){const mn=rnd(10)<3,r=mn?pick(SQN):pick(SQM),ki=keyInfo(r,+mn);return{ki,mn,r}}
function sqNote(){const cl=$('#sqclef').value,clef=cl=='m'?(cfg().clef||'t'):cl=='x'?pick(['t','b']):cl,bd=clef=='b'?18:30,{ki,mn}=sqKey(),
    dia=bd-3+rnd(15),l=((dia%7)+7)%7,ka=ki.sp.find(s=>s.l==l).a,a0=sqName(l,ka);
  const pool=new Set([sqName((l+1)%7,ki.sp.find(s=>s.l==(l+1)%7).a),sqName((l+6)%7,ki.sp.find(s=>s.l==(l+6)%7).a),sqName((l+2)%7,ki.sp.find(s=>s.l==(l+2)%7).a),ka?sqName(l,0):sqName(l,rnd(2)?1:-1)]);
  pool.delete(a0);const o=shuf([...pool]).slice(0,3);while(o.length<3){const x=sqName(rnd(7),0);if(x!=a0&&!o.includes(x))o.push(x)}
  return{svg:sqSvg(clef,ki,dia,'Note to name'),q:ki.n?'What note is this? Read the key signature.':'What note is this?',a:a0,o:shuf([a0,...o]),
    w:`${MNEM[clef]} ${ka?`In ${fm(ki.names[0])} ${mn?'minor':'major'} the key signature (${sig(ki.names)}) makes it ${a0}.`:`This note is ${a0}.`}`}}
function sqKeyQ(){const {ki,mn}=sqKey(),clef=pick(['t','b']),right=fm(ki.names[0])+(mn?' minor':' major'),o=new Set();
  while(o.size<3){const k=mn?pick(SQN):pick(SQM),t=fm((mn?MIN:MAJ)[k])+(mn?' minor':' major');if(t!=right)o.add(t)}
  return{svg:sqSvg(clef,ki,null,'Key signature'),q:`Which ${mn?'minor':'major'} key has this key signature?`,a:right,o:shuf([right,...o]),
    w:`${right}: ${sig(ki.names)}.${mn?' A minor key shares its signature with the major key a minor 3rd above it.':''}`}}
function sqFing(){const f=cfg(),{ki}=sqKey(),r=pick(SQM),pl=pPlan(r,0,true),k2=keyInfo(r,0),n=pl.lo+rnd(pl.hi-pl.lo+1),sp=spell(k2,pl.o,n),snd=sp.midi-f.off,x=fingerFor(snd,f);
  if(!x)return sqNote();
  const gap=gapOf(f,x.i),txt=d=>isT()?'position '+(d+1):fmtC(combos(d,f)[0],'+'),a=txt(x.d),o=new Set();
  for(const d of shuf(Array.from({length:gap},(_,i)=>i)))if(d!=x.d&&o.size<3)o.add(txt(d));
  if(o.size<3)return sqNote();
  return{svg:sqSvg(f.clef||'t',k2,sp.dia,'Note to finger'),q:`Which ${isT()?'slide position':'fingering'} plays this note on your ${f.l.toLowerCase()}?`,a,o:shuf([a,...o]),
    w:`${sp.name} on your ${f.l.toLowerCase()} is ${fingTxt(snd,f)}.${f.off?' The staff shows the written note, not the concert pitch.':''}`}}
const sqOne=()=>pick([sqNote,sqNote,sqNote,sqKeyQ,sqKeyQ,sqFing])();
let sqs,sqn,sqsc,sqbest=+ls('mb-sbest')||0,sqf=false;
function sqstart(){sqs=Array.from({length:10},sqOne);sqn=0;sqsc=0;$('#sqnote').textContent='Fingering questions use your instrument: '+cfg().l+'. Change it in the Fingering chart or on the Play page.';sqshow()}
function sqshow(){const q=sqs[sqn],z=$('#sq');
  if(!q){if(sqsc>sqbest){sqbest=sqsc;ls('mb-sbest',sqsc)}
    z.innerHTML=`<h3 class="hand big" id="sqq" tabindex="-1">You scored ${sqsc} / ${sqs.length}</h3><p>${sqsc==10?'Perfect score.':sqsc>6?'Nice reading. Another round will lock it in.':'Keep going. Read the hints and try another round.'} Best score: ${sqbest}.</p><button class="btn" id="sagain" style="margin-top:12px">Play again</button>`;if(sqf)$('#sqq').focus();return}
  z.innerHTML=`<div class="bar"><i style="width:${sqn/sqs.length*100}%"></i></div><p class="mut">Question ${sqn+1} of ${sqs.length} · Score ${sqsc}</p>${q.svg}<h3 class="hand big" id="sqq" tabindex="-1">${q.q}</h3><div class="opts">${q.o.map((o,i)=>`<button class="opt" data-i="${i}">${o}</button>`).join('')}</div><p id="sfb" role="status"></p>`;if(sqf)$('#sqq').focus()}
$('#sq').onclick=e=>{const b=e.target.closest('button');if(!b)return;
  if(b.id=='sagain')return sqstart();if(b.id=='snext'){sqn++;return sqshow()}
  if(!b.dataset.i||$('#sfb').dataset.done)return;
  const q=sqs[sqn],ok=q.o[+b.dataset.i]==q.a;if(ok)sqsc++;
  $$('#sq .opt').forEach(x=>{x.disabled=true;if(q.o[+x.dataset.i]==q.a)x.classList.add('good');else if(x===b)x.classList.add('bad')});
  $('#sfb').dataset.done=1;$('#sfb').innerHTML=`<b>${ok?'Correct.':'Not quite.'}</b> ${q.w} <button class="btn" id="snext">${sqn+1<sqs.length?'Next':'See score'}</button>`;$('#snext').focus()};
$('#sqclef').onchange=e=>{sqstart();e.target.blur()};
sqstart();sqf=true;


/* ---------- Metronome & tuning tones ---------- */
let mt=0;
$('#bpm').oninput=()=>$('#bpmv').textContent=$('#bpm').value;
$('#met').onclick=e=>{const b=e.currentTarget;
  if(mt){clearInterval(mt);mt=0;b.textContent='Start';b.setAttribute('aria-pressed','false');$('#beat').textContent='–';return}
  const c=cx();let nx=c.currentTime+.05,n=0;b.textContent='Stop';b.setAttribute('aria-pressed','true');
  mt=setInterval(()=>{while(nx<c.currentTime+.15){const k=n%+$('#bpb').value;tone(k?800:1200,nx,.06,.35,'square');setTimeout(()=>{if(mt)$('#beat').textContent=k+1},Math.max(0,(nx-c.currentTime)*1000));nx+=60/+$('#bpm').value;n++}},25)};
/* Tuning tones: pick a sound, then hold a concert pitch. Each sound has an octave shift so a tuba is not squeaking up at B♭4. */
const DS=[['Piano','acoustic_grand_piano',0,1],['Trumpet','trumpet',0,0],['Trombone','trombone',-12,0],['Tuba','tuba',-24,0],['French horn','french_horn',-12,0],['Clarinet','clarinet',0,0],['Flute','flute',0,0],['Alto sax','alto_sax',0,0],['Violin','violin',0,0],['Plain tone (sine)','',0,0]];
$('#tsnd').innerHTML=DS.map((d,i)=>`<option value="${i}">${d[0]}</option>`).join('');
let dr=null,dtok=0;
function dStop(){dtok++;if(dr){dr.stop();dr=null}}
async function dStart(){cx();const b=$('#drone button[aria-pressed=true]');if(!b)return;
  const d=DS[+$('#tsnd').value],m=+b.dataset.m+d[2],tok=++dtok;
  if(!d[1]){const c=cx(),o=c.createOscillator(),g=c.createGain();o.frequency.value=hz(m);g.gain.value=.15;o.connect(g);g.connect(c.destination);o.start();dr={stop(){o.stop()}};return}
  if(!SF[d[1]]){$('#tstat').textContent='Loading '+d[0].toLowerCase()+' sound…';await loadSF(d[1]);if(tok!==dtok)return;$('#tstat').textContent=''}
  dr=holdStart(SF[d[1]]||null,m,{perc:!!d[3]})}
$('#drone').onclick=e=>{const b=e.target.closest('button');if(!b)return;const was=b.getAttribute('aria-pressed')=='true';
  dStop();$$('#drone button').forEach(x=>x.setAttribute('aria-pressed','false'));if(was)return;
  b.setAttribute('aria-pressed','true');dStart()};
$('#tsnd').onchange=e=>{const had=$('#drone button[aria-pressed=true]');dStop();if(had)dStart();else{const d=DS[+$('#tsnd').value];if(d[1]){cx();loadSF(d[1])}}e.target.blur()};

/* ---------- Maestro Mel ---------- */
/* ---------- Mel's calculator: works answers out instead of looking them up ---------- */
const FO='FCGDAEB',FL='BEADGCF',LT='CDEFGAB',PCL={C:0,D:2,E:4,F:5,G:7,A:9,B:11},acS=n=>n>0?'♯'.repeat(n):n<0?'♭'.repeat(-n):'',nn=(l,a)=>LT[l]+acS(a);
function parseNotes(t){const out=[],re=/\b([A-Ga-g])(#|♯|b(?![a-z])|♭|\s?sharp\b|\s?flat\b)?/g;let m;
  while((m=re.exec(t))){const end=m.index+m[0].length,ac=(m[2]||'').trim();
    if(/[a-z]/i.test(t[end]||''))continue;
    if(!ac&&m[1]=='a'&&!/^\s+(major|minor)/i.test(t.slice(end)))continue;
    out.push({l:LT.indexOf(m[1].toUpperCase()),a:ac?(/^(#|♯|sharp)$/i.test(ac)?1:-1):0,at:m.index,end})}
  return out}
const ksN=(l,a,mn)=>FO.indexOf(LT[l])-1+7*a-(mn?3:0);
const ksAcc=(L,n)=>n>0?(FO.indexOf(LT[L])<n?1:0):n<0?(FL.indexOf(LT[L])<-n?-1:0):0;
const ksList=n=>n>0?FO.slice(0,n).split('').map(x=>x+'♯').join(' '):FL.slice(0,-n).split('').map(x=>x+'♭').join(' ');
const INSTW=/^\s*(clarinet|trumpet|cornet|sax|saxophone|horn|flugel|instrument|tuba|euph|trombone)/i;
function calc(t){const l=t.toLowerCase(),nt0=parseNotes(t);if(!nt0.length)return null;
  const ci=l.indexOf('concert'),nt=nt0.filter(n=>!INSTW.test(t.slice(n.end))),pool=nt.length?nt:nt0,N0=(ci>=0&&pool.find(n=>n.at>ci))||pool[0],mn=/\bminor\b|\bmin\b/.test(l),mj=mn?'minor':'major';
  /* intervals between two notes */
  if(/interval|apart|distance/.test(l)&&nt.length>=2){const a=nt[0],b=nt[1],st=(b.l-a.l+7)%7;let sm=((PCL[LT[b.l]]+b.a)-(PCL[LT[a.l]]+a.a)+12)%12;
    const base=[0,2,4,5,7,9,11][st];let d=sm-base;if(d>6)d-=12;if(d<-6)d+=12;const per=[0,3,4].includes(st);
    const q=per?(d==0?'perfect':d>0?'augmented':'diminished'):(d==0?'major':d==-1?'minor':d>0?'augmented':'diminished');
    const nm_=['unison','2nd','3rd','4th','5th','6th','7th'][st];
    return `From <b>${nn(a.l,a.a)}</b> up to <b>${nn(b.l,b.a)}</b> is a <b>${q} ${nm_}</b> (${sm||(st?12:0)} half steps).`}
  /* transposition for a band instrument */
  if(/transpos|concert|written|what note.*(play|read)|\bfor concert\b|play.*when/.test(l)&&/(clarinet|trumpet|cornet|sax|horn|flugel|flute|oboe|trombone|tuba|euphonium|baritone|bassoon|violin|cello)/.test(l)){
    const E=/alto sax|bari(tone)? sax|alto clarinet|e.?flat/.test(l),F=/french horn|\bhorn\b|\bf horn\b/.test(l)&&!/baritone horn/.test(l),B=/clarinet|trumpet|cornet|soprano sax|tenor sax|flugel|b.?flat/.test(l);
    const inst=E?['E♭ instrument',5,9]:F?['F horn',4,7]:B?['B♭ instrument',1,2]:null;
    if(!inst)return `Flute, oboe, trombone, tuba, euphonium, bassoon and strings are <b>concert pitch</b> instruments, so what you read is what the band hears.`;
    const fromW=/\b(written|reads?|sees?|on the page)\b/.test(l)&&!/concert/.test(l),sgn=fromW?-1:1,L2=(N0.l+sgn*inst[1]+70)%7,pt=((PCL[LT[N0.l]]+N0.a+sgn*inst[2])%12+12)%12,a2=((pt-PCL[LT[L2]]+18)%12)-6;
    const o=nn(N0.l,N0.a),r=nn(L2,a2),how=E?'up a major 6th':F?'up a perfect 5th':'up a major 2nd';
    return fromW?`If a ${inst[0]} <b>reads ${o}</b>, the band hears concert <b>${r}</b> (written is ${how} from concert).`:`When the band plays concert <b>${o}</b>, a ${inst[0]} reads <b>${r}</b> (${how} from concert).`}
  /* fingerings on the valve instruments and trombone */
  if(/fingering|valves?|position|how do (i|you) play|how to play/.test(l)&&/(trumpet|trombone|tuba|euphonium|baritone|horn)/.test(l)){
    const k=/trombone/.test(l)?'trombone':/tuba/.test(l)?'tuba':/euph|baritone/.test(l)?'euph':/horn/.test(l)?'horn':'trumpet',b=FI[k],x=b.vars[0],f={v:b.vals?b.vals[0]:b.v},pc=((PCL[LT[N0.l]]+N0.a)%12+12)%12,out=[];
    b.p.forEach((q,i)=>{const g=Math.min(i?q-b.p[i-1]:(f.v==0||f.v==3?7:12),f.v==0||f.v==3?7:12);for(let d=0;d<g;d++){const w=q-d+x.off;if(((w%12)+12)%12==pc)out.push([w,f.v==0?'position '+(d+1):(combos(d,f)[0].length?combos(d,f)[0].join('+'):'open')])}});
    if(out.length)return `On a ${x.l} (${x.off?'written pitch':'concert pitch'}), <b>${nn(N0.l,N0.a)}</b>: ${out.slice(0,5).map(o=>`${nm(o[0])} = <b>${o[1]}</b>`).join(', ')}. The Fingering chart lets you try them.`}
  /* chords */
  if(/chord|triad/.test(l)){const R=l.slice(N0.end),T=x=>x.test(R),
      Q=T(/^\s*(dim|°)/)||/diminished/.test(l)?['diminished',[0,3,6]]:T(/^\s*(aug|\+)/)||/augmented/.test(l)?['augmented',[0,4,8]]:T(/^\s*(maj\s?7|major\s?(7|seventh))/)||/major seventh/.test(l)?['major 7th',[0,4,7,11]]:T(/^\s*(m7|min\s?7|minor\s?(7|seventh))/)||/minor seventh/.test(l)?['minor 7th',[0,3,7,10]]:T(/^\s*(7|dom)/)||/dominant|seventh/.test(l)?['dominant 7th',[0,4,7,10]]:T(/^\s*(m(?!aj)|min)/)||mn?['minor',[0,3,7]]:['major',[0,4,7]];
    const ns=Q[1].map((s,i)=>{const L2=(N0.l+i*2)%7,pt=(PCL[LT[N0.l]]+N0.a+s)%12,a2=((pt-PCL[LT[L2]]+18)%12)-6;return nn(L2,a2)});
    return `A <b>${nn(N0.l,N0.a)} ${Q[0]}</b> chord is <b>${ns.join(' – ')}</b>.`}
  /* relative keys */
  if(/relative/.test(l)){const want=(l.match(/relative (major|minor)/)||[])[1],gm=want?want=='major':/^\s*(minor|min)/.test(l.slice(N0.end)),n=ksN(N0.l,N0.a,gm),L2=(N0.l+(gm?2:5))%7,a2=ksAcc(L2,n);
    return gm?`The relative major of ${nn(N0.l,N0.a)} minor is <b>${nn(L2,a2)} major</b>. They share the same key signature.`:`The relative minor of ${nn(N0.l,N0.a)} major is <b>${nn(L2,a2)} minor</b>. They share the same key signature.`}
  /* key signatures and scales */
  const ks=/key signature|sharps|flats|how many/.test(l),sc=/scale|notes in|spell/.test(l)||/\bmajor\b|\bminor\b/.test(l)&&/notes/.test(l);
  if(ks||sc){const n=ksN(N0.l,N0.a,mn);
    if(Math.abs(n)>7)return `${nn(N0.l,N0.a)} ${mj} would need double sharps or flats, so musicians use its enharmonic twin instead.`;
    const sig_=n==0?'no sharps or flats':`${Math.abs(n)} ${n>0?'sharp':'flat'}${Math.abs(n)>1?'s':''} (${ksList(n)})`;
    const nts=Array.from({length:8},(_,i)=>{const L2=(N0.l+i)%7;return nn(L2,ksAcc(L2,n))});
    if(sc&&!ks||(sc&&/scale|notes/.test(l)))return `The <b>${nn(N0.l,N0.a)} ${mj}</b> scale: <b>${nts.join(' ')}</b>. Key signature: ${sig_}.`;
    return `<b>${nn(N0.l,N0.a)} ${mj}</b> has <b>${sig_}</b>.`}
  return null}

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
const BR=typeof BRAIN!=='undefined'?BRAIN:[];
function local(t){const l=t.toLowerCase(),r=recall(l);
  if(r)return esc(r)+' <span class="mut">(you taught me this)</span>';
  let c=null;try{c=calc(t)}catch(e){}if(c)return c;
  const b=BR.find(x=>x[0].test(l));if(b)return b[1];
  const a=A.find(a=>a[0].test(l));if(a)return a[1];
  pend=t;return 'I do not know that one yet.'+(MEL_API?'':' (My AI brain is not connected on this site, so I only know my built-in answers.)')+' If you know the answer, type it and I will save it on this device. Or say "skip".'}
const melStat=s=>{const e=$('#mst');if(e)e.textContent=s};
melStat(MEL_API?'AI mode: I can answer any music question.':'Offline mode: built-in answers only. The site owner can connect the AI (see the README).');
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
    hist.push({role:'assistant',content:d.reply});tp.innerHTML=fmtAI(d.reply);melStat('AI mode: I can answer any music question.')}
  catch(e){hist.pop();tp.innerHTML=local(t)+' <span class="mut">(built-in answer: the AI did not respond)</span>';melStat('The AI did not respond, so I am using built-in answers. Check the Worker (see the README).')}
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
window.MB_OK=true;
