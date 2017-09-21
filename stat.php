<?
header("Content-Type: application/json");
// header("Accept: application/json, text/plain");
header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$root = '../crm/api/';

include_once($root.'cfg/main_config.php');
include_once($root.'_pre.php');

// function classautoloader2($classname) {
// 	include 'classes/'.$classname1.'.php';
// }	

// spl_autoload_register ('classautoloader2');

$core = new stdClass();
$core->_parent->dbi = new DBi();
$core->_parent->dbi->Connect();

$response = new stdClass();
if(@$_POST->user->id) {
	$core->_parent->dbi->Query(
		Array(
			 Array('s',@$_POST->act)
			,Array('i',@$_POST->user->id)
			,Array('s',@$_POST->user->nm)
			,Array('s',@$_POST->user->prp->city)
			,Array('i',@$_POST->user->prp->tz)
			,Array('s',@$_POST->sid_src)
			,Array('s',$GLOBALS['_SERVER']['REMOTE_ADDR'])
			,Array('s',$GLOBALS['_SERVER']['HTTP_REFERER'])
		),"
		INSERT INTO sc_stat (act, w_users_id, w_user_nm, w_user_city, tz, sid_src, ip, referer, dt)	VALUES (
			?
			,?
			,?
			,?
			,?
			,?
			,?
			,?
			,NOW()
		)
	");
}
	
$response->added =  $core->_parent->dbi->AffectedRows();

echo json_encode($response);