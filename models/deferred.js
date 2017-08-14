var Deferred = function(){
  var def = this;
  /**
   * @instance
   * @memberof Flybits.Deferred
   * @member {external:Promise} promise Instance of an ES6 Promise to be fulfilled.
   */
  this.promise = new Promise(function(resolve,reject){
    /**
     * @instance
     * @memberof Flybits.Deferred
     * @member {function} resolve Callback to be invoked when the asychronous task that initiated the promise is successfully completed.
     */
    def.resolve = resolve;
    /**
     * @instance
     * @memberof Flybits.Deferred
     * @member {function} reject Callback to be invoked when the asychronous task that initiated the promise has failed to complete successfully.
     */
    def.reject = reject;
  });

  this.then = this.promise.then.bind(this.promise);
  this.catch = this.promise.catch.bind(this.promise);
};

module.exports = Deferred;
