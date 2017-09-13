Main.service('AccountFormValidator', ['Validator', 'Accounts', 'Users'
  ,function(Validator, Accounts, Users) {
    var _s = this;
    _s.create = function(acc, crt_user) {
      _s.v = new Validator(acc);
      _s.validate = _s.v.validate;
      _s.errClass = function(key) {
        return _s.v.errors[key] ? 'has-error' : '';
      }
      _s.v.setPart('nm', function(acc) {
        var ret = {valid: true};
        if(acc.item) {
          if(acc.item.nm === undefined) {
            ret.valid = false;
            ret.msg = 'Name is empty!';
          } else {
            if(Accounts.index.nm[acc.item.nm]) {
              if(Accounts.index.nm[acc.item.nm].id !== acc.item.id) {
                ret.valid = false;
                ret.msg = 'Account with the same Name already exists';
                ret.link = '#/account/'+Accounts.index.nm[acc.item.nm].id;
                ret.title = Accounts.index.nm[acc.item.nm].nm;
              }
            }
          }
        }
        return ret;
      });
      _s.v.setPart('crt_user_nm', function(acc) {
        var ret = {valid: true};
        if(acc.crt_user) {
          if(acc.crt_user.nm === undefined) {
            ret.valid = false;
            ret.msg = 'User Name is empty!';
          } else {
            if(acc.crt_user.nm.length<4 || acc.crt_user.nm.length>50) {
              ret.valid = false;
              ret.msg = 'User name length must be from 4 to 50';
            }
            if(Users.index.nm[acc.crt_user.nm]) {
              if(Users.index.nm[acc.crt_user.nm].id !== acc.crt_user.id) {
                ret.valid = false;
                ret.msg = 'User with the same Name already exists';
                ret.link = '#/user/'+Users.index.nm[acc.crt_user.nm].id;
                ret.title = Users.index.nm[acc.crt_user.nm].nm;
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