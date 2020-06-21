var you = {
	health: 150,
	resistance: 1,
	weapon: false,
	damage: false
}
var sword  = {
	damage: 25
}
var knife = {
	damage: 22
}
var gun = {
	damage: 27
}
var fists = {
	damage: 20
}
var machinegun = {
	damage: 30
}

function changeWeaponSword(){
	you.weapon = "sword";
	you.damage = sword.damage;
	document.write(you.weapon)
}
function changeWeaponKnife(){
	you.weapon = "knife";
	you.damage = knife.damage;
	document.write(you.weapon)
}
function changeWeaponGun(){
	you.weapon = "gun";
	you.damage = gun.damage;
	document.write(you.weapon)
}
function changeWeaponFists(){
	you.weapon = "fists";
	you.damage = fists.damage;
	document.write(you.weapon)
}
function changeWeaponMachinegun(){
	you.weapon = "machinegun";
	you.damage = machinegun.damage;
	document.write(you.damage)
}


