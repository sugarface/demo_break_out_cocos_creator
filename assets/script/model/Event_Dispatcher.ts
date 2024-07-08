// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class EventDispatcher implements EventTarget {
	/**
	 * Create a new EventDispatcher. This class implements the EventTarget
	 * interface (DOM level 2 interface).
	 *
	 * Refers to the chromium implementation here:
	 * https://cs.chromium.org/chromium/src/ui/webui/resources/js/cr/event_target.js?type=cs&q=event_target.js&sq=package:chromium&g=0&l=1
	 */
	public constructor() { }

	private _listeners: { [type: string]: Array<EventListenerType> } = undefined;

	/**
	 * Adds an event listener to the target.
	 * @param type The name of the event.
	 * @param handler The handler for the event. This is called when the event
	 * is dispatched.
	 */
	public addEventListener(type: string, handler: EventListenerType) {
		if (!this._listeners)
			this._listeners = {};

		if (!(type in this._listeners)) {
			this._listeners[type] = [handler];
		} else {
			const handlers = this._listeners[type];
			if (handlers.indexOf(handler) < 0)
				handlers.push(handler);
		}
	}

	public subscribe(type: string, handler: EventListenerType) {
		if (!this._listeners)
			this._listeners = {};

		if (!(type in this._listeners)) {
			this._listeners[type] = [handler];
		} else {
			const handlers = this._listeners[type];
			if (handlers.indexOf(handler) < 0)
				handlers.push(handler);
		}
	}

	/**
	 * Removes an event listener from the target.
	 * @param type The name of the event.
	 * @param handler  The handler for the event.
	 */
	public removeEventListener(type: string, handler: EventListenerType) {
		if (!this._listeners) return;
		if (!(type in this._listeners)) return;

		const handlers = this._listeners[type];
		const index = handlers.indexOf(handler);
		if (index >= 0) {
			// Clean up if this was the last listener.
			if (handlers.length === 1)
				delete this._listeners[type];
			else
				handlers.splice(index, 1);
		}
	}

	/**
	 * Dispatches an event and calls all the listeners that are listening to
	 * the type of the event.
	 * @param event The event to dispatch.
	 * @returns Whether the default action was prevented. If someone calls
	 * preventDefault on the event object then this returns false.
	 */
	public dispatchEvent(event: Event, data?: any): boolean {
		if (!this._listeners) return true;

		const type = event.type;
		let prevented = false;
		if (type in this._listeners) {
			// Close to prevent removal during dispatch
			const handlers = this._listeners[type].concat();
			for (let i = 0, handler; handler = handlers[i]; i++) {
				if (handler.handlerEvent) {
					let p = handler.handlerEvent.call(handler, event, data) === false;
					prevented = prevented || p;
				} else {
					let p = handler.call(handler, event, data) === false;
					prevented = prevented || p;
				}
			}
		}

		return !prevented && !event.defaultPrevented;
	}
}

type EventListenerType = EventListener | ((event: Event, data?: any) => void);
