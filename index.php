<?
function FileLMT($filename) { if (file_exists($filename)) { return filemtime($filename); } else { return false; } }
$my_css_mt = FileLMT('css/style.css');
$my_js_mt = FileLMT('js/scripts.css');
$my_js = '
	    <!-- My -->
		<script src="js/mywrappers.js"></script>
	    <!-- APP Routing -->
		<script src="js/app.js"></script>
		<script src="js/route.js"></script>
		<!-- Services -->
		<script src="js/services/GurtamWialon.js"></script>
		<script src="js/services/WaitFor.js"></script>
		<script src="js/services/State.js"></script>
		<script src="js/services/Wialon.js"></script>
		<script src="js/services/Ready.js"></script>
		<script src="js/services/Units.js"></script>
		<script src="js/services/HWTypes.js"></script>
		<script src="js/services/Messages.js"></script>
		<script src="js/services/Validator.js"></script>
		<script src="js/services/UnitFormValidator.js"></script>
		<script src="js/services/Options.js"></script>
		<script src="js/services/GlomosCRM.js"></script>
		<script src="js/services/Statistics.js"></script>
		<!-- Controlllers -->
		<script src="js/controllers/MainCtrl.js"></script>
		<script src="js/controllers/UnitsListCtrl.js"></script>
		<script src="js/controllers/LoginCtrl.js"></script>
		<script src="js/controllers/UnitCtrl.js"></script>
		<script src="js/controllers/MessagesCtrl.js"></script>
		<script src="js/controllers/OptionsCtrl.js"></script>
		<!-- Filters -->
		<script src="js/filters/ParamToSensorValueFilter.js"></script>
		<script src="js/filters/UnitsFilter.js"></script>
		<script src="js/filters/UtoTimeFilter.js"></script>
		<script src="js/filters/MessagesParamsFilter.js"></script>
		<!-- Directives -->
';

include_once('index.html');
