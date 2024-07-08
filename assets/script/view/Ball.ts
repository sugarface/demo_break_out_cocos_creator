import IngameController from "../controller/Ingame_Controller";
import GameLogic from "../model/Game_Logic";
import { EventName, PhysicalTag, RoundController } from "../utils/Enum";

const { ccclass, property } = cc._decorator;
const DEFAULT_LINEAR_VELOCITY_NORMAL = 400;

@ccclass
export default class Ball extends cc.Component {
    @property(cc.Sprite)
    private ballSprite: cc.Sprite = null;

    private isLeftDirection: boolean = false;
    private _ingameController: IngameController = null;

    onLoad() {
        this.reset();
        cc.director.getPhysicsManager().enabled = true;
        GameLogic.Instance.subscribe(RoundController.Continue, this.listenerContinue.bind(this));
        GameLogic.Instance.subscribe(RoundController.ResetGame, this.listenerResetGame.bind(this));
        GameLogic.Instance.subscribe(RoundController.NextLevel, this.listenerNextLevel.bind(this));
    }

    // start() {}

    update(dt) {
        this.turn();
    }

    onBeginContact(contact, self, other) {
        const { _ingameController } = this;
        switch (other.tag) {
            case PhysicalTag.Brick:
                GameLogic.Instance.dispatchEvent(new Event(EventName.BreakBrick), EventName.BreakBrick);
                _ingameController.onBallContactBrick(self.node, other.node);
                break;
            case PhysicalTag.Ground:
                _ingameController.onBallContactGround(self.node, other.node);
                break;
            case PhysicalTag.MovingBar:
                _ingameController.onBallContactMovingBar(self.node, other.node);
                break;
            case PhysicalTag.Wall:
                _ingameController.onBallContactWall(self.node, other.node);
                break;
            case 6:
                this.isLeftDirection = false;
                break;
            case 7:
                this.isLeftDirection = true;
                break;
            default:
                break;
        }
    }

    /***** LISTENER EVENT ******/
    private listenerContinue(event, data) {
        this.reset();
    }

    private listenerResetGame(event, data) {
        this.reset();
    }

    private listenerNextLevel(event, data) {
        this.handleBallNextLevel(data);
        this.reset();
    }


    /***** LOGIC *****/
    public init(ingameController: IngameController) {
        this._ingameController = ingameController;
    }

    private turn() {
        if (this.isLeftDirection) {
            this.ballSprite.node.angle -= 30;
        } else {
            this.ballSprite.node.angle += 30;
        }
    }

    private handleBallNextLevel(data) {
        let speed: number = 0;
        switch (data) {
            case 2:
                speed = DEFAULT_LINEAR_VELOCITY_NORMAL + 100;
                this.getComponent(cc.RigidBody).linearVelocity = cc.v2(speed, speed);
                break;
            case 3:
                speed = DEFAULT_LINEAR_VELOCITY_NORMAL + 200;
                this.getComponent(cc.RigidBody).linearVelocity = cc.v2(speed, speed);
                break;
            default:
                speed = DEFAULT_LINEAR_VELOCITY_NORMAL;
                this.getComponent(cc.RigidBody).linearVelocity = cc.v2(speed, speed);
                break;
        }
    }

    /***** RESET *****/
    private reset() {
        this.unscheduleAllCallbacks();
        this.node.position = cc.v3(0, 0, 0);
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(DEFAULT_LINEAR_VELOCITY_NORMAL, DEFAULT_LINEAR_VELOCITY_NORMAL);
    }

}
