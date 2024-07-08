import GameLogic from "../model/Game_Logic";
import { EventName } from "../utils/Enum";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BricksValue extends cc.Component {
    @property(cc.Label)
    private brickValueLB: cc.Label = null;

    // onLoad () {}

    // start () {}

    // update (dt) {}

    private getRndInteger(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public setData(pos: cc.Vec3) {
        const { brickValueLB } = this;
        const brickValueRnd = this.getRndInteger(0, 5);
        this.node.position = pos;
        brickValueLB.node.active = true;
        brickValueLB.node.opacity = 255;
        cc.tween(brickValueLB.node)
            .to(1, { opacity: 0, y: 40 })
            .delay(1)
            .call(() => {
                this.node.destroy();
            })
            .start()
        if (brickValueRnd === 0) {
            brickValueLB.node.active = false;
        } else {
            brickValueLB.string = `+${brickValueRnd}$`;
        }
        GameLogic.Instance.dispatchEvent(new Event(EventName.BricksValue), brickValueRnd);
    }

}
