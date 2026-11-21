/* Music Buddy: real day streak + a warm-up that changes every day.
   Load this AFTER app.js. It takes over the "Today's warm-up" card.

   Streak: counts every day you open the site. Open it today and tomorrow and it says 2 day streak.
   Skip a whole day and it starts over at 1.

   Warm-up: big days and light days alternate. A big day is the full routine (7 things, with a
   different focus drill each time). A light day is just a scale and a song. */
(function(){
const $=s=>document.querySelector(s);
const wl=$('#wl');if(!wl)return;
const ls=(k,v)=>{try{return v==null?localStorage.getItem(k):localStorage.setItem(k,v)}catch(e){}};
const lj=(k,d)=>{try{const v=JSON.parse(ls(k)||d);return Array.isArray(v)?v:JSON.parse(d)}catch(e){return JSON.parse(d)}};
const dk=d=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
const now=new Date(),today=dk(now);
/* whole days since 1970 in the student's own time zone, so every midnight flips the plan */
const dayNum=Math.floor(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())/864e5);

/* ----- streak: one entry per day the site was opened ----- */
const days=lj('mb-visit-days','[]');
if(!days.includes(today)){days.push(today);ls('mb-visit-days',JSON.stringify(days.slice(-400)))}
function streak(){let n=0;const d=new Date();while(days.includes(dk(d))){n++;d.setDate(d.getDate()-1)}return n}

/* ----- today's plan ----- */
const SCALES=['C','F','B♭','E♭','A♭','G','D'];
const sc=SCALES[((dayNum%7)+7)%7];
const big=dayNum%2===0;
const FOCUS=[
  sc+' major in thirds: up and back, slow and even',
  sc+' major arpeggio (1 3 5 8), then back down',
  'Chromatic scale: one octave up and back, no rushing',
  'Dynamics: play your '+sc+' scale soft, then loud, then crescendo up and decrescendo down',
  'Interval leaps: from '+sc+', leap up a 5th and back, five times each',
  'Rhythm drill: clap one measure of eighths and sixteenths, then play it on '+sc
];
const focus=FOCUS[Math.floor(dayNum/2)%FOCUS.length];
const WI=big?[
  'Tune to concert B♭ (Quick pitch is right there)',
  'Long tones: four notes, eight counts each',
  sc+' major scale, slow first, then up to tempo',
  focus,
  'Articulation: slur a short phrase, then tongue it',
  'Hardest four bars of your music: slowly, five clean times',
  'Play something you love'
]:[
  sc+' major scale: once through, slow and clean',
  'Play something you love'
];

/* ----- drawing the card ----- */
const KEY='mb-warm2-'+today;
let wdone=lj(KEY,'[]');
function render(){
  const n=WI.filter((_,i)=>wdone[i]).length;
  wl.innerHTML=WI.map((t,i)=>`<li><label class="wi"><input type="checkbox" data-i="${i}"${wdone[i]?' checked':''}><span class="bx2"></span><span>${t}</span></label></li>`).join('');
  const wb=$('#wb');if(wb)wb.style.width=(n/WI.length*100)+'%';
  const s=streak(),st=$('#wst');
  if(st){st.hidden=false;st.textContent=s+' day streak'}
  const wn=$('#wn');
  if(wn)wn.textContent=n==WI.length
    ?(big?'That is a real warm-up. Go play something.':'Short and sweet. Rest up, tomorrow is a big one.')
    :n?`${n} of ${WI.length} done, keep going`
    :(big?`Big day: ${WI.length} things, about 15 minutes.`:'Light day: just two things. Tomorrow is a big one.')}
wl.onchange=e=>{const c=e.target.closest('input');if(!c)return;wdone[+c.dataset.i]=c.checked;ls(KEY,JSON.stringify(wdone));render()};
render();
})();
