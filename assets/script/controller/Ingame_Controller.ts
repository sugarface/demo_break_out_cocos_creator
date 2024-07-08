import * as _ from "lodash";
import GameLogic from "../model/Game_Logic";
import { GameLevel, RoundController } from "../utils/Enum";
import Ball from "../view/Ball";
import BricksLayout from "../view/Bricks_Layout";
import BricksValue from "../view/Bricks_Value";
import MovingBar from "../view/Moving_Bar";

const { ccclass, property } = cc._decorator;
const REMAINING_DEFAULT = 3;
const POS_BALL_DEFAULT: cc.Vec3 = cc.v3(360, 193, 0);

@ccclass
export default class IngameController extends cc.Component {

    @property(cc.Node)
    private ballParent: cc.Node = null;
    @property(cc.Node)
    private movingBar: cc.Node = null;
    @property(cc.Node)
    private bricksLayout: cc.Node = null;
    @property(cc.Node)
    private bricksValueParent: cc.Node = null;
    @property(cc.Prefab)
    private bricksValuePrefab: cc.Prefab = null;

    //NODE
    private _ballNode: cc.Node = null;
    private _movingBarNode: cc.Node = null;
    private _brickLayoutNode: cc.Node = null;
    //BOOLEAN
    private _isBall2: boolean = false;
    private _isBall4: boolean = false;
    //NUMBER
    private _currentLevel: number = 0;
    private _remainingTurns: number = 0;
    private _brickHasBeenDestroyed: number = 0;

    onLoad() {
        /***** LISTEN ROUND CONTROLLER EVENT *****/
        GameLogic.Instance.dispatchEvent(new Event(RoundController.NewRound), RoundController.NewRound);
        GameLogic.Instance.subscribe(RoundController.StartGame, this.listenerStartGame.bind(this));
        GameLogic.Instance.subscribe(RoundController.Continue, this.listenerContinue.bind(this));
        GameLogic.Instance.subscribe(RoundController.NextLevel, this.listenerNextLevel.bind(this));
        GameLogic.Instance.subscribe(RoundController.LoseGame, this.listenerLoseGame.bind(this));
        GameLogic.Instance.subscribe(RoundController.ResetGame, this.listenerResetGame.bind(this));
        /***** LISTEN EVENT *****/
        /***** INIT UI *****/
        this.initUI();
    }

    // start () {}

    // update (dt) {}

    /***** LISTENER EVENT ******/
    private listenerStartGame(event, data) {
        this.onStartGame();
    }

    private listenerContinue(event, data) {
        this.onContinue();
    }

    private listenerNextLevel(event, data) {
        this.onNextLevel();
    }

    private listenerLoseGame(event, data) {
        this.onLoseGame();
    }

    private listenerResetGame(event, data) {
        this.onResetGame();
    }


    /***** HANDLE WORK ON EVENT *****/
    private onStartGame() {
        this.setPhysics(true);
    }

    private onContinue() {
        const { _movingBarNode, ballParent } = this;
        ballParent.position = POS_BALL_DEFAULT;
        _movingBarNode.getComponent(MovingBar).init();
        this.setPhysics(true);
    }

    private onNextLevel() {
        this.resetGame();
        this._brickHasBeenDestroyed = 0;
        this._remainingTurns = REMAINING_DEFAULT;
    }

    private onLoseGame() {
        this.setPhysics(false);
    }

    private onResetGame() {
        this.resetGame();
        GameLogic.Instance.dispatchEvent(new Event(RoundController.NewRound), RoundController.NewRound);
    }

    /***** INIT UI *****/
    protected spawnUI(parent: cc.Node, prefab: cc.Prefab) {
        if (parent && prefab) {
            const _node = cc.instantiate(prefab);
            _node.parent = parent;
            return _node;
        }
        return null;
    }

    private initUI() {
        this.setPhysics(false);
        this._currentLevel = GameLevel.Level1;
        this._remainingTurns = REMAINING_DEFAULT;
        this._ballNode = this.ballParent.getChildByName("Ball");
        this._movingBarNode = this.movingBar.getChildByName("MovingBar");
        this._brickLayoutNode = this.bricksLayout.getChildByName("BricksLayout");
        this._ballNode.getComponent(Ball).init(this);
        this._movingBarNode.getComponent(MovingBar).init();
        this._brickLayoutNode.getComponent(BricksLayout).loadUI(this._currentLevel);
    }

