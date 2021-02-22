import _chai from 'isotropic-dev-dependencies/lib/chai.js';
import _Error from 'isotropic-error';
import _make from 'isotropic-make';
import _mocha from 'isotropic-dev-dependencies/lib/mocha.js';
import _PropertyChainer from '../js/property-chainer.js';

_mocha.describe('PropertyChainer', () => {
    _mocha.it('should construct property chainer objects', () => {
        _chai.expect(_PropertyChainer).to.be.a('function');

        const propertyChainer = new _PropertyChainer();

        _chai.expect(propertyChainer).to.be.an.instanceOf(_PropertyChainer);
    });

    _mocha.it('should be a property chainer object factory', () => {
        _chai.expect(_PropertyChainer).to.be.a('function');

        const propertyChainer = _PropertyChainer();

        _chai.expect(propertyChainer).to.be.an.instanceOf(_PropertyChainer);
    });

    _mocha.it('should create prototype chains for instance property objects', () => {
        const A = _make(_PropertyChainer, {
                a: {
                    a: 'a'
                },
                b: {
                    a: 'a'
                },
                c: {
                    a: 'a'
                },
                _init (...args) {
                    Reflect.apply(_PropertyChainer.prototype._init, this, args);
                    return this;
                },
                _propertyChains: [
                    'a',
                    'b',
                    'c'
                ]
            }),
            B = _make(A, {
                a: {
                    b: 'b'
                },
                b: {
                    b: 'b'
                },
                c: {
                    b: 'b'
                },
                _init (...args) {
                    Reflect.apply(A.prototype._init, this, args);
                    return this;
                }
            }),
            C = _make(B, {
                a: {
                    c: 'c'
                },
                b: {
                    c: 'c'
                },
                c: {
                    c: 'c'
                },
                _init (...args) {
                    Reflect.apply(B.prototype._init, this, args);
                    return this;
                }
            }),
            c = C();

        _chai.expect(Reflect.getPrototypeOf(c.a)).to.equal(B.prototype.a);
        _chai.expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(c.a))).to.equal(A.prototype.a);
        _chai.expect(Reflect.getPrototypeOf(c.b)).to.equal(B.prototype.b);
        _chai.expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(c.b))).to.equal(A.prototype.b);
        _chai.expect(Reflect.getPrototypeOf(c.c)).to.equal(B.prototype.c);
        _chai.expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(c.c))).to.equal(A.prototype.c);

        _chai.expect(c.a).to.have.property('a', 'a');
        _chai.expect(c.a).to.have.property('b', 'b');
        _chai.expect(c.a).to.have.property('c', 'c');
        _chai.expect(c.b).to.have.property('a', 'a');
        _chai.expect(c.b).to.have.property('b', 'b');
        _chai.expect(c.b).to.have.property('c', 'c');
        _chai.expect(c.c).to.have.property('a', 'a');
        _chai.expect(c.c).to.have.property('b', 'b');
        _chai.expect(c.c).to.have.property('c', 'c');
    });

    _mocha.it('should ignore invalid or missing values for instance property objects', () => {
        const A = _make(_PropertyChainer, {
                a: {
                    a: 'a'
                },
                b: {
                    a: 'a'
                },
                c: {
                    a: 'a'
                },
                _init (...args) {
                    Reflect.apply(_PropertyChainer.prototype._init, this, args);
                    return this;
                },
                _propertyChains: [
                    'a',
                    'b',
                    'c'
                ]
            }),
            B = _make(A, {
                a () {
                    return 'b';
                },
                c: 'b',
                _init (...args) {
                    Reflect.apply(A.prototype._init, this, args);
                    return this;
                }
            }),
            C = _make(B, {
                a: {
                    c: 'c'
                },
                b: {
                    c: 'c'
                },
                c: {
                    c: 'c'
                },
                _init (...args) {
                    Reflect.apply(B.prototype._init, this, args);
                    return this;
                }
            }),
            c = C();

        _chai.expect(Reflect.getPrototypeOf(c.a)).to.equal(B.prototype.a);
        _chai.expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(c.a))).to.equal(A.prototype.a);
        _chai.expect(Reflect.getPrototypeOf(c.b)).to.equal(A.prototype.b);
        _chai.expect(Reflect.getPrototypeOf(c.c)).to.equal(A.prototype.c);

        _chai.expect(c.a).to.have.property('a', 'a');
        _chai.expect(c.a).not.to.have.property('b');
        _chai.expect(c.a).to.have.property('c', 'c');
        _chai.expect(c.b).to.have.property('a', 'a');
        _chai.expect(c.b).not.to.have.property('b');
        _chai.expect(c.b).to.have.property('c', 'c');
        _chai.expect(c.c).to.have.property('a', 'a');
        _chai.expect(c.c).not.to.have.property('b');
        _chai.expect(c.c).to.have.property('c', 'c');
    });

    _mocha.it('should throw an error when a prototype chain can not be created for instance property objects', () => {
        const A = _make(_PropertyChainer, {
                a: {
                    a: 'a'
                },
                _init (...args) {
                    Reflect.apply(_PropertyChainer.prototype._init, this, args);
                    return this;
                },
                _propertyChains: [
                    'a'
                ]
            }),
            B = _make(A, {
                a: Object.freeze({
                    b: 'b'
                }),
                _init (...args) {
                    Reflect.apply(A.prototype._init, this, args);
                    return this;
                }
            });

        _chai.expect(() => {
            B();
        }).to.throw(_Error);
    });

    _mocha.it('should create prototype chains for instance property objects with a custom property chains property name', () => {
        const A = _make(_PropertyChainer, {
                a: {
                    a: 'a'
                },
                b: {
                    a: 'a'
                },
                c: {
                    a: 'a'
                },
                somethingElse: [
                    'a',
                    'b',
                    'c'
                ],
                _init () {
                    Reflect.apply(_PropertyChainer.prototype._init, this, [{
                        propertyChainsPropertyName: 'somethingElse'
                    }]);
                    return this;
                }
            }),
            B = _make(A, {
                a: {
                    b: 'b'
                },
                b: {
                    b: 'b'
                },
                c: {
                    b: 'b'
                },
                _init (...args) {
                    Reflect.apply(A.prototype._init, this, args);
                    return this;
                }
            }),
            C = _make(B, {
                a: {
                    c: 'c'
                },
                b: {
                    c: 'c'
                },
                c: {
                    c: 'c'
                },
                _init (...args) {
                    Reflect.apply(B.prototype._init, this, args);
                    return this;
                }
            }),
            c = C();

        _chai.expect(Reflect.getPrototypeOf(c.a)).to.equal(B.prototype.a);
        _chai.expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(c.a))).to.equal(A.prototype.a);
        _chai.expect(Reflect.getPrototypeOf(c.b)).to.equal(B.prototype.b);
        _chai.expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(c.b))).to.equal(A.prototype.b);
        _chai.expect(Reflect.getPrototypeOf(c.c)).to.equal(B.prototype.c);
        _chai.expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(c.c))).to.equal(A.prototype.c);

        _chai.expect(c.a).to.have.property('a', 'a');
        _chai.expect(c.a).to.have.property('b', 'b');
        _chai.expect(c.a).to.have.property('c', 'c');
        _chai.expect(c.b).to.have.property('a', 'a');
        _chai.expect(c.b).to.have.property('b', 'b');
        _chai.expect(c.b).to.have.property('c', 'c');
        _chai.expect(c.c).to.have.property('a', 'a');
        _chai.expect(c.c).to.have.property('b', 'b');
        _chai.expect(c.c).to.have.property('c', 'c');
    });

    _mocha.it('should create prototype chains including mixins for instance property objects', () => {
        const A = _make([
                _PropertyChainer
            ], {
                a: {
                    a: 'a'
                },
                b: {
                    a: 'a'
                },
                c: {
                    a: 'a'
                },
                _init (...args) {
                    Reflect.apply(_PropertyChainer.prototype._init, this, args);
                    return this;
                },
                _propertyChains: [
                    'a',
                    'b',
                    'c'
                ]
            }),
            B = _make([
                A
            ], {
                a: {
                    b: 'b'
                },
                b: {
                    b: 'b'
                },
                c: {
                    b: 'b'
                },
                _init (...args) {
                    Reflect.apply(A.prototype._init, this, args);
                    return this;
                }
            }),
            C = _make([
                B
            ], {
                a: {
                    c: 'c'
                },
                b: {
                    c: 'c'
                },
                c: {
                    c: 'c'
                },
                _init (...args) {
                    Reflect.apply(B.prototype._init, this, args);
                    return this;
                }
            }),
            c = C();

        _chai.expect({
            ...Reflect.getPrototypeOf(c.a)
        }).to.deep.equal({
            ...B.prototype.a
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(Reflect.getPrototypeOf(c.a))
        }).to.deep.equal({
            ...A.prototype.a
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(c.b)
        }).to.deep.equal({
            ...B.prototype.b
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(Reflect.getPrototypeOf(c.b))
        }).to.deep.equal({
            ...A.prototype.b
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(c.c)
        }).to.deep.equal({
            ...B.prototype.c
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(Reflect.getPrototypeOf(c.c))
        }).to.deep.equal({
            ...A.prototype.c
        });

        _chai.expect(c.a).to.have.property('a', 'a');
        _chai.expect(c.a).to.have.property('b', 'b');
        _chai.expect(c.a).to.have.property('c', 'c');
        _chai.expect(c.b).to.have.property('a', 'a');
        _chai.expect(c.b).to.have.property('b', 'b');
        _chai.expect(c.b).to.have.property('c', 'c');
        _chai.expect(c.c).to.have.property('a', 'a');
        _chai.expect(c.c).to.have.property('b', 'b');
        _chai.expect(c.c).to.have.property('c', 'c');
    });

    _mocha.it('should create prototype chains excluding mixins for instance property objects', () => {
        const A = _make([
                _PropertyChainer
            ], {
                a: {
                    a: 'a'
                },
                b: {
                    a: 'a'
                },
                c: {
                    a: 'a'
                },
                _init (...args) {
                    Reflect.apply(_PropertyChainer.prototype._init, this, args);
                    return this;
                },
                _propertyChains: [
                    'a',
                    'b',
                    'c'
                ]
            }),
            B = _make([
                A
            ], {
                a: {
                    b: 'b'
                },
                b: {
                    b: 'b'
                },
                c: {
                    b: 'b'
                },
                _init (...args) {
                    Reflect.apply(A.prototype._init, this, args);
                    return this;
                }
            }),
            C = _make([
                B
            ], {
                a: {
                    c: 'c'
                },
                b: {
                    c: 'c'
                },
                c: {
                    c: 'c'
                },
                _init (...args) {
                    Reflect.apply(B.prototype._init, this, args);
                    return this;
                }
            }),
            c = C({
                propertyChainsIncludeMixins: false
            });

        _chai.expect(Reflect.getPrototypeOf(c.a)).to.equal(Object.prototype);
        _chai.expect(Reflect.getPrototypeOf(c.b)).to.equal(Object.prototype);
        _chai.expect(Reflect.getPrototypeOf(c.c)).to.equal(Object.prototype);

        _chai.expect(c.a).not.to.have.property('a');
        _chai.expect(c.a).not.to.have.property('b');
        _chai.expect(c.a).to.have.property('c', 'c');
        _chai.expect(c.b).not.to.have.property('a');
        _chai.expect(c.b).not.to.have.property('b');
        _chai.expect(c.b).to.have.property('c', 'c');
        _chai.expect(c.c).not.to.have.property('a');
        _chai.expect(c.c).not.to.have.property('b');
        _chai.expect(c.c).to.have.property('c', 'c');
    });

    _mocha.it('should create prototype chains for static property objects', () => {
        const A = _make(_PropertyChainer, {}, {
                a: {
                    a: 'a'
                },
                b: {
                    a: 'a'
                },
                c: {
                    a: 'a'
                },
                _init (...args) {
                    Reflect.apply(_PropertyChainer._init, this, args);
                    return this;
                },
                _propertyChains: [
                    'a',
                    'b',
                    'c'
                ]
            }),
            B = _make(A, {}, {
                a: {
                    b: 'b'
                },
                b: {
                    b: 'b'
                },
                c: {
                    b: 'b'
                },
                _init (...args) {
                    Reflect.apply(A._init, this, args);
                    return this;
                }
            }),
            C = _make(B, {}, {
                a: {
                    c: 'c'
                },
                b: {
                    c: 'c'
                },
                c: {
                    c: 'c'
                },
                _init (...args) {
                    Reflect.apply(B._init, this, args);
                    return this;
                }
            });

        _chai.expect(Reflect.getPrototypeOf(C.a)).to.equal(B.a);
        _chai.expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(C.a))).to.equal(A.a);
        _chai.expect(Reflect.getPrototypeOf(C.b)).to.equal(B.b);
        _chai.expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(C.b))).to.equal(A.b);
        _chai.expect(Reflect.getPrototypeOf(C.c)).to.equal(B.c);
        _chai.expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(C.c))).to.equal(A.c);

        _chai.expect(C.a).to.have.property('a', 'a');
        _chai.expect(C.a).to.have.property('b', 'b');
        _chai.expect(C.a).to.have.property('c', 'c');
        _chai.expect(C.b).to.have.property('a', 'a');
        _chai.expect(C.b).to.have.property('b', 'b');
        _chai.expect(C.b).to.have.property('c', 'c');
        _chai.expect(C.c).to.have.property('a', 'a');
        _chai.expect(C.c).to.have.property('b', 'b');
        _chai.expect(C.c).to.have.property('c', 'c');
    });

    _mocha.it('should ignore invalid or missing values for static property objects', () => {
        const A = _make(_PropertyChainer, {}, {
                a: {
                    a: 'a'
                },
                b: {
                    a: 'a'
                },
                c: {
                    a: 'a'
                },
                _init (...args) {
                    Reflect.apply(_PropertyChainer._init, this, args);
                    return this;
                },
                _propertyChains: [
                    'a',
                    'b',
                    'c'
                ]
            }),
            B = _make(A, {}, {
                a () {
                    return 'b';
                },
                c: 'b',
                _init (...args) {
                    Reflect.apply(A._init, this, args);
                    return this;
                }
            }),
            C = _make(B, {}, {
                a: {
                    c: 'c'
                },
                b: {
                    c: 'c'
                },
                c: {
                    c: 'c'
                },
                _init (...args) {
                    Reflect.apply(B._init, this, args);
                    return this;
                }
            });

        _chai.expect(Reflect.getPrototypeOf(C.a)).to.equal(B.a);
        _chai.expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(C.a))).to.equal(A.a);
        _chai.expect(Reflect.getPrototypeOf(C.b)).to.equal(A.b);
        _chai.expect(Reflect.getPrototypeOf(C.c)).to.equal(A.c);

        _chai.expect(C.a).to.have.property('a', 'a');
        _chai.expect(C.a).not.to.have.property('b');
        _chai.expect(C.a).to.have.property('c', 'c');
        _chai.expect(C.b).to.have.property('a', 'a');
        _chai.expect(C.b).not.to.have.property('b');
        _chai.expect(C.b).to.have.property('c', 'c');
        _chai.expect(C.c).to.have.property('a', 'a');
        _chai.expect(C.c).not.to.have.property('b');
        _chai.expect(C.c).to.have.property('c', 'c');
    });

    _mocha.it('should throw an error when a prototype chain can not be created for static property objects', () => {
        const A = _make(_PropertyChainer, {}, {
                a: {
                    a: 'a'
                },
                _init (...args) {
                    Reflect.apply(_PropertyChainer._init, this, args);
                    return this;
                },
                _propertyChains: [
                    'a'
                ]
            }),
            B = _make(A, {}, {
                a: Object.freeze({
                    b: 'b'
                }),
                _init (...args) {
                    _chai.expect(() => {
                        Reflect.apply(A._init, this, args);
                    }).to.throw(_Error);

                    return this;
                }
            });
    });

    _mocha.it('should create prototype chains for static property objects with a custom property chains property name', () => {
        const A = _make(_PropertyChainer, {}, {
                a: {
                    a: 'a'
                },
                b: {
                    a: 'a'
                },
                c: {
                    a: 'a'
                },
                somethingElse: [
                    'a',
                    'b',
                    'c'
                ],
                _init () {
                    Reflect.apply(_PropertyChainer._init, this, [{
                        propertyChainsPropertyName: 'somethingElse'
                    }]);
                    return this;
                }
            }),
            B = _make(A, {}, {
                a: {
                    b: 'b'
                },
                b: {
                    b: 'b'
                },
                c: {
                    b: 'b'
                },
                _init (...args) {
                    Reflect.apply(A._init, this, args);
                    return this;
                }
            }),
            C = _make(B, {}, {
                a: {
                    c: 'c'
                },
                b: {
                    c: 'c'
                },
                c: {
                    c: 'c'
                },
                _init (...args) {
                    Reflect.apply(B._init, this, args);
                    return this;
                }
            });

        _chai.expect(Reflect.getPrototypeOf(C.a)).to.equal(B.a);
        _chai.expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(C.a))).to.equal(A.a);
        _chai.expect(Reflect.getPrototypeOf(C.b)).to.equal(B.b);
        _chai.expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(C.b))).to.equal(A.b);
        _chai.expect(Reflect.getPrototypeOf(C.c)).to.equal(B.c);
        _chai.expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(C.c))).to.equal(A.c);

        _chai.expect(C.a).to.have.property('a', 'a');
        _chai.expect(C.a).to.have.property('b', 'b');
        _chai.expect(C.a).to.have.property('c', 'c');
        _chai.expect(C.b).to.have.property('a', 'a');
        _chai.expect(C.b).to.have.property('b', 'b');
        _chai.expect(C.b).to.have.property('c', 'c');
        _chai.expect(C.c).to.have.property('a', 'a');
        _chai.expect(C.c).to.have.property('b', 'b');
        _chai.expect(C.c).to.have.property('c', 'c');
    });

    _mocha.it('should create prototype chains including mixins for static property objects', () => {
        const A = _make([
                _PropertyChainer
            ], {}, {
                a: {
                    a: 'a'
                },
                b: {
                    a: 'a'
                },
                c: {
                    a: 'a'
                },
                _init (...args) {
                    Reflect.apply(_PropertyChainer._init, this, args);
                    return this;
                },
                _propertyChains: [
                    'a',
                    'b',
                    'c'
                ]
            }),
            B = _make([
                A
            ], {}, {
                a: {
                    b: 'b'
                },
                b: {
                    b: 'b'
                },
                c: {
                    b: 'b'
                },
                _init (...args) {
                    Reflect.apply(A._init, this, args);
                    return this;
                }
            }),
            C = _make([
                B
            ], {}, {
                a: {
                    c: 'c'
                },
                b: {
                    c: 'c'
                },
                c: {
                    c: 'c'
                },
                _init (...args) {
                    Reflect.apply(B._init, this, args);
                    return this;
                }
            });

        _chai.expect({
            ...Reflect.getPrototypeOf(C.a)
        }).to.deep.equal({
            ...B.a
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(Reflect.getPrototypeOf(C.a))
        }).to.deep.equal({
            ...A.a
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(C.b)
        }).to.deep.equal({
            ...B.b
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(Reflect.getPrototypeOf(C.b))
        }).to.deep.equal({
            ...A.b
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(C.c)
        }).to.deep.equal({
            ...B.c
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(Reflect.getPrototypeOf(C.c))
        }).to.deep.equal({
            ...A.c
        });

        _chai.expect(C.a).to.have.property('a', 'a');
        _chai.expect(C.a).to.have.property('b', 'b');
        _chai.expect(C.a).to.have.property('c', 'c');
        _chai.expect(C.b).to.have.property('a', 'a');
        _chai.expect(C.b).to.have.property('b', 'b');
        _chai.expect(C.b).to.have.property('c', 'c');
        _chai.expect(C.c).to.have.property('a', 'a');
        _chai.expect(C.c).to.have.property('b', 'b');
        _chai.expect(C.c).to.have.property('c', 'c');
    });

    _mocha.it('should create prototype chains excluding mixins for static property objects', () => {
        const A = _make([
                _PropertyChainer
            ], {}, {
                a: {
                    a: 'a'
                },
                b: {
                    a: 'a'
                },
                c: {
                    a: 'a'
                },
                _init (...args) {
                    Reflect.apply(_PropertyChainer._init, this, args);
                    return this;
                },
                _propertyChains: [
                    'a',
                    'b',
                    'c'
                ]
            }),
            B = _make([
                A
            ], {}, {
                a: {
                    b: 'b'
                },
                b: {
                    b: 'b'
                },
                c: {
                    b: 'b'
                },
                _init (...args) {
                    Reflect.apply(A._init, this, args);
                    return this;
                }
            }),
            C = _make([
                B
            ], {}, {
                a: {
                    c: 'c'
                },
                b: {
                    c: 'c'
                },
                c: {
                    c: 'c'
                },
                _init (...args) {
                    Reflect.apply(B._init, this, args);
                    return this;
                }
            }, '_init', '_init', [{
                propertyChainsIncludeMixins: false
            }]);

        _chai.expect(Reflect.getPrototypeOf(C.a)).to.equal(Object.prototype);
        _chai.expect(Reflect.getPrototypeOf(C.b)).to.equal(Object.prototype);
        _chai.expect(Reflect.getPrototypeOf(C.c)).to.equal(Object.prototype);

        _chai.expect(C.a).not.to.have.property('a');
        _chai.expect(C.a).not.to.have.property('b');
        _chai.expect(C.a).to.have.property('c', 'c');
        _chai.expect(C.b).not.to.have.property('a');
        _chai.expect(C.b).not.to.have.property('b');
        _chai.expect(C.b).to.have.property('c', 'c');
        _chai.expect(C.c).not.to.have.property('a');
        _chai.expect(C.c).not.to.have.property('b');
        _chai.expect(C.c).to.have.property('c', 'c');
    });

    _mocha.it('should ignore duplicate prototype chains', () => {
        const aa = {
                a: 'a'
            },
            bb = {
                b: 'b'
            },
            cc = {
                c: 'c'
            },

            A = _make(_PropertyChainer, {
                a: aa,
                _init (...args) {
                    Reflect.apply(_PropertyChainer.prototype._init, this, args);
                    return this;
                },
                _propertyChains: [
                    'a',
                    'a',
                    'a'
                ]
            }, {
                a: aa,
                _init (...args) {
                    Reflect.apply(_PropertyChainer._init, this, args);
                    return this;
                },
                _propertyChains: [
                    'a',
                    'a',
                    'a'
                ]
            }),
            B = _make(A, {
                a: bb,
                _init (...args) {
                    Reflect.apply(A.prototype._init, this, args);
                    return this;
                }
            }, {
                a: bb,
                _init (...args) {
                    Reflect.apply(A._init, this, args);
                    return this;
                }
            }),
            C = _make(B, {
                a: cc,
                _init (...args) {
                    Reflect.apply(B.prototype._init, this, args);
                    return this;
                }
            }, {
                a: cc,
                _init (...args) {
                    Reflect.apply(B._init, this, args);
                    return this;
                }
            }),
            c = C();

        _chai.expect(Reflect.getPrototypeOf(C.a)).to.equal(B.a);
        _chai.expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(C.a))).to.equal(A.a);

        _chai.expect(C.a).to.have.property('a', 'a');
        _chai.expect(C.a).to.have.property('b', 'b');
        _chai.expect(C.a).to.have.property('c', 'c');

        _chai.expect(Reflect.getPrototypeOf(c.a)).to.equal(B.prototype.a);
        _chai.expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(c.a))).to.equal(A.prototype.a);

        _chai.expect(c.a).to.have.property('a', 'a');
        _chai.expect(c.a).to.have.property('b', 'b');
        _chai.expect(c.a).to.have.property('c', 'c');
    });

    _mocha.it('should chain only the last instance of duplicate property objects', () => {
        const A = _make(_PropertyChainer, {
                a: {
                    a: 'a'
                },
                b: {
                    a: 'a'
                },
                c: {
                    a: 'a'
                },
                _init (...args) {
                    Reflect.apply(_PropertyChainer._init, this, args);
                    return this;
                },
                _propertyChains: [
                    'a',
                    'b',
                    'c'
                ]
            }, {
                a: {
                    a: 'a'
                },
                b: {
                    a: 'a'
                },
                c: {
                    a: 'a'
                },
                _init (...args) {
                    Reflect.apply(_PropertyChainer._init, this, args);
                    return this;
                },
                _propertyChains: [
                    'a',
                    'b',
                    'c'
                ]
            }),
            B = _make(A, {
                a: {
                    b: 'b'
                },
                b: {
                    b: 'b'
                },
                c: {
                    b: 'b'
                },
                _init (...args) {
                    Reflect.apply(A.prototype._init, this, args);
                    return this;
                }
            }, {
                a: {
                    b: 'b'
                },
                b: {
                    b: 'b'
                },
                c: {
                    b: 'b'
                },
                _init (...args) {
                    Reflect.apply(A._init, this, args);
                    return this;
                }
            }),
            C = _make(A, {
                a: {
                    c: 'c'
                },
                b: {
                    c: 'c'
                },
                c: {
                    c: 'c'
                },
                _init (...args) {
                    Reflect.apply(B.prototype._init, this, args);
                    return this;
                }
            }, {
                a: {
                    c: 'c'
                },
                b: {
                    c: 'c'
                },
                c: {
                    c: 'c'
                },
                _init (...args) {
                    Reflect.apply(B._init, this, args);
                    return this;
                }
            }),
            D = _make(A, [
                B,
                C
            ], {
                a: {
                    d: 'd'
                },
                b: {
                    d: 'd'
                },
                c: {
                    d: 'd'
                },
                _init (...args) {
                    Reflect.apply(A.prototype._init, this, args);
                    return this;
                }
            }, {
                a: {
                    d: 'd'
                },
                b: {
                    d: 'd'
                },
                c: {
                    d: 'd'
                },
                _init (...args) {
                    Reflect.apply(A._init, this, args);
                    return this;
                }
            }),
            d = D();

        _chai.expect({
            ...Reflect.getPrototypeOf(D.a)
        }).to.deep.equal({
            ...C.a
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(Reflect.getPrototypeOf(D.a))
        }).to.deep.equal({
            ...B.a
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(Reflect.getPrototypeOf(Reflect.getPrototypeOf(D.a)))
        }).to.deep.equal({
            ...A.a
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(D.b)
        }).to.deep.equal({
            ...C.b
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(Reflect.getPrototypeOf(D.b))
        }).to.deep.equal({
            ...B.b
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(Reflect.getPrototypeOf(Reflect.getPrototypeOf(D.b)))
        }).to.deep.equal({
            ...A.b
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(D.c)
        }).to.deep.equal({
            ...C.c
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(Reflect.getPrototypeOf(D.c))
        }).to.deep.equal({
            ...B.c
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(Reflect.getPrototypeOf(Reflect.getPrototypeOf(D.c)))
        }).to.deep.equal({
            ...A.c
        });

        _chai.expect(D.a).to.have.property('a', 'a');
        _chai.expect(D.a).to.have.property('b', 'b');
        _chai.expect(D.a).to.have.property('c', 'c');
        _chai.expect(D.a).to.have.property('d', 'd');
        _chai.expect(D.b).to.have.property('a', 'a');
        _chai.expect(D.b).to.have.property('b', 'b');
        _chai.expect(D.b).to.have.property('c', 'c');
        _chai.expect(D.b).to.have.property('d', 'd');
        _chai.expect(D.c).to.have.property('a', 'a');
        _chai.expect(D.c).to.have.property('b', 'b');
        _chai.expect(D.c).to.have.property('c', 'c');
        _chai.expect(D.c).to.have.property('d', 'd');

        _chai.expect({
            ...Reflect.getPrototypeOf(d.a)
        }).to.deep.equal({
            ...C.prototype.a
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(Reflect.getPrototypeOf(d.a))
        }).to.deep.equal({
            ...B.prototype.a
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(Reflect.getPrototypeOf(Reflect.getPrototypeOf(d.a)))
        }).to.deep.equal({
            ...A.prototype.a
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(d.b)
        }).to.deep.equal({
            ...C.prototype.b
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(Reflect.getPrototypeOf(d.b))
        }).to.deep.equal({
            ...B.prototype.b
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(Reflect.getPrototypeOf(Reflect.getPrototypeOf(d.b)))
        }).to.deep.equal({
            ...A.prototype.b
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(d.c)
        }).to.deep.equal({
            ...C.prototype.c
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(Reflect.getPrototypeOf(d.c))
        }).to.deep.equal({
            ...B.prototype.c
        });
        _chai.expect({
            ...Reflect.getPrototypeOf(Reflect.getPrototypeOf(Reflect.getPrototypeOf(d.c)))
        }).to.deep.equal({
            ...A.prototype.c
        });

        _chai.expect(d.a).to.have.property('a', 'a');
        _chai.expect(d.a).to.have.property('b', 'b');
        _chai.expect(d.a).to.have.property('c', 'c');
        _chai.expect(d.a).to.have.property('d', 'd');
        _chai.expect(d.b).to.have.property('a', 'a');
        _chai.expect(d.b).to.have.property('b', 'b');
        _chai.expect(d.b).to.have.property('c', 'c');
        _chai.expect(d.b).to.have.property('d', 'd');
        _chai.expect(d.c).to.have.property('a', 'a');
        _chai.expect(d.c).to.have.property('b', 'b');
        _chai.expect(d.c).to.have.property('c', 'c');
        _chai.expect(d.c).to.have.property('d', 'd');
    });
});
