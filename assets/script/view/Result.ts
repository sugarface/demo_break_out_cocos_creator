import * as _ from "lodash";
import GameLogic from "../model/Game_Logic";
import { EventName, GameLevel, RoundController } from "../utils/Enum";

enum StateButton {
    Continue,
    NextLevel,
    Collect,
    Reset
}

const { ccclass, property } = cc._decorator;
const REMAINING_DEFAULT = 3;

@ccclass
export default class Result extends cc.Component {

    @property(cc.Button)
    private continueButton: cc.Button = null;
    @property(cc.Button)
    private nextLevelButton: cc.Button = null;
    @property(cc.Button)
    private collectButton: cc.Button = null;
    @property(cc.Button)
    private resetButton: cc.Button = null;
    @property(cc.Label)
    private resultLB: cc.Label = null;
    @property(cc.Label)
    private scoreLB: cc.Label = null;
    @property(cc.Label)
    private remainTurnLb: cc.Label = null;

    private _isNextLevel: boolean = false;
    private _currentLevel: number = 0;

    onLoad() {
        this.hide();
        this._currentLevel = GameLevel.Level1;
        GameLogic.Instance.subscribe(RoundController.LostTurn, this.listenerLostTurn.bind(this));
        GameLogic.Instance.subscribe(RoundController.LevelUp, this.listenerLevelUp.bind(this));
        GameLogic.Instance.subscribe(RoundController.LoseGame, this.listenerLoseGame.bind(this));
    }

    // start() {}

    // update (dt) {}

    /***** LISTENER EVENT *****/
    private listenerLostTurn(event, data) {
        this.onLostTurn(data);
    }

    private listenerLevelUp(event, data) {
        this.onLevelUp(data);
    }

    private listenerLoseGame(event, data) {
        this.show(0, 0);
    }

    /***** HANDLE WORK ON EVENT *****/
    private onLostTurn(data) {
        if (data) {
            this.show(data.destroyedBricks, data.remainingTurns);
        }
    }

    private onLevelUp(data) {
        this._isNextLevel = true;
        if (this._currentLevel < 3) {
            if (data) {
                this.show(data, REMAINING_DEFAULT);
            }
        }
        else {
            this.showResultWin();
        }
    }

    /***** LISTENER EVENT CLICK BUTTONS *****/
    private onClickContinue() {
        this.hide();
        GameLogic.Instance.dispatchEvent(new Event(RoundController.Continue), RoundController.Continue);
    }

    private onClickNextLevel() {
        this._currentLevel += 1;
        this.reset();
        GameLogic.Instance.dispatchEvent(new Event(RoundController.NextLevel), this._currentLevel);
    }

    private onClickCollect() {
        this._currentLevel = GameLevel.Level1;
        this.reset();
        this.scheduleOnce(() => {
            GameLogic.Instance.dispatchEvent(new Event(RoundController.NextLevel), this._currentLevel);
        }, 1);
    }

    private onClickReset() {
        this.reset();
        this._currentLevel = GameLevel.Level1;
        GameLogic.Instance.dispatchEvent(new Event(RoundController.ResetGame), RoundController.ResetGame);
    }

    private show(destroyedBricks: number, remainingTurns?: number) {
        const { resultLB } = this;
        this.node.active = true;
        resultLB.node.active = true;
        if (remainingTurns === 0) {
            this.remainTurnLb.node.active = false;
            resultLB.string = 'YOU LOSE!';
            this.resetButton.node.active = true;
            this.setDisplayButton(StateButton.Reset);
            this.scoreLB.string = "";
        }
        else if (remainingTurns > 0 && remainingTurns <= 3) {
            if (this._isNextLevel) {
                this.setDisplayButton(StateButton.NextLevel);
                resultLB.string = 'YOU WIN, NEXT LEVEL!';
            } else {
                this.remainTurnLb.node.active = true;
                this.remainTurnLb.string = `YOUR TURN REMAIN: ${remainingTurns}`;
                this.setDisplayButton(StateButton.Continue);
                resultLB.node.active = false;
            }
            this.scoreLB.string = 'Destroyed Bricks ' + `${destroyedBricks}`;
        }
    }

    private showResultWin() {
        this.setDisplayButton(StateButton.Collect);
        this.node.active = true;
        this.resultLB.string = 'YOUUU WINNN!!!';
    }

    private hide() {
        this.node.active = false;
    }

    private hideAllButtons() {
        const { continueButton, nextLevelButton, collectButton, resetButton } = this;
        continueButton.node.active = false;
        nextLevelButton.node.active = false;
        collectButton.node.active = false;
        resetButton.node.active = false;
    }

    private setDisplayButton(state: StateButton) {
        const { continueButton, nextLevelButton, collectButton, resetButton } = this;
        this.hideAllButtons();
        if (state === StateButton.Continue) {
            continueButton.node.active = true;
        } else if (state === StateButton.NextLevel) {
            nextLevelButton.node.active = true;
        } else if (state === StateButton.Collect) {
            collectButton.node.active = true;
        } else {
            resetButton.node.active = true;
        }
    }

    private reset() {
        this.hide();
        this.unscheduleAllCallbacks();
        this._isNextLevel = false;
    }

}
