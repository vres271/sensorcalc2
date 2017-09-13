Main.service('UserFormValidator', ['Validator', 'Users'
  ,function(Validator,  Users) {
    var _s = this;
    _s.create = function(acc, crt_user) {
      _s.v = new Validator(acc);
      _s.validate = _s.v.validate;
      _s.errClass = function(key) {
        return _s.v.errors[key] ? 'has-error' : '';
      }
      _s.v.setPart('nm', function(item) {
        var ret = {valid: true};
        if(item) {
          if(item.nm === undefined) {
            ret.valid = false;
            ret.msg = 'User Name is empty!';
          } else {
            if(item.nm.length<4 || item.nm.length>50) {
              ret.valid = false;
              ret.msg = 'User name length must be from 4 to 50';
            }
            if(Users.index.nm[item.nm]) {
              if(Users.index.nm[item.nm].id !== item.id) {
                ret.valid = false;
                ret.msg = 'User with the same Name already exists';
                ret.link = '#/user/'+Users.index.nm[item.nm].id;
                ret.title = Users.index.nm[item.nm].nm;
              }
            }
          }
        }
        return ret;
      });
      return _s.v
    }
    return _s;
}]);