    /***** SET DATA *****/
    private setPhysics(isPhysics: boolean) {
        cc.director.getPhysicsManager().enabled = isPhysics;
    }

    /***** LOGIC GAME *****/
    private stopGame() {
        this.setPhysics(false);
        this._remainingTurns -= 1;
        this.unscheduleAllCallbacks();
        this._isBall2 = false;
        this._isBall4 = false;
        if (this._remainingTurns === 0) {
            GameLogic.Instance.dispatchEvent(new Event(RoundController.LoseGame), RoundController.LoseGame);
            this.resetGame();
            return;
        }
        GameLogic.Instance.dispatchEvent(new Event(RoundController.LostTurn),
            { destroyedBricks: this._brickHasBeenDestroyed, remainingTurns: this._remainingTurns });
    }

    public onBallContactBrick(ballNode: cc.Node, brickNode: cc.Node) {
        const totalNodeLevel = brickNode.parent.children;
        const totalBricks = this._brickLayoutNode.getComponent(BricksLayout).TotalBricks;
        const bricksValueNode = this.spawnUI(this.bricksValueParent, this.bricksValuePrefab);
        bricksValueNode.getComponent(BricksValue).setData(brickNode.position);
        if (!this._isBall2 && !this._isBall4) {
            this._brickHasBeenDestroyed += 1;
            brickNode.destroy();
        } else {
            if (this._isBall2) this.handleBall2Power(totalNodeLevel, brickNode);
            if (this._isBall4) this.handleBall4Power(totalNodeLevel, brickNode);
        }
        if (this._brickHasBeenDestroyed >= totalBricks) {
            this._currentLevel += 1;
            GameLogic.Instance.dispatchEvent(new Event(RoundController.LevelUp), this._brickHasBeenDestroyed);
            this.setPhysics(false);
        }
    }

    public onBallContactGround(ballNode, groundNode) {
        this.stopGame();
    }

    public onBallContactMovingBar(ballNode, paddleNode) {
        return;
    }

    public onBallContactWall(ballNode, brickNode) {
        return;
    }

    private handleBall2Power(totalNode: Array<cc.Node>, nodeContact: cc.Node) {
        let arrBrickNearby = [];
        arrBrickNearby.push(nodeContact);
        _.each(totalNode, (node) => {
            if (node.y == nodeContact.y) {
                const isNearbyRow = node.x == nodeContact.x - 84 || node.x == nodeContact.x + 84;
                if (isNearbyRow) arrBrickNearby.push(node);
            } else {
                const isNearbyRow = node.x === nodeContact.x || node.x == nodeContact.x - 84 || node.x == nodeContact.x + 84;
                const isNearbyCol = node.y == nodeContact.y + 42 || node.y == nodeContact.y - 42;
                if (isNearbyRow) {
                    if (isNearbyCol) arrBrickNearby.push(node);
                }
            }
        })
        _.each(arrBrickNearby, (node) => {
            node.destroy();
            this._brickHasBeenDestroyed += 1;
        });
    }

    private handleBall4Power(totalNode: Array<cc.Node>, nodeContact: cc.Node) {
        let arrBrickNearby = [];
        arrBrickNearby.push(nodeContact);
        _.each(totalNode, (node) => {
            if (node.y == nodeContact.y) {
                if (node.x == nodeContact.x - 84 || node.x == nodeContact.x + 84) {
                    arrBrickNearby.push(node);
                }
            }
        })
        _.each(arrBrickNearby, (node) => {
            node.destroy();
            this._brickHasBeenDestroyed += 1;
        });
    }

    private resetGame() {
        this._isBall2 = false;
        this._isBall4 = false;
        this._brickHasBeenDestroyed = 0;
        this._currentLevel = GameLevel.Level1;
        this._remainingTurns = REMAINING_DEFAULT;
        this.unscheduleAllCallbacks();
    }
}
