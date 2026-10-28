const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const fm=s=>s.replace(/([A-G])#/g,'$1♯').replace(/([A-G])b(?![a-z])/g,'$1♭');
const rnd=n=>Math.floor(Math.random()*n),pick=a=>a[rnd(a.length)],shuf=a=>[...a].sort(()=>Math.random()-.5);
const ls=(k,v)=>{try{return v==null?localStorage.getItem(k):localStorage.setItem(k,v)}catch(e){}};

/* ---------- Guides ---------- */
const T=['Put it together','Sit (or stand) right','Where your hands go','Air & sound'];
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
let cur='flute';
function guide(){
  $('#tabs').innerHTML=Object.entries(G).map(([k,v])=>`<button class="pill" role="tab" id="t-${k}" aria-selected="${k===cur}" aria-controls="guide" tabindex="${k===cur?0:-1}" data-k="${k}">${v[0]}</button>`).join('');
  const g=$('#guide'),c=cur;g.setAttribute('aria-labelledby','t-'+c);$('#tip').textContent='Mel says: '+TIP[c];
  g.innerHTML=G[c][1].map((t,i)=>`<article class="box"><span class="num" aria-hidden="true">Step ${i+1}</span><h4 class="hand">${T[i]}</h4><p>${t}</p></article>`).join('');
  G[c][1].forEach((_,i)=>{const im=new Image();im.alt=`${G[c][0]}: ${T[i]}`;im.onload=()=>{if(cur===c&&g.children[i])g.children[i].prepend(im)};im.src=`images/${c}-${i+1}.jpg`});
}
$('#tabs').onclick=e=>{const k=e.target.dataset.k;if(k){cur=k;guide();$('#t-'+k).focus()}};
$('#tabs').onkeydown=e=>{const ks=Object.keys(G),d={ArrowRight:1,ArrowLeft:-1}[e.key];if(d){cur=ks[(ks.indexOf(cur)+d+ks.length)%ks.length];guide();$('#t-'+cur).focus();e.preventDefault()}};

/* ---------- Music engine ---------- */
const L='CDEFGAB',N=[0,2,4,5,7,9,11],ST=[[0,2,4,5,7,9,11],[0,2,3,5,7,8,10]];
const MAJ='C Db D Eb E F F# G Ab A Bb B'.split(' '),MIN='C C# D Eb E F F# G G# A Bb B'.split(' ');
const INST={'Concert pitch (flute, oboe, trombone, tuba, bells)':0,'B♭ (clarinet, trumpet, tenor sax)':2,'E♭ (alto or bari sax)':9,'F (French horn)':7};
function scale(p,m){const t=(m?MIN:MAJ)[p],li=L.indexOf(t[0]);
  return ST[m].map((s,k)=>{const l=L[(li+k)%7],d=((p+s-N[L.indexOf(l)])%12+18)%12-6;return l+(d>0?'#'.repeat(d):'b'.repeat(-d))})}
const acc=s=>s.filter(n=>n.length>1);
const ct=s=>{const a=acc(s);return a.length?a.length+(a[0][1]=='#'?' sharp':' flat')+(a.length>1?'s':''):'No sharps or flats'};
const sig=s=>{const a=acc(s);return a.length?ct(s)+': '+a.map(fm).join(' '):ct(s)};
let mode=0;
function keys(){const v=$('#key').value||0;$('#key').innerHTML=(mode?MIN:MAJ).map((n,i)=>`<option value="${i}">${fm(n)} ${mode?'minor':'major'}</option>`).join('');$('#key').value=v}
function scales(){const r=+$('#key').value,sh=+$('#inst').value,w=(r+sh)%12,c=scale(r,mode),x=scale(w,mode),nm=mode?MIN:MAJ;
  $('#concert').innerHTML=c.map(n=>`<span>${fm(n)}</span>`).join('');
  $('#written').innerHTML=x.map(n=>`<span>${fm(n)}</span>`).join('');
  $('#sigc').textContent=`Concert ${fm(nm[r])} ${mode?'minor':'major'}. ${sig(c)}`;
  $('#sigw').textContent=sh?`You read ${fm(nm[w])} ${mode?'minor':'major'}. ${sig(x)}`:'Concert pitch instruments read the same notes the band hears.'}
$('#inst').innerHTML=Object.entries(INST).map(([k,v])=>`<option value="${v}">${k}</option>`).join('');
$('#mode').onchange=()=>{mode=+$('#mode').value;keys();scales()};
$('#key').onchange=$('#inst').onchange=scales;keys();scales();

let ac;const cx=()=>{ac=ac||new(window.AudioContext||window.webkitAudioContext)();ac.resume();return ac};
const hz=m=>440*2**((m-69)/12);
function tone(f,t,d,v=.2,ty='triangle'){const c=cx(),o=c.createOscillator(),g=c.createGain();o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.05)}
const mark=i=>$$('#concert span,#written span').forEach((e,j)=>e.classList.toggle('on',i>=0&&j%7==i));
$('#play').onclick=()=>{const c=cx(),r=60+(+$('#key').value),st=ST[mode],up=st.map((s,i)=>[i,r+s]),seq=[...up,[0,r+12],...up.reverse()];
  seq.forEach(([i,m],k)=>{tone(hz(m),c.currentTime+k*.4,.45);setTimeout(()=>mark(i),k*400)});setTimeout(()=>mark(-1),seq.length*400)};

