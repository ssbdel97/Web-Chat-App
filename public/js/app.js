var name = getQueryVariable('name')|| 'Anonymous';
var room = getQueryVariable('room');
var socket = io();
console.log(name + ' wants to join room ' + room);
socket.on('connect', function() {
	console.log('connected to socket.io!');
	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});

jQuery('.room-title').text(room);

socket.on('message', function(message) {
	var momentTimestamp = moment.utc(message.timestamp);
	var $nav = jQuery('#nav');
	var $messages = jQuery('.messages');
	var $message = jQuery('<li class="list-group-item"></li>');
	console.log('New message:');
	console.log(message.text);
	console.log(momentTimestamp.local().format('h:mm a'));
	$message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
	$message.append('<p>' + message.text + '</p>');
	$messages.append($message);
	var shouldScroll	=	$nav["0"].scrollTop + $nav["0"].clientHeight === $nav["0"].scrollHeight;
	// console.log($nav["0"].scrollHeight);
	// console.log($nav["0"].scrollTop);
	// console.log($nav["0"].clientHeight);
	if(!shouldScroll){
		$nav["0"].scrollTop = $nav["0"].scrollHeight;	
	}
});

//Hadles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function(event) {
	event.preventDefault();
	var $message = $form.find('input[name=message]');
	socket.emit('message', {
		name: name,
		text: $message.val()
	});
	$message.val('');
});

