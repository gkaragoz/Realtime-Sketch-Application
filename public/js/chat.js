var socket = io();

function scrollToBottom() {
    //Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    //Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        }
    });
});

socket.on('disconnect', function () {
    console.log("Server ile bağlantı kesildi");
});

socket.on('updateUserList', function (users) {
    updateUsers(users);
});

socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

function updateUsers(users) {
    var ol = jQuery('<ol></ol>');
   
    users.forEach(function (user) {
        if (user.isArtist) {
            ol.append(jQuery('<li></li>').text(user.name + "\t" + user.score + "\tÇİZER"));
        } else {
            ol.append(jQuery('<li></li>').text(user.name + "\t" + user.score));
        }
    });

    jQuery('#users').html(ol);
}

function updateRoomInfo(currentRaund, maxRaund, tourTime) {
    $('#roomInfo').html("Raund: " + currentRaund + "/" + maxRaund + " | " + tourTime + " saniye");
}

function updateQuestionText() {

}

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    var messageTextBox = jQuery('[name = message]');
    socket.emit('createMessage', {
        text: jQuery('[name=message]').val()
    }, function () {
        messageTextBox.val('');
    }
    );
});