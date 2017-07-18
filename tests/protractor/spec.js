// spec.js
describe('SensorCalc2 Tests', function() {

  var username = 'glomosru';
  var access_token = '1179ebaf58c260144c34d6cc0535072d8983896B88684CEA9CAF8522C04FCD5C2CEF0918';
  var filter = ['nm','uid','ph'];
  var default_limit = 20;

  browser.get('http://sensorcalc2');

  it('exists Sign-In button', function() {
    expect(element(by.id('login')).isDisplayed()).toEqual(true);
  });

  it('trying to login by link from Wialon login form', function() {
    browser.get('http://sensorcalc2/#/login?user_name='+username+'&access_token='+access_token);
    browser.wait(function() {
      return element(by.id('username')).isDisplayed();
    });
    expect(element(by.id('username')).getText()).toContain(username);
  });

  it('units', function() {
    element(by.linkText('Units')).click();
    browser.wait(function() {
      return element(by.binding('item.nm')).isPresent();
    },15*1000);
    expect(element.all(by.className('item-row')).count()).toBeGreaterThan(default_limit/2);
    expect(element.all(by.repeater('item in units.items')).count()).toBeGreaterThan(default_limit/2);
  });

  it('units filter', function() {
    var items = by.repeater('item in units.items');
    expect(element.all(items).count()).toBeGreaterThan(default_limit/2);

    var testFilter = function(key) {
      var filter_input = element(by.model('filter.'+key)); // поле ввода фильтра
      filter_input.clear(); // очищаем его
      expect(element.all(items).count()).toBeGreaterThan(default_limit/2); // ожидаем, что в таблице более 10 строк
      var search = element(items.row(5).column('item.'+key)).getText(); // берём текст из требуемой ячейки в 5й строке
      filter_input.sendKeys(search); // вводим его в поле ввода фильтра
      expect(element.all(items).count()).toBe(1); // в таблице должа стать одна строка (найдено соответствие)
      expect(element(items.row(0).column('item.'+key)).getText()).toBe(search); // в той же ячейке в этой строке должен стоять искомый текст (видим то, что искали)
      filter_input.clear(); // очищаем его
    }

    for(var key in filter) {
      testFilter(filter[key]);
    }

    expect(element.all(items).count()).toBeGreaterThan(default_limit/2);
  });

  it('rows limiter - more-button', function() {
    var items = by.repeater('item in units.items');
    var limit = element.all(items).count();
    var more_button = element(by.id('paginator'));

    expect(limit).toBe(default_limit);
    
    expect(more_button.isDisplayed()).toEqual(true); 
    more_button.click();
    expect(element.all(items).count()).toBe(2*default_limit);
    more_button.click();
    expect(element.all(items).count()).toBe(4*default_limit);

    var search = element(items.row(3).column('item.nm')).getText();
    var filter_input = element(by.model('filter.nm')); // поле ввода фильтра
    filter_input.sendKeys(search); // вводим его в поле ввода фильтра

    expect(more_button.isDisplayed()).toEqual(false); 

    filter_input.clear(); // очищаем его
    expect(more_button.isDisplayed()).toEqual(true); 
  });

  it('rows limiter - limit select', function() {
    var items = by.repeater('item in units.items');
    var limit = element.all(items).count();
    var limit_options = element.all(by.css('select[ng-model="limit"] option'));

    var testLimiterOption = function(i) {
      limit_options.get(i).getText().then(function(text){
        var next_limit = 1*text;
        limit_options.get(i).click();
        expect(element.all(items).count()).toEqual(next_limit);
      });
    }

    limit_options.get(1).click();
    testLimiterOption(0);
    testLimiterOption(1);
    testLimiterOption(2);

  });

  it('logout from', function() {
    element(by.id('logout')).click();
    browser.wait(function() {
      return element(by.id('login')).isDisplayed();
    });
    expect(element(by.id('login')).isDisplayed()).toEqual(true);
  });

});