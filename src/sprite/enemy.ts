import { Weapon } from 'phaser3-weapon-plugin';
import Arthur from './arthur';

export default class Enemy extends Phaser.GameObjects.Sprite {
  physics: any;

  gun: Phaser.GameObjects.Sprite;
  weapon: Weapon;
  gunTopLeft: any;

  is_killed: boolean = false;
  can_shoot: boolean = false;
  arthur: Arthur;

  constructor(scene: Phaser.Scene, x: number, y:number) {
    // super(Level1Scene, 1000, 485, config.key);
    super(scene, x, y, 'enemy1_body');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.arthur = this.scene.arthur;

    // enemy
    this.gun = scene.add.sprite(x - 50, y-40, 'enemy1_gun');

    // enemy weapon

    this.weapon = this.scene.add.weapon(100, 'bullet');
    this.weapon.debugPhysics = true;
    this.weapon.bulletAngleOffset = 90;
    this.weapon.bulletSpeed = 2000;

    this.gunTopLeft = this.gun.getTopLeft();

    this.scene.physics.add.overlap(
      this,
      this.arthur.weapon.bullets,
      (enemy: Enemy, bullet) => {
        enemy.getsHit(enemy, bullet);
        this.arthur.canMoveForward = true;
      }
    );


  }



  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.enemyFire();
  }

  // enemey shot
  enemyFire() {
    if (this.can_shoot != true) {
      return;
    }

    this.weapon.fireAngle = -180;
    this.weapon.fire(this.gunTopLeft, undefined, undefined, -1, 10);
    this.can_shoot = false;
  }

  getsHit(enemy, bullet) {
    bullet.kill();
    enemy.gun.destroy();
    enemy.can_shoot = false;
    enemy.is_killed = true;
    enemy.destroy();
  }
}
