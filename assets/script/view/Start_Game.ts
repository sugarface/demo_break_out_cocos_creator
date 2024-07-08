
import GameLogic from "../model/Game_Logic";
import { RoundController } from "../utils/Enum";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StartGame extends cc.Component {

    onLoad() {
        this.show();
        GameLogic.Instance.subscribe(RoundController.NextLevel, this.listenerNextLevel.bind(this));
        GameLogic.Instance.subscribe(RoundController.ResetGame, this.listenerResetGame.bind(this));
    }

    // start () {}

    // update (dt) {}

    private onClickStartGame() {
        this.hide();
        GameLogic.Instance.dispatchEvent(new Event(RoundController.StartGame), RoundController.StartGame);
    }

    /* LISTENER EVENT */
    private listenerNextLevel(event, data) {
        this.show();
    }

    private listenerResetGame(event, data) {
        this.show();
    }

    private show() {
        this.node.active = true;
    }

    private hide() {
        this.node.active = false;
    }

}
