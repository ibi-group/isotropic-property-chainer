import {
    describe,
    it
} from 'mocha';

import {
    expect
} from 'chai';

import make from 'isotropic-make';

import PropertyChainer from '../js/property-chainer.js';

describe('PropertyChainer', () => {
    it('should construct property chainer objects', () => {
        expect(PropertyChainer).to.be.a('function');

        const propertyChainer = new PropertyChainer();

        expect(propertyChainer).to.be.an.instanceOf(PropertyChainer);
    });

    it('should be a property chainer object factory', () => {
        expect(PropertyChainer).to.be.a('function');

        const propertyChainer = PropertyChainer();

        expect(propertyChainer).to.be.an.instanceOf(PropertyChainer);
    });

    it('should create prototype chains for instance property objects', () => {
        const A = make(PropertyChainer, {
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
                    Reflect.apply(PropertyChainer.prototype._init, this, args);
                    return this;
                },
                _propertyChains: [
                    'a',
                    'b',
                    'c'
                ]
            }),
            B = make(A, {
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
            C = make(B, {
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

        expect(Reflect.getPrototypeOf(c.a)).to.equal(B.prototype.a);
        expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(c.a))).to.equal(A.prototype.a);
        expect(Reflect.getPrototypeOf(c.b)).to.equal(B.prototype.b);
        expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(c.b))).to.equal(A.prototype.b);
        expect(Reflect.getPrototypeOf(c.c)).to.equal(B.prototype.c);
        expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(c.c))).to.equal(A.prototype.c);

        expect(c).to.have.deep.property('a.a', 'a');
        expect(c).to.have.deep.property('a.b', 'b');
        expect(c).to.have.deep.property('a.c', 'c');
        expect(c).to.have.deep.property('b.a', 'a');
        expect(c).to.have.deep.property('b.b', 'b');
        expect(c).to.have.deep.property('b.c', 'c');
        expect(c).to.have.deep.property('c.a', 'a');
        expect(c).to.have.deep.property('c.b', 'b');
        expect(c).to.have.deep.property('c.c', 'c');
    });

    it('should create prototype chains for instance property objects with a custom property chains property name', () => {
        const A = make(PropertyChainer, {
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
                    Reflect.apply(PropertyChainer.prototype._init, this, [{
                        propertyChainsPropertyName: 'somethingElse'
                    }]);
                    return this;
                }
            }),
            B = make(A, {
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
            C = make(B, {
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

        expect(Reflect.getPrototypeOf(c.a)).to.equal(B.prototype.a);
        expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(c.a))).to.equal(A.prototype.a);
        expect(Reflect.getPrototypeOf(c.b)).to.equal(B.prototype.b);
        expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(c.b))).to.equal(A.prototype.b);
        expect(Reflect.getPrototypeOf(c.c)).to.equal(B.prototype.c);
        expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(c.c))).to.equal(A.prototype.c);

        expect(c).to.have.deep.property('a.a', 'a');
        expect(c).to.have.deep.property('a.b', 'b');
        expect(c).to.have.deep.property('a.c', 'c');
        expect(c).to.have.deep.property('b.a', 'a');
        expect(c).to.have.deep.property('b.b', 'b');
        expect(c).to.have.deep.property('b.c', 'c');
        expect(c).to.have.deep.property('c.a', 'a');
        expect(c).to.have.deep.property('c.b', 'b');
        expect(c).to.have.deep.property('c.c', 'c');
    });

    it('should create prototype chains for static property objects', () => {
        const A = make(PropertyChainer, {}, {
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
                    Reflect.apply(PropertyChainer._init, this, args);
                    return this;
                },
                _propertyChains: [
                    'a',
                    'b',
                    'c'
                ]
            }),
            B = make(A, {}, {
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
            C = make(B, {}, {
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

        expect(Reflect.getPrototypeOf(C.a)).to.equal(B.a);
        expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(C.a))).to.equal(A.a);
        expect(Reflect.getPrototypeOf(C.b)).to.equal(B.b);
        expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(C.b))).to.equal(A.b);
        expect(Reflect.getPrototypeOf(C.c)).to.equal(B.c);
        expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(C.c))).to.equal(A.c);

        expect(C).to.have.deep.property('a.a', 'a');
        expect(C).to.have.deep.property('a.b', 'b');
        expect(C).to.have.deep.property('a.c', 'c');
        expect(C).to.have.deep.property('b.a', 'a');
        expect(C).to.have.deep.property('b.b', 'b');
        expect(C).to.have.deep.property('b.c', 'c');
        expect(C).to.have.deep.property('c.a', 'a');
        expect(C).to.have.deep.property('c.b', 'b');
        expect(C).to.have.deep.property('c.c', 'c');
    });

    it('should create prototype chains for static property objects with a custom property chains property name', () => {
        const A = make(PropertyChainer, {}, {
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
                    Reflect.apply(PropertyChainer._init, this, [{
                        propertyChainsPropertyName: 'somethingElse'
                    }]);
                    return this;
                }
            }),
            B = make(A, {}, {
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
            C = make(B, {}, {
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

        expect(Reflect.getPrototypeOf(C.a)).to.equal(B.a);
        expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(C.a))).to.equal(A.a);
        expect(Reflect.getPrototypeOf(C.b)).to.equal(B.b);
        expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(C.b))).to.equal(A.b);
        expect(Reflect.getPrototypeOf(C.c)).to.equal(B.c);
        expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(C.c))).to.equal(A.c);

        expect(C).to.have.deep.property('a.a', 'a');
        expect(C).to.have.deep.property('a.b', 'b');
        expect(C).to.have.deep.property('a.c', 'c');
        expect(C).to.have.deep.property('b.a', 'a');
        expect(C).to.have.deep.property('b.b', 'b');
        expect(C).to.have.deep.property('b.c', 'c');
        expect(C).to.have.deep.property('c.a', 'a');
        expect(C).to.have.deep.property('c.b', 'b');
        expect(C).to.have.deep.property('c.c', 'c');
    });

    it('should ignore duplicate prototype chains', () => {
        const aa = {
                a: 'a'
            },
            bb = {
                b: 'b'
            },
            cc = {
                c: 'c'
            },

            A = make(PropertyChainer, {
                a: aa,
                _init (...args) {
                    Reflect.apply(PropertyChainer.prototype._init, this, args);
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
                    Reflect.apply(PropertyChainer._init, this, args);
                    return this;
                },
                _propertyChains: [
                    'a',
                    'a',
                    'a'
                ]
            }),
            B = make(A, {
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
            C = make(B, {
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

        expect(Reflect.getPrototypeOf(C.a)).to.equal(B.a);
        expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(C.a))).to.equal(A.a);

        expect(C).to.have.deep.property('a.a', 'a');
        expect(C).to.have.deep.property('a.b', 'b');
        expect(C).to.have.deep.property('a.c', 'c');

        expect(Reflect.getPrototypeOf(c.a)).to.equal(B.prototype.a);
        expect(Reflect.getPrototypeOf(Reflect.getPrototypeOf(c.a))).to.equal(A.prototype.a);

        expect(c).to.have.deep.property('a.a', 'a');
        expect(c).to.have.deep.property('a.b', 'b');
        expect(c).to.have.deep.property('a.c', 'c');
    });
});
