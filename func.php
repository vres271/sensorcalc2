<? 

function error($msg='error') {
	echo '{"error":"'.$msg.'""}';
	exit();
}

function toParams($keys, $arr=false) {
	$params = new stdClass();
	foreach ($keys as $key => $value) {
		if(isset($arr->$value)) {
			$params->$value = $arr->$value;
		}
	}
	return $params;
}

function check_rights($rights, $object_name, $method_name='') {
	$result = $rights->getC($object_name, $method_name);
	if($result==false) {
		throw new Exception('Access denied: '.$object_name.'.'.$method_name.'');
	}
}
