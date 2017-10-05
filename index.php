<?
function FileLMT($filename) { if (file_exists($filename)) { return filemtime($filename); } else { return false; } }
$my_css_mt = FileLMT('css/style.css');
$my_js_mt = FileLMT('scripts.js');
$my_js_lib_mt = FileLMT('lib/js/lib.js');

$my_js = '<script src="scripts.js?mt='.$my_js_mt.'" type="text/javascript"></script>';
$my_js_lib = '<script src="lib/js/lib.js?mt='.$my_js_lib_mt.'" type="text/javascript"></script>';
$my_counter = '';

include_once('index.html');





// $my_js = '
// 	    <!-- My -->
// 		<script src="js/mywrappers.js"></script>
// 	    <!-- APP Routing -->
// 		<script src="js/app.js"></script>
// 		<script src="js/route.js"></script>
// 		<!-- Services -->
// 		<script src="js/services/GurtamWialon.js"></script>
// 		<script src="js/services/WaitFor.js"></script>
// 		<script src="js/services/State.js"></script>
// 		<script src="js/services/Wialon.js"></script>
// 		<script src="js/services/Ready.js"></script>
// 		<script src="js/services/Units.js"></script>
// 		<script src="js/services/HWTypes.js"></script>
// 		<script src="js/services/Messages.js"></script>
// 		<script src="js/services/Validator.js"></script>
// 		<script src="js/services/UnitFormValidator.js"></script>
// 		<script src="js/services/Options.js"></script>
// 		<script src="js/services/GlomosCRM.js"></script>
// 		<script src="js/services/Statistics.js"></script>
// 		<script src="js/services/Accounts.js"></script>
// 		<!-- Controlllers -->
// 		<script src="js/controllers/MainCtrl.js"></script>
// 		<script src="js/controllers/UnitsListCtrl.js"></script>
// 		<script src="js/controllers/LoginCtrl.js"></script>
// 		<script src="js/controllers/UnitCtrl.js"></script>
// 		<script src="js/controllers/MessagesCtrl.js"></script>
// 		<script src="js/controllers/OptionsCtrl.js"></script>
// 		<script src="js/controllers/AboutCtrl.js"></script>
// 		<script src="js/controllers/AccountsListCtrl.js"></script>
// 		<!-- Filters -->
// 		<script src="js/filters/ParamToSensorValueFilter.js"></script>
// 		<script src="js/filters/UnitsFilter.js"></script>
// 		<script src="js/filters/UtoTimeFilter.js"></script>
// 		<script src="js/filters/MessagesParamsFilter.js"></script>
// 		<script src="js/filters/AccountsFilter.js"></script>
// 		<!-- Directives -->
// ';
// $my_js_lib = '
// 		<script src="lib/js/jquery.min.js"></script>
// 		<script src="lib/js/bootstrap.min.js"></script>
// 		<script src="lib/js/angular.min.js"></script>
// 		<script src="lib/js/angular-animate.min.js"></script>
// 	    <script src="lib/js/angular-ui-router.min.js" type="text/javascript"></script>  
// 	    <script src="lib/js/angular-locale_ru.min.js" type="text/javascript"></script>
// 	    <script src="lib/js/d3.min.js" type="text/javascript"></script>
// 	    <script src="lib/js/LineChart.min.js" type="text/javascript"></script>
// 	    <script src="lib/js/angular-translate.min.js" type="text/javascript"></script>
// 	    <script src="lib/js/angular-translate-loader-partial.min.js" type="text/javascript"></script>
// ';

