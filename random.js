globalThis.CatRandom={
 choosePool(cats,rng=Math.random){
  const groups=[{weight:70,items:cats.filter(c=>!c.hasText)},{weight:25,items:cats.filter(c=>c.hasText&&c.textDensity!=='dense')},{weight:5,items:cats.filter(c=>c.hasText&&c.textDensity==='dense')}].filter(g=>g.items.length);
  if(!groups.length)return [];
  let roll=rng()*groups.reduce((sum,g)=>sum+g.weight,0);
  for(const group of groups){roll-=group.weight;if(roll<0)return group.items;}
  return groups.at(-1).items;
 },
 shuffle(items,rng=Math.random){const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;},
 makeBag(items,current,rng=Math.random){const bag=this.shuffle(items,rng);if(bag.length>1&&bag.at(-1)===current){[bag[0],bag[bag.length-1]]=[bag.at(-1),bag[0]];}return bag;}
};
