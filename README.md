# isotropic-property-chainer

[![npm version](https://img.shields.io/npm/v/isotropic-property-chainer.svg)](https://www.npmjs.com/package/isotropic-property-chainer)
[![License](https://img.shields.io/npm/l/isotropic-property-chainer.svg)](https://github.com/ibi-group/isotropic-property-chainer/blob/main/LICENSE)
![](https://img.shields.io/badge/tests-passing-brightgreen.svg)
![](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)

A base class that automatically establishes prototype chains for object properties in inheritance hierarchies.

## Why Use This?

- **Automatic Property Inheritance**: Object properties inherit from their parent class counterparts
- **Configuration Objects**: Perfect for nested configuration objects that should inherit from parent classes
- **Multiple Inheritance**: Works with mixins via isotropic-make
- **Prototype Preservation**: Maintains proper prototype relationships throughout the inheritance chain
- **Flexible Options**: Control which properties to chain and whether to include mixins

## Installation

```bash
npm install isotropic-property-chainer
```

## Usage

```javascript
import _make from 'isotropic-make';
import _PropertyChainer from 'isotropic-property-chainer';

// Create a base class with object properties to be chained
const _BaseComponent = _make(_PropertyChainer, {
        // Define default configuration as an object property
        config: {
            animationSpeed: 'normal',
            logging: false,
            theme: 'light'
        },
        _init (...args) {
            // Call parent _init method
            Reflect.apply(_PropertyChainer.prototype._init, this, args);

            this.name = 'Base';

            return this;
        },
        // Define which properties should be chained
        _propertyChains: [
            'config'
        ]
    }),
    // Create a derived class
    _EnhancedComponent = _make(_BaseComponent, {
        // Only define the config properties we want to override
        config: {
            debugMode: true,
            theme: 'dark'
        },
        _init (...args) {
            // Call parent _init method
            Reflect.apply(_BaseComponent.prototype._init, this, args);

            this.name = 'Enhanced';

            return this;
        }
    });

{
    // Create an instance
    const component = _EnhancedComponent();

    // The config property properly inherits values
    console.log(component.config.animationSpeed); // 'normal' (inherited from BaseComponent)
    console.log(component.config.debugMode); // true (from EnhancedComponent)
    console.log(component.config.logging); // false (inherited from BaseComponent)
    console.log(component.config.theme); // 'dark' (from EnhancedComponent)
}
```

## How It Works

The PropertyChainer does the following:

1. It collects property names from all classes in the inheritance chain that have a `_propertyChains` array (or custom named property)
2. For each property name, it walks the prototype chain (including mixins if enabled)
3. It builds a chain of property values, mirroring the inheritance structure
4. It sets up prototype relationships between these property values
5. This allows derived classes to only specify the properties they want to override while inheriting the rest

## API

### Constructor Options

```javascript
PropertyChainer({
    propertyChainsIncludeMixins: true, // Whether to include mixins in the chain
    propertyChainsPropertyName: '_propertyChains' // Property name containing the list of properties to chain
});
```

#### Parameters

- `propertyChainsIncludeMixins` (Boolean, optional): Whether to include mixins when building property chains. Default: `true`
- `propertyChainsPropertyName` (String, optional): The name of the property that contains the array of property names to chain. Default: `'_propertyChains'`

## Examples

### Basic Inheritance

```javascript
import _make from 'isotropic-make';
import _PropertyChainer from 'isotropic-property-chainer';

// Base class with default settings
const _UiComponent = _make(_PropertyChainer, {
        render () {
            console.log(`Rendering with settings: ${JSON.stringify(this.settings)}`);
        },
        settings: {
            enabled: true,
            height: 'auto',
            padding: '0px',
            visible: true,
            width: 'auto'
        },
        _init (...args) {
            Reflect.apply(_PropertyChainer.prototype._init, this, args);

            return this;
        },
        _propertyChains: [
            'settings'
        ]
    }),

    // Button class extends base component
    _Button = _make(_UiComponent, {
        onClick () {
            console.log('Button clicked');
        },
        settings: {
            borderRadius: '4px',
            height: '40px',
            padding: '5px 10px',
            width: '100px',
        },
        _init(...args) {
            Reflect.apply(_UiComponent.prototype._init, this, args);

            this.settings = Object.create(this.settings);

            return this;
        }
    });

{
    // Instance with custom settings
    const submitButton = _Button();

    submitButton.settings.text = 'Submit';

    // Access combined settings
    console.log(submitButton.settings.borderRadius); // '4px' (from Button)
    console.log(submitButton.settings.visible); // true (from UiComponent)
    console.log(submitButton.settings.text); // 'Submit' (from instance)
    console.log(submitButton.settings.width); // '100px' (from Button)
}
```

### Multiple Object Properties

```javascript
import _make from 'isotropic-make';
import _PropertyChainer from 'isotropic-property-chainer';

const _Database = _make(_PropertyChainer, {
        connectionConfig: {
            host: 'localhost',
            port: 5432,
            timeout: 30000
        },
        queryDefaults: {
            cache: true,
            maxRows: 1000,
            timeout: 5000
        },
        _init (...args) {
            Reflect.apply(_PropertyChainer.prototype._init, this, args);

            return this;
        },
        _propertyChains: [
            'connectionConfig',
            'queryDefaults'
        ],
    }),
    _ProductionDb = _make(_Database, {
        connectionConfig: {
            host: 'production.example.com',
            ssl: true
        },
        queryDefaults: {
            retryCount: 3,
            timeout: 10000
        },
        _init (...args) {
            Reflect.apply(_Database.prototype._init, this, args);

            return this;
        }
});

{
    const db = _ProductionDb();

    // Both object properties are properly chained
    console.log(db.connectionConfig.host); // 'production.example.com'
    console.log(db.connectionConfig.port); // 5432 (inherited)
    console.log(db.connectionConfig.ssl); // true
    console.log(db.connectionConfig.timeout); // 30000 (inherited)
    console.log(db.queryDefaults.cache); // true (inherited)
    console.log(db.queryDefaults.maxRows); // 1000 (inherited)
    console.log(db.queryDefaults.retryCount); // 3
    console.log(db.queryDefaults.timeout); // 10000
}
```

### Using With Mixins

```javascript
import _make from 'isotropic-make';
import _PropertyChainer from 'isotropic-property-chainer';

// Create a logging mixin
const _LoggingMixin = _make({
        log (message, level = this.logConfig.level) {
            if (this.logConfig.console) {
                console.log(`[${level.toUpperCase()}] ${message}`);
            }
        },
        logConfig: {
            console: true,
            file: false,
            level: 'info'
        },
        _propertyChains: ['logConfig']
    }),
    // Create a network mixin
    _NetworkMixin = _make({
        async fetch (url) {
            // Implementation...
        },
        headers: {
            'Content-Type': 'application/json'
        },
        networkConfig: {
            retries: 3,
            timeout: 5000
        },
        _propertyChains: [
            'headers',
            'networkConfig'
        ]
    }),
    // Base service class
    _Service = _make(_PropertyChainer, {
        serviceConfig: {
            enabled: true,
            name: 'BaseService'
        },
        _init (...args) {
            Reflect.apply(_PropertyChainer.prototype._init, this, args);
            return this;
        },
        _propertyChains: [
            'serviceConfig'
        ]
    }),
    // User service with mixins
    _UserService = _make(_Service, [
        _LoggingMixin,
        _NetworkMixin
    ], {
        async getUsers () {
            this.log('Fetching users', 'debug');
            // Implementation...
        },
        headers: {
            Authorization: 'Bearer ${token}'
        },
        logConfig: {
            level: 'debug'
        },
        serviceConfig: {
            name: 'UserService',
            path: '/api/users'
        },
        _init (...args) {
            Reflect.apply(_Service.prototype._init, this, args);

            return this;
        }
    });

{
    const userService = _UserService();

    // Properties from both parent and mixins are chained
    console.log(userService.headers.Authorization); // 'Bearer ${token}'
    console.log(userService.headers['Content-Type']); // 'application/json' (from NetworkMixin)
    console.log(userService.logConfig.console); // true (from LoggingMixin)
    console.log(userService.logConfig.level); // 'debug'
    console.log(userService.networkConfig.retries); // 3 (from NetworkMixin)
    console.log(userService.serviceConfig.enabled); // true (from Service)
    console.log(userService.serviceConfig.name); // 'UserService'
}
```

### Static Property Chaining

```javascript
import _make from 'isotropic-make';
import _PropertyChainer from 'isotropic-property-chainer';

// Base class with static properties to chain
const _ApiClient = _make(_PropertyChainer, {
        _init (...args) {
            Reflect.apply(_PropertyChainer.prototype._init, this, args);

            return this;
        }
    }, {
        defaults: {
            baseURL: 'https://api.example.com',
            timeout: 10000,
            version: 'v1'
        },
        _init (...args) {
            Reflect.apply(_PropertyChainer._init, this, args);

            return this;
        },
        _propertyChains: [
            'defaults'
        ]
    }),
    // Derived class with static property overrides
    _CustomerApi = _make(_ApiClient, {
        _init (...args) {
            Reflect.apply(_ApiClient.prototype._init, this, args);

            return this;
        }
    }, {
        defaults: {
            baseURL: 'https://customers.example.com',
            headers: {
                'X-API-Key': 'default-key'
            }
        },
        _init (...args) {
            Reflect.apply(_ApiClient._init, this, args);

            return this;
        }
    });

// Static properties are chained
console.log(_CustomerApi.defaults.baseURL);   // 'https://customers.example.com'
console.log(_CustomerApi.defaults.headers);   // { 'X-API-Key': 'default-key' }
console.log(_CustomerApi.defaults.timeout);   // 10000 (inherited from APIClient)
console.log(_CustomerApi.defaults.version);   // 'v1' (inherited from APIClient)
```

### Custom Property Chain Configuration

```javascript
import _make from 'isotropic-make';
import _PropertyChainer from 'isotropic-property-chainer';

// Base class with custom property chains property name
const _Component = _make(_PropertyChainer, {
        // Using a custom name for _propertyChains
        chainedProps: [
            'config'
        ],
        config: {
            theme: 'light'
        },
        _init () {
            // Pass custom property name to PropertyChainer init
            Reflect.apply(_PropertyChainer.prototype._init, this, [{
                propertyChainsPropertyName: 'chainedProps'
            }]);

            return this;
        }
    }),

    // Exclude mixins from property chains
    _AdvancedComponent = _make(_Component, [
        _SomeMixin
    ], {
        chainedProps: [
            'config'
        ],
        config: {
            theme: 'dark'
        },
        _init () {
            // Exclude mixins from property chains
            Reflect.apply(_Component.prototype._init, this, [{
                propertyChainsIncludeMixins: false,
                propertyChainsPropertyName: 'chainedProps'
            }]);

            return this;
        }
    });

{
    const component = _AdvancedComponent();

    console.log(component.config.theme); // 'dark'
}
```

### Handling Multiple Inheritance Paths

When using multiple inheritance via mixins, PropertyChainer resolves chains in reverse mixin definition order:

```javascript
import _make from 'isotropic-make';
import _PropertyChainer from 'isotropic-property-chainer';

const _MixinA = _make({
        config: {
            a: 'a-value',
            shared: 'a-value'
        },
        _propertyChains: [
            'config'
        ]
    }),
    _MixinB = _make({
        config: {
            b: 'b-value',
            shared: 'b-value'
        },
        _propertyChains: [
            'config'
        ]
    }),

    _Component = _make(_PropertyChainer, [
        _MixinA, // Order matters - last defined mixin overwrites previous
        _MixinB
    ], {
        config: {
            component: 'value'
        },
        _init (...args) {
            Reflect.apply(_PropertyChainer.prototype._init, this, args);

            return this;
        }
    });

{
    const instance = _Component();

    // Properties follow the inheritance chain with later mixins taking precedence
    console.log(instance.config.a); // 'a-value' (from MixinA)
    console.log(instance.config.b); // 'b-value' (from MixinB)
    console.log(instance.config.component); // 'value' (from Component)
    console.log(instance.config.shared); // 'b-value' (from MixinB, which takes precedence over MixinA)
}
```

## Integration with Other isotropic Modules

PropertyChainer works seamlessly with other modules in the isotropic ecosystem:

- **isotropic-make**: Required for creating constructor functions with proper inheritance
- **isotropic-mixin-prototype-chain**: Used internally to traverse prototype chains with mixin awareness
- **isotropic-prototype-chain**: Used for basic prototype chain traversal

## Contributing

Please refer to [CONTRIBUTING.md](https://github.com/ibi-group/isotropic-property-chainer/blob/main/CONTRIBUTING.md) for contribution guidelines.

## Issues

If you encounter any issues, please file them at https://github.com/ibi-group/isotropic-property-chainer/issues
