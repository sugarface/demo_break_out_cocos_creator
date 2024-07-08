// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import GameLogic from "../model/Game_Logic";
import { ColorLable, EventName, GameLevel, RoundController, TimeLeftLevel } from "../utils/Enum";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Background extends cc.Component {

    @property(cc.Label)
    private timerLB: cc.Label = null;
    @property(cc.Label)
    private levelLB: cc.Label = null;

    private _currentLevel: number = 0;
    private _currentTimeLevel: number = 0;
    private _timeLeft: number = -99999;
    private _defaultTimer: string = "00:00";
    private _isStartGame: boolean = false;

    onLoad() {
        this.loadDefault();
        GameLogic.Instance.subscribe(RoundController.StartGame, this.listenerStartGame.bind(this));
        GameLogic.Instance.subscribe(RoundController.LevelUp, this.listenerLevelUp.bind(this));
        GameLogic.Instance.subscribe(RoundController.NextLevel, this.listenerNextLevel.bind(this));
        GameLogic.Instance.subscribe(RoundController.ResetGame, this.listenerResetGame.bind(this));
    }

    // start () {}

    update(dt) {
        if (this._timeLeft > 0) {
            this.timerLB.node.active = true;
            this._timeLeft -= dt;
            let time_left = Math.ceil(this._timeLeft);
            this.timerLB.node.color = new cc.Color().fromHEX(ColorLable.Default);
            if (time_left >= 10 && time_left < 60) {
                this.timerLB.string = `00:${time_left}`;
            } else if (time_left >= 60) {
                const mind = this._timeLeft % (60 * 60);
                const minutes = Math.floor(mind / 60);
                const secd = mind % 60;
                const seconds = Math.ceil(secd);
                if (minutes >= 10) {
                    this.timerLB.string = `${minutes}:${seconds}`;
                } else {
                    if (seconds == 60) {
                        this.timerLB.string = `01:00`;
                    } else if (seconds >= 10 && seconds < 60) {
                        this.timerLB.string = `0${minutes}:${seconds}`;
                    } else {
                        this.timerLB.string = `0${minutes}:0${seconds}`;
                    }
                }
            } else {
                this.timerLB.string = `00:0${time_left}`;
            }
        } else {
            this.timerLB.string = `${this._defaultTimer}`;
            this.timerLB.node.color = new cc.Color().fromHEX(ColorLable.Disable);
            if (this._isStartGame) {
                GameLogic.Instance.dispatchEvent(new Event(RoundController.LoseGame), RoundController.LoseGame);
                this._isStartGame = false;
            }
        }
    }

    /***** LISTENER EVENT *****/
    private listenerStartGame(event, data) {
        this.onStartGame();
    }

    private listenerLevelUp(event, data) {
        this.onLevelUp();
    }

    private listenerNextLevel(event, data) {
        this.onNextLevel();
    }

    private listenerResetGame(event, data) {
        this.reset();
        this.resetLevel();
    }

    /***** HANDLE WORK ON EVENT *****/
    private onStartGame() {
        const { _currentTimeLevel } = this;
        this._isStartGame = true;
        this._timeLeft = _currentTimeLevel;
    }

    private onLevelUp() {
        this.reset();
        this._currentLevel += 1;
        switch (this._currentLevel) {
            case GameLevel.Level2:
                this._currentTimeLevel = TimeLeftLevel.Level2;
                break;
            case GameLevel.Level3:
                this._currentTimeLevel = TimeLeftLevel.Level3;
                break;

            default:
                break;
        }
    }

    private onNextLevel() {
        const { levelLB } = this;
        if (this._currentLevel > 3) return;
        levelLB.string = `LEVEL ${this._currentLevel}`;
    }

    /***** INIT UI *****/
    private loadDefault() {
        const { levelLB } = this;
        this._currentLevel = GameLevel.Level1;
        this._currentTimeLevel = TimeLeftLevel.Level1;
        levelLB.string = `LEVEL ${GameLevel.Level1}`;
    }

    private resetLevel() {
        this._currentLevel = GameLevel.Level1;
    }

    private reset() {
        const { levelLB } = this;
        this._timeLeft = 0;
        this._isStartGame = false;
        levelLB.string = `LEVEL ${GameLevel.Level1}`;
        this._currentTimeLevel = TimeLeftLevel.Level1;
    }

}
