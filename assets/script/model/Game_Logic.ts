// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventDispatcher from "./Event_Dispatcher";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameLogic extends EventDispatcher {
    private static instance: GameLogic = null;
    public static get Instance() {
        if (this.instance == null)
            this.instance = new GameLogic();
        return this.instance;
    }

}