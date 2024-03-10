import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
        let shiftKey;
        let cursors;
        let controls;
        let glayer;
        let marker;
    }

    preload (){
        this.load.image('tiles', 'assets/tilesets/0x72-industrial-tileset-32px-extruded.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/platformer-simple.json');
    }
    create ()
    {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('0x72-industrial-tileset-32px-extruded', 'tiles');
        map.createLayer('Background', tileset);
        this.glayer = map.createLayer('Ground', tileset).setCollisionByProperty({collides: true});
        map.createLayer('Foreground', tileset);
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.cursors = this.input.keyboard.createCursorKeys();
        const controlConfig = {
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            up: this.cursors.up,
            down: this.cursors.down,
            speed: 0.5
        };
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.marker = this.add.graphics();
        this.marker.lineStyle(5, 0xffffff, 1);
        this.marker.strokeRect(0, 0,map.tileWidth,map.tileHeight);
        this.marker.lineStyle(3, 0xff4f78, 1);
        this.marker.strokeRect(0, 0,map.tileWidth,map.tileHeight);

    }

    update(time, delta){
        this.controls.update(delta);
        const worldPos = this.input.activePointer.positionToCamera(this.cameras.main);
        const pointXY = this.glayer.worldToTileXY(worldPos.x, worldPos.y);
        const snapped = this.glayer.tileToWorldXY(pointXY.x, pointXY.y);
        this.marker.setPosition(snapped.x, snapped.y);  
        if (this.input.manager.activePointer.isDown){
            if (this.shiftKey.isDown){
                this.glayer.removeTileAtWorldXY(worldPos.x, worldPos.y);
            }
            else {
                this.glayer.putTileAtWorldXY(6,worldPos.x,worldPos.y);
            }
        }
    }
}
