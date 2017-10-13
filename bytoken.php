<?
header("Content-Type: application/json");
// header("Accept: application/json, text/plain");
header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$root = '../crm/api/'; // changed 11124444

include_once($root.'cfg/main_config.php');
include_once($root.'_pre.php');


function classautoloader2($classname) {
	include 'classes/'.$classname.'.php';
}	

spl_autoload_register ('classautoloader2');

$core = new stdClass();
$core->_parent = new stdClass();
$core->_parent->dbi = new DBi();
$core->_parent->dbi->Connect();

$response = new stdClass();

$urow = $core->_parent->dbi->FetchQuery(
	Array(
		Array('s',$_POST->token)
	),"
		SELECT
			u.id uid,
			u.name name,
			ut.enabled enabled,
			ut.start_dt start_dt,
			ut.end_dt end_dt,
			ut.dsc dsc
		FROM
			users u
		LEFT OUTER JOIN
			users_tokens ut ON ut.users_id = u.id
		WHERE
			ut.token = ?
			AND ut.start_dt <= NOW()
			AND ut.end_dt >= NOW()
			AND !u.d
			AND !ut.d
	");
if (@$urow['uid']) {
	$sessno = md5(substr(time(), 3, 11).rand(100,999));
	if(!$core->mobile) {
		$_SESSION[PROJECTNAME.'us_no'] = $sessno;
	}
	$core->_parent->dbi->Query(
		Array(
			Array('i',$urow['uid'])
			,Array('s',$GLOBALS['_SERVER']['REMOTE_ADDR'])
			,Array('s',$sessno)
		),"
		INSERT INTO usessions (users_id,ip,sdate,ldate,num)	VALUES (
			?
			,?
			,NOW()
			,NOW()
			,?
		)
	");
	if(!$urow['enabled']) {
		$response->error = 'Token is disabled';
	} else {
		$response->uid = $urow['uid'];
		$response->name = $urow['name'];
		$response->enabled = $urow['enabled'];
		$response->start_dt = $urow['start_dt'];
		$response->end_dt = $urow['end_dt'];
		$response->dsc = $urow['dsc'];
		$response->sid = $sessno;
	}
} else {
	$response->error = 'Wrong token';
}

echo json_encode($response);