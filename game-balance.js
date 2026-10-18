/* Bounded difficulty curve and public clearing rewards. No saved-state changes. */
class LumiBalance {
 static level(value){return Number.isSafeInteger(value)&&value>0?value:1}
 static stepMs(value){const n=this.level(value);return n<=3?145-n*5:Math.max(80,130-(n-3)*2.5)}
 static enemyRatio(value){return .5+Math.min(20,Math.max(0,this.level(value)-3))*.025}
 static enemyInterval(value,protectedByFlower=false){return protectedByFlower?3:1/this.enemyRatio(value)}
 static clearingBonus(value){return 25+Math.min(20,this.level(value)-1)*5}
}
if(typeof module!=='undefined')module.exports=LumiBalance;
