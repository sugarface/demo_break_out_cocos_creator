import * as _ from "lodash";
import GameLogic from "../model/Game_Logic";
import { EventName, GameLevel, RoundController } from "../utils/Enum";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BricksLayout extends cc.Component {

    @property(cc.Prefab)
    private layoutLevelOnePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    private layoutLevelTwoPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    private layoutLevelThreePrefab: cc.Prefab = null;


    private _totalBricksNode: Array<cc.Node> = [];
    private _totalBricks: number = 0;
    private _currentLevel: number = 0;

    onLoad() {
        GameLogic.Instance.subscribe(RoundController.NextLevel, this.listenerNextLevel.bind(this));
        GameLogic.Instance.subscribe(RoundController.ResetGame, this.listenerResetGame.bind(this));
    }

    // start() {}

    // update (dt) {}

    public get TotalBricks() {
        return this._totalBricks;
    }

    /***** LISTENER EVENT ******/
    private listenerNextLevel(event, data) {
        this.unscheduleAllCallbacks();
        if (data) this._currentLevel = data;
        this.loadUI(this._currentLevel);
    }

    private listenerResetGame(event, data) {
        this.reset();
        this.loadUI(GameLevel.Level1);
    }


    /***** COMMOM *****/
    private spawnUI(parent: cc.Node, prefab: cc.Prefab) {
        if (parent && prefab) {
            const _node = cc.instantiate(prefab);
            _node.parent = parent;
            return _node;
        }
        return null;
    }

    private getName(data): Array<string> {
        let arr = [];
        _.each(data, (item) => {
            arr.push(item.name);
        })
        return arr;
    }

    /***** LOGIC *****/
    public loadUI(level: number) {
        let layoutNode: cc.Node = null;
        this.clearLayout();
        switch (level) {
            case GameLevel.Level1:
                layoutNode = this.spawnUI(this.node, this.layoutLevelOnePrefab);
                this._totalBricksNode = layoutNode.children;
                this._totalBricks = layoutNode.children.length;
                break;
            case GameLevel.Level2:
                layoutNode = this.spawnUI(this.node, this.layoutLevelTwoPrefab);
                this._totalBricksNode = layoutNode.children;
                this._totalBricks = layoutNode.children.length;
                break;
            case GameLevel.Level3:
                layoutNode = this.spawnUI(this.node, this.layoutLevelThreePrefab);
                this._totalBricksNode = layoutNode.children;
                this._totalBricks = layoutNode.children.length;
                break;
            default:
                break;
        }
    }

    private clearLayout() {
        this.node.removeAllChildren();
    }

    private reset() {
        this.clearLayout();
        this._currentLevel = 1;
    }

}