import * as _ from "lodash";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Level extends cc.Component {
    private flag = false;

    // update (dt) {}

    public setSensorLayout(isActive: boolean = true) {
        if (this.flag) {
            _.each(this.node.children, (node) => {
                node.getComponent(cc.PhysicsBoxCollider).sensor = true;
            })
            this.flag = false;
        }
    }

}
