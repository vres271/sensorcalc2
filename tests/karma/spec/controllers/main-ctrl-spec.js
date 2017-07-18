describe('MainCtrl', function() {

	var scope, ctrl, httpBackend;
	beforeEach(module('Main'));
	beforeEach(inject(function($q, _$httpBackend_, $rootScope, $controller, _Wialon_) {
		sessionStorage.clear();
		sessionStorage.setItem('sid',saved_sid);
		httpBackend = _$httpBackend_;
		httpBackend
			.whenPOST(
				wpath+'core/duplicate'
				,function(resp) {
					data = JSON.parse(resp);
					if(data.sid) {
						if(data.sid === saved_sid) {
							return true;		
						}
					};
					return false;
				} 
			)
			.respond(
				{"host":"188.235.129.145","eid":dubl_sid,"au":"glomosru","tm":1500032789,"wsdk_version":"1.149","hl":1,"base_url":"https:\/\/hst-api.wialon.com","user":{"nm":"glomosru","cls":1,"id":350070,"prp":{"__sensolator_resource_id":"350071","access_templates":"{\"avl_resource\":[{\"acl\":268435457,\"color\":\"#ffd9bf\",\"id\":0,\"name\":\"Нет доступа\"},{\"acl\":-1,\"color\":\"#d3bfe5\",\"id\":1,\"name\":\"Полный доступ\"},{\"acl\":305,\"color\":\"#bfd4f2\",\"id\":2,\"name\":\"Только чтение\"},{\"acl\":133142941315,\"color\":\"#cae5bf\",\"id\":3,\"name\":\"Шаблон 4\"},{\"acl\":52780852068327,\"color\":\"rgb(191, 242, 242)\",\"id\":4,\"name\":\"Шаблон 5\"},{\"acl\":3,\"color\":\"rgb(232, 201, 162)\",\"id\":5,\"name\":\"Шаблон 6\"}],\"avl_route\":[],\"avl_unit\":[{\"acl\":0,\"name\":\"Нет доступа\",\"id\":0,\"color\":\"#ffd9bf\"},{\"acl\":4503599627370495,\"name\":\"Полный доступ\",\"id\":1,\"color\":\"#d3bfe5\"},{\"acl\":16689,\"name\":\"Только чтение\",\"id\":2,\"color\":\"#bfd4f2\"},{\"acl\":552746354307,\"name\":\"Шаблон 3\",\"id\":3,\"color\":\"#cae5bf\"},{\"acl\":549755814403,\"name\":\"Шаблон 5\",\"id\":4,\"color\":\"rgb(191, 242, 242)\"},{\"acl\":551903298049,\"name\":\"Шаблон 6\",\"id\":5,\"color\":\"rgb(232, 201, 162)\"},{\"acl\":877103429623,\"name\":\"Северстрой\",\"id\":6,\"color\":\"rgb(232, 164, 162)\"},{\"acl\":551903298051,\"name\":\"Шаблон 8\",\"id\":7,\"color\":\"rgb(241, 198, 252)\"}],\"avl_unit_group\":[{\"acl\":0,\"name\":\"Нет доступа\",\"id\":0,\"color\":\"#ffd9bf\"},{\"acl\":880333045759,\"name\":\"Полный доступ\",\"id\":1,\"color\":\"#d3bfe5\"},{\"acl\":547,\"name\":\"Только чтение\",\"id\":2,\"color\":\"#bfd4f2\"},{\"acl\":549755815425,\"name\":\"Шаблон 4\",\"id\":3,\"color\":\"#cae5bf\"},{\"acl\":550565316099,\"name\":\"Шаблон 5\",\"id\":4,\"color\":\"rgb(191, 242, 242)\"},{\"acl\":1031,\"name\":\"Шаблон 6\",\"id\":5,\"color\":\"rgb(232, 201, 162)\"},{\"acl\":550561120993,\"name\":\"Шаблон 7\",\"color\":\"rgb(232, 164, 162)\",\"id\":6}],\"user\":[{\"acl\":0,\"color\":\"rgb(255, 217, 191)\",\"id\":0,\"name\":\"Нет доступа\"},{\"acl\":7405543,\"color\":\"rgb(211, 191, 229)\",\"id\":1,\"name\":\"Полный доступ\"},{\"acl\":547,\"color\":\"rgb(191, 212, 242)\",\"id\":2,\"name\":\"Только чтение\"},{\"acl\":6305763,\"color\":\"rgb(202, 229, 191)\",\"id\":3,\"name\":\"Шаблон 4\"},{\"acl\":2097283,\"color\":\"rgb(191, 242, 242)\",\"id\":4,\"name\":\"Шаблон 5\"}]}","addr_provider":"map_webgis","autocomplete":"{}","cfmt":"0","city":"Саратов, Саратовская обл., Россия","dashboard_widgets_new":"{\"1401894237265\":{\"server_type\":\"max_speed\",\"is_static\":false,\"type\":\"plot\",\"ct\":\"avl_unit\",\"gid\":4336371,\"id\":\"1401894237265\",\"title\":\"Maximum speed - DAF Т886РХ\"},\"1418935739166\":{\"server_type\":\"units\",\"is_static\":true,\"type\":\"table\",\"ct\":\"avl_unit\",\"id\":1418935739166,\"title\":\"Объекты\"}}","drvsvlist":"{\"m\":1,\"e\":{\"12624154_1\":1},\"go\":{}}","dst":"-1","email":"chudin@glomos.ru","evt_flags":"0","fpnl":"report_templates_filter_target","geodata_source":"map_webgis","hbacit":"{\"hb_mi_monitoring\":{\"l\":1},\"hb_mi_reports_ctl\":{\"l\":0},\"hb_mi_pois\":{\"layer\":false,\"l\":1},\"hb_mi_apps\":{},\"hb_mi_routes\":{\"l\":1},\"hb_mi_messages\":{\"l\":0},\"hb_mi_geozones\":{\"l\":1},\"hb_mi_jobs\":{},\"hb_mi_notifications\":{},\"hb_mi_users\":{},\"hb_mi_devices\":{},\"hb_mi_units_groups\":{},\"hb_mi_tools\":{},\"hb_mi_search\":null,\"hb_mi_drivers\":{\"l\":1},\"hb_mi_trailers\":{\"l\":1}}","hpnl":"hb_mi_reports_ctl","language":"ru","last_tail_color":"#0f0f10","last_tail_points":"5","last_tail_width":"3","lastmsgl":"{\"u\":15660769,\"t\":\"data\",\"s\":0}","m_ge":"1","m_gia":"0","m_gu":"1","m_ml":"11","m_monu":"[15660757,15660751,15660772,15660755,15660768,15660761,15660767,15660752,15660753,15660770,15660763,15660771,15660754,15660764]","m_mt":"1","mbl_ui_visibility":"1","mbl_um_mask":"*383*","mbl_un_visibility":"1","mbl_ut_msg_params":"1","mbl_ut_sensors":"1","mbl_uv_lst":"11961718","mbl_uw_lst":"11961718","mf_use_sensors":"0","minimap_zoom_level":"15","mondv":"[]","mongr":"{}","mont":"1","monu":"[\"15660762\",\"15660766\",\"15703971\"]","monuei":"{}","monuexpg":"{\"15274345\":1}","monug":"[]","monugr":"{\"15274345\":[15060819,15060820,15060821,15060822,15060824,15060829,15060841]}","monugv":"[\"15060819\",\"15060820\",\"15060821\",\"15060824\"]","monuv":"[\"15660762\",\"15660766\"]","msc":"1","msg_aw":"1","mtg":"1","mtgis2":"1","mtlg":"0","mtly":"0","mtmyin2":"0","mtnavm":"0","mtosm":"1","mtve":"1","mtwikim":"0","mtya":"1","mu_cmd_btn":"1","mu_delete_from_list":"1","mu_dev_cfg":"1","mu_driver":"0","mu_events":"2","mu_fast_report":"1","mu_fast_report_ival":"0","mu_fast_report_tmpl":"350071_41","mu_fast_track_ival":"0","mu_gps":"1","mu_gps_mode":"0","mu_gps_time":"0","mu_loc_mode":"0","mu_location":"0","mu_msgs":"1","mu_photo":"0","mu_sens":"2","mu_sl_type":"none","mu_sms":"0","mu_tag":"0","mu_tbl_cols_sizes":"ldt:256,0.22,0.26,0.26,0.26;ld:192,0.28,0.36,0.36;lt:192,0.28,0.36,0.36;dt:192,0.28,0.36,0.36;l:191,0.5706806282722513,0.4293193717277487;t:128,0.45,0.55;d:128,0.45,0.55;f:575,1","mu_tbl_sort":"1name","mu_tr_mode":"0","mu_tracks":"1","mu_tracks_ival":"0","mu_trailer":"0","muf":"1027","mugow":"[]","muow":"[]","mwlg":"0","radd":"{\"w\":\"5\",\"c\":1,\"u\":15660762,\"a\":0,\"td\":0,\"s\":\"default\",\"f\":0}","roul":"15620747","round_sort":"1","round_sort_order":"1","route_provider":"map_yandex","show_log":"0","tapps":"[{\"n\":\"wapi\",\"uid\":\"1373551270_15458\"},{\"n\":\"Техподдержка\",\"uid\":\"1417420307_37640\"},{\"n\":\"Track Player\",\"uid\":\"trackplayer\"},{\"n\":\"sensorCalc Unstable\",\"uid\":\"1389868100_8949\"},{\"n\":\"sensorCalc\",\"uid\":\"1386758371_14159\"},{\"n\":\"RouteList\",\"uid\":\"1416305366_196154\"},{\"n\":\"PL_l\",\"uid\":\"1405022854_12718\"},{\"n\":\"Actualizer\",\"uid\":\"1378232754_33062\"},{\"n\":\"Chatterbox\",\"uid\":\"chatterbox\"},{\"n\":\"cquardfg\",\"uid\":\"1417167256_7541\"},{\"n\":\"Dashboard\",\"uid\":\"dashboard\"},{\"n\":\"Eco Driving\",\"uid\":\"ecodriving\"},{\"n\":\"Gurtam Maps\",\"uid\":\"1424983310_83885\"},{\"n\":\"EngineControl\",\"uid\":\"1394196088_10215\"}]","tapps_order":"[0,1,2,3,4,5,6,7,8,9,10,11,12,13]","tracks_player_show_params":"1","tracks_player_show_sensors":"1","trlsvlist":"{\"md\":1,\"e\":{\"13734370_1\":1}}","tz":"134232128","umap":"Yandex Public","umsp":"46.0346908569,51.5300216675,11","ursstp":"0x5fbf","us_addr_fmt":"350552064_10_5","us_addr_ordr":"350552064","uschs":"1","used_hw":"{\"9\":9,\"37\":7,\"38\":1,\"939\":2,\"944\":1,\"10700\":1,\"12152\":4,\"20496\":1,\"28252\":3,\"40247\":1,\"41742\":5,\"43158\":30,\"50096\":6,\"50371\":366,\"64613\":30,\"69846\":50,\"73514\":2,\"96266\":53,\"96778\":1,\"97227\":8,\"127810\":1,\"135884\":5,\"162749\":9,\"172002\":0,\"173884\":11,\"207160\":3,\"216940\":7,\"250483\":1,\"260225\":6,\"275064\":3,\"315612\":1,\"315726\":2,\"331179\":2,\"353562\":8,\"353682\":2,\"396333\":1,\"399405\":4,\"420632\":1,\"461554\":2,\"502929\":3,\"512016\":4,\"520165\":4,\"532882\":13,\"592010\":2,\"604476\":27,\"679066\":2,\"742164\":1,\"775638\":1,\"815951\":3,\"1265016\":6,\"11787130\":1,\"12159664\":2,\"12401577\":12,\"13028700\":2,\"13891237\":236,\"14098460\":0,\"14391218\":1,\"14674573\":0,\"14674577\":1,\"undefined\":1}","user_settings_hotkeys":"0","user_unit_cmds":"версияПрошивки\nversion\npwd 12345\nрестарт\nполучитьКонфигурацию\nстатическаяНавигация a 200\nполучитьБудущуюКонфигурацию\nнавигационныйФильтр 180 60 5.0\nсервер1 95.163.120.190 20116 ASC6 0\nrs485Omnicomm 0\/RS485(1) 1\/RS485(1) 2\/RS485(1)\nэнергосбережение 10\nсервер0 193.193.165.165 20246 ASC6 0\nsim1 internet.mts.ru mts mts _ -\nсервер1 81.25.44.176 20116 ASC6 0\nsim0 internet megafon megafon _ +\nrebootall\nset sensor R4.1 LLS Fuel 1 1 1\nset sensor R4.1 DUTOMNI2 FUEL 1 1 2\nset sensor R4.1 DUTOMNI2 FUEL 1 1 2\nset wlndata ain1\nноваяПрошивка 80508969 http:\/\/178.161.134.26:80\/c.bin-2.278\nсервер1 37.200.70.180 65521 ASC6 0\nноваяПрошивка 1789025080 http:\/\/178.161.134.26:80\/c.bin-3.423\nset gpsfilter on\nget gpsfilter\nноваяПрошивка 1731891759 http:\/\/178.161.134.26:80\/c.bin-1.791\nноваяПрошивка 1927437176 http:\/\/178.161.134.26:80\/c.bin-2.1\nserupdate 243\nsim0 internet megafon megafon _ +\nserupdate 249\nserupdate 251\nset wlnprot binary\nset serverport 21204\nlogout\ndiag gps\n*!CNCT_RCS:89.208.152.55:8100:63841478\n!1Y\n!1N\n*!1Y\n*!1N\n*!1N\nget sensor R4.1 DUTOMN2 FUEL\nget doutmode\nset doutmode off\nset doutmode on\nupgrade 0\nset sensor R4.1 DUTOMN2 FUEL 1 1 1\nFUEL\n*CONNECTSC#\n*SETPWDID 203022628 253325#\n*!CNCT_RCS:89.208.152.55:8100:43840157\nserupdate 268\nноваяПрошивка 576552233 http:\/\/178.161.134.26:80\/c.bin-3.538\nноваяПрошивка 576552233 http:\/\/178.161.134.26:80\/c.bin-3.538","usuei":"0x5fbf","vsplit":"579","vsplit_block_left_panel":"575","vsplit_messages_filter_target":"325","vsplit_monitoring_map_target":"200","vsplit_report_templates_filter_target":"347","vsplit_routectrl_dialog_target":"200","vsplit_routectrl_target":"454","wdcheck":"1","webg_c":"Вологда","webg_c_id":"webg_feature_2022929609217","wl_sno":"1","zlst":"[\"11327545_3\",\"12645924_514\",\"12645924_308\",\"12645924_265\",\"12645924_335\",\"12645924_718\",\"12645924_399\",\"12645924_318\",\"12645924_284\",\"12645924_515\",\"12645924_568\",\"12645924_269\",\"13234853_13\"]","znsn":"0","znsrv":"0","znsvlist":"{\"m\":1,\"e\":{\"350071_9\":3,\"15640249_52\":3,\"15640249_54\":3,\"582871_171\":3,\"350071_10\":3,\"15640249_67\":3,\"15640249_46\":3,\"15640249_71\":3,\"15640249_75\":3,\"15640249_49\":3,\"15640249_57\":3,\"15640249_58\":3,\"15640249_51\":3,\"15640249_45\":3,\"15640249_73\":3,\"15640249_44\":3,\"15640249_65\":3,\"15640249_43\":3,\"15640249_72\":3,\"15640249_56\":3,\"15640249_50\":3,\"15640249_59\":3,\"15640249_60\":3,\"15640249_62\":3,\"15640249_76\":3,\"15640249_70\":3,\"15640249_15\":3,\"350071_12\":3,\"350071_5\":3,\"350071_11\":3,\"15640249_69\":3,\"15640249_47\":3,\"15640249_61\":3,\"15640249_42\":3,\"15640249_68\":3,\"350071_8\":3,\"350071_7\":3,\"15640249_41\":3,\"582871_169\":3,\"582871_167\":3,\"582871_172\":3,\"582871_165\":3,\"582871_170\":3,\"582871_168\":3,\"582871_166\":3,\"350071_6\":3,\"15640249_55\":3,\"15640249_53\":3,\"15640249_66\":3,\"15640249_74\":3,\"15640249_63\":3},\"go\":{}}"},"crt":0,"bact":350071,"mu":0,"ct":1333027101,"ftp":{"ch":0,"tp":0,"fl":1},"fl":36,"hm":"","ld":1500031847,"pfl":0,"mapps":{"1":{"id":1,"n":"Wialon","uid":"43a870c17a3a5f42a4a6e854695ef3cbf354fb9c8c4fac02d903ff09585cb59e","cp":{"sl":1,"sn":"echoed-ding.mp3","ui":350070,"un":"glomosru"},"as":{"appid":"com.gurtam.wialonClient","device":"iPhone (iPhone)","type":"apns","version":"10.3"},"e":1},"2":{"id":2,"n":"Wialon","uid":"73a8f79be3225d64e6055a75d6550063a69e06aa07cd74502e2d99d2868c5488","cp":{"ui":350070,"un":"glomosru"},"as":{"appid":"com.gurtam.wialonClient","device":"iPhone (iPhone)","type":"apns","version":"7.1.2"},"e":1}},"mappsmax":0,"uacl":2146947},"token":"{\"app\":\"Sensorcalc\",\"ct\":1500007592,\"at\":1500007592,\"dur\":0,\"fl\":-1,\"p\":\"{}\",\"items\":[]}","th":"1179ebaf58c260144c34d6cc0535072d3069A9EABB351FBB9CBECCF87680A0494E248D3E","classes":{"avl_hw":4,"avl_resource":3,"avl_retranslator":7,"avl_route":6,"avl_unit":2,"avl_unit_group":5,"user":1},"features":{"unlim":0,"svcs":{"admin_fields":1,"app.1373551270_15458":1,"app.1383330034_8593":1,"app.1386758371_14159":1,"app.1389868100_8949":1,"app.1394196088_10215":1,"app.1405022854_12718":1,"app.1416305366_196154":1,"app.1417167256_7541":1,"app.1424983310_83885":1,"app.1432821138_45060":1,"app.1448459948_68726":1,"app.1448544645_61548":1,"app.1448606801_74057":1,"app.1457033943_200666":1,"app.1488520621_1539":1,"app.1488520621_1540":1,"app.1488520621_1542":1,"app.1488520621_1543":1,"app.1488520621_1544":1,"app.1498625641_700055":1,"app.1498655946_749758":1,"app.1498657447_225595":1,"app.1498657486_225632":1,"app.1498657493_225637":1,"app.1498657520_225665":1,"app.1498657538_225678":1,"app.1499014613_1092128":1,"app.1499014626_1092141":1,"app.1499014663_1092161":1,"app.1499014669_1092168":1,"app.1499014745_1092221":1,"app.1499014750_1092222":1,"app.nimbus":1,"avl_resource":1,"avl_retranslator":1,"avl_route":1,"avl_unit":1,"avl_unit_group":1,"cms_manager":1,"cms_manager2":1,"create_resources":1,"create_unit_groups":1,"create_units":1,"create_users":1,"custom_fields":1,"custom_reports":1,"driver_groups":1,"drivers":1,"ecodriving":1,"email_notification":1,"email_report":1,"glomosru":1,"glomosru2":1,"glomosru3":1,"glomosru5":1,"google_service":1,"hosting":1,"hosting2":1,"hosting3":1,"hosting4":1,"hosting5":1,"hosting6":1,"hosting7":1,"hosting8":1,"hosting_arctic":1,"hosting_black":1,"hosting_indigo":1,"hosting_plum":1,"hosting_summer":1,"hosting_urban":1,"import_export":1,"jobs":1,"lite":1,"locator":1,"messages":1,"mobile_apps":1,"notifications":1,"orders":1,"pois":1,"profile_fields":1,"quick_guide":1,"reports":1,"reportsdata":1,"reportsmngt":1,"reporttemplates":1,"retranslator_units":1,"rounds":1,"route_schedules":1,"routes":1,"sdk":1,"service.glomosru":1,"service_intervals":1,"sms":1,"storage_user":1,"tacho":1,"tag_groups":1,"tags":1,"toll_roads":1,"trailer_groups":1,"trailers":1,"unit_commands":1,"unit_sensors":1,"user_notifications":1,"wialon.hosting":1,"wialon_activex":1,"wialon_hosting_api":1,"wialon_hosting_apps_api":1,"wialon_hosting_dev_api":1,"wialon_hosting_test_api":1,"wialon_mobile":1,"wialon_mobile2":1,"wialon_mobile_client":1,"zone_groups":1,"zones_library":1}}}
			);
		
		httpBackend
			.when('POST','https://hst-api.wialon.com/avl_evts')
			.respond({"tm":1500039089,"events":[]});

		httpBackend
			.whenPOST(
				wpath+'core/logout'
				,function(resp) {
					data = JSON.parse(resp);
					if(data.sid) {
						if(data.sid === dubl_sid) {
							return true;		
						}
					};
					return false;
				} 
			)
			.respond(
				{error: 0}
			);
		scope = $rootScope.$new();
		ctrl = $controller('MainCtrl', {
			$scope: scope
		})

		Wialon = _Wialon_;
		spyOn(Wialon, 'duplicate').and.returnValue($q.defer().promise);
	}));
 	 
 	it('Init with right SID', function() {

		expect(scope.wialon.auth).toEqual(false); 
		expect(scope.wialon.sid).toEqual(saved_sid); 
		expect(scope.wialon.user).toEqual(null);  
	
		httpBackend.flush();

	  	expect(Wialon.auth).toEqual(true); 
	  	expect(Wialon.sid).toEqual(dubl_sid); 
	  	expect(typeof Wialon.user).toBe('object');
	  	expect(Wialon.user.nm).toBe('glomosru');
	  	
		scope.logout();
		httpBackend.flush();
		
		expect(scope.wialon.auth).toEqual(false); 
		expect(scope.wialon.sid).toEqual(undefined); 
		expect(scope.wialon.user).toEqual(null);

 	});
 
});

