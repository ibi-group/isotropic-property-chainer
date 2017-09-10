import * as _mixinPrototypeChain from 'isotropic-mixin-prototype-chain';
import _make from 'isotropic-make';
import _prototypeChain from 'isotropic-prototype-chain';

const _getPropertyChainerMethods = ({
    breakValue,
    mixinPrototypeChain
}) => ({
    _init ({
        propertyChainsIncludeMixins = true,
        propertyChainsPropertyName = '_propertyChains'
    } = {}) {
        const completedPropertyChains = new Set();

        for (
            const object of propertyChainsIncludeMixins ?
                mixinPrototypeChain(this) :
                _prototypeChain(this)
        ) {
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

                    this._initPropertyChain({
                        includeMixins: propertyChainsIncludeMixins,
                        propertyName
                    });
                    completedPropertyChains.add(propertyName);
                }
            }
        }

        return this;
    },
    _initPropertyChain ({
        includeMixins,
        propertyName
    }) {
        let object,
            previousProperty;

        for (
            object of includeMixins ?
                mixinPrototypeChain(this) :
                _prototypeChain(this)
        ) {
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
    }
});

export default _make(_getPropertyChainerMethods({
    breakValue: Object.prototype,
    mixinPrototypeChain: _mixinPrototypeChain.mixinPrototypeChainFromInstanceObject
}), _getPropertyChainerMethods({
    breakValue: Object,
    mixinPrototypeChain: _mixinPrototypeChain.mixinPrototypeChainFromStaticObject
}));
