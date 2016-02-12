import {ComponentTable} from './component_table.js';
import {SetWrapper} from './set_wrapper.js';
import {assert} from './assert.js';

export class EntitySet {
    constructor() {
        this.set = new Set();
    }
    *[Symbol.iterator]() {
        yield* this.set;
    }
    clear() {
        this.set.clear();
    }
    delete(entity) {
        this.set.delete(entity);
    }
    add(entity) {
        this.set.add(entity);
    }
    entries() {
        return this.set.entries();
    }
    has(entity) {
        return this.set.has(entity);
    }
    entries() {
        return this.set.entries();
    }
}

export class ComponentCountingEntitySet extends EntitySet {
    constructor() {
        super();
        this.componentCount = new ComponentTable();
        this.clearComponentCount();
    }

    clearComponentCount() {
        for (let i = 0; i < this.componentCount.length; ++i) {
            this.componentCount.set(i, 0);
        }
    }

    incrementComponents(entity) {
        for (let component of entity) {
            this.incrementSingleComponent(component);
        }
    }

    decrementComponents(entity) {
        for (let component of entity) {
            this.decrementSingleComponent(component);
        }
    }

    incrementSingleComponent(component) {
        let count = this.componentCount.get(component);
        this.componentCount.set(component, count + 1);
    }

    decrementSingleComponent(component) {
        let count = this.componentCount.get(component);
        assert(count > 0);
        this.componentCount.set(count - 1);
    }

    clear() {
        super.clear();
        this.clearComponentCount();
    }

    add(entity) {
        if (this.has(entity)) {
            return;
        }
        this.incrementComponents(entity);
        super.add(entity);
    }

    delete(entity) {
        if (!this.has(entity)) {
            return;
        }
        this.decrementComponents(entity);
        super.delete(entity);
    }
}
