/* eslint-disable indent */

import _make from 'isotropic-make';
import _prototypeChain from 'isotropic-prototype-chain';

const _getInitMethod = breakValue => function ({
        propertyChainsPropertyName = '_propertyChains'
    } = {}) {
        const completedPropertyChains = new Set();

        for (const object of _prototypeChain(this)) {
            if (object === breakValue) {
                break;
            }

            if (Reflect.apply(Object.prototype.hasOwnProperty, object, [
                propertyChainsPropertyName
            ])) {
                for (const propertyName of object[propertyChainsPropertyName]) {
                    if (completedPropertyChains.has(propertyName)) {
                        // TODO: log dev-time warning
                        continue;
                    }

                    this._initPropertyChain(propertyName);
                    completedPropertyChains.add(propertyName);
                }
            }
        }

        return this;
    },
    _getInitPropertyChainMethod = breakValue => function (propertyName) {
        let object,
            previousProperty;

        for (object of _prototypeChain(this)) {
            if (object === breakValue) {
                break;
            }

            if (Reflect.apply(Object.prototype.hasOwnProperty, object, [
                propertyName
            ])) {
                const property = object[propertyName];

                if (previousProperty) {
                    if (Reflect.getPrototypeOf(previousProperty) === property) {
                        break;
                    }

                    Reflect.setPrototypeOf(previousProperty, property);
                }

                previousProperty = property;
            }
        }

        return this;
    },

    _PropertyChainer = _make({
        _init: _getInitMethod(Object.prototype),
        _initPropertyChain: _getInitPropertyChainMethod(Object.prototype)
    }, {
        _init: _getInitMethod(Object),
        _initPropertyChain: _getInitPropertyChainMethod(Object)
    });

export default _PropertyChainer;
