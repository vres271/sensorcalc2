<?
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: http://localhost:3000');
//header('Access-Control-Allow-Origin: https://wialoncrm.com');
header('Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {echo ""; exit();}

$root = '../crm/api/'; // changed 11124

include_once($root.'cfg/main_config.php');
include_once($root.'_pre.php');



define('AMEMBER_KEY', 'qYTyOfLc5SlGchfSmbgq');

$core = new stdClass();
$core->_parent = new stdClass();
$core->_parent->dbi = new DBi();
$core->_parent->dbi->Connect();

$response = new stdClass();

function error($msg='error') {
	echo '{"error":"'.$msg.'""}';
	exit();
}

function toParams($keys, $arr=false) {
	$params = new stdClass();
	if(!$arr) $arr = $_POST;
	foreach ($keys as $key => $value) {
		if(isset($arr->$value)) {
			$params->$value = $arr->$value;
		}
	}
	return $params;
}


try {

	$core->_parent->amember = new aMember(AMEMBER_KEY, 'https://wialoncrm.com/amember/api/');
	$account = new WCRMAccount($core->_parent);
	$account->login(@$_POST->w_accounts_id);

	if(!@$_GET['obj']) throw new Exception('Undefined object');
	if(!@$_GET['m']) throw new Exception('Undefined method');

	$object_name = $_GET['obj'];
	$method_name = $_GET['m'];

	if($object_name=='account') {
		if($method_name=='get') {
			$response = $account->get();
		} else if($method_name=='create') {
			$response = $account->create(toParams(Array('name','w_accounts_id','email')));
		}	
	}
	$core->_parent->amember->close();


} catch(Exception $e) {
	$response = new stdClass();
	$response->error = true;
	$response->message = $e->getMessage();
	echo json_encode($response);
	exit();
}

echo json_encode($response);

