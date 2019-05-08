import {
    mixinPrototypeChainFromInstanceObject as _mixinPrototypeChainFromInstanceObject,
    mixinPrototypeChainFromStaticObject as _mixinPrototypeChainFromStaticObject
} from 'isotropic-mixin-prototype-chain';
import _Error from 'isotropic-error';
import _make from 'isotropic-make';
import _prototypeChain from 'isotropic-prototype-chain';

export default _make({
    _init ({
        propertyChainsIncludeMixins = true,
        propertyChainsPropertyName = '_propertyChains'
    } = {}) {
        const propertyNameSet = new Set();

        for (
            const object of propertyChainsIncludeMixins ?
                _mixinPrototypeChainFromInstanceObject(this) :
                _prototypeChain(this)
        ) {
            if (object === Object.prototype) {
                break;
            }

            if (Reflect.apply(Object.prototype.hasOwnProperty, object, [
                propertyChainsPropertyName
            ])) {
                for (const propertyName of object[propertyChainsPropertyName]) {
                    propertyNameSet.add(propertyName);
                }
            }
        }

        if (propertyNameSet.size) {
            const propertyChainsByPropertyName = this._initPropertyChains({
                includeMixins: propertyChainsIncludeMixins,
                propertyNameSet
            });

            Object.keys(propertyChainsByPropertyName).forEach(propertyName => {
                const propertyChain = propertyChainsByPropertyName[propertyName];

                let previousPropertyValue;

                propertyChain.objects.forEach(object => {
                    const propertyValue = propertyChain.propertyValueByObjectMap.get(object);

                    if (previousPropertyValue && !Reflect.setPrototypeOf(previousPropertyValue, propertyValue)) {
                        throw _Error({
                            details: {
                                propertyName
                            },
                            message: 'Instance property chain could not be created'
                        });
                    }

                    previousPropertyValue = propertyValue;
                });
            });
        }

        return this;
    },
    _initPropertyChains ({
        includeMixins,
        propertyChainsByPropertyName = {},
        propertyNameSet,
        startObject = this
    }) {
        const isMixin = startObject !== this;

        for (const object of _prototypeChain(startObject)) {
            if (object === Object.prototype) {
                break;
            }

            for (const propertyName of propertyNameSet) {
                if (Reflect.apply(Object.prototype.hasOwnProperty, object, [
                    propertyName
                ])) {
                    const propertyValue = object[propertyName];

                    switch (typeof propertyValue) {
                        case 'function':
                        case 'object':
                            break;
                        default:
                            continue;
                    }

                    let propertyChain = propertyChainsByPropertyName[propertyName];

                    if (!propertyChain) {
                        propertyChain = {
                            objects: [],
                            propertyValueByObjectMap: new Map()
                        };
                        propertyChainsByPropertyName[propertyName] = propertyChain;
                    }

                    if (propertyChain.propertyValueByObjectMap.has(object)) {
                        propertyChain.objects.splice(propertyChain.objects.indexOf(object), 1);
                    }

                    propertyChain.objects.push(object);
                    propertyChain.propertyValueByObjectMap.set(
                        object,
                        isMixin ?
                            {
                                ...propertyValue
                            } :
                            propertyValue
                    );
                }
            }

            if (includeMixins) {
                const mixins = object.constructor && object.constructor.mixins;

                if (Array.isArray(mixins)) {
                    for (let mixinIndex = mixins.length - 1; mixinIndex >= 0; mixinIndex -= 1) {
                        this._initPropertyChains({
                            includeMixins,
                            propertyChainsByPropertyName,
                            propertyNameSet,
                            startObject: mixins[mixinIndex].prototype
                        });
                    }
                }
            }
        }

        return propertyChainsByPropertyName;
    }
}, {
    _init ({
        propertyChainsIncludeMixins = true,
        propertyChainsPropertyName = '_propertyChains'
    } = {}) {
        const propertyNameSet = new Set();

        for (
            const object of propertyChainsIncludeMixins ?
                _mixinPrototypeChainFromStaticObject(this) :
                _prototypeChain(this)
        ) {
            if (object === Object) {
                break;
            }

            if (Reflect.apply(Object.prototype.hasOwnProperty, object, [
                propertyChainsPropertyName
            ])) {
                for (const propertyName of object[propertyChainsPropertyName]) {
                    propertyNameSet.add(propertyName);
                }
            }
        }

        if (propertyNameSet.size) {
            const propertyChainsByPropertyName = this._initPropertyChains({
                includeMixins: propertyChainsIncludeMixins,
                propertyNameSet
            });

            Object.keys(propertyChainsByPropertyName).forEach(propertyName => {
                const propertyChain = propertyChainsByPropertyName[propertyName];

                let previousPropertyValue;

                propertyChain.objects.forEach(object => {
                    const propertyValue = propertyChain.propertyValueByObjectMap.get(object);

                    if (previousPropertyValue && !Reflect.setPrototypeOf(previousPropertyValue, propertyValue)) {
                        throw _Error({
                            details: {
                                propertyName
                            },
                            message: 'Static property chain could not be created'
                        });
                    }

                    previousPropertyValue = propertyValue;
                });
            });
        }

        return this;
    },
    _initPropertyChains ({
        includeMixins,
        propertyChainsByPropertyName = {},
        propertyNameSet,
        startObject = this
    }) {
        const isMixin = startObject !== this;

        for (const object of _prototypeChain(startObject)) {
            if (object === Object) {
                break;
            }

            for (const propertyName of propertyNameSet) {
                if (Reflect.apply(Object.prototype.hasOwnProperty, object, [
                    propertyName
                ])) {
                    const propertyValue = object[propertyName];

                    switch (typeof propertyValue) {
                        case 'function':
                        case 'object':
                            break;
                        default:
                            continue;
                    }

                    let propertyChain = propertyChainsByPropertyName[propertyName];

                    if (!propertyChain) {
                        propertyChain = {
                            objects: [],
                            propertyValueByObjectMap: new Map()
                        };
                        propertyChainsByPropertyName[propertyName] = propertyChain;
                    }

                    if (propertyChain.propertyValueByObjectMap.has(object)) {
                        propertyChain.objects.splice(propertyChain.objects.indexOf(object), 1);
                    }

                    propertyChain.objects.push(object);
                    propertyChain.propertyValueByObjectMap.set(
                        object,
                        isMixin ?
                            {
                                ...propertyValue
                            } :
                            propertyValue
                    );
                }
            }

            if (includeMixins && Array.isArray(object.mixins)) {
                for (let mixinIndex = object.mixins.length - 1; mixinIndex >= 0; mixinIndex -= 1) {
                    this._initPropertyChains({
                        includeMixins,
                        propertyChainsByPropertyName,
                        propertyNameSet,
                        startObject: object.mixins[mixinIndex]
                    });
                }
            }
        }

        return propertyChainsByPropertyName;
    }
});
