import GameLogic from "../model/Game_Logic";
import { EventName, RoundController } from "../utils/Enum";

const { ccclass, property } = cc._decorator;
const LEFT_LIMIT_MOVING_BAR = -200;
const RIGHT_LIMIT_MOVING_BAR = 200;
const LEFT_LIMIT_MOVING_BAR_POWER = -180;
const RIGHT_LIMIT_MOVING_BAR_POWER = 180;

@ccclass
export default class MovingBar extends cc.Component {

    private isExpand: boolean = false;

    onLoad() {
        GameLogic.Instance.subscribe(EventName.Expand, this.listenerExpand.bind(this));
        GameLogic.Instance.subscribe(RoundController.LevelUp, this.listenerLevelUp.bind(this));
        GameLogic.Instance.subscribe(RoundController.NextLevel, this.listenerNextLevel.bind(this));
        GameLogic.Instance.subscribe(RoundController.ResetGame, this.listenerResetGame.bind(this));
    }

    // start() {}

    update(dt) {
        this.setTouchMove(this.isExpand);
    }
    /***** LISTENER EVENT ******/
    private listenerLevelUp(event, data) {
        this.onLevelUp();
    }

    private listenerNextLevel(event, data) {
        this.reset();
    }

    private listenerResetGame(event, data) {
        this.reset();
    }

    private listenerExpand(event, data) {
        this.onExpand();
    }

    /***** HANDLE WORK ON EVENT *****/
    private onExpand() {
        const self = this;
        this.isExpand = true;
        this.node.scaleX = 1.2;
        this.scheduleOnce(() => {
            self.node.scaleX = 1;
            this.isExpand = false;
        }, 3);
    }

    private onLevelUp() {
        this.isExpand = false;
    }

    /***** LOGIC *****/
    public init() {
        this.node.x = 0;
    }

    private setTouchMove(isExpand: boolean = false) {
        const leftLimit = isExpand ? LEFT_LIMIT_MOVING_BAR_POWER : LEFT_LIMIT_MOVING_BAR;
        const rightLimit = isExpand ? RIGHT_LIMIT_MOVING_BAR_POWER : RIGHT_LIMIT_MOVING_BAR;
        this.node.on("touchmove", (event) => {
            let touchPoint = this.node.parent.convertToNodeSpaceAR(event.getLocation());
            if (touchPoint.x <= leftLimit) {
                this.node.x = leftLimit;
            } else if (touchPoint.x >= rightLimit) {
                this.node.x = rightLimit;
            } else {
                this.node.x = touchPoint.x;
            }
        });
    }

    /***** RESET *****/
    private reset() {
        this.node.x = 0;
        this.isExpand = false;
        this.unscheduleAllCallbacks();
    }

}
