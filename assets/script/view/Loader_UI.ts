// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoaderUI extends cc.Component {
    @property(cc.Node)
    private backgroundParent: cc.Node = null;
    @property(cc.Prefab)
    private backgroundPrefab: cc.Prefab = null;
    @property(cc.Node)
    private resultParent: cc.Node = null;
    @property(cc.Prefab)
    private resultPrefab: cc.Prefab = null;
    @property(cc.Node)
    private bricksLayoutParent: cc.Node = null;
    @property(cc.Prefab)
    private bricksLayoutPrefab: cc.Prefab = null;
    @property(cc.Node)
    private ballParent: cc.Node = null;
    @property(cc.Prefab)
    private ballPrefab: cc.Prefab = null;
    @property(cc.Node)
    private movingBarParent: cc.Node = null;
    @property(cc.Prefab)
    private movingBarPrefab: cc.Prefab = null;
    @property(cc.Node)
    private startGameParent: cc.Node = null;
    @property(cc.Prefab)
    private startGamePrefab: cc.Prefab = null;

    onLoad () {
        this.spawnUI(this.backgroundParent, this.backgroundPrefab);
        this.spawnUI(this.resultParent, this.resultPrefab);
        this.spawnUI(this.bricksLayoutParent, this.bricksLayoutPrefab);
        this.spawnUI(this.ballParent, this.ballPrefab);
        this.spawnUI(this.movingBarParent, this.movingBarPrefab);
        this.spawnUI(this.startGameParent, this.startGamePrefab);
    }

    // start () {}

    // update (dt) {}

    protected spawnUI(parent: cc.Node, prefab: cc.Prefab) {
        if (parent && prefab) {
            const _node = cc.instantiate(prefab);
            _node.parent = parent;
            return _node;
        }
        return null;
    }

}