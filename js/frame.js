//Load the icons for closing,maximizing and minimizing the window
const icons = {'close':'&times;','maximize':'&square;','minimize':'&minus;'};
for (var i in icons){
    $('.options').append($('<div/>').addClass('option').attr('id', i).html(icons[i]));
}

//If the current window isn't the login page, display the logged in user in the frame
if(remote.getCurrentWindow().getTitle() !== 'Login' ){
    $('#frame').append($('<div/>').attr('id','user_box')
    .append($('<div/>').addClass('logged_user_image')
    .append($('<img/>'))));
}

$('#close').click(function(){
    var window = remote.getCurrentWindow();
    window.close();
});
    
$('#maximize').click(function(){
    var window = remote.getCurrentWindow();
    if(window.isMaximized()){
        $('#maximize').html('&square;');
        window.unmaximize();
    }
    else{
        $('#maximize').html('&#x1F5D7;');
        window.maximize();
    }
});
    
$('#minimize').click(function(){
    var window = remote.getCurrentWindow();
    window.minimize();
});

//Sending signal to main.js to signout of firebase
$('#user_box').click(function(e){
    e.preventDefault();
    ipcRenderer.send('user_signout');
});

//Recieving the authenticated user from main.js
ipcRenderer.on('send_current_user', function(event,user){
    $('.logged_user_image').children('img').attr('src','../images/' + user['image']);
});