const V=[['C',[]],['C#/Db',[1,2,3]],['D',[1,3]],['Eb',[2,3]],['E',[1,2]],['F',[1]],['F#/Gb',[2]],['G',[]],['Ab',[2,3]],['A',[1,2]],['Bb',[1]],['B',[2]]];
$('#notebtns').innerHTML=V.map((n,i)=>`<button aria-pressed="false" data-i="${i}">${fm(n[0])}</button>`).join('');
$('#valves').innerHTML=[1,2,3].map(i=>`<div class="valve" id="v${i}"></div>`).join('');
$('#notebtns').onclick=e=>{const b=e.target.closest('button');if(!b)return;const v=V[+b.dataset.i][1];
  $$('#notebtns button').forEach(x=>x.setAttribute('aria-pressed',x===b));
  [1,2,3].forEach(i=>$('#v'+i).classList.toggle('on',v.includes(i)));
  $('#vt').textContent=v.length?'Valves '+v.join(' + '):'Open (no valves)'};

/* ---------- Flip cards ---------- */
function wheel(){const M='C G D A E B F♯ D♭ A♭ E♭ B♭ F'.split(' '),m='Am Em Bm F♯m C♯m G♯m E♭m B♭m Fm Cm Gm Dm'.split(' '),a=['0','1♯','2♯','3♯','4♯','5♯','6','5♭','4♭','3♭','2♭','1♭'];
  return '<svg viewBox="-108 -108 216 216" width="200" role="img" aria-label="Circle of fifths" class="mx">'+M.map((k,i)=>{const t=i*Math.PI/6-Math.PI/2,c=Math.cos(t),d=Math.sin(t),p=(r,y)=>`x="${(c*r).toFixed(1)}" y="${(d*r+y).toFixed(1)}" text-anchor="middle"`;
    return `<text ${p(76,4)} font-size="13" font-weight="700" fill="currentColor">${k}</text><text ${p(50,3)} font-size="9" style="fill:var(--mut)">${m[i]}</text><text ${p(97,3)} font-size="8" font-weight="700" style="fill:var(--ct)">${a[i]}</text>`}).join('')+'</svg>'}
