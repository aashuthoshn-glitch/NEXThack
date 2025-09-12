<?php
return [
	'routes' => [
		['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
		['name' => 'page#embed', 'url' => '/embed', 'verb' => 'GET'],
		['name' => 'page#weather', 'url' => '/weather', 'verb' => 'GET'],
		['name' => 'chat#list', 'url' => '/chat/{room}', 'verb' => 'GET'],
		['name' => 'chat#send', 'url' => '/chat/{room}/send', 'verb' => 'POST'],
		['name' => 'chat#react', 'url' => '/chat/{room}/react', 'verb' => 'POST'],
		['name' => 'chat#presenceSet', 'url' => '/chat/{room}/presence', 'verb' => 'POST'],
		['name' => 'chat#presenceList', 'url' => '/chat/{room}/presence', 'verb' => 'GET'],
	]
];
