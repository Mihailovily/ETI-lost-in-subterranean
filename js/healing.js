var you = {
	health: 100,
	resistance: 1,
	weapon: false,
	damage: false,
	healing: 5,
	maxHealth: 150
}
function healing(){
	do{
		you.health = you.health + you.healing;
		console.log(you.health)
	}
	while(you.maxHealth > you.health)
}
