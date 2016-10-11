var hasId = {
    setId: function(){
        this.id = this.constructor.name + '-' +
            (this.x | 0) + '-' +
            (this.y | 0) + '-' +
            Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

    }
};

module.exports = hasId;