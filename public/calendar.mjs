// UTC 계산으로 시간대와 일광절약시간의 영향을 받지 않습니다.
export function monthCells(month){
 if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw Error('올바른 월을 입력하세요.');
 const [year,m]=month.split('-').map(Number),first=new Date(Date.UTC(year,m-1,1)).getUTCDay(),last=new Date(Date.UTC(year,m,0)).getUTCDate();
 return [...Array(first).fill(null),...Array.from({length:last},(_,i)=>`${month}-${String(i+1).padStart(2,'0')}`)];
}
export function moveMonth(month,delta){const [y,m]=month.split('-').map(Number),d=new Date(Date.UTC(y,m-1+delta,1));return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}`}
