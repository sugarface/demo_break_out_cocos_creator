// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import IngameController from "../controller/Ingame_Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameView extends cc.Component {

    @property(cc.Node)
    private profileParent: cc.Node = null;
    @property(cc.Prefab)
    private profilePrefab: cc.Prefab = null;
    @property(cc.Label)
    private scoreLB: cc.Label = null;

    onLoad() {
        this.spawnUI(this.profileParent, this.profilePrefab);
        this.init();
    }

    // start() {}

    // update (dt) {}

    private spawnUI(parent: cc.Node, prefab: cc.Prefab) {
        if (parent && prefab) {
            const _node = cc.instantiate(prefab);
            _node.parent = parent;
            return _node;
        }
        return null;
    }

    public init() {
        this.scoreLB.string = '0';
    };

    public updateScore(score) {
        this.scoreLB.string = score;
    }

}
