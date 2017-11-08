<?
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: http://localhost:3000');
//header('Access-Control-Allow-Origin: https://wialoncrm.com');
header('Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {echo ""; exit();}

$root = '../crm/api/'; 
define('AMEMBER_KEY', 'qYTyOfLc5SlGchfSmbgq');

include_once($root.'cfg/main_config.php');
include_once($root.'_pre.php');
include_once('func.php');


$core = new stdClass();
$core->_parent = new stdClass();
$core->_parent->dbi = new DBi();
$core->_parent->dbi->Connect();
$core->_parent->wcrm_format = true;

$response = new stdClass();


try {

	if(!@$_GET['o']) throw new Exception('Undefined object');
	if(!@$_GET['m']) throw new Exception('Undefined method');

	$object_name = $_GET['o'];
	$method_name = $_GET['m'];

	$params = $_POST;

	$core->_parent->amember = new aMember(AMEMBER_KEY, 'https://wialoncrm.com/amember/api/');
	$account = new WCRMAccount($core->_parent);
	$core->_parent->rights = new WCRMRights($core->_parent);

	if(!($object_name=='products' || ($object_name=='account' && ( $method_name=='create' || $method_name=='login')))) {
		$account->checkAuth(@$params->sid);
		$core->_parent->user = $account->user;
	}

	$account->init();
	check_rights($core->_parent->rights, $object_name, $method_name);

	if($object_name=='account') {
		if($method_name=='login') {
			$response = $account->login(toParams(Array('token'),$params));
		} else if($method_name=='get') {
			$response = $account->get();
		} else if($method_name=='create') {
			$response = $account->create(toParams(Array('name','w_accounts_id','email'),$params));
		} else if($method_name=='getamcredentials') {
			$response = $account->getAmCredentials();
		} else if($method_name=='test') {
			$response = (object) Array('hello'=>'world');
		}
	} else if($object_name=='products') {
		$products = new WCRMProducts($core->_parent);
		if($method_name=='get') {
			$response = $products->get();
		}
	} else if($object_name=='test_object') {
		if($method_name=='test_method') {
			$response->test = 'test_object.test_method() response';
			$response->rightNav = $core->_parent->rights->getN('rights','r');
		}
	} else if($object_name=='wcrmrights') {
		if($method_name=='get') {
			$response->ref = $core->_parent->rights->getRef();
			//$response->comp = $core->_parent->rights->getComplied();
			$response->full = $core->_parent->rights->getFullTable($params);
		} else if($method_name=='getref') {
			$response->ref = $core->_parent->rights->getRef();
		} else if($method_name=='save') {
			$response = $core->_parent->rights->save($params);
		}
	} else if($object_name=='users') {
		$users = new Users($core->_parent);
		if($method_name=='get') {
			$response = $users->get();
		} else if($method_name=='getall') {
			$response = $users->getAll();
		}
	} else if($object_name=='ugroups') {
		$ugroups = new UGroups($core->_parent);
		if($method_name=='get') {
			$response = $ugroups->get();
		} else if($method_name=='getall') {
			$response = $ugroups->getAll();
		}
	} else if($object_name=='accounts') {
		$accounts = new Accounts($core->_parent);
		if($method_name=='get') {
			//$response = $accounts->get();
		} else if($method_name=='getall') {
			$acc_params = new stdClass();
			$acc_params->notid = 1;
			$result = $accounts->get($acc_params);
			if(@$result->body) {
				$response->items = $result->body;
			}
		}
	} else if($object_name=='companies') {
		$companies = new Companies($core->_parent);
		if($method_name=='get') {
			$response = $companies->WCRMget();
		}
	} else if($object_name=='c_users') {
		$c_users = new C_Users($core->_parent);
		if($method_name=='get') {
			$result = $response = $c_users->get();
			if(@$result->body) {
				$response->items = $result->body;
			}
		}
	} else if($object_name=='objects') {
		$objects = new Objects($core->_parent);
		if($method_name=='get') {
			$result = $response = $objects->get();
			if(@$result->body) {
				$response->items = $result->body;
			}
		}
	} else if($object_name=='connector') {
		$connector = new WCRMConnector($core->_parent);
		if($method_name=='connect') {
			$response = $connector->connectAccount($params);
		} else if($method_name=='clear') {
			$response = $connector->clearByAccount($params);
		} else if($method_name=='clearacc') {
			$response = $connector->clearAllByAccount($params);
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

