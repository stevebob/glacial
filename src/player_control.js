import {Turn} from 'engine/turn';
import {Action} from 'engine/action';

import {Actions} from 'actions';
import {Direction} from 'utils/direction';

import * as Input from 'utils/input';
import {controlFromChar} from 'control';
import {Controller} from 'controller';

async function getControlFunction() {
    var key = await Input.getNonModifierKey();
    if (Input.isCharKey(key)) {
        var character = Input.getCharFromKey(key);
        return controlFromChar(character);
    }
    return null;
}

async function getControlAction(entity) {
    while (true) {
        var fn = await getControlFunction();

        if (fn === null) {
            continue;
        }

        var action = await fn(entity);
        if (action === null) {
            continue;
        }

        return action;
    }
}

export class PlayerTurnTaker extends Controller{}

PlayerTurnTaker.prototype.takeTurn = async function() {
    var action = await getControlAction(this.entity);
    if (action instanceof Action) {
        return new Turn(action);
    } else if (action instanceof Turn) {
        return action;
    } else {
        throw Error('invalid action');
    }
}
