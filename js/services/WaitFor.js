Main.service('WaitFor', ['$timeout', function($timeout){
  return function(if_func,then_func,t) {
    var _t = 30; if(t) _t = t;
    var waitfor = function() {
      if(if_func()) {
        $timeout(function() {
          then_func();
        },_t);
      } else {
        $timeout(function() {
          waitfor();
        },_t);
      }
    }; waitfor();
  }
}])
