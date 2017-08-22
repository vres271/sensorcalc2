<?
function FileLMT($filename) { if (file_exists($filename)) { return filemtime($filename); } else { return false; } }
$my_css_mt = FileLMT('css/style.css');
$my_js_mt = FileLMT('js/scripts.js');

$my_js = '<script src="js/scripts.js?mt='.$my_js_mt.'" type="text/javascript"></script>';

include_once('html/index.html');