const kb='<svg viewBox="0 0 175 70" width="200" class="mx" role="img" aria-label="Piano keys C to B">'+[0,1,2,3,4,5,6].map(i=>`<rect x="${i*25}" y="0" width="25" height="70" fill="#fff" stroke="#3b3226"/><text x="${i*25+12}" y="64" text-anchor="middle" font-size="9" fill="#3b3226">${'CDEFGAB'[i]}</text>`).join('')+[1,2,4,5,6].map(i=>`<rect x="${i*25-7}" y="0" width="14" height="40" fill="#2b2218"/>`).join('')+'</svg>';
const CARDS=[
['Circle of Fifths','Key signatures, minus the panic.','#E9A83B',wheel()+'<p>Clockwise adds a sharp, counter-clockwise adds a flat. The small letters inside are relative minors, and they share the same key signature.</p>'],
['Interval math','For the spreadsheet brain.','#8FA98B','<p>Count half-steps. m2=1, M2=2, m3=3, M3=4, P4=5, tritone=6, P5=7, m6=8, M6=9, m7=10, M7=11, octave=12.</p><p>Major scale pattern: <b>W W H W W W H</b>. Minor third + major third stacks to a perfect fifth (3+4=7).</p>'],
['Color & mood','For the vibes brain.','#E2634E','<p><b>C</b> plain and honest, <b>G</b> sunny, <b>D</b> bright and triumphant, <b>F</b> pastoral and calm, <b>B♭</b> warm and round, <b>E♭</b> heroic, <b>A minor</b> lonely, <b>D minor</b> serious and stormy.</p><p>Try it: play a scale, then write down the color you hear.</p>'],
['Keyboard map','For the see-it-to-get-it brain.','#C9B79C',kb+'<p>Black keys come in groups of 2 and 3. C is the white key just left of the two-black-key group. Every neighboring key is one half-step.</p>']];
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
let qs,qn,sc,best=+ls('mb-best')||0;
function mk(n){const out=[],seen=new Set;while(out.length<n){const q=pick(GEN)();if(!seen.has(q.q)){seen.add(q.q);out.push(q)}}return out}
function qstart(){qs=mk(10);qn=0;sc=0;qshow()}
function qshow(){const q=qs[qn],z=$('#quiz');
  if(!q){if(sc>best){best=sc;ls('mb-best',sc)}
    z.innerHTML=`<h3 class="hand big" id="qq" tabindex="-1">You scored ${sc} / ${qs.length}</h3><p>${sc==10?'Perfect. Frame it.':sc>6?'Solid. One more round and those key signatures will stick.':'Rough round, totally normal. Read the explanations and go again.'} Best score: ${best}.</p><button class="btn" id="again" style="margin-top:12px">Play again</button>`;$('#qq').focus();return}
  z.innerHTML=`<p class="mut">Question ${qn+1} of ${qs.length} · Score ${sc}</p><h3 class="hand big" id="qq" tabindex="-1">${fm(q.q)}</h3><div class="opts">${q.o.map((o,i)=>`<button class="opt" data-i="${i}">${fm(o)}</button>`).join('')}</div><p id="fb" role="status"></p>`;$('#qq').focus()}
$('#quiz').onclick=e=>{const b=e.target.closest('button');if(!b)return;
  if(b.id=='again')return qstart();if(b.id=='next'){qn++;return qshow()}
  if(!b.dataset.i||$('#fb').dataset.done)return;
  const q=qs[qn],ok=q.o[+b.dataset.i]==q.a;if(ok)sc++;
  $$('.opt').forEach(x=>{x.disabled=true;if(q.o[+x.dataset.i]==q.a)x.classList.add('good');else if(x===b)x.classList.add('bad')});
  $('#fb').dataset.done=1;$('#fb').innerHTML=`<b>${ok?'Yep!':'Close, but no.'}</b> ${fm(q.w)} <button class="btn" id="next">${qn+1<qs.length?'Next':'See score'}</button>`;$('#next').focus()};
