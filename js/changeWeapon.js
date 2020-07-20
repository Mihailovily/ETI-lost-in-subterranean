Game.PlayerTemplate = {
    character: '@',
    foreground: 'white',
    maxHp: 40,
    attackValue: 10,
    sightRadius: 6,
    mixins: [Game.Mixins.PlayerActor,
             Game.Mixins.Attacker, Game.Mixins.Destructible,
             Game.Mixins.Sight, Game.Mixins.MessageRecipient]
};

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
	Game.Screen.playScreen._player._attackValue = sword.damage;
}
document.onkeydown = function(e) {
	if (e.keyCode == 49) {
		changeWeaponSword();
	}
}
function changeWeaponKnife(){	
	Game.Screen.playScreen._player._attackValue = knife.damage;	
}
document.onkeydown = function(e) {
	if (e.keyCode == 50) {
		changeWeaponKnife()
	}
}
function changeWeaponGun(){	
	Game.Screen.playScreen._player._attackValue = gun.damage;	
}
document.onkeydown = function(e) {
	if (e.keyCode == 51) {
		changeWeaponGun()
	}
}
function changeWeaponFists(){	
	Game.Screen.playScreen._player._attackValue = fists.damage;	
}
document.onkeydown = function(e) {
	if (e.keyCode == 52) {
		changeWeaponFists()
	}
}
function changeWeaponMachinegun(){
	Game.Screen.playScreen._player._attackValue = machinegun.damage;
}
document.onkeydown = function(e) {
	if (e.keyCode == 53) {
		changeWeaponMachinegun()
	}
}

