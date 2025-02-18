// 6种继承方法

// 方法一：原型链继承
function Parent() {
    this.name = 'parent';
}

Parent.prototype.getName = function () {
    return this.name;
};

Parent.prototype.setName = function (newName) {
    this.name = newName;
};

function Child() {}

Child.prototype = new Parent();

Child.prototype.getName = function () {
    return this.name;
};

Child.prototype.setName = function (newName) {
    this.name = newName;
};

// 方法二：盗用构造函数
function Parent(name) {
    this.name = name;
}
function Child(name) {
    Parent.call(this, name);
}

// 方法三：法一法二组合继承

function Parent(name = 'parent') {
    this.name = name;
}

Parent.prototype.getName = function () {
    return this.name;
};

function Child(name = 'child') {
    Parent.call(this, name);
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

// 方法四：原型式继承
const createObject = <T extends object = any>(t: T) => {
    function F() {}
    F.prototype = t;
    return new F();
};

const parent = {
    name: 'parent',
    getName() {
        return this.name;
    },
};

const child = createObject(parent);

// 方法五：寄生
const inheritObject = <T extends object = any>(t: T) => {
    const c = createObject(t);
    c.getName = function () {
        return t.getName();
    };
    return c;
};

const child = inheritObject(parent);

// 方法六：寄生组合
const inheritPrototype = <P extends object = any, C extends object = any>(p: P, c: C) => {
    const pt = Object.create(p.prototype);
    pt.constructor = c;
    c.prototype = pt;
};

function Parent(name) {
    this.name = name;
}

Parent.prototype.getName = function () {
    return this.name;
};

function Child(name) {
    Parent.call(this, name); // 继承父类实例属性
}

inheritPrototype(Parent, Child);
