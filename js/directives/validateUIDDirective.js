
Main.directive('vdUid', function() {
  return {
    require: 'ngModel'
    ,scope: {
      vdData: "="
    } //862631037728747 MIELTA M3 +79696925444

    ,link: function(scope, element, attr, mCtrl) {
      function myValidation(value) {
        var item = scope.vdData.item;
        var units = scope.vdData.units;
        var errors = scope.vdData.errors;
        mCtrl.$setValidity('vdUid', true);
        delete scope.vdData.errors.uid;
        element.parent().removeClass('has-error');
        if(value) {
          if(units.index.uid[value]) {
            if(units.index.uid[value].id !== item.id && item.hw && item.hw === units.index.uid[value].hw) {
              scope.vdData.errors.uid = {msg: 'Unit with the same UID and HW Type already exists', link: '#/unit/'+units.index.uid[value].id, title: units.index.uid[value].nm};
              mCtrl.$setValidity('vdUid', false);
              element.parent().addClass('has-error');
            }
          }
        }
        return value;
      }
      mCtrl.$parsers.push(myValidation);
    }
  };
});

Main.directive('vdPh', function() {
  return {
    require: 'ngModel'
    ,scope: {
      vdData: "="
    }

    ,link: function(scope, element, attr, mCtrl) {
      function myValidation(value) {
        var item = scope.vdData.item;
        var units = scope.vdData.units;
        var errors = scope.vdData.errors;
        mCtrl.$setValidity('vdPh', true);
        delete scope.vdData.errors.ph;
        element.parent().removeClass('has-error');
        if(value) {
          if(units.index.ph[value]) {
            if(units.index.ph[value].id !== item.id ) {
              scope.vdData.errors.ph = {msg: 'Unit with the same Phone already exists', link: '#/unit/'+units.index.ph[value].id, title: units.index.ph[value].nm};
              mCtrl.$setValidity('vdPh', false);
              element.parent().addClass('has-error');
            }
          }
        }
        return value;
      }
      mCtrl.$parsers.push(myValidation);
    }
  };
});