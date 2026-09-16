import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import vm from 'node:vm';
import './public/random.js';
test('every cycle contains each cat once and boundaries do not repeat',()=>{
 let last='1';const ids=['1','2','3','4','5'];
 for(let i=0;i<300;i++){const bag=CatRandom.makeBag(ids,last);assert.equal(bag.length,ids.length);assert.equal(new Set(bag).size,ids.length);assert.notEqual(bag.at(-1),last);while(bag.length)last=bag.pop();}
});
test('single and empty pools terminate safely',()=>{assert.deepEqual(CatRandom.makeBag(['1'],'1'),['1']);assert.deepEqual(CatRandom.makeBag([],'1'),[]);});
test('random helpers do not mutate their input',()=>{const ids=['1','2','3'];CatRandom.makeBag(ids,'2');assert.deepEqual(ids,['1','2','3']);});
test('catalogue has unique IDs, source links and local JPEG photos',async()=>{
 const scope={window:{}};vm.runInNewContext(await readFile(new URL('./public/cats.js',import.meta.url),'utf8'),scope);const cats=scope.window.CATS;assert.equal(cats.length,15);assert.equal(new Set(cats.map(c=>c.id)).size,cats.length);
 for(const cat of cats){assert.ok(cat.alt);assert.ok(cat.source.startsWith('https://imgflip.com/'));const file=new URL('./public/'+cat.local,import.meta.url);await access(file);const data=await readFile(file);assert.equal(data[0],0xff);assert.equal(data[1],0xd8);}
});

test('all picks use 70 percent plain, 25 percent short, 5 percent dense text',()=>{
 const cats=[{id:'plain',hasText:false},{id:'short',hasText:true,textDensity:'short'},{id:'dense',hasText:true,textDensity:'dense'}];const count={plain:0,short:0,dense:0};
 for(let i=0;i<1000;i++)count[CatRandom.choosePool(cats,()=>(i+0.5)/1000)[0].id]++;
 assert.deepEqual(count,{plain:700,short:250,dense:50});
 assert.equal(CatRandom.choosePool([cats[0]],()=>0.99)[0].id,'plain');
 assert.deepEqual(CatRandom.choosePool([]),[]);
});