qstart();

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
const A=[[/cold|temperature|winter/,'Cold air = flat horn. Breathe through it for a minute and play a few easy notes <i>before</i> you tune, or you will end up sharp once it warms up.'],
[/order.*flats|flats.*order/,'Flats: <b>B E A D G C F</b>. “Battle Ends And Down Goes Charles’ Father.” Yes, it is a dumb sentence. That is why it works.'],
[/order.*sharps|sharps.*order/,'Sharps: <b>F C G D A E B</b>. It is just the flats backwards, so you only memorize once.'],
[/out of tune|tun(e|ing)\b|\bflat\b|\bsharp\b|pitch/,'Match a concert B♭ or A. <b>Sharp</b>? Pull the tuning slide or mouthpiece out a little. <b>Flat</b>? Push in. Still off? Check your air and posture before blaming the horn. The tuning tones are in Practice tools.'],
[/squeak|reed|chirp/,'Squeaks usually mean too much reed in your mouth, too much bite, or a finger not fully covering a hole. Less mouthpiece, firm corners, check your pads.'],
[/dizz|light.?head|pass out|breath/,'Dizzy? Stop and sit down, no heroics. Take slower, lower belly breaths and do not blow harder than the music needs.'],
[/circle|fifths?/,'Clockwise on the circle of fifths adds a sharp, counter-clockwise adds a flat. The first flashcard has the whole wheel.'],
[/transpos|concert|written/,'B♭ instruments read a major 2nd above concert, E♭ instruments a major 6th above, and F horn a perfect 5th above. Try it in the transposition explorer.'],
[/metronome|tempo|rhythm|rush|drag|count/,'Set the metronome slower than your ego wants, play it clean three times, then bump it up 4 BPM. Count out loud. Yes, out loud.'],
[/practi|warm.?up|routine/,'Short and focused beats long and tired. Try 5 minutes of long tones, 5 of scales, then your hardest 4 bars, slowly.'],
[/sight.?read|reading music|read notes/,'Before you play a note: key signature, time signature, then scan for the scariest bar. Keep the beat going even when you slip.'],
[/nervous|audition|perform|stage|solo/,'Nerves are normal. Practice the hard spots slowly, take one low breath before you start, and play it for a friend first.'],
[/clean|oil|grease|swab|maint|valve/,'Valve oil, cork grease, swab after playing. Boring, cheap, and way better than a repair bill. Ask your director for your instrument’s routine.'],
[/^(hi|hello|hey|yo)\b/,'Hey! I am Mel. Ask me about reeds, scales, tuning or practice.']];
const log=$('#log');
function say(t,c){log.insertAdjacentHTML('beforeend',`<div class="m ${c}">${t}</div>`);log.scrollTop=log.scrollHeight}
function ask(t){say(t.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])),'me');const l=t.toLowerCase();
  setTimeout(()=>say((A.find(a=>a[0].test(l))||[0,'Ha, you stumped me. Ask your director or section leader, then come back and tell me what they said. I take notes.'])[1],'bot'),450)}
$('#chips').innerHTML=['Why is my flute flat when it is cold?','Order of flats?','Clarinet squeaks'].map(t=>`<button class="chip" type="button">${t}</button>`).join('');
$('#chips').onclick=e=>{if(e.target.classList.contains('chip'))ask(e.target.textContent)};
function drawer(open){const d=$('#drawer');d.hidden=!open;$('#mel').setAttribute('aria-expanded',open);
  if(open){if(!log.children.length)say('Hey, it’s Mel. Reeds, scales, tuning, practice: I have opinions. Ask away.','bot');$('#q').focus()}else $('#mel').focus()}
$('#mel').onclick=()=>drawer($('#drawer').hidden);$('#x').onclick=()=>drawer(false);
$('#drawer').onkeydown=e=>{if(e.key=='Escape')drawer(false)};
$('#f').onsubmit=e=>{e.preventDefault();const v=$('#q').value.trim();if(v){ask(v);$('#q').value=''}};
$('#poke').onclick=()=>drawer(true);
guide();
