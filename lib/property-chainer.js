import _Error from 'isotropic-error';
import _make from 'isotropic-make';
import _mixinPrototypeChain from 'isotropic-mixin-prototype-chain';
import _prototypeChain from 'isotropic-prototype-chain';

const _createInitMethod = ({
        endObject,
        errorLabel,
        getPrototypeGenerator
    }) => function ({
        propertyChainsIncludeMixins = true,
        propertyChainsPropertyName = '_propertyChains'
    } = {}) {
        const propertyNameSet = new Set();

        for (const object of propertyChainsIncludeMixins ?
            getPrototypeGenerator(this) :
            _prototypeChain(this)
        ) {
            if (object === endObject) {
                break;
            }

            if (Object.hasOwn(object, propertyChainsPropertyName)) {
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
                            message: `${errorLabel} property chain could not be created`
                        });
                    }

                    previousPropertyValue = propertyValue;
                });
            });
        }

        return this;
    },
    _createInitPropertyChainsMethod = ({
        endObject,
        getMixins,
        getStartObject
    }) => function ({
        includeMixins,
        propertyChainsByPropertyName = {},
        propertyNameSet,
        startObject = this
    }) {
        const isMixin = startObject !== this;

        for (const object of _prototypeChain(startObject)) {
            if (object === endObject) {
                break;
            }

            for (const propertyName of propertyNameSet) {
                if (Object.hasOwn(object, propertyName)) {
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
                    propertyChain.propertyValueByObjectMap.set(object, isMixin ?
                        {
                            ...propertyValue
                        } :
                        propertyValue);
                }
            }

            if (includeMixins) {
                const mixins = getMixins(object);

                if (Array.isArray(mixins)) {
                    for (let mixinIndex = mixins.length - 1; mixinIndex >= 0; mixinIndex -= 1) {
                        this._initPropertyChains({
                            includeMixins,
                            propertyChainsByPropertyName,
                            propertyNameSet,
                            startObject: getStartObject(mixins[mixinIndex])
                        });
                    }
                }
            }
        }

        return propertyChainsByPropertyName;
    },
    _instanceConfig = {
        endObject: Object.prototype,
        errorLabel: 'Instance',
        getMixins: object => object.constructor?.mixins,
        getPrototypeGenerator: object => _mixinPrototypeChain.fromInstanceObject(object),
        getStartObject: mixin => mixin.prototype
    },
    _staticConfig = {
        endObject: Object,
        errorLabel: 'Static',
        getMixins: object => object.mixins,
        getPrototypeGenerator: object => _mixinPrototypeChain.fromStaticObject(object),
        getStartObject: mixin => mixin
    };

export default _make('PropertyChainer', {
    _init: _createInitMethod(_instanceConfig),
    _initPropertyChains: _createInitPropertyChainsMethod(_instanceConfig)
}, {
    _init: _createInitMethod(_staticConfig),
    _initPropertyChains: _createInitPropertyChainsMethod(_staticConfig)
});
