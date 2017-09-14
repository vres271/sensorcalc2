<? 
	if($_SERVER['REQUEST_METHOD'] == 'POST') {
		$ret = new stdClass();
	    $data = file_get_contents("php://input");
	    $_POST =json_decode($data);
	    if(@$_POST->id) { // ждём id, в котором должны содеражться
			$ref =  $_SERVER['HTTP_REFERER'];
			$tmp = split('://', $ref);
			$tmp1 = split('/',$tmp[1]);
			$ref = $tmp[0].'://'.$tmp1[0]; // реферер
			if(($ref == 'http://localhost:3000') or ($ref == 'http://www.wialoncrm.com') or ($ref == 'http://wialoncrm.com')) { // к стати проверяем его
				$client_salt = 'resolvedValue'; // клиентская соль
				$s = round(time()/100000); // юникстайм с точностью до 100000000 (меняется раз в 100000 сек)
				$str = $client_salt.$s.$ref; // всё это в одной строке
				$hash = md5($str); // от неё взят мд5 хэш
				$id = substr(preg_replace("/[^0-9]/", '', $hash),0,11); // из хэша взяты только цифры, чтобы было похоже на id
				if($_POST->id == $id) { // если пришедший с клиента id совпадает с получившимся, 
					$server_salt = '$controller'; // готовим parent_id (имя переменной от балды и чтоб не подозрительно)
					$str = $server_salt.$s.$ref;
					$hash = md5($str);
					$id = substr(preg_replace("/[^0-9]/", '', $hash),0,11);
					$ret->id = $id; // делаем всё то же самое, только с серверной солью
					$ret->name = null; // для отвода глаз, чтобы ответ выглядел менее подозрительным
				}
			}
	    }
	    echo json_encode($ret);
	}
?>