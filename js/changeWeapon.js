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
function changeWeaponKnife(){	
	Game.Screen.playScreen._player._attackValue = knife.damage;	
}
function changeWeaponGun(){	
	Game.Screen.playScreen._player._attackValue = gun.damage;	
}
function changeWeaponFists(){	
	Game.Screen.playScreen._player._attackValue = fists.damage;	
}
function changeWeaponMachinegun(){
	Game.Screen.playScreen._player._attackValue = machinegun.damage;
}


