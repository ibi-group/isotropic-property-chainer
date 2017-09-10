import _chai from 'chai';
import _make from 'isotropic-make';
import _mocha from 'mocha';
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
});
