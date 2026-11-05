export const workouts={
 a1:{label:'근력 A',minutes:40,items:[['시티드 로우','12회 × 3세트'],['레그 프레스','12회 × 3세트'],['체스트 프레스','12회 × 3세트'],['플랭크','20초 × 3세트']]},
 b1:{label:'근력 B',minutes:40,items:[['레그 컬','12회 × 3세트'],['랫 풀다운','12회 × 3세트'],['덤벨 숄더 프레스','10회 × 3세트'],['백 익스텐션','12회 × 2세트']]},
 a2:{label:'근력 A',minutes:45,items:[['시티드 로우','12회 × 3세트'],['고블릿 스쿼트','10회 × 3세트'],['덤벨 벤치프레스','10회 × 3세트']]},
 b2:{label:'근력 B',minutes:45,items:[['루마니안 데드리프트','10회 × 3세트'],['랫 풀다운','10회 × 3세트'],['워킹 런지','양쪽 각각 10회 × 2세트']]},
 c2:{label:'근력 C',minutes:45,items:[['케이블 로우','12회 × 3세트'],['레그 프레스','12회 × 3세트'],['인클라인 덤벨 프레스','10회 × 3세트']]}}
export function addDays(date,n){let [y,m,d]=date.split('-').map(Number);return new Date(Date.UTC(y,m-1,d+n)).toISOString().slice(0,10)}
export function schedule(start){if(!/^\d{4}-\d{2}-\d{2}$/.test(start)||addDays(start,0)!==start)throw Error('올바른 시작일을 입력하세요.');return Array.from({length:56},(_,i)=>{let w=Math.floor(i/7)+1, p=i%7;let k=w<=4?({0:'a1',4:'b1'}[p]):({1:'a2',4:'b2',6:'c2'}[p]);let workout=k?workouts[k]:null;let items=workout?workout.items.map(([name,amount])=>({name,amount})):[];if(!k||w===8)items.push({name:'걷기',amount:(w===8?'8,000':'6,000')+'보'});return {date:addDays(start,i),week:w,day:p+1,key:k||'walk',label:workout?.label||'걷기',minutes:workout?.minutes||null,items}})}
export function localToday(){let d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
export function percent(done){return Math.round(done/56*100)}
