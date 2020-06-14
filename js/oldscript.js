var enemy1 = {
	health: 100,
	damage: 20,
	resistance: 1.2
}
var enemy2 = {
	health: 120,
	damage: 18,
	resistance: 1.3
}
var enemy3 = {
	health: 80,
	damage: 30,
	resistance: 1.5
}
var enemy4 = {
	health: 200,
	damage: 25,
	resistance: 0.8
}
var enemy5 = {
	health: 150,
	damage: 13,
	resistance: 1
}
var you = {
	health: 150,
	damage: 20,
	resistance: 1
}
function causeDamage1(){
	enemy1.health = enemy1.health - you.damage * enemy1.resistance;
	document.write(enemy1.health)
};
function causeDamage2(){
	enemy2.health = enemy2.health - you.damage * enemy2.resistance;
	document.write(enemy2.health)
};
function causeDamage3(){
	enemy3.health = enemy3.health - you.damage * enemy3.resistance;
	document.write(enemy3.health)
};
function causeDamage4(){
	enemy4.health = enemy4.health - you.damage * enemy4.resistance;
	document.write(enemy4.health)
};
function causeDamage5(){
	enemy5.health = enemy5.health - you.damage * enemy5.resistance;
	document.write(enemy5.health)
};
function damageReceived1(){
	you.health = you.health - enemy1.damage * you.resistance;
	document.write(you.health)
};
function damageReceived2(){
	you.health = you.health - enemy2.damage * you.resistance;
	document.write(you.health)
};
function damageReceived3(){
	you.health = you.health - enemy3.damage * you.resistance;
	document.write(you.health)
};
function damageReceived4(){
	you.health = you.health - enemy4.damage * you.resistance;
	document.write(you.health)
};
function damageReceived5(){
	you.health = you.health - enemy5.damage * you.resistance;
	document.write(you.health)
};
