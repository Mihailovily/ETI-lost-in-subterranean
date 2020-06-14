var you = {
	health: 150,
	resistance: 1,
	damage: 20,
	maxHealth: 150
};
var healthPotion = 20;
var bigHealthPotion = 50;
function regeneration(){
	you.health = you.health + healthPotion;
	if (you.health > you.maxHealth){
		document.write(you.maxHealth)
	}
	else{
		document.write(you.health)
	}
}
function bigRegeneration(){
	you.health = you.health + bigHealthPotion
}