describe('Main Controller - Fails on Init', function() {
	var scope, ctrl, httpBackend;
	beforeEach(module('Main'));
	beforeEach(inject(function($q, _$httpBackend_, $rootScope, $controller, _Wialon_) {
		sessionStorage.clear();
		sessionStorage.setItem('sid',wrong_sid);
		httpBackend = _$httpBackend_;
		httpBackend
			.whenPOST(
				wpath+'core/duplicate'
				,function(resp) {
					data = JSON.parse(resp);
					if(data.sid) {
							return true;		
					};
					return false;
				} 
			)
			.respond(
				{error: 1}
			);
		scope = $rootScope.$new();
		ctrl = $controller('MainCtrl', {
			$scope: scope
		})
		Wialon = _Wialon_;
	}));
 	 
 	it('Init with saved wrong SID', function() {

		expect(scope.wialon.auth).toEqual(false); 
		expect(scope.wialon.sid).toEqual(wrong_sid); 
		expect(scope.wialon.user).toEqual(null);  
	
		httpBackend.flush();

	  	expect(Wialon.auth).toEqual(false); 
	  	expect(Wialon.sid).toEqual(undefined); 
	  	expect(Wialon.user).toEqual(null);
	  	
 	});
 
});


describe('Main Controller - Init without saved SID', function() {
	var scope, ctrl, httpBackend;
	beforeEach(module('Main'));
	beforeEach(inject(function($q, _$httpBackend_, $rootScope, $controller, _Wialon_) {
		sessionStorage.clear();
		httpBackend = _$httpBackend_;
		httpBackend
			.whenPOST(
				wpath+'core/duplicate'
				,function(resp) {
					data = JSON.parse(resp);
					if(data.sid) {
							return true;		
					};
					return false;
				} 
			)
			.respond(
				{error: 1}
			);
		scope = $rootScope.$new();
		ctrl = $controller('MainCtrl', {
			$scope: scope
		})
		Wialon = _Wialon_;
	}));
 	 
 	it('Init with saved wrong SID', function() {
		expect(scope.wialon.auth).toEqual(false); 
		expect(scope.wialon.sid).toEqual(undefined); 
		expect(scope.wialon.user).toEqual(null);  
 	});
 
});
